// Gera as artes das redes da VYREX (PNG + SVG) com satori + resvg.
// Uso: node render.mjs
import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const OUT = new URL("./entregas/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

// Paleta Voltagem
const INK = "#0A0A0A";
const SURF = "#161616";
const LINE = "#2A2A2A";
const PAPER = "#F5F5F0";
const MUTE = "#9B9B95";
const LIME = "#C6FF1A";
const ON_LIME_SOFT = "#2E2E2B";
const INK_55 = "rgba(10,10,10,0.55)";

// Preço de entrada (landing page) e @ do Instagram. Mesmos valores do site: vyrex-site/src/lib/site.ts.
const PRICE = "R$ 1.499";
const HANDLE = "@vyrexdigital";

const fontFile = (pkg, file) =>
  fs.readFile(new URL(`./node_modules/@fontsource/${pkg}/files/${file}`, import.meta.url));

const fonts = [
  { name: "Unbounded", weight: 700, data: await fontFile("unbounded", "unbounded-latin-700-normal.woff") },
  { name: "Unbounded", weight: 800, data: await fontFile("unbounded", "unbounded-latin-800-normal.woff") },
  { name: "Inter", weight: 400, data: await fontFile("inter", "inter-latin-400-normal.woff") },
  { name: "Inter", weight: 600, data: await fontFile("inter", "inter-latin-600-normal.woff") },
  { name: "JetBrains Mono", weight: 500, data: await fontFile("jetbrains-mono", "jetbrains-mono-latin-500-normal.woff") },
  { name: "JetBrains Mono", weight: 700, data: await fontFile("jetbrains-mono", "jetbrains-mono-latin-700-normal.woff") },
].map((f) => ({ ...f, style: "normal" }));

// ---------- primitivas ----------
const h = (type, style, ...children) => ({
  type,
  props: { style, children: children.flat().filter((c) => c !== null && c !== false && c !== undefined) },
});

const symbol = (width, left = PAPER, right = LIME) => ({
  type: "svg",
  props: {
    width,
    height: Math.round(width / 1.2),
    viewBox: "0 0 120 100",
    children: [
      { type: "polygon", props: { points: "0,0 32,0 49.65,41.7 40.25,95", fill: left } },
      { type: "polygon", props: { points: "120,0 88,0 55.65,41.7 46.25,95", fill: right } },
    ],
  },
});

const arrow = (width, color) => ({
  type: "svg",
  props: {
    width,
    height: Math.round(width / 2),
    viewBox: "0 0 48 24",
    children: [{ type: "path", props: { d: "M0 9.5h34V2l14 10-14 10v-7.5H0z", fill: color } }],
  },
});

// Paletas de aplicação: escura (padrão) e lima.
const DARK = { bg: INK, fg: PAPER, soft: MUTE, accent: LIME, symL: PAPER, symR: LIME };
const SURFACE = { ...DARK, bg: SURF };
const LIMEBG = { bg: LIME, fg: INK, soft: ON_LIME_SOFT, accent: INK, symL: INK, symR: INK_55 };

const lockup = (size, t) =>
  h(
    "div",
    { display: "flex", alignItems: "center", gap: Math.round(size * 0.35) },
    symbol(Math.round(size * 1.2), t.symL, t.symR),
    h("div", { fontFamily: "Unbounded", fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03, color: t.fg, lineHeight: 1 }, "VYREX"),
  );

const display = (text, size, color, extra = {}) =>
  h("div", { fontFamily: "Unbounded", fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.025, color, ...extra }, text);

const body = (text, size, color, extra = {}) =>
  h("div", { fontFamily: "Inter", fontWeight: 400, fontSize: size, lineHeight: 1.45, color, ...extra }, text);

const mono = (text, color, size = 24, extra = {}) =>
  h("div", { fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: size, letterSpacing: size * 0.12, color, ...extra }, text);

// Bloco de destaque: linha com fundo contrastante.
const highlight = (text, size, t) =>
  h(
    "div",
    { display: "flex", alignSelf: "flex-start", background: t.bg === LIME ? INK : LIME, padding: `${size * 0.06}px ${size * 0.22}px`, marginTop: size * 0.12 },
    display(text, size, t.bg === LIME ? LIME : INK),
  );

const rajada = (count, width, t) =>
  h(
    "div",
    { display: "flex", gap: Math.round(width * 0.18) },
    ...Array.from({ length: count }, (_, i) =>
      h("div", { display: "flex", opacity: (i + 1) / count }, symbol(width, t.symL, t.symR)),
    ),
  );

// ---------- molduras ----------
// Largura útil das peças de 1080px com margem de 96px. O satori só quebra linha com largura explícita.
// No satori width/height não incluem o padding, então a raiz recebe só a área interna.
const INNER = 888;

// Post 4:5 (1080x1350): cabeçalho com logo, conteúdo, rodapé.
const post = (t, { label = "", footerRight = "" }, ...content) =>
  h(
    "div",
    { width: INNER, height: 1350 - 192, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 96, background: t.bg, fontFamily: "Inter" },
    h("div", { display: "flex", width: INNER, justifyContent: "space-between", alignItems: "center" }, lockup(34, t), mono(label, t.soft, 22)),
    h("div", { display: "flex", flexDirection: "column", width: INNER }, ...content),
    h(
      "div",
      { display: "flex", width: INNER, justifyContent: "space-between", alignItems: "center" },
      mono(HANDLE, t.soft, 22),
      typeof footerRight === "string" ? mono(footerRight, t.soft, 22) : footerRight,
    ),
  );

// Story/Reel 9:16 (1080x1920). Áreas de 250px no topo e 340px na base ficam livres para a interface do Instagram.
const story = (t, ...content) =>
  h(
    "div",
    { width: INNER, height: 1920 - 590, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "250px 96px 340px", background: t.bg, fontFamily: "Inter" },
    h("div", { display: "flex" }, lockup(34, t)),
    h("div", { display: "flex", flexDirection: "column", width: INNER }, ...content),
    mono(HANDLE, t.soft, 22),
  );

const swipe = (t) =>
  h("div", { display: "flex", alignItems: "center", gap: 16 }, mono("ARRASTE", t.soft, 22), arrow(44, t.soft));

const stickerSlot = (text, t) =>
  h(
    "div",
    { display: "flex", alignItems: "center", justifyContent: "center", height: 220, marginTop: 64, border: `3px dashed ${t.soft}`, borderRadius: 24 },
    mono(text, t.soft, 22),
  );

const list = (items, t, size = 40) =>
  h(
    "div",
    { display: "flex", flexDirection: "column", width: INNER, marginTop: 48 },
    ...items.map((item, i) =>
      h(
        "div",
        { display: "flex", alignItems: "baseline", gap: 32, padding: "26px 0", borderTop: `2px solid ${t.bg === LIME ? "rgba(10,10,10,0.25)" : LINE}` },
        mono(String(i + 1).padStart(2, "0"), t.accent, 26, { fontWeight: 700 }),
        display(item, size, t.fg, { width: INNER - 90 }),
      ),
    ),
  );

// ---------- peças ----------
const pieces = [];
const add = (file, width, height, node, opts) => pieces.push({ file, width, height, node, opts });

// 01 Logos
add("01-logos/avatar-instagram.png", 1080, 1080,
  h("div", { width: 1080, height: 1080, display: "flex", alignItems: "center", justifyContent: "center", background: INK }, symbol(560)));
add("01-logos/avatar-instagram-lima.png", 1080, 1080,
  h("div", { width: 1080, height: 1080, display: "flex", alignItems: "center", justifyContent: "center", background: LIME }, symbol(560, INK, INK_55)));
add("01-logos/logo-horizontal-fundo-escuro.png", 2400, 640,
  h("div", { width: 2400, height: 640, display: "flex", alignItems: "center", justifyContent: "center" }, lockup(300, DARK)), { svg: true });
add("01-logos/logo-horizontal-fundo-claro.png", 2400, 640,
  h("div", { width: 2400, height: 640, display: "flex", alignItems: "center", justifyContent: "center" }, lockup(300, { ...LIMEBG, fg: INK, symR: "#55554F" })), { svg: true });
add("01-logos/simbolo.png", 1200, 1000,
  h("div", { width: 1200, height: 1000, display: "flex", alignItems: "center", justifyContent: "center" }, symbol(1080)), { svg: true });
add("01-logos/logo-com-fundo-preto.png", 2400, 1260,
  h("div", { width: 2400, height: 1260, display: "flex", alignItems: "center", justifyContent: "center", background: INK }, lockup(260, DARK)));

for (const [i, name] of ["CASES", "MÉTODO", "PREÇOS", "SOBRE", "CONTATO"].entries()) {
  add(`01-logos/capas-destaques/${String(i + 1).padStart(2, "0")}-${name.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}.png`, 1080, 1920,
    h("div", { width: 1080, height: 1920, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56, background: INK },
      symbol(220), display(name, 96, LIME, { fontWeight: 800 })));
}

// 02 Feed (ordem de postagem: 01 primeiro)
add("02-feed/01-prazer-vyrex.png", 1080, 1350, post(DARK, { label: "APRESENTAÇÃO" },
  rajada(5, 120, DARK),
  body("Prazer,", 48, MUTE, { marginTop: 80 }),
  display("VYREX.", 168, PAPER, { fontWeight: 800 }),
  body("Empresa digital de design e tecnologia.", 40, MUTE, { marginTop: 32 })));

add("02-feed/02-manifesto.png", 1080, 1350, post(LIMEBG, { label: "MANIFESTO" },
  display("Nós não fazemos sites.", 84, INK),
  highlight("Construímos", 84, LIMEBG),
  highlight("máquinas de", 84, LIMEBG),
  highlight("conversão.", 84, LIMEBG)));

add("02-feed/03-menos-de-2s.png", 1080, 1350, post(DARK, { label: "PERFORMANCE INEGOCIÁVEL" },
  mono("<2s", LIME, 300, { fontWeight: 700, letterSpacing: -6, lineHeight: 1 }),
  display("É o tempo máximo para o seu site abrir.", 60, PAPER, { marginTop: 48 }),
  body("Se passar disso, a gente falhou.", 40, MUTE, { marginTop: 28 })));

add("02-feed/04-anti-template.png", 1080, 1350, post(SURFACE, { label: "ANTI-TEMPLATE" },
  display("Template deixa seu site igual ao do concorrente.", 64, PAPER),
  display("Cada pixel nosso tem um objetivo: o clique.", 64, LIME, { marginTop: 40 })));

add("02-feed/05-design-sem-estrategia.png", 1080, 1350, post(LIMEBG, { label: "DESIGN + ESTRATÉGIA" },
  display("Design sem estratégia é só arte.", 88, INK),
  highlight("Nós fazemos", 72, LIMEBG),
  highlight("negócios.", 72, LIMEBG)));

add("02-feed/06-obsessao-por-roi.png", 1080, 1350, post(DARK, { label: "OBSESSÃO POR ROI" },
  display("O site tem que se pagar.", 96, PAPER),
  body("O sucesso de um projeto não se mede por prêmio de design. Se mede pelo dinheiro que ele traz para o cliente.", 40, MUTE, { marginTop: 40 })));

add("02-feed/07-papo-reto.png", 1080, 1350, post(DARK, { label: "PAPO RETO E CONSULTIVO" },
  display("Não somos tiradores de pedido.", 80, PAPER),
  body("Se uma ideia prejudica a conversão, a gente avisa. Você diz onde dói, a gente prescreve a solução.", 40, MUTE, { marginTop: 40 })));

add("02-feed/08-metodo.png", 1080, 1350, post(SURFACE, { label: "MÉTODO VYREX" },
  display("Do diagnóstico ao site que se paga.", 64, PAPER),
  list(["Diagnóstico", "Estratégia e design", "Engenharia", "Lançamento e otimização"], SURFACE, 40)));

add("02-feed/09-a-partir-de-1499.png", 1080, 1350, post(LIMEBG, { label: "INVESTIMENTO" },
  body("Sites a partir de", 48, INK),
  display(PRICE, 136, INK, { fontWeight: 800, letterSpacing: -4 }),
  body("Design exclusivo, sem template, que abre em menos de 2 segundos.", 40, ON_LIME_SOFT, { marginTop: 32 }),
  highlight("Link na bio.", 56, LIMEBG)));

// 03 Carrossel "Quem é a VYREX"
const cA = "03-carrossel-quem-somos";
add(`${cA}/01-capa.png`, 1080, 1350, post(LIMEBG, { label: "1/7", footerRight: swipe(LIMEBG) },
  display("Quem é a", 112, INK), highlight("VYREX?", 112, LIMEBG)));
add(`${cA}/02.png`, 1080, 1350, post(DARK, { label: "2/7", footerRight: swipe(DARK) },
  display("Somos uma empresa digital de design e tecnologia.", 72, PAPER),
  body("Criamos sites e landing pages com um único objetivo: vender.", 44, MUTE, { marginTop: 40 })));
add(`${cA}/03.png`, 1080, 1350, post(DARK, { label: "3/7", footerRight: swipe(DARK) },
  mono("O PROBLEMA", LIME, 26, { fontWeight: 700 }),
  display("A maioria das agências entrega site de template: lento e igual ao do concorrente.", 64, PAPER, { marginTop: 32 })));
add(`${cA}/04.png`, 1080, 1350, post(DARK, { label: "4/7", footerRight: swipe(DARK) },
  mono("A GENTE FAZ O CONTRÁRIO", LIME, 26, { fontWeight: 700 }),
  display("Design único para prender a atenção.", 64, PAPER, { marginTop: 32 }),
  display("Engenharia que abre em menos de 2 segundos.", 64, LIME, { marginTop: 32 })));
add(`${cA}/05.png`, 1080, 1350, post(SURFACE, { label: "5/7", footerRight: swipe(SURFACE) },
  display("Nossas 4 regras", 72, PAPER),
  list(["Performance inegociável", "Anti-template", "Papo reto e consultivo", "Obsessão por ROI"], SURFACE, 40)));
add(`${cA}/06.png`, 1080, 1350, post(DARK, { label: "6/7", footerRight: swipe(DARK) },
  mono("O RESULTADO", LIME, 26, { fontWeight: 700 }),
  display("Você para de perder dinheiro com cliques que não convertem.", 72, PAPER, { marginTop: 32 })));
add(`${cA}/07-cta.png`, 1080, 1350, post(LIMEBG, { label: "7/7" },
  body("Sites a partir de", 48, INK),
  display(PRICE, 136, INK, { fontWeight: 800, letterSpacing: -4 }),
  highlight("Fale com a gente", 60, LIMEBG),
  highlight("pelo link da bio.", 60, LIMEBG)));

// 04 Carrossel "Método VYREX"
const cB = "04-carrossel-metodo";
const steps = [
  ["Diagnóstico", "Entendemos seu negócio, seu cliente e onde o site atual perde vendas."],
  ["Estratégia e design", "Estrutura da página, textos e visual exclusivo, pensados para converter."],
  ["Engenharia", "Código otimizado para abrir quase na hora, em qualquer aparelho."],
  ["Lançamento e otimização", "Publicamos, medimos e ajustamos com base em dados reais."],
];
add(`${cB}/01-capa.png`, 1080, 1350, post(DARK, { label: "1/6", footerRight: swipe(DARK) },
  mono("MÉTODO VYREX", LIME, 28, { fontWeight: 700 }),
  display("Como um site vira uma máquina de vendas.", 88, PAPER, { marginTop: 36 })));
steps.forEach(([title, text], i) =>
  add(`${cB}/${String(i + 2).padStart(2, "0")}.png`, 1080, 1350, post(i % 2 ? SURFACE : DARK, { label: `${i + 2}/6`, footerRight: swipe(DARK) },
    mono(String(i + 1).padStart(2, "0"), LIME, 220, { fontWeight: 700, letterSpacing: -4, lineHeight: 1 }),
    display(title, 80, PAPER, { marginTop: 40 }),
    body(text, 44, MUTE, { marginTop: 32 }))));
add(`${cB}/06-cta.png`, 1080, 1350, post(LIMEBG, { label: "6/6" },
  display("Quer o seu site nesse método?", 88, INK),
  highlight("Chama no direct.", 64, LIMEBG)));

// 05 Stories
add("05-stories/01-chegamos.png", 1080, 1920, story(DARK,
  rajada(5, 110, DARK),
  display("Chegamos.", 150, PAPER, { fontWeight: 800, marginTop: 72 }),
  body("VYREX: empresa digital de design e tecnologia.", 48, MUTE, { marginTop: 32 })));
add("05-stories/02-o-que-fazemos.png", 1080, 1920, story(SURFACE,
  mono("O QUE A GENTE FAZ", LIME, 28, { fontWeight: 700 }),
  list(["Landing pages", "Sites institucionais", "Projetos sob medida"], SURFACE, 64)));
add("05-stories/03-regra-2s.png", 1080, 1920, story(DARK,
  mono("NOSSA REGRA", LIME, 28, { fontWeight: 700 }),
  mono("<2s", LIME, 320, { fontWeight: 700, letterSpacing: -6, lineHeight: 1, marginTop: 24 }),
  display("Se o seu site demora mais que isso, você está pagando para perder cliente.", 64, PAPER, { marginTop: 40 })));
add("05-stories/04-preco-link.png", 1080, 1920, story(LIMEBG,
  body("Sites a partir de", 56, INK),
  display(PRICE, 148, INK, { fontWeight: 800, letterSpacing: -4 }),
  stickerSlot("COLE AQUI O STICKER DE LINK", LIMEBG)));
add("05-stories/05-caixa-de-perguntas.png", 1080, 1920, story(DARK,
  display("Qual o maior problema do seu site hoje?", 88, PAPER),
  stickerSlot("COLE AQUI A CAIXA DE PERGUNTAS", DARK)));

// 06 Capas dos reels (a área central 1080x1440 aparece no grid)
const reelCover = (t, ...content) =>
  h("div", { width: INNER, height: 1920, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px", background: t.bg, fontFamily: "Inter" },
    h("div", { display: "flex", flexDirection: "column", width: INNER }, ...content));
add("06-reels/capas/01-manifesto.png", 1080, 1920, reelCover(LIMEBG,
  mono("MANIFESTO", INK, 30, { fontWeight: 700 }),
  display("Nós não fazemos sites.", 104, INK, { marginTop: 32 })));
add("06-reels/capas/02-regra-2s.png", 1080, 1920, reelCover(DARK,
  display("Seu site abre em menos de", 88, PAPER),
  mono("2s?", LIME, 300, { fontWeight: 700, letterSpacing: -6, lineHeight: 1, marginTop: 16 })));
add("06-reels/capas/03-prazer-vyrex.png", 1080, 1920, reelCover(DARK,
  rajada(5, 110, DARK),
  display("Prazer, VYREX.", 120, PAPER, { fontWeight: 800, marginTop: 64 })));

// ---------- render ----------
// ONLY=trecho renderiza só as peças cujo caminho contém o trecho; DUMP_SVG=1 salva o SVG de todas.
const only = process.env.ONLY;
for (const { file, width, height, node, opts = {} } of pieces) {
  if (only && !file.includes(only)) continue;
  const svg = await satori(node, { width, height, fonts });
  const target = path.join(OUT, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  if (opts.svg || process.env.DUMP_SVG) await fs.writeFile(target.replace(/\.png$/, ".svg"), svg);
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
  await fs.writeFile(target, png);
  console.log("ok", file);
}
console.log(`${pieces.length} peças em ${OUT}`);
