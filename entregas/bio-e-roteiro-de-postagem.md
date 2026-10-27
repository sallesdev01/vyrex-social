# VYREX: perfil, bio e roteiro de postagem

## 1. Configurar o perfil

- **Foto de perfil:** `01-logos/avatar-instagram.png` (símbolo sobre preto). Alternativa: `avatar-instagram-lima.png`.
- **@:** `@vyrexdigital`
- **Nome (campo pesquisável):** `VYREX | Sites que vendem`
- **Categoria:** Agência de marketing digital / Web designer
- **Link:** `vyrex.com.br` (ou link do WhatsApp até o site estar no ar)
- **Destaques:** capas em `01-logos/capas-destaques/` (Cases, Método, Preços, Sobre, Contato)

## 2. Bio (escolha uma, todas com menos de 150 caracteres)

**Opção A (recomendada)**
```
Empresa digital de design e tecnologia
Sites exclusivos que abrem em menos de 2s e vendem
Landing pages a partir de R$ 1.499
Fale com a gente ↓
```

**Opção B (manifesto)**
```
Nós não fazemos sites.
Construímos máquinas de conversão.
Design sem template + engenharia de performance
Orçamento ↓
```

**Opção C (direta)**
```
Sites e landing pages que vendem
Zero template · Menos de 2s para abrir · Foco em ROI
A partir de R$ 1.499 ↓
```

## 3. Ordem de postagem (primeira semana)

Poste na ordem abaixo. O Instagram mostra o último post no topo, então o grid final fica alternando preto e lima.

| Dia | Formato | Arquivo | Legenda |
|---|---|---|---|
| 1 | Feed | `02-feed/01-prazer-vyrex.png` | Prazer, VYREX. Somos uma empresa digital de design e tecnologia. A gente não entrega "mais um site": entrega uma máquina de conversão. Acompanha que vem coisa boa. |
| 1 | Story | `05-stories/01-chegamos.png` | — |
| 1 | Reel | `06-reels/01-manifesto.mp4` | Nós não fazemos sites. Construímos máquinas de conversão. |
| 2 | Feed | `02-feed/02-manifesto.png` | Site bonito que não vende é custo. Site que vende é investimento. Nossa régua é uma só: conversão. |
| 2 | Carrossel | `03-carrossel-quem-somos/` (7 imagens) | Quem é a VYREX? Arrasta pro lado e conhece quem vai tirar seu site do modo template. |
| 3 | Feed | `02-feed/03-menos-de-2s.png` | Menos de 2 segundos. Essa é a nossa regra. Se o seu site demora mais que isso, você paga por cliques que vão embora. |
| 3 | Story | `05-stories/03-regra-2s.png` | — |
| 3 | Reel | `06-reels/02-regra-2s.mp4` | Seu site abre em menos de 2 segundos? Se não, a gente precisa conversar. |
| 4 | Feed | `02-feed/04-anti-template.png` | Template deixa você igual ao concorrente. E quem é igual compete só por preço. |
| 4 | Story | `05-stories/05-caixa-de-perguntas.png` | Cole a caixa de perguntas do Instagram em cima da área tracejada. |
| 5 | Feed | `02-feed/05-design-sem-estrategia.png` | Design sem estratégia é só arte. A gente faz negócios. |
| 5 | Carrossel | `04-carrossel-metodo/` (6 imagens) | Do diagnóstico ao site que se paga: é assim que a gente trabalha. |
| 6 | Feed | `02-feed/06-obsessao-por-roi.png` | O site tem que se pagar. Simples assim. |
| 6 | Reel | `06-reels/03-prazer-vyrex.mp4` | Prazer, VYREX. |
| 7 | Feed | `02-feed/07-papo-reto.png` | Você diz onde dói, a gente prescreve a solução. Papo reto, sempre. |
| 7 | Feed | `02-feed/08-metodo.png` | Método VYREX em 4 etapas. Salva pra consultar depois. |
| 7 | Feed | `02-feed/09-a-partir-de-1499.png` | Landing pages a partir de R$ 1.499 e sites institucionais a partir de R$ 2.500. Design exclusivo, sem template, que abre em menos de 2 segundos. Chama no direct ou no link da bio. |
| 7 | Story | `05-stories/02-o-que-fazemos.png` e `05-stories/04-preco-link.png` | No story de preço, cole o sticker de link em cima da área tracejada. |

**Capas dos reels:** use os arquivos de `06-reels/capas/` como capa de cada reel. A parte central (1080×1440) é o que aparece no grid.

**Áudio dos reels:** os vídeos saem sem som, de propósito. Ao postar, escolha uma música em alta na biblioteca do Instagram: o alcance costuma ser maior do que com um áudio próprio. Para editar os vídeos, os projetos ficam em `vyrex-social/reels/` (abra com `npx hyperframes preview` dentro de cada pasta).

## 4. Hashtags sugeridas (use 3 a 5 por post)

`#webdesign #landingpage #criacaodesites #sitesprofissionais #marketingdigital #conversao #performance #designdigital`

## 5. Antes de postar

- Os stories `04-preco-link` e `05-caixa-de-perguntas` têm uma área tracejada com texto: ela precisa ficar coberta pelo sticker de link ou pela caixa de perguntas.
- Confirme que o @vyrexdigital é de vocês e que o link da bio funciona.
- Para mudar textos ou cores, edite `render.mjs` e rode `node render.mjs` na pasta `vyrex-social`.
