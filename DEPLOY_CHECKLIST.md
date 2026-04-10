# CHECKLIST DEPLOY - HOSTINGER BUSINESS

## ✅ REQUISITOS JÁ VALIDADOS

| Item | Status | Observação |
|------|--------|------------|
| Node.js 22.x suportado | ✅ | package.json usa Node 22.x |
| package.json com dependências | ✅ | scripts: start, build ok |
| Escuta process.env.PORT | ✅ | main.ts: `process.env.PORT ?? 3001` |
| Build output configurado | ✅ | nest-cli.json: output em dist/ |
| Entry file padrão | ✅ | dist/main.js |

---

## ⚠️ ITENS QUE PRECISAM SER CONFIGURADOS NO HOSTINGER

### 1. Variáveis de Ambiente (no painel Hostinger)

```
DATABASE_URL=mysql://user:password@host:3306/agendaflow
JWT_SECRET=chave_secreta_segura
NODE_ENV=production
PORT=3001

# OpenAI (obrigatório para IA funcionar)
OPENAI_API_KEY=sk-...

# Evolution API - URL do seu servidor
EVOLUTION_API_URL=https://evolution.seudominio.com
EVOLUTION_API_TOKEN=token_aqui

# Redis - Use Redis Embbeded do Hostinger ou serviço externo
REDIS_HOST=redis.host_externo.com
REDIS_PORT=6379

# CORS - Seu domínio do frontend
ALLOWED_ORIGINS=https://seudominio.com

# Mercado Pago (tokens reais)
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...
MERCADO_PAGO_PUBLIC_KEY=APP_USR-...
APP_URL=https://seudominio.com
```

### 2. Serviços Externos Obrigatórios

| Serviço | Opção Hostinger | Alternativa |
|---------|-----------------|-------------|
| **MySQL** | ✅ Managed MySQL disponível | - |
| **Redis** | ❌ Não tem | Upstash, Redis Cloud, or .env |
| **Evolution API** | ❌ Não tem | Self-hosted em outro servidor |

### 3. Build e Deploy

```bash
# Build local (testar antes)
cd backend
npm install
npm run build

# No Hostinger:
# Node.js Web App
# Root directory: /backend
# Build command: npm run build
# Start command: node dist/main.js
```

---

## 🔴 PROBLEMAS IDENTIFICADOS

### Problema 1: Evolution API (WhatsApp)
A Evolution API precisa estar rodando em algum servidor. Na Hostinger Business você pode:
- Contratar um VPS adicional
- Usar outro serviço de WhatsApp API (Twilio, WPPConnect)

### Problema 2: Redis
O BullMQ precisa de Redis. Soluções:
- Usar serviço externo (Upstash Redis Cloud - plano gratuito)
- Desabilitar BullMQ (não usar filas assíncronas)

### Problema 3: Banco de dados
O MySQL da Hostinger precisa ser configurado com as credenciais corretas.

---

## ✅ AÇÕES RECOMENDADAS ANTES DO DEPLOY

1. **Criar banco MySQL** no painel Hostinger
2. **Configurar Upstash Redis** (conta gratuita)
3. **Hospedar Evolution API** (VPS separado ou serviço)
4. **Atualizar .env** com credenciais reais
5. **Testar build localmente** antes do deploy
6. **Configurar ALLOWED_ORIGINS** com domínio real

---

## 📋 CONFIGURAÇÃO DO FRONTEND

O frontend (Next.js) precisa ser deployado separadamente:
- Na Hostinger: Hosting Node.js ou Vercel
- Variável NEXT_PUBLIC_API_URL=https://api.seudominio.com