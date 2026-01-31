# 🚀 Guia Rápido de Execução Local

## Pré-requisitos

- **Node.js** versão 18 ou superior (você tem v24.11.1 ✅)
- **npm** (vem com o Node.js)

## Passos para Executar

### 1. Instalar Dependências

As dependências já foram instaladas! Se precisar reinstalar:

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

**⚠️ IMPORTANTE:** O arquivo `.env.local` já foi criado automaticamente com o modo de desenvolvimento ativo!

Se precisar criar manualmente, crie um arquivo `.env.local` na raiz do projeto com:

```env
# Modo de Desenvolvimento (autenticação simulada)
NEXT_PUBLIC_DEV_MODE=true

# URL da API Backend (quando não estiver em modo dev)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

**⚠️ ATENÇÃO:** Após criar ou modificar o arquivo `.env.local`, você **DEVE reiniciar o servidor Next.js** para que as variáveis sejam carregadas!

### 3. Executar o Projeto

```bash
npm run dev
```

### 4. Acessar a Aplicação

Abra seu navegador em:
```
http://localhost:3000
```

Se a porta 3000 estiver ocupada, o Next.js tentará automaticamente a porta 3001.

## 🔐 Testando o Login

No modo de desenvolvimento, use estes emails para testar os diferentes dashboards:

- **Cliente:** `cliente@teste.com` → Acessa `/dashboard/cliente`
- **Vendedor:** `vendedor@teste.com` → Acessa `/dashboard/vendedor`
- **Marceneiro:** `marceneiro@teste.com` → Acessa `/dashboard/marceneiro`

**Qualquer senha funciona** no modo de desenvolvimento!

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção (após build)
- `npm run lint` - Verifica erros de código

## 🐛 Problemas Comuns

### Erro de CORS ao fazer login
**Sintoma:** Erro "Access to XMLHttpRequest has been blocked by CORS policy" no console.

**Solução:** 
1. Certifique-se de que o arquivo `.env.local` existe e contém `NEXT_PUBLIC_DEV_MODE=true`
2. **Reinicie o servidor Next.js** (pare com `Ctrl+C` e execute `npm run dev` novamente)
3. As variáveis de ambiente só são carregadas quando o servidor inicia

### Porta 3000 ocupada
O Next.js automaticamente tenta a próxima porta disponível (3001, 3002, etc.)

### Erro ao instalar dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Problemas de cache
```bash
# Limpe o cache do Next.js
rm -rf .next
npm run dev
```

## ✅ Pronto!

Agora você pode desenvolver e testar a plataforma localmente! 🎉

