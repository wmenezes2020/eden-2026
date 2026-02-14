# 🦞 EDEN (JARVIS) — Asistente Personal de IA

<p align="center">
  <img src="https://raw.githubusercontent.com/clawdbot/clawdbot/main/docs/whatsapp-clawd.jpg" alt="EDEN (JARVIS)" width="400">
</p>

<p align="center">
  <strong>El Futuro de la Asistencia Personal.</strong>
</p>

**EDEN (JARVIS)** es un *asistente personal de IA* que ejecutas en tus propios dispositivos.
Te responde en los canales que ya usas (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, WebChat), además de canales de extensión como BlueBubbles, Matrix, Zalo y Zalo Personal. Puede hablar y escuchar en macOS/iOS/Android, y renderizar un Canvas en vivo que tú controlas. El Gateway es solo el plano de control — el producto es el asistente.

Si buscas un asistente personal, de usuario único, que se sienta local, rápido y siempre disponible, es este.

## Modelos (selección + autenticación)

- Configuración de modelos + CLI: [Modelos](https://docs.clawd.bot/concepts/models)
- Rotación de perfil de autenticación (OAuth vs claves de API) + fallbacks: [Fallo de Modelo](https://docs.clawd.bot/concepts/model-failover)

## Instalación (recomendado)

Runtime: **Node ≥22**.

```bash
npm install -g clawdbot@latest
# o: pnpm add -g clawdbot@latest

clawdbot onboard --install-daemon
```

El asistente instala el daemon del Gateway (servicio de usuario launchd/systemd) para que continúe ejecutándose.

## Inicio Rápido (TL;DR)

Runtime: **Node ≥22**.

Guía completa para principiantes (autenticación, emparejamiento, canales): [Empezando](https://docs.clawd.bot/start/getting-started)

```bash
clawdbot onboard --install-daemon

clawdbot gateway --port 18789 --verbose

# Enviar un mensaje
clawdbot message send --to +1234567890 --message "Hola desde EDEN (JARVIS)"

# Hablar con el asistente (opcionalmente entregar de vuelta a cualquier canal conectado)
clawdbot agent --message "Lista de verificación de la nave" --thinking high
```

## Canales de Desarrollo

- **stable**: lanzamientos etiquetados (`vYYYY.M.D` o `vYYYY.M.D-<patch>`), npm dist-tag `latest`.
- **beta**: etiquetas de pre-lanzamiento (`vYYYY.M.D-beta.N`), npm dist-tag `beta`.
- **dev**: cabeza móvil de `main`, npm dist-tag `dev`.

Cambiar canales: `clawdbot update --channel stable|beta|dev`.

## Destacados

- **[Gateway Local-first](https://docs.clawd.bot/gateway)** — plano de control único para sesiones, canales, herramientas y eventos.
- **[Buzón Multi-canal](https://docs.clawd.bot/channels)** — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, BlueBubbles, Microsoft Teams, Matrix, Zalo, WebChat.
- **[Enrutamiento Multi-agente](https://docs.clawd.bot/gateway/configuration)** — enruta canales/cuentas a agentes aislados.
- **[Voice Wake](https://docs.clawd.bot/nodes/voicewake) + [Talk Mode](https://docs.clawd.bot/nodes/talk)** — habla siempre activa.
- **[Live Canvas](https://docs.clawd.bot/platforms/mac/canvas)** — espacio de trabajo visual conducido por el agente.
- **[Herramientas de primera clase](https://docs.clawd.bot/tools)** — navegador, canvas, nodos, cron, sesiones y acciones Discord/Slack.

## Cómo funciona (corto)

```
WhatsApp / Telegram / Slack / Discord / Google Chat / Signal / iMessage / BlueBubbles / Microsoft Teams / Matrix / WebChat
               │
               ▼
┌───────────────────────────────┐
│            Gateway            │
│       (plano de control)      │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Agente Pi (RPC)
               ├─ CLI (clawdbot …)
               ├─ WebChat UI
               ├─ App macOS
               └─ Nodos iOS / Android
```

## Documentación

Usa estos enlaces cuando pases el flujo de integración y quieras una referencia más profunda.
- [Índice de documentación](https://docs.clawd.bot)
- [Visión general de la arquitectura](https://docs.clawd.bot/concepts/architecture)
- [Referencia de configuración completa](https://docs.clawd.bot/gateway/configuration)

## Comunidad

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para directrices.
¡PRs codificados con vibra de IA son bienvenidos! 🤖

Originalmente construido como Clawdbot, ahora evolucionado a **EDEN (JARVIS)**.
