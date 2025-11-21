import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


const params = new URLSearchParams(window.location.search);
const causaID = params.get("id");

const nomeEl = document.getElementById("nomeCausa");
const DescricaoEl = document.getElementById("descricaoCausa");
const empresaLocalEl = document.getElementById("empresaLocal");

const inputNome = document.getElementById("Nome");
const inputEmail = document.getElementById("E-mail");
const inputValor = document.getElementById("Valor");

const btnPagar = document.getElementById("btnPagar");

async function carregarCausa() {
  if (!causaID) return;

  const ref = doc(db, "causas", causaID);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const dados = snap.data();
    nomeEl.textContent = dados.Causa;
    DescricaoEl.textContent = dados.Descricao;
    empresaLocalEl.textContent = `${dados.Empresa} • ${dados.Local.replace(/_/g, " ")}`;
  }
}

btnPagar.addEventListener("click", () => {
  const nome = inputNome.value.trim();
  const email = inputEmail.value.trim();
  const valor = Number(inputValor.value);

  if (!nome) {
    alert("Por favor, preencha seu nome.");
    return;
  }

  if (!email || !email.includes("@") || !email.includes(".")) {
    alert("Digite um e-mail válido.");
    return;
  }

  if (!valor || valor <= 0) {
    alert("Digite um valor válido para doação.");
    return;
  }

  if (valor > 5000) {
    alert("Por motivos didáticos, o valor máximo permitido é de R$ 5.000,00.");
    return;
  }

  window.location.href = `simulacao.html?id=${causaID}&valor=${valor}&nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}`;
});

carregarCausa();
