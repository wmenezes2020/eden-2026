# 🦞 EDEN (JARVIS) — Assistente Pessoal de IA

<p align="center">
  <img src="https://raw.githubusercontent.com/clawdbot/clawdbot/main/docs/whatsapp-clawd.jpg" alt="EDEN (JARVIS)" width="400">
</p>

<p align="center">
  <strong>O Futuro da Assistência Pessoal.</strong>
</p>

**EDEN (JARVIS)** é um *assistente pessoal de IA* que você executa em seus próprios dispositivos.
Ele responde nos canais que você já usa (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, WebChat), além de canais de extensão como BlueBubbles, Matrix, Zalo e Zalo Personal. Ele pode falar e ouvir no macOS/iOS/Android e renderizar um Canvas ao vivo que você controla. O Gateway é apenas o plano de controle — o produto é o assistente.

Se você quer um assistente pessoal, de usuário único, que pareça local, rápido e sempre disponível, é este.

## Modelos (seleção + autenticação)

- Configuração de modelos + CLI: [Modelos](https://docs.clawd.bot/concepts/models)
- Rotação de perfil de autenticação (OAuth vs chaves de API) + fallbacks: [Falha de Modelo](https://docs.clawd.bot/concepts/model-failover)

## Instalação (recomendado)

Runtime: **Node ≥22**.

```bash
npm install -g clawdbot@latest
# ou: pnpm add -g clawdbot@latest

clawdbot onboard --install-daemon
```

O assistente instala o daemon do Gateway (serviço de usuário launchd/systemd) para que ele continue rodando.

## Início Rápido (TL;DR)

Runtime: **Node ≥22**.

Guia completo para iniciantes (autenticação, pareamento, canais): [Começando](https://docs.clawd.bot/start/getting-started)

```bash
clawdbot onboard --install-daemon

clawdbot gateway --port 18789 --verbose

# Enviar uma mensagem
clawdbot message send --to +1234567890 --message "Olá do EDEN (JARVIS)"

# Falar com o assistente (opcionalmente entregar de volta para qualquer canal conectado)
clawdbot agent --message "Lista de verificação da nave" --thinking high
```

## Canais de Desenvolvimento

- **stable**: lançamentos taggeados (`vYYYY.M.D` ou `vYYYY.M.D-<patch>`), npm dist-tag `latest`.
- **beta**: tags de pré-lançamento (`vYYYY.M.D-beta.N`), npm dist-tag `beta`.
- **dev**: ponta móvel da `main`, npm dist-tag `dev`.

Trocar canais: `clawdbot update --channel stable|beta|dev`.

## Destaques

- **[Gateway Local-first](https://docs.clawd.bot/gateway)** — plano de controle único para sessões, canais, ferramentas e eventos.
- **[Caixa de entrada Multi-canal](https://docs.clawd.bot/channels)** — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, BlueBubbles, Microsoft Teams, Matrix, Zalo, WebChat.
- **[Roteamento Multi-agente](https://docs.clawd.bot/gateway/configuration)** — roteie canais/contas para agentes isolados.
- **[Voice Wake](https://docs.clawd.bot/nodes/voicewake) + [Talk Mode](https://docs.clawd.bot/nodes/talk)** — fala sempre ativa.
- **[Live Canvas](https://docs.clawd.bot/platforms/mac/canvas)** — espaço de trabalho visual conduzido pelo agente.
- **[Ferramentas de primeira classe](https://docs.clawd.bot/tools)** — navegador, canvas, nós, cron, sessões e ações Discord/Slack.

## Como funciona (curto)

```
WhatsApp / Telegram / Slack / Discord / Google Chat / Signal / iMessage / BlueBubbles / Microsoft Teams / Matrix / WebChat
               │
               ▼
┌───────────────────────────────┐
│            Gateway            │
│       (plano de controle)     │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Agente Pi (RPC)
               ├─ CLI (clawdbot …)
               ├─ WebChat UI
               ├─ App macOS
               └─ Nós iOS / Android
```

## Documentação

Use estes links quando passar do fluxo de integração e quiser uma referência mais profunda.
- [Índice da documentação](https://docs.clawd.bot)
- [Visão geral da arquitetura](https://docs.clawd.bot/concepts/architecture)
- [Referência de configuração completa](https://docs.clawd.bot/gateway/configuration)

## Comunidade

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.
PRs codificados com vibe de IA são bem-vindos! 🤖

Construído originalmente como Clawdbot, agora evoluído para **EDEN (JARVIS)**.
