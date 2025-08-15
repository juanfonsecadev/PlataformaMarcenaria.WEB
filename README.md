# Plataforma de Marcenaria

Uma plataforma web moderna para conectar clientes com marceneiros especializados para projetos sob medida.

## 🚀 Funcionalidades

- **Header transparente** com navegação e botão CTA
- **Seção Hero** com design atrativo e gradiente
- **Como Funciona** explicando o processo em 3 passos
- **Vendedores em Destaque** mostrando profissionais avaliados
- Design responsivo e moderno

## 🛠️ Tecnologias

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **React** para componentes

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
│   ├── cadastrar/         # Página de cadastro
│   ├── entrar/            # Página de login
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/             # Componentes reutilizáveis
│   ├── Header/            # Cabeçalho da aplicação
│   ├── HowItWorks/        # Seção "Como Funciona"
│   ├── FeaturedSellers/   # Seção "Vendedores em Destaque"
│   └── Footer/            # Rodapé da aplicação
```

## 🎨 Design System

### Cores
- **Teal**: Cores principais da marca
- **Orange**: Botões de call-to-action
- **White/Gray**: Fundos e textos

### Componentes
- Cards com sombras e hover effects
- Botões com transições suaves
- Layout responsivo para mobile e desktop

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar:**
   ```
   http://localhost:3000
   ```

## 📱 Responsividade

- Design mobile-first
- Breakpoints para tablet e desktop
- Menu mobile com hamburger
- Grid responsivo para cards

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 📝 Próximos Passos

- [ ] Implementar autenticação
- [ ] Adicionar sistema de avaliações
- [ ] Criar páginas de perfil dos marceneiros
- [ ] Implementar sistema de chat
- [ ] Adicionar upload de imagens
- [ ] Sistema de pagamentos
