(() => {
  const tools = document.getElementById('article-tools');
  const input = document.getElementById('article-search');
  const cards = Array.from(document.querySelectorAll('.filter-card'));
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const count = document.getElementById('finder-count');
  const empty = document.getElementById('finder-empty');
  const reset = document.getElementById('finder-reset');
  if (!tools || !input || !cards.length || !buttons.length) return;
  let active = 'all';
  const normalize = text => text.normalize('NFKC').toLocaleLowerCase('ja-JP').trim();
  const update = () => {
    const query = normalize(input.value);
    let shown = 0;
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(/\s+/);
      const matchesCategory = active === 'all' || tags.includes(active);
      const matchesText = !query || normalize(card.textContent + ' ' + (card.dataset.keywords || '')).includes(query);
      const visible = matchesCategory && matchesText;
      card.hidden = !visible;
      if (visible) shown++;
    });
    count.textContent = `${shown}件の記事が見つかりました（全${cards.length}件）`;
    empty.hidden = shown !== 0;
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    active = button.dataset.filter;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    update();
  }));
  input.addEventListener('input', update);
  reset.addEventListener('click', () => {
    input.value = '';
    buttons.find(b => b.dataset.filter === 'all').click();
    input.focus();
  });
  tools.hidden = false;
  update();
})();
