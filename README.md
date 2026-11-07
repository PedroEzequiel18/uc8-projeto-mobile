# Gestor de Fluxo de Caixa — Mobile

Aplicativo Android para controle de receitas e despesas pessoais, desenvolvido na **UC8 (Desenvolver aplicações mobile)** do SENAC RN a partir do sistema Gestor de Fluxo de Caixa da UC5.

O app registra transações financeiras em categorias, mostra o saldo e o resumo do mês, filtra por tipo, categoria e período, funciona sem internet e preenche o cadastro automaticamente a partir de um **comprovante PIX** (imagem ou PDF).

**Aluno:** Pedro Ezequiel Pontes da Silva

---

## Sumário

1. [Funcionalidades](#1-funcionalidades)
2. [Telas](#2-telas)
3. [Tecnologias](#3-tecnologias)
4. [Arquitetura](#4-arquitetura)
5. [Modelo de dados](#5-modelo-de-dados)
6. [Erros e validação](#6-erros-e-validação)
7. [Funcionamento sem internet](#7-funcionamento-sem-internet)
8. [Leitura de comprovante PIX (OCR)](#8-leitura-de-comprovante-pix-ocr)
9. [Como executar](#9-como-executar)
10. [Como gerar o APK](#10-como-gerar-o-apk)
11. [Qualidade e testes](#11-qualidade-e-testes)
12. [Decisões e limitações conhecidas](#12-decisões-e-limitações-conhecidas)
13. [Melhorias futuras](#13-melhorias-futuras)

---

## 1. Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Painel financeiro | Total que entrou, que saiu e saldo apurado, com botão para recalcular a partir da nuvem |
| Resumo mensal | Receitas, despesas, total movimentado e quantidade de transações **do mês atual** |
| Gráfico de despesas | Barras por categoria, do maior gasto para o menor, alternando entre "Este mês" e "Tudo" |
| Categorias | Quanto cada categoria movimentou, com subtotal por grupo e atalho para as transações dela |
| Transações (CRUD) | Cadastrar, listar, ver detalhe, **editar** e **excluir** |
| Filtros | Por tipo (receita/despesa), categoria e período, com seletor de data nativo |
| Comprovante PIX | Importa imagem ou PDF e preenche valor, data e nome de quem recebeu |
| Sem internet | Mostra os dados guardados no aparelho e guarda cadastros para enviar depois |
| Validação | Nome obrigatório, valor maior que zero (aceita `1.234,56`), data e categoria válidas |

---

## 2. Telas

O app usa **navegação por abas** na parte de baixo. A aba Transações tem uma **pilha** própria para detalhe, cadastro e edição.

| Aba / Tela | Arquivo | O que faz |
|---|---|---|
| **Início** | `src/telas/TelaDashboard.tsx` | Cabeçalho financeiro (Entrou, Saiu, Saldo apurado), gráfico de despesas por categoria e resumo mensal |
| **Categorias** | `src/telas/TelaCategorias.tsx` | Receitas, despesas fixas e variáveis com valores do período; tocar numa categoria abre as transações dela já filtradas |
| **Transações** | `src/telas/TelaTransacoes.tsx` | Lista em cartões (verde = receita, vermelho = despesa), botão Nova Transação, aviso de filtro ativo com botão Limpar |
| ↳ Detalhe | `src/telas/TelaDetalheTransacao.tsx` | Nome, descrição, valor, data e categoria; botões Editar e Excluir (com confirmação) |
| ↳ Nova Transação | `src/telas/TelaNovaTransacao.tsx` | Formulário + importação de comprovante PIX por imagem ou PDF |
| ↳ Editar Transação | `src/telas/TelaEditarTransacao.tsx` | Mesmo formulário, já preenchido |
| **Filtros** | `src/telas/TelaFiltros.tsx` | Tipo, categoria e período; Filtrar leva à lista; Limpar restaura tudo |
| **Sobre** | `src/telas/TelaSobre.tsx` | Informações do projeto e quantidade de transações guardadas no aparelho |

Em telas largas (tablet ou celular deitado, a partir de 600 dp) a lista de transações passa a ter duas colunas.

---

## 3. Tecnologias

| Tecnologia | Uso |
|---|---|
| **Expo SDK 58** / React Native 0.88 / React 19 | Base do aplicativo |
| **TypeScript 6** (modo estrito) | Tipagem de todo o código, sem `any` |
| **React Navigation 7** | Abas (`bottom-tabs`) e pilha (`native-stack`) |
| **Supabase** (API REST/PostgREST) | Banco na nuvem, acessado com `fetch` |
| **expo-sqlite** | Cópia local das transações e fila de pendentes |
| **expo-image-picker** / **expo-document-picker** | Escolha do comprovante (imagem ou PDF) |
| **expo-file-system** | Leitura do arquivo do comprovante para envio ao OCR |
| **OCR.space** (API externa) | Extração de texto do comprovante PIX |
| **@react-native-community/datetimepicker** | Calendário nativo para datas |
| **expo-splash-screen** | Tela de abertura do APK |
| **Prettier** | Padronização da formatação do código |
| **EAS Build** | Geração do APK na nuvem da Expo |

---

## 4. Arquitetura

### Estrutura de pastas

```
App.tsx                     Provedores (filtros e transações) + abas
src/
  banco/banco.ts            SQLite: cópia local e fila de pendentes
  components/               Peças de interface reaproveitáveis
    CabecalhoFinanceiro     Entrou / Saiu / Saldo apurado
    CabecalhoTela           Sobretítulo, título serifado e régua
    CampoData               Campo com calendário nativo
    FormularioTransacao     Formulário de cadastro e edição
    GraficoDespesas         Barras de despesas por categoria
    CartaoTransacao, Campo, Botao
  contexto/
    TransacoesContexto      Estado global das transações (carga, CRUD, sincronização)
    FiltrosContexto         Filtros compartilhados entre as abas
  dados/categorias.ts       As 12 categorias fixas
  erros/erros.ts            Classificação e registro de erros
  navegacao/                Pilha de transações e tipos das rotas
  servicos/
    transacoes.ts           Chamadas à API do Supabase
    ocr.ts                  Envio do comprovante ao OCR.space
    pix.ts                  Extração de valor, data e nome do texto do comprovante
  telas/                    Uma tela por arquivo
  tema/tema.ts              Cores, espaçamentos e raio
  types/                    Tipos Transacao e Categoria
  utils/
    datas.ts                Datas em horário local e leitura de valores ("1.234,56")
    financeiro.ts           Totais, mês atual e formatação em R$
docs/roteiro_de_teste.md    Casos de teste e resultados
supabase/esquema.sql        Tabela, RLS e permissões no Supabase
```

### Fluxo dos dados

```
Telas  ──usam──▶  TransacoesContexto  ──▶  servicos/transacoes.ts  ──▶  Supabase (nuvem)
  │                     │
  │                     └──────────────▶  banco/banco.ts  ──▶  SQLite (aparelho)
  │
  └──usam──▶  FiltrosContexto  (tipo, categoria, período)
```

- As **telas não falam direto com a API nem com o banco**: tudo passa pelo `TransacoesContexto`, que expõe `estado`, `adicionar`, `editar`, `remover`, `buscar` e `recarregar`.
- O estado da carga é uma união tipada: `carregando`, `erro` ou `pronto`. Quando está pronto, guarda também a origem dos dados: `nuvem` ou `aparelho`.
- Os cálculos (totais, mês atual, moeda) ficam em `utils/` e são usados pelo painel, pelo gráfico e pela tela de Categorias. Assim, uma regra só existe em um lugar.

---

## 5. Modelo de dados

### Supabase — tabela `transacoes`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | bigint, identidade | Chave primária |
| `nome` | text | Obrigatório |
| `descricao` | text | |
| `valor` | numeric | Sempre positivo; o tipo (receita ou despesa) vem da categoria |
| `id_categoria` | integer | Uma das 12 categorias abaixo |
| `data` | text | Formato `aaaa-mm-dd` |
| `criado_em` | timestamptz | Preenchido pelo banco |

O script completo, com RLS e permissões, está em `supabase/esquema.sql`.

### Categorias (fixas, em `src/dados/categorias.ts`)

| Grupo | Categorias |
|---|---|
| Receitas | 1 Salário · 2 Freelance · 3 Investimentos |
| Despesas fixas | 4 Internet · 5 Energia · 6 Água · 7 Academia · 8 Aluguel |
| Despesas variáveis | 9 Mercado · 10 Transporte · 11 Lazer · 12 Restaurante |

### SQLite no aparelho (`transacoes.db`)

- **`transacoes`**: cópia da última lista recebida da nuvem.
- **`pendentes`**: cadastros feitos sem internet, esperando envio.

---

## 6. Erros e validação

### Um só lugar para os erros — `src/erros/erros.ts`

- `classificarErro(erro)` transforma qualquer falha num tipo conhecido: `rede`, `api`, `banco`, `validacao` ou `desconhecido`. Cada tipo tem uma mensagem amigável para a tela e um detalhe técnico.
- `registrarErro(origem, erro)` classifica, escreve no console como `[origem] tipo: detalhe` e devolve a mensagem para a tela.
- Classes próprias: `ErroDaApi` (resposta não-OK do Supabase, com status), `ErroDoBanco` (qualquer falha do SQLite) e `ErroDeValidacao`.

Origens registradas: `sincronizar`, `pendentes`, `guardar no aparelho`, `carga`, `leitura do aparelho`, `pendente descartado`, `cadastro`, `edição`, `ocr` e `contagem`.

### Validação em duas camadas

1. **No formulário**: o nome é obrigatório e o valor precisa ser maior que zero. O erro aparece embaixo do campo e o botão fica desabilitado.
2. **No provedor** (`validarTransacao`): confere de novo o nome, o valor, se a categoria existe e o formato da data, antes de criar ou editar. Assim, nenhuma tela consegue enviar dado inválido.

---

## 7. Funcionamento sem internet

1. Ao abrir, o app primeiro **envia os pendentes** e depois carrega a lista da nuvem, guardando uma cópia no SQLite.
2. Sem rede, a lista vem da **cópia do aparelho**, com o aviso "Sem conexão: mostrando dados do aparelho".
3. Um cadastro feito sem rede vai para a **fila de pendentes** e é enviado na próxima carga.
4. Se o banco do aparelho falhar, a lista da nuvem **continua aparecendo**: o erro é só registrado. A tela Sobre mostra "indisponível".

---

## 8. Leitura de comprovante PIX (OCR)

```
Escolher imagem/PDF ─▶ ler o arquivo (expo-file-system) ─▶ base64
  ─▶ OCR.space (texto) ─▶ pix.ts extrai valor, data e nome ─▶ formulário preenchido
```

- **`servicos/ocr.ts`**: envia o arquivo como `base64Image` num formulário simples (`x-www-form-urlencoded`). O envio em `multipart` falhava no Android. Tem limite de 60 s e recusa arquivos acima de 1 MB (limite do plano grátis), pedindo um print do comprovante.
- **`servicos/pix.ts`**: reconhece formatos de vários bancos:
  - valor: `R$ 1.234,56` ou "Valor: 89,00";
  - data: `07/11/2026`, `07/11/26`, `07 NOV 2026` ou "3 de outubro de 2026", ignorando datas impossíveis;
  - nome: o que vem depois de "Para", "Destino", "Quem recebeu", "Favorecido" e rótulos parecidos.
- O usuário sempre confere o que foi lido e escolhe a categoria antes de salvar.

---

## 9. Como executar

### Requisitos

- Node.js 20 ou mais novo
- Expo Go no celular Android (mesma rede do computador, ou cabo USB com `adb reverse`)
- Projeto no Supabase com a tabela de `supabase/esquema.sql`
- Chave grátis do OCR.space (https://ocr.space/ocrapi/freekey)

### Configuração

Crie o arquivo **`.env.local`** na raiz do projeto, seguindo o modelo `.env.example`. Esse arquivo fica fora do git.

```
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_...
EXPO_PUBLIC_OCR_KEY=sua_chave_ocr
```

Sem `EXPO_PUBLIC_OCR_KEY`, o app usa a chave de demonstração do OCR.space, que é lenta e limitada.

### Comandos

```
npm install              # instala as dependências
npx expo start --clear   # inicia o servidor; leia o QR Code no Expo Go
npm run typecheck        # npx tsc --noEmit
npm run format           # formata o código com o Prettier
npm run format:check     # só confere a formatação
npx expo-doctor          # confere a saúde do projeto Expo
```

O `.env.local` só é lido quando o Expo inicia: depois de alterar, reinicie com `--clear`.

---

## 10. Como gerar o APK

O APK é gerado na nuvem pelo **EAS Build**. Isso evita o limite de 260 caracteres de caminho do Windows, que impede o build local dentro do OneDrive.

```
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

- O perfil `preview` do `eas.json` gera **.apk** (instala direto no celular), e não .aab (formato da Play Store).
- O `.easignore` repete o `.gitignore`, **menos o `.env.local`**. Assim, as chaves `EXPO_PUBLIC_*` chegam ao build sem ir para o GitHub.
- No fim do build aparece um link e um QR Code para baixar o APK. Na instalação, o Google Play Protect avisa que o desenvolvedor é desconhecido: toque em **Mais detalhes → Instalar mesmo assim**.

**Identidade do app:** nome **Fluxo de Caixa**, pacote `br.com.pedroezequiel.fluxodecaixa`, ícone adaptativo (três barras subindo sobre fundo verde) e tela de abertura na mesma cor.

---

## 11. Qualidade e testes

| Verificação | Como conferir | Situação |
|---|---|---|
| Compilação TypeScript | `npx tsc --noEmit` | Sem erros |
| Nenhum `any` | `git grep -nw any -- "*.ts" "*.tsx"` | Nenhuma linha |
| Formatação | `npm run format:check` | Todos os arquivos no padrão |
| Saúde do projeto | `npx expo-doctor` | 20/20 |
| Roteiro de teste | `docs/roteiro_de_teste.md` | 26 casos (carga, offline, sincronização, CRUD, filtros, OCR, gráficos) |

O roteiro registra, para cada caso, os passos, o resultado esperado, o resultado obtido, onde e quando foi executado e a correção aplicada quando houve falha.

---

## 12. Decisões e limitações conhecidas

- **Editar e excluir liberados para o papel `anon`.** O guia do módulo 8 sugere `revoke update, delete` para que a API recuse essas operações (código 42501). Este app precisa do CRUD completo, então mantém policies de update e delete, com a justificativa escrita em `supabase/esquema.sql`.
- **Sem login.** Qualquer pessoa com a chave publicável, que vai dentro do APK, pode ler, alterar e apagar as transações. Todos usam os mesmos dados.
- **Categorias fixas no código.** Não há cadastro de categorias no app, e os ids precisam ser os mesmos no banco.
- **Só o cadastro funciona sem internet.** Editar e excluir sem rede mostram erro, em vez de entrar na fila.
- **OCR depende de serviço externo.** Precisa de internet, aceita no máximo 1 MB e a qualidade da leitura varia com o banco e a nitidez da imagem.
- **Arquivos sem uso:** `src/telas/TelaBusca.tsx` e `src/navegacao/NavegacaoPrincipal.tsx` sobraram de versões antigas e não são usados.

---

## 13. Melhorias futuras

Em ordem de prioridade.

### Segurança e dados

1. **Login com Supabase Auth.** Cada transação passa a ter um dono (`user_id`), e as policies trocam `to anon using (true)` por `to authenticated using (auth.uid() = user_id)`. Isso resolve o problema de qualquer pessoa alterar ou apagar dados e permite vários usuários.
2. **OCR por uma Edge Function do Supabase.** A chave do OCR.space sairia do APK e ficaria no servidor. Também daria para trocar de serviço de OCR sem publicar um novo app.
3. **Tipos mais fortes no banco:** `data` como `date` em vez de texto, `valor` com `check (valor > 0)` e chave estrangeira para uma tabela de categorias.

### Funcionalidades

4. **Cadastro de categorias**, como no sistema desktop: criar, editar e escolher a cor, lidas do Supabase em vez de fixas no código.
5. **Editar e excluir sem internet**, colocando essas operações na mesma fila de pendentes.
6. **Busca por nome ou descrição** na lista de transações, aproveitando ou removendo a `TelaBusca` sem uso.
7. **Transações recorrentes:** contas fixas (aluguel, internet) lançadas automaticamente todo mês.
8. **Metas e orçamento por categoria**, com aviso quando um gasto passa do limite.
9. **Escolher o mês** no resumo, no gráfico e na tela de Categorias, e comparar com o mês anterior.
10. **Exportar** as transações em CSV ou PDF.
11. **Câmera direto no OCR**, para fotografar o comprovante sem precisar de um print, com compressão automática para ficar abaixo de 1 MB.
12. **Sugestão de categoria** a partir do nome lido no comprovante (por exemplo, "Mercado" ou "Posto").

### Qualidade

13. **Testes automatizados** (Jest e React Native Testing Library) para `pix.ts`, `datas.ts`, `financeiro.ts` e para o provedor, além do roteiro manual.
14. **ESLint** junto com o Prettier, e uma verificação automática no GitHub (Actions) rodando `tsc`, `format:check` e os testes a cada push.
15. **Remover o código sem uso** (`TelaBusca`, `NavegacaoPrincipal`) e trocar as cores escritas direto no código, como os avisos em `#d97706`, por cores do tema.
16. **Tema escuro**, seguindo a configuração do celular.
17. **Acessibilidade:** revisar rótulos para leitor de tela em todos os botões e testar com fonte grande.

### Publicação

18. **Publicar na Play Store** (perfil `production` gerando .aab), o que também elimina o aviso do Play Protect.
19. **Atualizações pelo ar** com EAS Update, para corrigir o app sem gerar um APK novo.
