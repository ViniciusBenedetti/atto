// Páginas institucionais. Textos a validar com o Vinícius; os jurídicos precisam de revisão profissional.
import { esc, paginaTexto } from './render.mjs';

function contato(ctx) {
  const email = ctx.config.contato_email;
  return email
    ? `<p>Para dúvidas, correções ou para reportar um preço divergente, escreva para <a href="mailto:${esc(email)}">${esc(email)}</a>. Informe a oferta, o preço que você viu na loja e a data e hora.</p>`
    : '<p>O endereço de contato ainda não foi publicado. Enquanto isso, confira sempre o preço na página da loja antes de pagar.</p>';
}

export function paginaSobre(ctx) {
  const { config } = ctx;
  const h = ctx.limite;
  const corpo = `
<p class="body muted" style="margin-top: var(--space-3)">Quem mantém a Atto, como as ofertas são coletadas e como cada veredito é decidido.</p>

<h2>Quem mantém</h2>
<p>A Atto é mantida por ${esc(config.assinatura)}, que define as categorias, os critérios mínimos de cada produto e as fontes consultadas, e assina as análises.</p>

<h2 id="metodologia">Como a coleta funciona</h2>
<ul>
  <li>Uma rotina automática roda todos os dias às 09:00 (horário de Brasília). Ela pesquisa ofertas nas categorias acompanhadas e lê as páginas e listagens permitidas.</li>
  <li>Cada preço é registrado com a data e a hora em que foi visto e com a origem (página da loja, listagem de busca da loja ou agregador de ofertas).</li>
  <li>O resultado vira um relatório. O site exibe esse relatório sem alterar valores: nada é arredondado nem recalculado.</li>
  <li>Antes de cada publicação, um teste automático compara todos os preços exibidos com os valores do relatório. Se algum for diferente, a publicação é bloqueada e o site continua com a versão anterior.</li>
  <li>Quando um dado tem mais de ${h} horas, o site mostra o aviso de dado desatualizado com a data da última checagem. Quando a coleta falha, o preço não é exibido.</li>
</ul>

<h2 id="fontes">Fonte verificada e fonte não verificada</h2>
<p>A fonte é considerada verificada quando a oferta é de uma destas lojas, com o vendedor identificado:</p>
<ul>
  <li>Amazon.com.br, vendido pela Amazon;</li>
  <li>Mercado Livre, de Loja Oficial, Full ou vendedor MercadoLíder;</li>
  <li>Magalu, KaBuM, Casas Bahia, Americanas, Fast Shop e Extra, vendendo diretamente;</li>
  <li>lojas oficiais das marcas.</li>
</ul>
<p>A fonte é marcada como não verificada quando o vendedor não foi identificado ou é um terceiro. Ela pode ter o menor preço, e por isso aparece no site, sempre com o aviso: o risco da compra é do comprador.</p>
<p>Agregadores de ofertas, como Promobit, servem para encontrar ofertas. O preço lido neles aparece com a origem indicada na oferta.</p>

<h2 id="vereditos">Como ler os vereditos</h2>
<ul>
  <li><strong>Comprar agora:</strong> preço checado nas últimas 48 horas e pelo menos 5% abaixo da referência de mercado citada.</li>
  <li><strong>Esperar:</strong> preço acima da referência, oferta sem confirmação ou motivo de mercado para esperar.</li>
  <li><strong>Sem base suficiente:</strong> preço a menos de 5% da referência, não revalidado no dia ou sem dado para comparar, como o preço à vista.</li>
</ul>
<p>Todo veredito traz o motivo e a base (fonte e data). Previsões indicam tendência, não certeza. Sem base citada, não há veredito.</p>

<h2 id="ia">Uso de inteligência artificial</h2>
<p>A coleta e a redação das análises são feitas com apoio de IA (Claude, da Anthropic), seguindo os critérios, as fontes e as regras definidos pelo autor. Páginas com análise feita com apoio de IA informam isso ao lado da assinatura. A IA pode errar: por isso cada preço traz a origem e a hora da checagem, e o site aceita correções.</p>

<h2 id="faq">Perguntas frequentes</h2>
<dl class="faq">
  <dt>Por que o preço na loja está diferente?</dt>
  <dd>Lojas mudam preços a qualquer momento. O site mostra o preço do momento da checagem, com data e hora. Se a diferença aparecer logo após a checagem, reporte pelo link "Reportar preço divergente" da oferta.</dd>
  <dt>A Atto vende produtos?</dt>
  <dd>Não. A Atto só informa. A compra é feita na loja, com as condições da loja.</dd>
  <dt>Por que algumas ofertas não têm link direto?</dt>
  <dd>Algumas lojas não permitem a leitura automática da página do produto. Nesses casos, a oferta traz um texto pronto para colar na busca da loja.</dd>
  <dt>A Atto recebe comissão?</dt>
  <dd>Alguns links podem ser de afiliado e são marcados na oferta. A comissão não muda preço, ordem nem veredito. <a href="/afiliados/">Leia o aviso de afiliados</a>.</dd>
  <dt>Com que frequência o site é atualizado?</dt>
  <dd>Uma vez por dia, depois da rotina das 09:00. A data e a hora da última atualização ficam no topo da página inicial.</dd>
</dl>

<h2 id="contato">Contato</h2>
${contato(ctx)}

<div class="assinatura secao"><p class="body-sm">Análise: ${esc(config.assinatura)}</p></div>
`;
  return paginaTexto(ctx, {
    titulo: 'Sobre e metodologia',
    descricao: 'Quem mantém a Atto, como as ofertas são coletadas, o que é fonte verificada e como a IA é usada.',
    caminho: '/sobre/',
    corpo,
    navAtual: 'sobre',
  });
}

export function paginaAfiliados(ctx) {
  const corpo = `
<p style="margin-top: var(--space-5)">Alguns links da Atto para lojas podem ser links de afiliado. Se você comprar por um desses links, a loja pode pagar uma comissão à Atto. O preço para você é o mesmo.</p>
<ul>
  <li>Todo link de afiliado é marcado na oferta com o selo "Link de afiliado".</li>
  <li>A comissão não muda o preço exibido, a ordem das ofertas nem o veredito. Uma oferta melhor sem link de afiliado continua aparecendo como melhor.</li>
  <li>Fontes não verificadas continuam sinalizadas, com ou sem comissão.</li>
</ul>
<p>Dúvidas sobre este aviso: <a href="/sobre/#contato">contato</a>.</p>`;
  return paginaTexto(ctx, {
    titulo: 'Aviso de afiliados',
    descricao: 'Como a Atto trata links de afiliado e por que eles não mudam preço, ordem nem veredito.',
    caminho: '/afiliados/',
    corpo,
  });
}

export function paginaPrivacidade(ctx) {
  const { config } = ctx;
  const analytics = config.cloudflare_analytics_token
    ? '<li><strong>Métricas de uso:</strong> o site usa o Cloudflare Web Analytics, que conta visitas de forma agregada, sem cookies e sem identificar quem visita.</li>'
    : '<li><strong>Métricas de uso:</strong> no momento o site não coleta métricas de uso.</li>';
  const corpo = `
<p class="caption" style="margin-top: var(--space-3)">Última atualização: 29/10/2026</p>
<p style="margin-top: var(--space-5)">Esta política explica quais dados a Atto trata, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018). O responsável pelo site é ${esc(config.assinatura)}.</p>
<h2>Dados que a Atto trata</h2>
<ul>
  <li><strong>Sem cadastro:</strong> o site não tem conta, login nem formulário.</li>
  <li><strong>Sem cookies:</strong> o site não grava cookies. A escolha de tema claro ou escuro fica salva apenas no seu navegador e não é enviada para a Atto.</li>
  ${analytics}
  <li><strong>Hospedagem:</strong> o site é hospedado pela Cloudflare, que registra dados técnicos de acesso (como endereço IP) para operar e proteger o serviço.</li>
  <li><strong>Fontes tipográficas:</strong> as fontes do site são carregadas do Google Fonts, que recebe o endereço IP do seu dispositivo ao entregar os arquivos.</li>
  <li><strong>E-mail:</strong> se você escrever para a Atto, o e-mail é usado só para responder e corrigir o que for reportado.</li>
</ul>
<h2>Links para lojas</h2>
<p>Ao abrir uma loja a partir da Atto, você passa a seguir a política de privacidade da loja.</p>
<h2>Seus direitos</h2>
<p>Você pode pedir acesso, correção ou exclusão dos seus dados pelo canal de <a href="/sobre/#contato">contato</a>.</p>`;
  return paginaTexto(ctx, {
    titulo: 'Política de privacidade',
    descricao: 'Quais dados a Atto trata: sem cadastro, sem cookies, com métricas agregadas.',
    caminho: '/privacidade/',
    corpo,
  });
}

export function paginaTermos(ctx) {
  const corpo = `
<p class="caption" style="margin-top: var(--space-3)">Última atualização: 29/10/2026</p>
<h2>O que a Atto é</h2>
<p>A Atto publica um relatório informativo de ofertas de eletrônicos. A Atto não vende produtos, não intermedia compras e não garante preço, estoque, prazo ou condição de pagamento.</p>
<h2>Preços e informações</h2>
<ul>
  <li>Cada preço é o valor visto na fonte na data e hora indicadas. As lojas podem mudar preços e condições a qualquer momento.</li>
  <li>A informação não é definitiva e pode conter erros. Confira preço, vendedor, prazo e garantia na página da loja antes de pagar.</li>
  <li>Ofertas de fontes não verificadas são sinalizadas: o risco da compra é do comprador.</li>
  <li>Vereditos são análises com base citada e indicam tendência, não certeza. A decisão de compra é sua.</li>
</ul>
<h2>Marcas e imagens</h2>
<p>Nomes de produtos, marcas e imagens pertencem aos respectivos donos e aparecem apenas para identificar as ofertas.</p>
<h2>Links de afiliado</h2>
<p>Alguns links podem ser de afiliado. Veja o <a href="/afiliados/">aviso de afiliados</a>.</p>
<h2>Contato</h2>
<p>Correções e dúvidas: <a href="/sobre/#contato">contato</a>.</p>`;
  return paginaTexto(ctx, {
    titulo: 'Termos de uso',
    descricao: 'Condições de uso da Atto: relatório informativo, sem venda e sem garantia de preço.',
    caminho: '/termos/',
    corpo,
  });
}

export function pagina404(ctx) {
  return paginaTexto(ctx, {
    titulo: 'Página não encontrada',
    descricao: 'Esta página não existe ou a oferta saiu do relatório.',
    caminho: '/404.html',
    corpo: '<p class="body" style="margin-top: var(--space-5)">Esta página não existe ou a oferta saiu do relatório atual. Ofertas encerradas ou fora dos critérios deixam de ser publicadas.</p><p style="margin-top: var(--space-5)"><a class="btn btn-principal" href="/">Ver as ofertas atuais</a></p>',
  });
}
