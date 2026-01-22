const USUARIO_ADMIN = "admin";
const SENHA_ADMIN = "1234";

// Verificar se já está logado
if (localStorage.getItem("adminLogado") === "true") {
    mostrarAdmin();
}

function login() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erroLogin");

    if (usuario === USUARIO_ADMIN && senha === SENHA_ADMIN) {
        localStorage.setItem("adminLogado", "true");
        mostrarAdmin();
    } else {
        erro.classList.remove("d-none");
    }
}

function mostrarAdmin() {
    document.getElementById("loginArea").classList.add("d-none");
    document.getElementById("adminArea").classList.remove("d-none");
}

function logout() {
    localStorage.removeItem("adminLogado");
    location.reload();
}

function mostrarSecao(secao, link) {
    ["financeira", "reservas", "contactos"].forEach(id => {
        document.getElementById(id).classList.add("d-none");
    });

    document.getElementById(secao).classList.remove("d-none");

    document.querySelectorAll(".nav-link").forEach(l => {
        l.classList.remove("active");
        l.classList.add("text-white");
    });

    link.classList.add("active");
    link.classList.remove("text-white");

    if (secao === "contactos") {
        carregarContactos();
    }
}

function carregarContactos() {
    const lista = document.getElementById("listaContactos");
    lista.innerHTML = "";

    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];

    if (contactos.length === 0) {
        lista.innerHTML = `
      <div class="alert alert-info">
        Ainda não há mensagens.
      </div>
    `;
        return;
    }

    contactos.forEach(c => {
        const card = document.createElement("div");
        card.className = "card mb-3";

        card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${c.nome} <small class="text-muted">(${c.email})</small></h5>
        <p class="card-text">${c.mensagem}</p>
        <p class="text-end"><small class="text-muted">${c.data}</small></p>
      </div>
    `;

        lista.appendChild(card);
    });
}


