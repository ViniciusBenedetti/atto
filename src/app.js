// Atto: comportamento no navegador. O site funciona sem este script; ele só
// acrescenta tema, aviso de idade do dado, filtros e o botão Copiar.
(function () {
  'use strict';

  // Tema: o inicial vem do sistema (CSS); a escolha manual fica neste navegador.
  var CHAVE_TEMA = 'atto-tema';
  var raiz = document.documentElement;
  function temaAtual() {
    var t = raiz.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function rotularBotaoTema(botao) {
    var proximo = temaAtual() === 'dark' ? 'claro' : 'escuro';
    botao.setAttribute('aria-label', 'Usar tema ' + proximo);
    var texto = botao.querySelector('[data-tema-texto]');
    if (texto) texto.textContent = 'Tema ' + proximo;
  }
  document.querySelectorAll('[data-alternar-tema]').forEach(function (botao) {
    rotularBotaoTema(botao);
    botao.addEventListener('click', function () {
      var novo = temaAtual() === 'dark' ? 'light' : 'dark';
      raiz.setAttribute('data-theme', novo);
      try { localStorage.setItem(CHAVE_TEMA, novo); } catch (e) { /* armazenamento indisponível */ }
      rotularBotaoTema(botao);
    });
  });

  // Idade do dado: compara a hora da checagem com o relógio de quem está vendo.
  // Se a rotina deixar de rodar, o aviso aparece mesmo sem novo build.
  var limiteHoras = Number(document.body.getAttribute('data-limite-horas')) || 24;
  var agora = Date.now();
  document.querySelectorAll('[data-checado]').forEach(function (el) {
    var t = Date.parse(el.getAttribute('data-checado'));
    if (isNaN(t)) return;
    var desatualizado = (agora - t) / 3600000 > limiteHoras;
    var atual = el.querySelector('[data-estado="atual"]');
    var antigo = el.querySelector('[data-estado="desatualizado"]');
    if (atual && antigo) {
      atual.hidden = desatualizado;
      antigo.hidden = !desatualizado;
    }
  });

  // Filtros e ordenação das listas de ofertas.
  function numero(texto) {
    var limpo = String(texto || '').replace(/[^\d,]/g, '').replace(',', '.');
    return limpo ? Number(limpo) : NaN;
  }
  document.querySelectorAll('[data-filtros]').forEach(function (form) {
    var escopo = document.querySelector(form.getAttribute('data-filtros'));
    if (!escopo) return;
    form.hidden = false;
    var campos = {};
    form.querySelectorAll('[data-f]').forEach(function (c) { campos[c.getAttribute('data-f')] = c; });
    var contagem = form.querySelector('[data-contagem]');

    function aplicar() {
      var busca = (campos.busca && campos.busca.value || '').trim().toLowerCase();
      var loja = campos.loja ? campos.loja.value : '';
      var max = campos.max ? numero(campos.max.value) : NaN;
      var soVerificada = campos.verificada && campos.verificada.checked;
      var ordem = campos.ordem ? campos.ordem.value : 'relatorio';
      var visiveis = 0;

      escopo.querySelectorAll('[data-grade]').forEach(function (grade) {
        var cartoes = Array.prototype.slice.call(grade.querySelectorAll('[data-oferta]'));
        var naGrade = 0;
        cartoes.forEach(function (c) {
          var valor = c.getAttribute('data-valor');
          var ok = true;
          if (busca && c.getAttribute('data-busca').indexOf(busca) === -1) ok = false;
          if (loja && c.getAttribute('data-loja') !== loja) ok = false;
          if (soVerificada && c.getAttribute('data-verificada') !== 'sim') ok = false;
          if (!isNaN(max) && (!valor || Number(valor) > max)) ok = false;
          c.hidden = !ok;
          if (ok) naGrade++;
        });
        cartoes.sort(function (a, b) {
          if (ordem === 'relatorio') return Number(a.getAttribute('data-ordem')) - Number(b.getAttribute('data-ordem'));
          var va = a.getAttribute('data-valor'), vb = b.getAttribute('data-valor');
          if (!va && !vb) return Number(a.getAttribute('data-ordem')) - Number(b.getAttribute('data-ordem'));
          if (!va) return 1;
          if (!vb) return -1;
          return ordem === 'menor' ? Number(va) - Number(vb) : Number(vb) - Number(va);
        });
        cartoes.forEach(function (c) { grade.appendChild(c); });
        var vazio = grade.parentNode.querySelector('[data-vazio-filtro]');
        if (vazio) vazio.hidden = naGrade > 0 || cartoes.length === 0;
        visiveis += naGrade;
      });
      if (contagem) contagem.textContent = visiveis === 1 ? '1 oferta exibida' : visiveis + ' ofertas exibidas';
    }
    form.addEventListener('input', aplicar);
    form.addEventListener('change', aplicar);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    aplicar();
  });

  // Botão Copiar, com alternativa que seleciona o texto quando a área de transferência falha.
  document.addEventListener('click', function (e) {
    var botao = e.target.closest && e.target.closest('[data-copiar]');
    if (!botao) return;
    var codigo = botao.parentNode.querySelector('code');
    var texto = codigo ? codigo.textContent : '';
    function feito() {
      botao.textContent = 'Copiado';
      setTimeout(function () { botao.textContent = 'Copiar'; }, 2000);
    }
    function selecionar() {
      try {
        var r = document.createRange();
        r.selectNodeContents(codigo);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        botao.textContent = 'Texto selecionado';
      } catch (err) {
        botao.textContent = 'Selecione o texto';
      }
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(feito, selecionar);
      else selecionar();
    } catch (err) {
      selecionar();
    }
  });
})();
