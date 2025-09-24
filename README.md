# Five Marcenaria - Plataforma WEB

Uma plataforma web moderna e completa para conectar clientes, vendedores e marceneiros especializados para projetos sob medida.

## 🚀 Funcionalidades Principais

### 🏠 **Páginas Públicas**
- **Home** - Landing page com hero section e call-to-action
- **Sobre Nós** - História da empresa, missão, visão e valores
- **Como Funciona** - Processo detalhado para cada tipo de usuário
- **Projetos Realizados** - Galeria interativa com filtros por categoria
- **Cadastro** - Formulário completo para novos usuários
- **Login** - Sistema de autenticação com modo de desenvolvimento

### 👤 **Dashboards por Perfil**

#### **Cliente Dashboard** (`/dashboard/cliente`)
- Visão geral com estatísticas de projetos
- Lista de projetos em andamento e concluídos
- Sistema de mensagens com marceneiros
- Ações rápidas para solicitar novos projetos

#### **Vendedor Dashboard** (`/dashboard/vendedor`)
- Gestão de visitas técnicas
- Projetos em elaboração
- Calendário de agendamentos
- Relatórios de performance

#### **Marceneiro Dashboard** (`/dashboard/marceneiro`)
- Busca de projetos disponíveis
- Sistema de propostas competitivas
- Acompanhamento de propostas enviadas
- Portfólio de trabalhos realizados

## 🛠️ Tecnologias

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **React** para componentes
- **Context API** para gerenciamento de estado

## 📁 Estrutura do Projeto

```
src/
├── app/                           # Páginas da aplicação
│   ├── cadastrar/                # Página de cadastro
│   ├── como-funciona/            # Página explicativa
│   ├── dashboard/                # Dashboards por perfil
│   │   ├── cliente/              # Dashboard do cliente
│   │   ├── vendedor/             # Dashboard do vendedor
│   │   └── marceneiro/           # Dashboard do marceneiro
│   ├── entrar/                   # Página de login
│   ├── projetos-realizados/      # Galeria de projetos
│   ├── sobre-nos/                # Página sobre a empresa
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial
├── components/                    # Componentes reutilizáveis
│   ├── Header/                   # Cabeçalho da aplicação
│   ├── HowItWorks/               # Seção "Como Funciona"
│   ├── FeaturedSellers/          # Seção "Vendedores em Destaque"
│   └── Footer/                   # Rodapé da aplicação
├── contexts/                      # Contextos React
│   └── AuthContext.tsx           # Contexto de autenticação
└── lib/                          # Utilitários e configurações
    └── api.ts                    # Configuração da API
```

## 🎨 Design System

### **Cores**
- **Teal (Verde-azulado)**: Cores principais da marca
- **Purple (Roxo)**: Dashboard do vendedor
- **Blue (Azul)**: Dashboard do marceneiro
- **Orange**: Botões de call-to-action
- **White/Gray**: Fundos e textos

### **Componentes**
- Cards com sombras e hover effects
- Botões com transições suaves
- Modais interativos para galerias
- Layout responsivo para mobile e desktop
- Sistema de tabs para navegação

## 🔐 Sistema de Autenticação

### **Modo de Desenvolvimento**
Para testar os dashboards sem backend, use os seguintes emails:

- **`cliente@teste.com`** - Acessa dashboard do cliente
- **`vendedor@teste.com`** - Acessa dashboard do vendedor
- **`marceneiro@teste.com`** - Acessa dashboard do marceneiro

*Qualquer senha funciona no modo de desenvolvimento.*

### **Modo Produção**
Para usar com backend real:
1. Altere `DEV_MODE = false` em `src/contexts/AuthContext.tsx`
2. Configure a URL correta da API
3. O sistema voltará a usar a API real

## 🚀 Como Executar

### **Pré-requisitos**
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes)

### **Instalação**

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/PlataformaMarcenaria.WEB.git
   cd PlataformaMarcenaria.WEB
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute em desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse:**
   ```
   http://localhost:3000
   ```
   *Se a porta 3000 estiver ocupada, o Next.js tentará a 3001 automaticamente.*

## 📱 Responsividade

- **Design mobile-first**
- **Breakpoints** para tablet e desktop
- **Menu mobile** com hamburger
- **Grid responsivo** para cards
- **Modais adaptáveis** para diferentes tamanhos de tela

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 🎯 Funcionalidades Implementadas

### ✅ **Completas**
- [x] Layout responsivo e moderno
- [x] Sistema de autenticação com modo de desenvolvimento
- [x] Dashboards completos para cada perfil
- [x] Galeria de projetos com modal interativo
- [x] Páginas informativas (Sobre Nós, Como Funciona)
- [x] Sistema de navegação por tabs
- [x] Correção de espaçamentos e layout

### 🚧 **Em Desenvolvimento**
- [ ] Telas para ações rápidas (Solicitar Projeto, etc.)
- [ ] Sistema de chat entre usuários
- [ ] Upload de imagens para projetos
- [ ] Sistema de avaliações
- [ ] Integração com API real
- [ ] Sistema de pagamentos

## 🎨 Galeria de Projetos

A página de projetos inclui:
- **Filtros por categoria** (Cozinha, Quarto, Escritório, etc.)
- **Modal interativo** com navegação entre fotos
- **Miniaturas clicáveis** para navegação rápida
- **Informações detalhadas** de cada projeto
- **Layout responsivo** para todos os dispositivos

## 🔄 Fluxo de Usuário

### **Cliente**
1. Cadastra-se na plataforma
2. Solicita projeto através do dashboard
3. Recebe visitas técnicas de vendedores
4. Compara propostas de marceneiros
5. Escolhe o melhor profissional
6. Acompanha o projeto até a conclusão

### **Vendedor**
1. Cadastra-se como vendedor
2. Recebe solicitações de clientes
3. Agenda e realiza visitas técnicas
4. Elabora projetos detalhados
5. Publica projetos na plataforma
6. Recebe remuneração pelos serviços

### **Marceneiro**
1. Cadastra-se como marceneiro
2. Busca projetos disponíveis
3. Envia propostas competitivas
4. Comunica-se com clientes
5. Executa projetos aprovados
6. Recebe pagamento após conclusão

## 🐛 Resolução de Problemas

### **Erro 403 no Login**
- O modo de desenvolvimento está ativo por padrão
- Use os emails de teste mencionados acima
- Verifique o console do navegador para logs detalhados

### **Problemas de Cache**
```bash
# Limpe o cache do Next.js
rm -rf .next
npm run dev
```

### **Porta Ocupada**
- O Next.js automaticamente tenta a próxima porta disponível
- Verifique se não há outros processos usando as portas 3000/3001

## 📝 Próximos Passos

1. **Implementar telas de ações rápidas**
2. **Criar sistema de chat em tempo real**
3. **Adicionar upload de imagens**
4. **Implementar sistema de avaliações**
5. **Conectar com API backend real**
6. **Adicionar sistema de pagamentos**
7. **Implementar notificações push**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através dos issues do GitHub ou email: suporte@fivemarcenaria.com

---

**Desenvolvido com ❤️ para conectar sonhos com realidade através da marcenaria de qualidade.**