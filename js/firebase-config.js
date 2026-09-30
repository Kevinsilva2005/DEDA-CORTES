// ======================================================
//              CONFIGURAÇÃO DO FIREBASE
//                  DEDA CORTES
// ======================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


// ======================================================
//              CONFIGURAÇÃO DO PROJETO
// ======================================================

const firebaseConfig = {

    apiKey: "AIzaSyDTt8uwBRawrAaD6BlxQccoaYv_j-9sDZ0",

    authDomain: "deda-cortes.firebaseapp.com",

    projectId: "deda-cortes",

    storageBucket: "deda-cortes.firebasestorage.app",

    messagingSenderId: "957713409713",

    appId: "1:957713409713:web:1b5991a1f56fa6b4432490"

};


// ======================================================
//              INICIALIZAR FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);


// ======================================================
//              INICIALIZAR FIRESTORE
// ======================================================

const db = getFirestore(app);


// ======================================================
//              INICIALIZAR AUTHENTICATION
// ======================================================

const auth = getAuth(app);


// ======================================================
//              EXPORTAR
// ======================================================

export {
    db,
    auth
};