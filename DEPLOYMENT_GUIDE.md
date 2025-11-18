# Guia Completo: Como Colocar o Zeyryth'Studio Online Gratuitamente

## 📋 Opção 1: Vercel (Recomendado - Mais Fácil)

### Passo 1: Criar conta no Vercel
1. Acesse https://vercel.com
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub" (você precisará de uma conta GitHub)
4. Autorize o Vercel a acessar seus repositórios

### Passo 2: Preparar o repositório no GitHub
1. Acesse https://github.com/new
2. Crie um novo repositório chamado "zeyryth-studio"
3. Clone o repositório na sua máquina:
   ```bash
   git clone https://github.com/seu-usuario/zeyryth-studio.git
   cd zeyryth-studio
   ```
4. Copie todos os arquivos do projeto para esta pasta
5. Faça o primeiro commit:
   ```bash
   git add .
   git commit -m "Initial commit: Zeyryth'Studio"
   git push origin main
   ```

### Passo 3: Deploy no Vercel
1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório "zeyryth-studio"
4. Configure as variáveis de ambiente:
   - DATABASE_URL: (você precisa de um banco de dados - veja abaixo)
   - JWT_SECRET: Gere uma string aleatória (use: https://www.uuidgenerator.net/)
   - Copie todas as outras variáveis do seu arquivo .env local
5. Clique em "Deploy"

### Passo 4: Configurar banco de dados (PlanetScale - Gratuito)
1. Acesse https://planetscale.com
2. Crie uma conta gratuita
3. Crie um novo banco de dados chamado "zeyryth_studio"
4. Vá para "Connections" e copie a string de conexão MySQL
5. Adicione esta string como DATABASE_URL no Vercel

---

## 🚀 Opção 2: Railway (Alternativa Simples)

### Passo 1: Criar conta no Railway
1. Acesse https://railway.app
2. Clique em "Start Project"
3. Conecte sua conta GitHub

### Passo 2: Deploy
1. Clique em "Deploy from GitHub"
2. Selecione seu repositório "zeyryth-studio"
3. Railway detectará automaticamente que é um projeto Node.js
4. Configure as variáveis de ambiente no painel
5. Clique em "Deploy"

### Passo 3: Banco de dados
1. No painel do Railway, clique em "Add Service"
2. Selecione "MySQL"
3. Railway criará automaticamente um banco de dados
4. Copie a string de conexão para DATABASE_URL

---

## 💾 Opção 3: Render (Gratuito com Limitações)

### Passo 1: Criar conta
1. Acesse https://render.com
2. Crie uma conta com GitHub

### Passo 2: Deploy
1. Clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - Name: zeyryth-studio
   - Runtime: Node
   - Build Command: `pnpm install && pnpm db:push && pnpm build`
   - Start Command: `pnpm start`
5. Adicione variáveis de ambiente
6. Clique em "Create Web Service"

### Passo 3: Banco de dados
1. Clique em "New +"
2. Selecione "MySQL"
3. Configure o banco e copie a string de conexão

---

## 🔧 Variáveis de Ambiente Necessárias

Você precisa configurar estas variáveis em qualquer plataforma:

```
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=sua-chave-secreta-aleatoria
VITE_APP_ID=seu-app-id
VITE_APP_TITLE=Zeyryth'Studio
VITE_APP_LOGO=/logo.svg
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=seu-open-id
OWNER_NAME=Seu Nome
```

---

## 📝 Passos Finais

### 1. Domínio Personalizado (Opcional)
- Vercel: Vá para Settings > Domains e adicione seu domínio
- Railway: Vá para Settings > Custom Domain
- Render: Vá para Environment > Custom Domain

### 2. Testar o Site
- Acesse a URL fornecida pela plataforma
- Teste todas as funcionalidades:
  - Login
  - Coletor de cores
  - Galeria de texturas
  - Painel de admin

### 3. Configurar SSL (Automático)
- Todas as plataformas fornecem SSL gratuito automaticamente

---

## 🎯 Resumo das Opções

| Plataforma | Facilidade | Gratuito | Banco de Dados | Recomendação |
|-----------|-----------|---------|----------------|--------------|
| Vercel | ⭐⭐⭐⭐⭐ | Sim | PlanetScale | ✅ Melhor |
| Railway | ⭐⭐⭐⭐ | Sim | Incluído | ✅ Boa |
| Render | ⭐⭐⭐ | Sim | Incluído | ⭐ Funciona |

---

## ❓ Dúvidas Frequentes

**P: Preciso pagar?**
R: Não! Todas as opções têm plano gratuito suficiente para começar.

**P: Quanto tempo leva para fazer deploy?**
R: 5-10 minutos em qualquer plataforma.

**P: Posso usar meu próprio domínio?**
R: Sim! Todas as plataformas permitem domínios personalizados.

**P: E se eu quiser mais usuários?**
R: Os planos gratuitos suportam milhares de usuários. Se crescer, é fácil fazer upgrade.

---

## 🆘 Troubleshooting

**Erro: DATABASE_URL não configurada**
- Verifique se você adicionou a variável de ambiente corretamente
- Certifique-se de que o banco de dados está ativo

**Erro: Build falhou**
- Verifique se todas as dependências estão instaladas: `pnpm install`
- Verifique se não há erros de TypeScript: `pnpm tsc`

**Site carrega mas funcionalidades não funcionam**
- Verifique se o banco de dados está conectado
- Verifique as variáveis de ambiente no painel da plataforma

---

Pronto! Seu site Zeyryth'Studio está online! 🎉
