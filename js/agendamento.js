/* ======================================================
                AGENDAMENTO.JS
                DEDA CORTES
====================================================== */


/* ======================================================
                FIREBASE / FIRESTORE
====================================================== */

import { db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    runTransaction,
    serverTimestamp
}  from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


/* ======================================================
                ELEMENTOS DO FORMULÁRIO
====================================================== */

const formulario = document.getElementById("formAgendamento");

const nomeInput = document.getElementById("nome");

const telefoneInput = document.getElementById("telefone");

const servicoInput = document.getElementById("servico");

const dataInput = document.getElementById("data");

const horarioInput = document.getElementById("horario");

const mensagemErro = document.getElementById("mensagemErro");


/* ======================================================
                    MODAL
====================================================== */

const modal = document.getElementById("modalConfirmacao");

const fecharModal = document.getElementById("fecharModal");

const editarAgendamento =
    document.getElementById("editarAgendamento");

const confirmarAgendamento =
    document.getElementById("confirmarAgendamento");

const resumoAgendamento =
    document.getElementById("resumoAgendamento");


/* ======================================================
                NÚMERO DO WHATSAPP
====================================================== */

const numeroWhatsApp = "5571988284324";


/* ======================================================
                CONFIGURAÇÕES
====================================================== */

const HORA_INICIO = 9;

const HORA_FIM = 21;

const INTERVALO = 30;


/* ======================================================
            COLEÇÃO DOS AGENDAMENTOS
====================================================== */

const nomeColecao = "agendamentos";


/* ======================================================
            DEFINIR DATA MÍNIMA
====================================================== */

function definirDataMinima() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    const dataAtual =
        `${ano}-${mes}-${dia}`;

    dataInput.min = dataAtual;

}


/* ======================================================
                MÁSCARA DE TELEFONE
====================================================== */

telefoneInput.addEventListener("input", function () {

    let valor = this.value
        .replace(/\D/g, "")
        .substring(0, 11);


    if (valor.length <= 10) {

        valor = valor.replace(
            /^(\d{2})(\d{4})(\d{0,4}).*/,
            "($1) $2-$3"
        );

    } else {

        valor = valor.replace(
            /^(\d{2})(\d{5})(\d{0,4}).*/,
            "($1) $2-$3"
        );

    }


    this.value = valor;

});


/* ======================================================
                MOSTRAR ERRO
====================================================== */

function mostrarErro(mensagem) {

    mensagemErro.textContent = mensagem;

    mensagemErro.classList.add("visivel");

}


/* ======================================================
                ESCONDER ERRO
====================================================== */

function esconderErro() {

    mensagemErro.textContent = "";

    mensagemErro.classList.remove("visivel");

}


/* ======================================================
                VALIDAR TELEFONE
====================================================== */

function telefoneValido(telefone) {

    const numeros =
        telefone.replace(/\D/g, "");

    return numeros.length === 11;

}


/* ======================================================
                VALIDAR DATA
====================================================== */

function dataValida(data) {

    if (!data) {

        return false;

    }


    const selecionada =
        new Date(`${data}T00:00:00`);

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);


    return selecionada >= hoje;

}


/* ======================================================
                VALIDAR HORÁRIO
====================================================== */

function horarioValido(horario) {

    if (!horario) {

        return false;

    }


    const partes = horario.split(":");

    const hora = Number(partes[0]);

    const minuto = Number(partes[1]);


    if (hora < HORA_INICIO) {

        return false;

    }


    if (hora > HORA_FIM) {

        return false;

    }


    if (minuto !== 0 && minuto !== 30) {

        return false;

    }


    return true;

}


/* ======================================================
            FORMATAR DATA PARA O BRASIL
====================================================== */

function formatarData(data) {

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* ======================================================
        CRIAR ID ÚNICO DO HORÁRIO
====================================================== */

function criarIdAgendamento(data, horario) {

    return `${data}_${horario.replace(":", "-")}`;

}

function criarIdHorario(data, horario) {

    return `${data}_${horario.replace(":", "-")}`;

}


/* ======================================================
        VERIFICAR HORÁRIOS OCUPADOS
====================================================== */

async function carregarHorariosOcupados() {

    const data = dataInput.value;

    if (!data) {

        return;

    }


    try {

        const referenciaColecao =
            collection(db, "horarios");

        const consulta =
            query(
                referenciaColecao,
                where("data", "==", data)
            );

        const resultado =
            await getDocs(consulta);


        /* ----------------------------------------------
                REATIVAR TODOS OS HORÁRIOS
        ---------------------------------------------- */

        Array.from(
            horarioInput.options
        ).forEach(opcao => {

            opcao.disabled = false;

        });


        /* ----------------------------------------------
                DESATIVAR HORÁRIOS OCUPADOS
        ---------------------------------------------- */

        resultado.forEach(documento => {

            const agendamento =
                documento.data();

            const horarioOcupado =
                agendamento.horario;


            Array.from(
                horarioInput.options
            ).forEach(opcao => {

                if (opcao.value === horarioOcupado) {

                    opcao.disabled = true;

                }

            });

        });


        /* ----------------------------------------------
                SE O HORÁRIO ATUAL ESTIVER OCUPADO
        ---------------------------------------------- */

        if (
            horarioInput.value &&
            Array.from(
                horarioInput.options
            ).find(
                opcao =>
                    opcao.value === horarioInput.value &&
                    opcao.disabled
            )
        ) {

            horarioInput.value = "";

            mostrarErro(
                "Esse horário acabou de ser ocupado. Escolha outro horário."
            );

        }

    } catch (erro) {

        console.error(
            "Erro ao consultar horários:",
            erro
        );

        mostrarErro(
            "Não foi possível verificar os horários disponíveis. Tente novamente."
        );

    }

}


/* ======================================================
        EVENTO: ALTERAÇÃO DA DATA
====================================================== */

dataInput.addEventListener(
    "change",
    async function () {

        esconderErro();

        horarioInput.value = "";

        await carregarHorariosOcupados();

    }
);


/* ======================================================
            CRIAR RESUMO DO AGENDAMENTO
====================================================== */

function criarResumo() {

    const nome =
        nomeInput.value.trim();

    const telefone =
        telefoneInput.value.trim();

    const servico =
        servicoInput.value;

    const data =
        formatarData(dataInput.value);

    const horario =
        horarioInput.value;


    resumoAgendamento.innerHTML = `

        <div class="resumo-item">

            <span>Nome</span>

            <span>${nome}</span>

        </div>


        <div class="resumo-item">

            <span>Telefone</span>

            <span>${telefone}</span>

        </div>


        <div class="resumo-item">

            <span>Serviço</span>

            <span>${servico}</span>

        </div>


        <div class="resumo-item">

            <span>Data</span>

            <span>${data}</span>

        </div>


        <div class="resumo-item">

            <span>Horário</span>

            <span>${horario}</span>

        </div>

    `;

}


/* ======================================================
                ABRIR MODAL
====================================================== */

function abrirModal() {

    criarResumo();

    modal.classList.add("aberto");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


/* ======================================================
                FECHAR MODAL
====================================================== */

function fecharModalConfirmacao() {

    modal.classList.remove("aberto");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


/* ======================================================
            ENVIO DO FORMULÁRIO
====================================================== */

formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        esconderErro();


        const nome =
            nomeInput.value.trim();

        const telefone =
            telefoneInput.value.trim();

        const servico =
            servicoInput.value;

        const data =
            dataInput.value;

        const horario =
            horarioInput.value;


        /* ----------------------------------------------
                    VALIDAR NOME
        ---------------------------------------------- */

        if (nome.length < 3) {

            mostrarErro(
                "Digite seu nome completo."
            );

            nomeInput.focus();

            return;

        }


        /* ----------------------------------------------
                    VALIDAR TELEFONE
        ---------------------------------------------- */

        if (!telefoneValido(telefone)) {

            mostrarErro(
                "Digite um telefone válido com DDD."
            );

            telefoneInput.focus();

            return;

        }


        /* ----------------------------------------------
                    VALIDAR SERVIÇO
        ---------------------------------------------- */

        if (!servico) {

            mostrarErro(
                "Selecione um serviço."
            );

            servicoInput.focus();

            return;

        }


        /* ----------------------------------------------
                    VALIDAR DATA
        ---------------------------------------------- */

        if (!dataValida(data)) {

            mostrarErro(
                "Selecione uma data válida."
            );

            dataInput.focus();

            return;

        }


        /* ----------------------------------------------
                    VALIDAR HORÁRIO
        ---------------------------------------------- */

        if (!horarioValido(horario)) {

            mostrarErro(
                "Selecione um horário válido."
            );

            horarioInput.focus();

            return;

        }


        /* ----------------------------------------------
                    ABRIR MODAL
        ---------------------------------------------- */

        abrirModal();

    }
);


/* ======================================================
                BOTÃO EDITAR
====================================================== */

editarAgendamento.addEventListener(
    "click",
    function () {

        fecharModalConfirmacao();

    }
);


/* ======================================================
                FECHAR MODAL
====================================================== */

fecharModal.addEventListener(
    "click",
    function () {

        fecharModalConfirmacao();

    }
);


/* ======================================================
            FECHAR CLICANDO FORA
====================================================== */

modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {

            fecharModalConfirmacao();

        }

    }
);


/* ======================================================
                TECLA ESC
====================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("aberto")
        ) {

            fecharModalConfirmacao();

        }

    }
);


/* ======================================================
            GERAR MENSAGEM WHATSAPP
====================================================== */

function criarMensagemWhatsApp() {

    const nome =
        nomeInput.value.trim();

    const telefone =
        telefoneInput.value.trim();

    const servico =
        servicoInput.value;

    const data =
        formatarData(dataInput.value);

    const horario =
        horarioInput.value;


    const mensagem =

`Olá, Deda Cortes!

Gostaria de confirmar um agendamento.

👤 Nome: ${nome}

📞 Telefone: ${telefone}

✂️ Serviço: ${servico}

📅 Data: ${data}

🕒 Horário: ${horario}

Aguardo a confirmação. Obrigado!`;


    return mensagem;

}


/* ======================================================
            SALVAR AGENDAMENTO NO FIRESTORE
====================================================== */

async function salvarAgendamento() {

    const nome =
        nomeInput.value.trim();

    const telefone =
        telefoneInput.value.trim();

    const servico =
        servicoInput.value;

    const data =
        dataInput.value;

    const horario =
        horarioInput.value;


    const idAgendamento =
        criarIdAgendamento(
            data,
            horario
        );


    const referencia =
        doc(
            db,
            nomeColecao,
            idAgendamento
        );

    const idHorario =
        criarIdHorario(
            data,
            horario
        );


    const referenciaHorario =
        doc(
            db,
            "horarios",
            idHorario
        );

    try {

        /*
         * A TRANSAÇÃO É IMPORTANTE.
         *
         * Ela verifica se o horário ainda está livre
         * imediatamente antes de salvar.
         *
         * Assim, dois clientes não conseguem reservar
         * o mesmo horário ao mesmo tempo.
         */

    await runTransaction(
    db,
    async (transaction) => {

        /* ==========================================
                VERIFICAR SE O HORÁRIO ESTÁ OCUPADO
        ========================================== */

        const documentoHorario =
            await transaction.get(
                referenciaHorario
            );


        if (documentoHorario.exists()) {

            throw new Error(
                "HORARIO_OCUPADO"
            );

        }


        /* ==========================================
                CRIAR BLOQUEIO DO HORÁRIO
        ========================================== */

        transaction.set(
            referenciaHorario,
            {

                data: data,

                horario: horario,

                ocupado: true,

                criadoEm:
                    serverTimestamp()

            }
        );


        /* ==========================================
                SALVAR AGENDAMENTO
        ========================================== */

        transaction.set(
            referencia,
            {

                nome: nome,

                telefone: telefone,

                servico: servico,

                data: data,

                horario: horario,

                criadoEm:
                    serverTimestamp()

            }
        );

    }
);

        console.log(
            "Agendamento salvo com sucesso!"
        );


        return true;


    } catch (erro) {

        console.error(
            "Erro ao salvar agendamento:",
            erro
        );


        if (
            erro.message ===
            "HORARIO_OCUPADO"
        ) {

            mostrarErro(
                "Esse horário acabou de ser reservado por outra pessoa. Escolha outro horário."
            );


            horarioInput.value = "";


            await carregarHorariosOcupados();


            fecharModalConfirmacao();


            return false;

        }


        mostrarErro(
            "Não foi possível salvar o agendamento. Tente novamente."
        );


        return false;

    }

}


/* ======================================================
        CONFIRMAR E ENVIAR WHATSAPP
====================================================== */

confirmarAgendamento.addEventListener(
    "click",
    async function () {

        /*
         * Evita que o cliente clique várias vezes
         * enquanto o Firebase está salvando.
         */

        confirmarAgendamento.disabled = true;

        const textoOriginal =
            confirmarAgendamento.textContent;

        confirmarAgendamento.textContent =
            "Salvando...";


        /* ----------------------------------------------
                SALVAR NO FIREBASE
        ---------------------------------------------- */

        const salvo =
            await salvarAgendamento();


        /* ----------------------------------------------
                SE NÃO SALVOU, PARA AQUI
        ---------------------------------------------- */

        if (!salvo) {

            confirmarAgendamento.disabled = false;

            confirmarAgendamento.textContent =
                textoOriginal;

            return;

        }


        /* ----------------------------------------------
                CRIAR MENSAGEM
        ---------------------------------------------- */

        const mensagem =
            criarMensagemWhatsApp();


        /* ----------------------------------------------
                ABRIR WHATSAPP
        ---------------------------------------------- */

        const url =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;


        window.open(
            url,
            "_blank"
        );


        /* ----------------------------------------------
                FECHAR MODAL
        ---------------------------------------------- */

        fecharModalConfirmacao();


        confirmarAgendamento.disabled = false;

        confirmarAgendamento.textContent =
            textoOriginal;


        /* ----------------------------------------------
                ATUALIZAR HORÁRIOS
        ---------------------------------------------- */

        await carregarHorariosOcupados();

    }
);


/* ======================================================
                INICIALIZAÇÃO
====================================================== */

definirDataMinima();