# Roteiro de teste - Gestor de Fluxo de Caixa

Legenda do resultado:

- aprovado
- falha
- corrigido
- não executado

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|---|---|---|---|---|---|
| C01 | Carga com rede | Abrir o aplicativo com internet | Lista carregada da nuvem | aprovado | renderizador de teste, 03/11/2026 | - |
| C02 | Cadastro válido | Criar uma transação com nome preenchido | Transação aparece na lista | aprovado | renderizador de teste, 03/11/2026 | - |
| C03 | Nome vazio | Tentar criar sem informar nome | Botão desabilitado ou validação exibida | aprovado | renderizador de teste, 03/11/2026 | - |
| C04 | API indisponível | Simular falha de comunicação | Mensagem de erro amigável | aprovado | renderizador de teste, 03/11/2026 | - |
| C05 | Carga sem rede com cache | Carregar uma vez com internet, fechar, desligar rede e abrir novamente | Dados do aparelho exibidos | aprovado | renderizador de teste, 03/11/2026 | - |
| C06 | Carga sem rede sem cache | Instalação nova sem conexão | Tela de erro exibida | aprovado | renderizador de teste, 03/11/2026 | - |
| C07 | Cadastro sem rede | Criar transação sem internet | Item entra em pendentes | aprovado | renderizador de teste, 03/11/2026 | - |
| C08 | Sincronização | Voltar a ter internet e recarregar | Pendentes enviados e removidos da fila | aprovado | renderizador de teste, 03/11/2026 | - |
| C09 | Tela Sobre | Abrir a tela Sobre | Contagem local exibida | aprovado | renderizador de teste, 03/11/2026 | - |
| C10 | Banco indisponível | Simular erro no banco | Sobre mostra "indisponível" | aprovado | renderizador de teste, 03/11/2026 | - |
| C11 | Exclusão | Abrir uma transação; Excluir; confirmar | Some da lista e do Supabase | aprovado | aparelho SM-A356E, 06/11/2026 | DELETE corrigido no Supabase |
| C12 | Filtro por tipo e categoria | Filtros; Despesas + Mercado; Filtrar | Abre Transações só com despesas de Mercado; faixa "Filtro ativo" | aprovado | aparelho SM-A356E, 07/11/2026 | Botão Filtrar não salvava os filtros; corrigido |
| C13 | Limpar filtro | Com filtro ativo, tocar em Limpar na faixa de Transações | Lista completa volta | não executado | - | - |
| C14 | Filtro por período | Filtros; Data Inicial e Data Final pelo calendário; Filtrar | Só transações dentro do período | não executado | - | - |
| C15 | Período invertido | Data Inicial depois da Data Final; Filtrar | Mensagem "A data inicial não pode ser depois da data final." | não executado | - | - |
| C16 | Edição | Abrir transação; Editar; mudar valor e categoria; Salvar Alterações | Volta ao detalhe com os dados novos; linha alterada no Supabase | não executado | - | - |
| C17 | Valor inválido | Nova Transação; valor 0 ou "abc" | "Informe um valor maior que zero" no campo; botão desabilitado | não executado | - | - |
| C18 | Valor com milhar | Nova Transação; valor "1.234,56"; criar | Transação salva com R$ 1.234,56 | não executado | - | - |
| C19 | Data pelo calendário | Nova Transação; tocar em Data; escolher outro dia | Campo mostra a data escolhida em dd/mm/aaaa | não executado | - | - |
| C20 | OCR de comprovante PIX (imagem) | Nova Transação; Importar Imagem; print de comprovante PIX | Valor, data e nome preenchidos no formulário | aprovado | aparelho SM-A356E, 07/11/2026 | Envio multipart falhava no Android; trocado por base64 |
| C21 | OCR sem internet | Sem rede; Importar Imagem | Mensagem de falha ao acessar o OCR; formulário continua utilizável | não executado | - | - |
| C22 | OCR de arquivo grande | Importar foto com mais de 1 MB | Mensagem pedindo um print (limite de 1 MB) | não executado | - | - |
| C23 | Categorias com valores | Aba Categorias; alternar Este mês / Tudo | Subtotais por grupo e valor por categoria mudam com o período | não executado | - | - |
| C24 | Categoria abre transações | Aba Categorias; tocar em uma categoria | Transações filtradas por ela | não executado | - | - |
| C25 | Gráfico de despesas | Aba Início; tocar em uma barra | Mostra percentual e quantidade daquela categoria | não executado | - | - |
| C26 | Resumo mensal | Aba Início com transações de meses diferentes | Resumo Mensal soma só o mês atual | não executado | - | - |
