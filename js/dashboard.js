/* ======================================================
                DASHBOARD.JS
                DEDA CORTES
====================================================== */

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    orderBy,
    getDocs,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


/* ======================================================
                    ELEMENTOS
====================================================== */

const btnSair =
    document.getElementById("btnSair");

const filtroData =
    document.getElementById("filtroData");

const listaAgendamentos =
    document.getElementById("listaAgendamentos");

const totalAgendamentos =
    document.getElementById("totalAgendamentos");

const agendamentosHoje =
    document.getElementById("agendamentosHoje");

const proximoCliente =
    document.getElementById("proximoCliente");


/* ======================================================
                    COLEÇÃO
====================================================== */

const nomeColecao = "agendamentos";


/* ======================================================
                    VARIÁVEIS
====================================================== */

let todosAgendamentos = [];


/* ======================================================
                    DATA DE HOJE
====================================================== */

function obterDataHoje() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;

}


/* ======================================================
                FORMATAR DATA
====================================================== */

function formatarData(data) {

    if (!data) {

        return "";

    }

    const partes =
        data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* ======================================================
                CARREGAR AGENDAMENTOS
====================================================== */

async function carregarAgendamentos() {

    try {

        listaAgendamentos.innerHTML = `
            <div class="estado-carregando">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>
                    Carregando agendamentos...
                </p>

            </div>
        `;


        const referencia =
            collection(
                db,
                nomeColecao
            );


        const consulta =
            query(
                referencia,
                orderBy("data"),
                orderBy("horario")
            );


        const resultado =
            await getDocs(consulta);


        todosAgendamentos = [];


        resultado.forEach(
            documento => {

                const dados =
                    documento.data();


                todosAgendamentos.push({

                    id: documento.id,

                    ...dados

                });

            }
        );


        atualizarResumo();

        aplicarFiltro();

    } catch (erro) {

        console.error(
            "Erro ao carregar agendamentos:",
            erro
        );


        listaAgendamentos.innerHTML = `
            <div class="estado-vazio">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Não foi possível carregar os agendamentos
                </h3>

                <p>
                    Verifique sua conexão e tente novamente.
                </p>

            </div>
        `;

    }

}


/* ======================================================
                    RESUMO
====================================================== */

function atualizarResumo() {

    totalAgendamentos.textContent =
        todosAgendamentos.length;


    const hoje =
        obterDataHoje();


    const hojeLista =
        todosAgendamentos.filter(
            agendamento =>
                agendamento.data === hoje
        );


    agendamentosHoje.textContent =
        hojeLista.length;


    /* ----------------------------------------------
                PRÓXIMO CLIENTE
    ---------------------------------------------- */

    const agora =
        new Date();


    const horaAtual =
        agora.getHours() * 60 +
        agora.getMinutes();


    const proximos =
        hojeLista
            .filter(
                agendamento => {

                    const partes =
                        agendamento.horario
                            .split(":");

                    const minutos =
                        Number(partes[0]) * 60 +
                        Number(partes[1]);

                    return minutos >= horaAtual;

                }
            )
            .sort(
                (a, b) =>
                    a.horario.localeCompare(
                        b.horario
                    )
            );


    if (proximos.length > 0) {

        proximoCliente.textContent =
            proximos[0].nome;

    } else {

        proximoCliente.textContent =
            "—";

    }

}


/* ======================================================
                    FILTRO
====================================================== */

function aplicarFiltro() {

    const dataSelecionada =
        filtroData.value;


    let lista =
        [...todosAgendamentos];


    if (dataSelecionada) {

        lista =
            lista.filter(
                agendamento =>
                    agendamento.data ===
                    dataSelecionada
            );

    }


    renderizarAgendamentos(lista);

}


/* ======================================================
                RENDERIZAR AGENDAMENTOS
====================================================== */

function renderizarAgendamentos(lista) {

    if (lista.length === 0) {

        listaAgendamentos.innerHTML = `

            <div class="estado-vazio">

                <i class="fa-regular fa-calendar-xmark"></i>

                <h3>
                    Nenhum agendamento encontrado
                </h3>

                <p>
                    Não existem agendamentos para esta data.
                </p>

            </div>

        `;

        return;

    }


/* ======================================================
                CANCELAR AGENDAMENTO
====================================================== */

async function cancelarAgendamento(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja cancelar este agendamento?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const referencia =
            doc(
                db,
                nomeColecao,
                id
            );


        await deleteDoc(referencia);


        alert(
            "Agendamento cancelado com sucesso."
        );


        await carregarAgendamentos();


    } catch (erro) {

        console.error(
            "Erro ao cancelar agendamento:",
            erro
        );


        alert(
            "Não foi possível cancelar o agendamento."
        );

    }

}


/* ======================================================
                AÇÕES DOS AGENDAMENTOS
====================================================== */

listaAgendamentos.addEventListener(
    "click",
    async function (event) {

        const botao =
            event.target.closest(
                ".btn-cancelar-admin"
            );


        if (!botao) {

            return;

        }


        const id =
            botao.dataset.id;


        await cancelarAgendamento(id);

    }
);


    listaAgendamentos.innerHTML = "";


    lista.forEach(
        agendamento => {

            const item =
                document.createElement("div");


            item.className =
                "agendamento-admin";


            item.innerHTML = `

                <div class="agendamento-horario">

                    <i class="fa-regular fa-clock"></i>

                    <strong>
                       ${agendamento.horario}
                     </strong>

                </div>


                <div class="agendamento-dados">

                    <h3>
                        ${agendamento.nome}
                    </h3>

                    <p>
                         <i class="fa-solid fa-scissors"></i>
                         ${agendamento.servico}
                    </p>

                    <p>
                         <i class="fa-solid fa-phone"></i>
                         ${agendamento.telefone}
                    </p>

                    <p>
                        <i class="fa-regular fa-calendar"></i>
                         ${formatarData(agendamento.data)}
                    </p>

                </div>


                <div class="agendamento-acoes">

                  <a
                      href="https://wa.me/55${agendamento.telefone.replace(/\D/g, "")}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-whatsapp-admin"
                      title="Enviar WhatsApp">

                      <i class="fa-brands fa-whatsapp"></i>

                  </a>


                  <button
                    type="button"
                    class="btn-cancelar-admin"
                    data-id="${agendamento.id}"
                    title="Cancelar agendamento">

                    <i class="fa-solid fa-trash"></i>

                  </button>

                </div>

            `;


            listaAgendamentos.appendChild(item);

        }
    );

}


/* ======================================================
                    FILTRO DE DATA
====================================================== */

filtroData.addEventListener(
    "change",
    function () {

        aplicarFiltro();

    }
);


/* ======================================================
                        LOGOUT
====================================================== */

btnSair.addEventListener(
    "click",
    async function () {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        } catch (erro) {

            console.error(
                "Erro ao sair:",
                erro
            );

        }

    }
);


/* ======================================================
                PROTEGER DASHBOARD
====================================================== */

onAuthStateChanged(
    auth,
    function (usuario) {

        if (
            !usuario ||
            usuario.uid !== "MBb4x5zvwqWUIuCFiTgXKda3Ph12"
        ) {

            window.location.href =
                "login.html";

            return;

        }


        console.log(
            "Administrador autenticado:",
            usuario.email
        );


        carregarAgendamentos();

    }
);