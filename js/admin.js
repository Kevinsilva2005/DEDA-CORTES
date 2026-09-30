/* ======================================================
                ADMIN.JS
                DEDA CORTES
====================================================== */

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { auth } from "./firebase-config.js";


/* ======================================================
                ELEMENTOS
====================================================== */

const formulario = document.getElementById("formLogin");

const emailInput = document.getElementById("email");

const senhaInput = document.getElementById("senha");

const mostrarSenha = document.getElementById("mostrarSenha");

const mensagemLogin =
    document.getElementById("mensagemLogin");

const btnLogin =
    document.getElementById("btnLogin");


/* ======================================================
                MOSTRAR / OCULTAR SENHA
====================================================== */

mostrarSenha.addEventListener(
    "click",
    function () {

        const senhaVisivel =
            senhaInput.type === "text";

        senhaInput.type =
            senhaVisivel ? "password" : "text";


        const icone =
            mostrarSenha.querySelector("i");

        icone.classList.toggle(
            "fa-eye",
            senhaVisivel
        );

        icone.classList.toggle(
            "fa-eye-slash",
            !senhaVisivel
        );

    }
);


/* ======================================================
                MOSTRAR ERRO
====================================================== */

function mostrarErro(mensagem) {

    mensagemLogin.textContent = mensagem;

    mensagemLogin.classList.add("visivel");

}


/* ======================================================
                ESCONDER ERRO
====================================================== */

function esconderErro() {

    mensagemLogin.textContent = "";

    mensagemLogin.classList.remove("visivel");

}


/* ======================================================
                    LOGIN
====================================================== */

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        esconderErro();


        const email =
            emailInput.value.trim();

        const senha =
            senhaInput.value;


        if (!email || !senha) {

            mostrarErro(
                "Preencha o e-mail e a senha."
            );

            return;

        }


        /* ----------------------------------------------
                    DESABILITAR BOTÃO
        ---------------------------------------------- */

        btnLogin.disabled = true;

        btnLogin.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Entrando...
        `;


        try {

            /* ------------------------------------------
                    AUTENTICAR NO FIREBASE
            ------------------------------------------ */

            await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );


            /* ------------------------------------------
                    LOGIN REALIZADO
            ------------------------------------------ */

            console.log(
                "Login realizado com sucesso."
            );


            window.location.href =
                "dashboard.html";


        } catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );


            /* ------------------------------------------
                    MENSAGENS AMIGÁVEIS
            ------------------------------------------ */

            if (
                erro.code ===
                "auth/invalid-credential"
            ) {

                mostrarErro(
                    "E-mail ou senha incorretos."
                );

            } else if (
                erro.code ===
                "auth/invalid-email"
            ) {

                mostrarErro(
                    "Digite um e-mail válido."
                );

            } else if (
                erro.code ===
                "auth/too-many-requests"
            ) {

                mostrarErro(
                    "Muitas tentativas. Aguarde alguns minutos e tente novamente."
                );

            } else {

                mostrarErro(
                    "Não foi possível realizar o login. Tente novamente."
                );

            }


            btnLogin.disabled = false;

            btnLogin.innerHTML = `
                <i class="fa-solid fa-right-to-bracket"></i>
                Entrar
            `;

        }

    }
);


/* ======================================================
            VERIFICAR USUÁRIO JÁ LOGADO
====================================================== */

onAuthStateChanged(
    auth,
    function (usuario) {

        if (usuario) {

            console.log(
                "Usuário autenticado:",
                usuario.email
            );

            /*
             * Se o administrador já estiver logado
             * e abrir novamente o login.html,
             * será encaminhado para o dashboard.
             */

            window.location.href =
                "dashboard.html";

        }

    }
);