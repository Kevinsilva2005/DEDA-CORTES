/*==========================================================
                DEDA CORTES
                MAIN.JS
==========================================================*/


/*==========================================================
                MENU MOBILE
==========================================================*/

console.log("Main.js carregado");

const menuMobile = document.querySelector(".menu-mobile");
const navbar = document.querySelector(".navbar");

if (menuMobile && navbar) {

    menuMobile.addEventListener("click", () => {

        navbar.classList.toggle("ativo");

    });

}


/*==========================================================
            FECHAR MENU AO CLICAR
==========================================================*/

if (navbar) {

    document.querySelectorAll(".navbar a").forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("ativo");

        });

    });

}


/*==========================================================
            HEADER AO ROLAR
==========================================================*/

const header = document.querySelector(".header");

if (header) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {

            header.style.padding = "8px 0";

            header.style.background =
                "rgba(17,17,17,.98)";

            header.style.boxShadow =
                "0 10px 25px rgba(0,0,0,.25)";

        } else {

            header.style.padding = "";

            header.style.background =
                "rgba(17,17,17,.92)";

            header.style.boxShadow = "none";

        }

    });

}


/*==========================================================
            BOTÃO VOLTAR AO TOPO
==========================================================*/

const btnTopo =
    document.getElementById("btnTopo");

if (btnTopo) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            btnTopo.style.display = "flex";

        } else {

            btnTopo.style.display = "none";

        }

    });


    btnTopo.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/*==========================================================
                CARROSSEL DOS TRABALHOS
==========================================================*/

const container =
    document.querySelector(".carrossel-container");

const fotos =
    document.querySelectorAll(".foto");

const setaDireita =
    document.querySelector(".seta-direita");

const setaEsquerda =
    document.querySelector(".seta-esquerda");

const indicadores =
    document.querySelectorAll(".indicadores span");

let indice = 0;

let intervalo;


/*----------------------------------------------------------
            QUANTIDADE DE IMAGENS VISÍVEIS
----------------------------------------------------------*/

function quantidadeVisivel() {

    if (window.innerWidth <= 768) {

        return 1;

    }

    return 3;

}


/*----------------------------------------------------------
            ATUALIZAR CARROSSEL
----------------------------------------------------------*/

function atualizarCarrossel() {

    /*
     * Só executa se o carrossel existir.
     */

    if (
        !container ||
        !fotos.length
    ) {

        return;

    }


    const largura =
        fotos[0].offsetWidth + 25;


    container.style.transform =
        `translateX(-${indice * largura}px)`;


    indicadores.forEach(item => {

        item.classList.remove("ativo");

    });


    if (indicadores[indice]) {

        indicadores[indice]
            .classList.add("ativo");

    }

}


/*----------------------------------------------------------
                    PRÓXIMO
----------------------------------------------------------*/

function proximo() {

    if (!fotos.length) {

        return;

    }


    const limite =
        fotos.length - quantidadeVisivel();


    indice++;


    if (indice > limite) {

        indice = 0;

    }


    atualizarCarrossel();

}


/*----------------------------------------------------------
                    ANTERIOR
----------------------------------------------------------*/

function anterior() {

    if (!fotos.length) {

        return;

    }


    const limite =
        fotos.length - quantidadeVisivel();


    indice--;


    if (indice < 0) {

        indice = limite;

    }


    atualizarCarrossel();

}


/*----------------------------------------------------------
                CONTROLES DO CARROSSEL
----------------------------------------------------------*/

if (
    container &&
    fotos.length &&
    setaDireita &&
    setaEsquerda
) {

    setaDireita.addEventListener(
        "click",
        proximo
    );


    setaEsquerda.addEventListener(
        "click",
        anterior
    );


    function iniciarAuto() {

        intervalo =
            setInterval(
                proximo,
                4000
            );

    }


    function pararAuto() {

        clearInterval(intervalo);

    }


    const carrossel =
        document.querySelector(".carrossel");


    if (carrossel) {

        carrossel.addEventListener(
            "mouseenter",
            pararAuto
        );


        carrossel.addEventListener(
            "mouseleave",
            iniciarAuto
        );

    }


    window.addEventListener(
        "resize",
        atualizarCarrossel
    );


    iniciarAuto();

    atualizarCarrossel();

}


/*==========================================================
                    LIGHTBOX
==========================================================*/

const lightbox =
    document.getElementById("lightbox");

const imagemLightbox =
    document.getElementById("imagemLightbox");

const fecharLightbox =
    document.getElementById("fecharLightbox");


if (
    lightbox &&
    imagemLightbox &&
    fecharLightbox &&
    fotos.length
) {


    fotos.forEach(foto => {

        foto.addEventListener(
            "click",
            () => {

                const imagem =
                    foto.querySelector("img");


                if (!imagem) {

                    return;

                }


                imagemLightbox.src =
                    imagem.src;


                lightbox.style.display =
                    "flex";


                document.body.style.overflow =
                    "hidden";

            }
        );

    });


    fecharLightbox.addEventListener(
        "click",
        () => {

            lightbox.style.display =
                "none";


            document.body.style.overflow =
                "auto";

        }
    );


    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
            ) {

                lightbox.style.display =
                    "none";


                document.body.style.overflow =
                    "auto";

            }

        }
    );

}


/*==========================================================
            ANIMAÇÃO AO ROLAR A PÁGINA
==========================================================*/

const elementosAnimados =
    document.querySelectorAll(".animar");


function animarScroll() {

    elementosAnimados.forEach(elemento => {

        const topo =
            elemento.getBoundingClientRect().top;


        const alturaTela =
            window.innerHeight;


        if (
            topo <
            alturaTela - 120
        ) {

            elemento.classList.add("ativo");

        }

    });

}


if (elementosAnimados.length) {

    window.addEventListener(
        "scroll",
        animarScroll
    );


    animarScroll();

}


/*==========================================================
                    MENU ATIVO
==========================================================*/

const secoes =
    document.querySelectorAll("section");

const linksMenu =
    document.querySelectorAll(".navbar a");


if (
    secoes.length &&
    linksMenu.length
) {

    window.addEventListener(
        "scroll",
        () => {

            let secaoAtual = "";


            secoes.forEach(secao => {

                const topo =
                    secao.offsetTop - 180;


                const altura =
                    secao.offsetHeight;


                if (
                    window.scrollY >= topo
                ) {

                    secaoAtual =
                        secao.getAttribute("id");

                }

            });


            linksMenu.forEach(link => {

                link.classList.remove(
                    "ativo"
                );


                if (
                    link.getAttribute("href") ===
                    "#" + secaoAtual
                ) {

                    link.classList.add(
                        "ativo"
                    );

                }

            });

        }
    );

}