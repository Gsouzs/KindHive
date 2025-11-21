
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);

const causaID = params.get("id");
const valor = Number(params.get("valor") || 0);
const nome = params.get("nome") ? decodeURIComponent(params.get("nome")) : "Visitante";
const email = params.get("email") ? decodeURIComponent(params.get("email")) : "Sem e-mail";

const campoValor = document.getElementById("valor");
const campoNome = document.getElementById("nomePessoa");
const campoEmail = document.getElementById("emailPessoa");
const btnConfirmar = document.getElementById("btnConfirmar");

if (campoValor) campoValor.textContent = `Valor da doação: R$ ${valor.toFixed(2)}`;
if (campoNome) campoNome.textContent = nome;
if (campoEmail) campoEmail.textContent = email;

btnConfirmar.addEventListener("click", async () => {
  if (!causaID) {
    alert("Causa inválida.");
    return;
  }
  if (!nome || nome.trim() === "") {
    alert("Nome inválido.");
    return;
  }
  if (!email || !email.includes("@")) {
    alert("E-mail inválido.");
    return;
  }
  if (!valor || valor <= 0) {
    alert("Valor inválido.");
    return;
  }

  btnConfirmar.disabled = true;
  btnConfirmar.textContent = "Registrando...";

  try {
    await addDoc(collection(db, `causas/${causaID}/doacoes`), {
      Nome: nome,
      Email: email,
      Valor: valor,
      Data: serverTimestamp()
    });

    alert("Doação registrada com sucesso!");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Erro ao salvar doação:", err);
    alert("Ocorreu um erro ao registrar a doação. Tente novamente.");
    btnConfirmar.disabled = false;
    btnConfirmar.textContent = "Confirmar pagamento";
  }
});
