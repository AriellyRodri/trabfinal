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



// PESQUISA DE RESERVA (inicio.html)
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const reserva = {
      id: Date.now(),
      checkin: document.getElementById("checkin").value,
      checkout: document.getElementById("checkout").value,
      adultos: document.getElementById("adultos").value,
      criancas: document.getElementById("criancas").value
    };

    localStorage.setItem("pesquisaReserva", JSON.stringify(reserva));

    window.location.href = "quartos-disponiveis.html";
  });
}

const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
reservas.push(reservaFinal);
localStorage.setItem("reservas", JSON.stringify(reservas));


// QUARTOS DISPONÍVEIS (quartos.html)
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


const reservaFinal = {
  id: pesquisaReserva.id, // reaproveita o id
  nome: document.getElementById("nome").value,
  email: document.getElementById("email").value,

  checkin: pesquisaReserva.checkin,
  checkout: pesquisaReserva.checkout,
  adultos: pesquisaReserva.adultos,
  criancas: pesquisaReserva.criancas,

  quarto: localStorage.getItem("quartoSelecionado"),
  total: localStorage.getItem("valorTarifa") + " EUR",

  data: new Date().toLocaleDateString()
};

// SALVAR DADOS NA PÁGINA INÍCIO
 document.getElementById("bookingForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const checkin = document.getElementById("checkin").value;
            const checkout = document.getElementById("checkout").value;
            const adultos = document.getElementById("adultos").value;
            const criancas = document.getElementById("criancas").value;

            const d1 = new Date(checkin);
            const d2 = new Date(checkout);

            if (!checkin || !checkout || d2 <= d1) {
                alert("Datas inválidas");
                return;
            }

            const noites = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));

            localStorage.setItem("checkin", checkin);
            localStorage.setItem("checkout", checkout);
            localStorage.setItem("noites", noites);
            localStorage.setItem("adultos", adultos);
            localStorage.setItem("criancas", criancas);

            window.location.href = "quartos-disponiveis.html";
        });






// TARIFAS - CARREGAR DADOS
        