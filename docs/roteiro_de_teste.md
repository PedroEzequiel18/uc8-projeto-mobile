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