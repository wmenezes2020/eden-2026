# Gestor-Clawd - Documentação de Deployment

## 📋 Visão Geral

**Projeto:** Sistema de gestão de clientes (CRUD)  
**Stack:** Next.js 14.1.0 + Node.js 20 + Docker  
**Plataforma:** Coolify (self-hosted)  
**Repositório:** https://github.com/edenivabot/gestor-clawd

---

## 🐳 Dockerfile Configurado Corretamente

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache curl
RUN addgroup -g 1001 -S nodejs && \
    adduser -S clawd -u 1001 -G nodejs
WORKDIR /app
COPY --from=builder --chown=clawd:nodejs /app/.next/standalone ./
COPY --from=builder --chown=clawd:nodejs /app/.next/static ./.next/static
RUN mkdir -p /app/usuarios && chown -R clawd:nodejs /app
USER clawd
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://127.0.0.1:3000/api/clients || exit 1
CMD ["node", "server.js"]
```

---

## ❌ Problemas Encontrados e Soluções

### Problema 1: `"/app/public": not found`
**Sintoma:** Docker build falhando com `ERROR: failed to calculate checksum of ref`

**Causa:** Next.js standalone NÃO gera pasta `public/` separadamente

**Solução:** Remover COPY desnecessários:
```dockerfile
# REMOVIDO:
COPY --from=builder --chown=clawd:nodejs /app/public ./public
COPY --from=builder --chown=clawd:nodejs /app/src ./src
```

**Commit:** `a0f631a`

---

### Problema 2: Healthcheck com Node.js http.get falhando
**Sintoma:** `ECONNREFUSED` ao conectar em localhost:3000

**Causa:** Healthcheck via Node.js não era robusto o suficiente

**Solução:** Instalar `curl` e usar para healthcheck:
```dockerfile
RUN apk add --no-cache curl
HEALTHCHECK CMD curl -f http://127.0.0.1:3000/api/clients || exit 1
```

**Commit:** `f21cae6`

---

### Problema 3: Servidor bindando no hostname errado
**Sintoma:** App mostra "Ready in 73ms" mas curl não conecta

**Logs:**
```
▲ Next.js 14.1.0
- Local: http://6bf041150921:3000  ← bindando no hostname do container!
- Network: http://10.0.1.9:3000
curl: (7) Failed to connect to localhost port 3000
```

**Causa:** Next.js standalone espera `HOSTNAME`, não `HOST`

**Solução:**
```dockerfile
# ERRADO:
ENV HOST=0.0.0.0

# CORRETO:
ENV HOSTNAME=0.0.0.0
```

**Commit:** `8f92bdf`

---

## 📚 Lições Aprendidas

### Next.js Standalone com Docker
1. **`output: 'standalone'`** gera `server.js` que já inclui tudo
2. **Não precisa** copiar `public/`, `src/` ou outros arquivos
3. **HOSTNAME** é a variável correta, não HOST
4. O servidor deve bindar em `0.0.0.0` para aceitar conexões externas

### Healthcheck no Coolify
1. Prefira `curl -f` em vez de scripts Node.js
2. `-f` faz curl falhar rapidamente em erros HTTP
3. `start-period` deve ser maior que o tempo de startup (15s neste caso)
4. Teste o endpoint `/api/clients` que é válido e retorna JSON

### Multi-stage Builds
1. Stage 1 (builder): instala dependências e faz build
2. Stage 2 (production): imagem mínima com só o necessário
3. Usuário não-root (`clawd`) por segurança
4. Diretório `/app/usuarios` para dados persistentes

---

## 🔧 Comandos Úteis

```bash
# Build local para testar
docker build -t gestor-clawd:test .

# Rodar localmente
docker run -p 3000:3000 -e HOSTNAME=0.0.0.0 gestor-clawd:test

# Ver logs do container
docker logs <container_id>

# Inspecionar healthcheck
docker inspect --format='{{json .State.Health}}' <container_id>
```

---

## 📅 Histórico de Commits

| Commit | Descrição |
|--------|-----------|
| `e7d6e85` | feat: Add authentication system with admin registration |
| `f86d1fb` | Initial: Fix npm install (original) |
| `a0f631a` | Fix: Dockerfile for Next.js standalone mode |
| `f21cae6` | Fix: Use curl for healthcheck instead of node http get |
| `8f92bdf` | Fix: Use HOSTNAME instead of HOST for Next.js standalone |

---

## ⚙️ Configurações Recomendadas no Coolify

- **Build Command:** (deixado em branco - usa Dockerfile)
- **Run Command:** (deixado em branco - usa CMD do Dockerfile)
- **Port:** 3000
- **Health Check:** (desabilitado - usa HEALTHCHECK do Dockerfile)
- **Persistent Storage:** `/app/usuarios` → volume mount

---

## 🔐 Sistema de Autenticação (2026-02-XX)

### Funcionalidades
- **Registro inicial:** Primeiro acesso mostra formulário de criação de admin
- **Login:** Sistema de login com email/senha (MD5)
- **Painel Admin:** Gerenciar administradores (adicionar/remover)
- **Proteção:** Todas as rotas protegidas por autenticação

### Arquivos
- `/app/usuarios/admin.json` - Armazenamento de admins (formato: `{ admins: [{ id, name, email, password }] }`)
- `/api/auth` - API de autenticação (register, login, add, remove, list)
- `/auth` - Página de login/registro
- `/admin` - Painel de administração

### Comandos da API Auth
```bash
# Verificar se admin existe
GET /api/auth

# Registro/Login
POST /api/auth { action: 'register'|'login', name?, email, password }

# Gerenciar admins
POST /api/auth { action: 'add', name, email, password }
POST /api/auth { action: 'remove', adminId }
POST /api/auth { action: 'list' }
```

### Segurança
- Senhas armazenadas como hash MD5
- Diretório `/app/usuarios` persistido via volume mount
- Sessão gerenciada via localStorage

---

*Documentação gerada em 2026-01-31 após debugging de deployment no Coolify*
*Atualizado em 2026-02-XX com sistema de autenticação*
