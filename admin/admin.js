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
    const secoes = ["financeira", "reservas", "contactos"];

    secoes.forEach(id => {
        document.getElementById(id).classList.add("d-none");
    });

    document.getElementById(secao).classList.remove("d-none");

    document.querySelectorAll(".nav-link").forEach(l => {
        l.classList.remove("active");
        l.classList.add("text-white");
    });

    link.classList.add("active");
    link.classList.remove("text-white");

    if (secao === "reservas") {
        carregarReservas();
    }

    if (secao === "contactos") {
        carregarContactos();
    }

    if (secao === "financeira") {
        carregarFinanceiro();
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

function carregarReservas() {
  const tbody = document.getElementById("listaReservas");
  tbody.innerHTML = "";

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  if (reservas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          Nenhuma reserva encontrada
        </td>
      </tr>
    `;
    return;
  }

  reservas.forEach(r => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.nome}</td>
      <td>${r.data}</td>
      <td>${r.checkout}</td>
      <td>${r.total}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1"
          onclick="editarReserva(${r.id})">
          ✏️
        </button>

        <button class="btn btn-sm btn-info me-1"
          onclick="contactarCliente('${r.email}')">
          📧
        </button>

        <button class="btn btn-sm btn-danger"
          onclick="removerReserva(${r.id})">
          🗑️
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function editarReserva(id) {
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const reserva = reservas.find(r => r.id === id);

  if (!reserva) return;

  const novoCheckin = prompt("Novo check-in:", reserva.checkin);
  const novoCheckout = prompt("Novo check-out:", reserva.checkout);

  if (novoCheckin && novoCheckout) {
    reserva.checkin = novoCheckin;
    reserva.checkout = novoCheckout;
    carregarReservas();
  }
}

function contactarCliente(email) {
  alert("A contactar cliente: " + email);
}

function removerReserva(id) {
  if (!confirm("Deseja remover esta reserva?")) return;

  let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  reservas = reservas.filter(r => r.id !== id);

  localStorage.setItem("reservas", JSON.stringify(reservas));
  carregarReservas();
}

function carregarFinanceiro() {
  const vendas = JSON.parse(localStorage.getItem("reservas")) || [];

  const total = vendas.reduce((acc, r) => {
    const valor = parseFloat((r.total || "0").toString().replace(",", "."));
    return acc + (isNaN(valor) ? 0 : valor);
  }, 0);

  document.getElementById("totalVendas").innerHTML = `
    <div class="alert alert-success">
      <strong>Total de vendas:</strong> R$ ${total.toFixed(2)}
    </div>
  `;

  // Montar dados para o gráfico
  const labels = vendas.map((v, index) => `Reserva ${index + 1}`);
  const dataValores = vendas.map(v => parseFloat((v.total || "0").toString().replace(",", ".")));

  // Criar gráfico
  const ctx = document.getElementById("graficoVendas").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Valor da Reserva (R$)",
        data: dataValores,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Lista de vendas (sem checkin/checkout)
  const lista = document.getElementById("listaVendas");
  lista.innerHTML = "";

  vendas.forEach(v => {
    lista.innerHTML += `
      <div class="card mb-2">
        <div class="card-body">
          <p><strong>Nome:</strong> ${v.nome}</p>
          <p><strong>Total:</strong> R$ ${v.total}</p>
        </div>
      </div>
    `;
  });
}





