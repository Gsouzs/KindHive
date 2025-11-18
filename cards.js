const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));

function criarCardParaCausa(id, causa) {
  const nome = causa.nome_causa || "Sem título";
  const empresa = causa.empresa || "Organização";
  const descricao = causa.descricao || "";
  const local = causa.local || "geral";
  const meta = Number(causa.meta) || 0;
  const arrecadado = Number(causa.arrecadado) || 0;

  const porcentagem = meta > 0 ? clamp((arrecadado / meta) * 100, 0, 100) : 0;

  const card = document.createElement('div');
  card.className = 'cards';
  card.dataset.causaId = id;

  card.innerHTML = `
    <div class="causa-container">
      <h2>${nome}</h2>
      <h3>${empresa} • ${local.toString().replace(/_/g, ' ')}</h3>
    </div>

    <div class="meta-container">
      <div class="meta-info">
        <span>Meta: <strong>${formatCurrency(meta)}/${formatCurrency(arrecadado)}</strong></span>
        <span class="meta-percent">
          <small>${porcentagem.toFixed(1)}%</small>
        </span>
        <br>
      </div>

      <div class="barra-meta" aria-label="Progresso da meta">
        <div class="progresso" style="width: ${porcentagem}%;"></div>
      </div>

    </div>

    <div class="container-abrir">
      <button class="btn-doar" type="button">Doar &gt;</button>
    </div>
  `;

  const btn = card.querySelector('.btn-doar');
  btn.addEventListener('click', () => {
    alert(`Você escolheu doar para: "${nome}"\nResponsável: ${empresa}`);
  });

  return card;
}

fetch('causas.json')
  .then(res => {
    if (!res.ok) throw new Error('Erro ao buscar causas.json — verifique caminho e permissão CORS.');
    return res.json();
  })
  .then(data => {
    const lista = data.causas || data;

    const container = document.getElementById('cards_container');
    if (!container) {
      console.error('Elemento #cards_container não encontrado no HTML.');
      return;
    }

    container.innerHTML = '';

    Object.keys(lista).forEach(key => {
      const causa = lista[key];
      const card = criarCardParaCausa(key, causa);
      container.appendChild(card);
    });
  })
  .catch(err => console.error('Erro ao carregar/mostrar causas:', err));