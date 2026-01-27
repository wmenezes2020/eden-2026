# 🦞 EDEN (JARVIS) — Personal AI Assistant

<p align="center">
  <img src="https://raw.githubusercontent.com/clawdbot/clawdbot/main/docs/whatsapp-clawd.jpg" alt="EDEN (JARVIS)" width="400">
</p>

<p align="center">
  <strong>The Future of Personal Assistance.</strong>
</p>

**EDEN (JARVIS)** is a *personal AI assistant* you run on your own devices.
It answers you on the channels you already use (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, WebChat), plus extension channels like BlueBubbles, Matrix, Zalo, and Zalo Personal. It can speak and listen on macOS/iOS/Android, and can render a live Canvas you control. The Gateway is just the control plane — the product is the assistant.

If you want a personal, single-user assistant that feels local, fast, and always-on, this is it.

## Models (selection + auth)

- Models config + CLI: [Models](https://docs.clawd.bot/concepts/models)
- Auth profile rotation (OAuth vs API keys) + fallbacks: [Model failover](https://docs.clawd.bot/concepts/model-failover)

## Install (recommended)

Runtime: **Node ≥22**.

```bash
npm install -g clawdbot@latest
# or: pnpm add -g clawdbot@latest

clawdbot onboard --install-daemon
```

The wizard installs the Gateway daemon (launchd/systemd user service) so it stays running.

## Quick start (TL;DR)

Runtime: **Node ≥22**.

Full beginner guide (auth, pairing, channels): [Getting started](https://docs.clawd.bot/start/getting-started)

```bash
clawdbot onboard --install-daemon

clawdbot gateway --port 18789 --verbose

# Send a message
clawdbot message send --to +1234567890 --message "Hello from EDEN (JARVIS)"

# Talk to the assistant (optionally deliver back to any connected channel)
clawdbot agent --message "Ship checklist" --thinking high
```

## Development channels

- **stable**: tagged releases (`vYYYY.M.D` or `vYYYY.M.D-<patch>`), npm dist-tag `latest`.
- **beta**: prerelease tags (`vYYYY.M.D-beta.N`), npm dist-tag `beta`.
- **dev**: moving head of `main`, npm dist-tag `dev`.

Switch channels: `clawdbot update --channel stable|beta|dev`.

## Highlights

- **[Local-first Gateway](https://docs.clawd.bot/gateway)** — single control plane for sessions, channels, tools, and events.
- **[Multi-channel inbox](https://docs.clawd.bot/channels)** — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, BlueBubbles, Microsoft Teams, Matrix, Zalo, WebChat.
- **[Multi-agent routing](https://docs.clawd.bot/gateway/configuration)** — route inbound channels/accounts/peers to isolated agents.
- **[Voice Wake](https://docs.clawd.bot/nodes/voicewake) + [Talk Mode](https://docs.clawd.bot/nodes/talk)** — always-on speech.
- **[Live Canvas](https://docs.clawd.bot/platforms/mac/canvas)** — agent-driven visual workspace.
- **[First-class tools](https://docs.clawd.bot/tools)** — browser, canvas, nodes, cron, sessions, and Discord/Slack actions.

## How it works (short)

```
WhatsApp / Telegram / Slack / Discord / Google Chat / Signal / iMessage / BlueBubbles / Microsoft Teams / Matrix / WebChat
               │
               ▼
┌───────────────────────────────┐
│            Gateway            │
│       (control plane)         │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Pi agent (RPC)
               ├─ CLI (clawdbot …)
               ├─ WebChat UI
               ├─ macOS app
               └─ iOS / Android nodes
```

## Documentation

Use these when you’re past the onboarding flow and want the deeper reference.
- [Docs index](https://docs.clawd.bot)
- [Architecture overview](https://docs.clawd.bot/concepts/architecture)
- [Configuration reference](https://docs.clawd.bot/gateway/configuration)

## Community

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
AI/vibe-coded PRs welcome! 🤖

Originally built as Clawdbot, now evolved into **EDEN (JARVIS)**.
