    /* Pagina Inicial */

document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;

    if (checkin >= checkout) {
        alert('A data de check-out deve ser posterior ao check-in.');
        return;
    }

    alert('Busca realizada com sucesso! (Simulação)');
});











// ===============================
// PESQUISA DE RESERVA (inicio.html)
// ===============================
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const reserva = {
      checkin: document.getElementById("checkin").value,
      checkout: document.getElementById("checkout").value,
      adultos: document.getElementById("adultos").value,
      criancas: document.getElementById("criancas").value
    };

    localStorage.setItem("pesquisaReserva", JSON.stringify(reserva));

    window.location.href = "quartos-disponiveis.html";
  });
}

// ===============================
// QUARTOS DISPONÍVEIS (quartos.html)
// ===============================
const listaQuartos = document.getElementById("listaQuartos");

const quartos = [
  {
    id: 1,
    nome: "Quarto Deluxe",
    preco: 180,
    imagem: "resources/imagens/quarto1.jpg"
  },
  {
    id: 2,
    nome: "Quarto Superior",
    preco: 140,
    imagem: "resources/imagens/quarto2.jpg"
  },
  {
    id: 3,
    nome: "Suíte Master",
    preco: 220,
    imagem: "resources/imagens/quarto3.jpg"
  }
];

if (listaQuartos) {
  const pesquisa = JSON.parse(localStorage.getItem("pesquisaReserva"));

  if (!pesquisa) {
    window.location.href = "inicio.html";
  }

  const dias =
    (new Date(pesquisa.checkout) - new Date(pesquisa.checkin)) /
    (1000 * 60 * 60 * 24);

  quartos.forEach((quarto) => {
    const total = dias * quarto.preco;

    listaQuartos.innerHTML += `
      <div class="col-md-4">
        <div class="card room-card">
          <img src="${quarto.imagem}" alt="${quarto.nome}">
          <div class="card-body text-center">
            <h5>${quarto.nome}</h5>
            <p class="room-price">€${quarto.preco} / noite</p>
            <p><strong>Total: €${total}</strong></p>
            <button class="btn btn-reservar w-100"
              onclick="reservarQuarto(${quarto.id})">
              Reservar
            </button>
          </div>
        </div>
      </div>
    `;
  });
}


// ===============================
// MINHAS RESERVAS
// ===============================
const minhasReservas = document.getElementById("minhasReservas");

if (minhasReservas) {
  const reservas = JSON.parse(localStorage.getItem("minhasReservas")) || [];

  if (reservas.length === 0) {
    minhasReservas.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
  }

  reservas.forEach((r) => {
    minhasReservas.innerHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5>${r.quarto}</h5>
          <p>Check-in: ${r.checkin}</p>
          <p>Check-out: ${r.checkout}</p>
          <strong>Total: € ${r.total}</strong>
        </div>
      </div>
    `;
  });
}
function reservarQuarto(id) {
  const pesquisa = JSON.parse(localStorage.getItem("pesquisaReserva"));
  const quarto = quartos.find(q => q.id === id);

  const dias =
    (new Date(pesquisa.checkout) - new Date(pesquisa.checkin)) /
    (1000 * 60 * 60 * 24);

  const reserva = {
    quarto: quarto.nome,
    precoNoite: quarto.preco,
    total: dias * quarto.preco,
    checkin: pesquisa.checkin,
    checkout: pesquisa.checkout
  };

  const reservas = JSON.parse(localStorage.getItem("minhasReservas")) || [];
  reservas.push(reserva);

  localStorage.setItem("minhasReservas", JSON.stringify(reservas));

  window.location.href = "minhas-reservas.html";
}












// SALVAR DATAS NA PÁGINA INÍCIO
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const checkin = document.getElementById("checkin").value;
      const checkout = document.getElementById("checkout").value;

      localStorage.setItem("checkin", checkin);
      localStorage.setItem("checkout", checkout);

      window.location.href = "quartos-disponiveis.html";
    });
  }
});

// FUNÇÃO PARA CALCULAR NOITES
function calcularNoites(checkin, checkout) {
  const entrada = new Date(checkin);
  const saida = new Date(checkout);
  const diff = saida - entrada;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ATUALIZAR TOTAL NA PÁGINA TARIFAS
function atualizarTotal() {
  const tarifaSelecionada = document.querySelector('input[name="tarifa"]:checked');
  const precoNoite = Number(tarifaSelecionada.dataset.preco);

  const checkin = localStorage.getItem("checkin");
  const checkout = localStorage.getItem("checkout");

  const noites = calcularNoites(checkin, checkout);
  const total = precoNoite * noites;

  document.getElementById("noites").innerText = `${noites} noite(s)`;
  document.getElementById("total").innerText = `${total.toFixed(2)} EUR`;
}

// CARREGAR DADOS AO ABRIR TARIFAS
document.addEventListener("DOMContentLoaded", () => {
  const checkin = localStorage.getItem("checkin");
  const checkout = localStorage.getItem("checkout");

  if (checkin && checkout) {
    document.getElementById("checkinData").innerText = formatarData(checkin);
    document.getElementById("checkoutData").innerText = formatarData(checkout);
    atualizarTotal();
  }
});

// FORMATAR DATA
function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-PT");
}












function selecionarQuarto(nomeQuarto, preco) {
  localStorage.setItem("quarto", nomeQuarto);
  localStorage.setItem("preco", preco);

  // Datas vindas do inicio.html
  const checkin = localStorage.getItem("checkin");
  const checkout = localStorage.getItem("checkout");

  const data1 = new Date(checkin);
  const data2 = new Date(checkout);

  const diffTime = data2 - data1;
  const noites = diffTime / (1000 * 60 * 60 * 24);

  localStorage.setItem("noites", noites);

  window.location.href = "tarifas.html";
}
