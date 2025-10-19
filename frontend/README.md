# 🎨 Frontend - Processamento de Imagens

Interface React moderna para processamento de imagens com ajuste de brilho e contraste.

## 🚀 Iniciar o Projeto

### 1️⃣ Instalar Dependências

```bash
cd frontend
npm install
```

### 2️⃣ Iniciar a API (Backend)

Em outro terminal, na pasta raiz do projeto:

```bash
python start_api.py
```

A API deve estar rodando em `http://localhost:8000`

### 3️⃣ Iniciar o Frontend

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Verifica erros de linting

## ✨ Funcionalidades

### 📤 Upload de Imagens
- **Drag & Drop**: Arraste imagens diretamente para a área de upload
- **Clique para selecionar**: Interface tradicional de seleção de arquivos
- **Formatos suportados**: JPG, PNG, BMP, GIF

### ⚙️ Ajustes
- **Brilho**: Controle deslizante de 0.0 a 3.0
  - 0.0 = Preto completo
  - 1.0 = Original
  - 3.0 = Extremamente claro
  
- **Contraste**: Controle deslizante de 0.0 a 3.0
  - 0.0 = Cinza uniforme
  - 1.0 = Original
  - 3.0 = Extremamente realçado

### 👁️ Visualização
- **Preview em tempo real**: Veja as alterações instantaneamente
- **Modo comparação**: Compare original e processada lado a lado
- **Informações detalhadas**: Dimensões, formato, tamanho, etc.

### 💾 Download
- Baixe a imagem processada com um clique
- Mantém o nome original do arquivo

## 🏗️ Estrutura do Projeto

```
frontend/
├── public/
│   └── vite.svg              # Ícone da aplicação
├── src/
│   ├── components/
│   │   ├── ImageUploader.jsx      # Componente de upload
│   │   ├── ImageUploader.css
│   │   ├── ImageAdjustments.jsx   # Controles de ajuste
│   │   ├── ImageAdjustments.css
│   │   ├── ImagePreview.jsx       # Visualização
│   │   └── ImagePreview.css
│   ├── services/
│   │   └── api.js                 # Cliente da API
│   ├── App.jsx                    # Componente principal
│   ├── App.css
│   ├── main.jsx                   # Entry point
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design

- **Cores**: Gradiente roxo/azul moderno
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Animações**: Transições suaves e feedback visual
- **Acessibilidade**: Controles claros e intuitivos

## 🔌 Integração com Backend

O frontend se comunica com a API através do serviço `api.js`:

```javascript
import api from './services/api';

// Upload
const result = await api.uploadImage(file);

// Processar
await api.processImage(imageId, brightness, contrast);

// Preview
const preview = await api.getPreview(imageId, true);

// Download
const url = api.getDownloadUrl(imageId, true);
```

## 🛠️ Tecnologias

- **React 18**: Framework JavaScript
- **Vite**: Build tool rápido
- **CSS Modules**: Estilos isolados
- **Fetch API**: Comunicação HTTP
- **ES Modules**: JavaScript moderno

## 📱 Responsividade

O layout é totalmente responsivo e se adapta a:

- 📱 **Mobile**: < 480px
- 📱 **Tablet**: 480px - 768px
- 💻 **Desktop**: > 768px

## 🐛 Troubleshooting

### API não conecta
1. Certifique-se de que o backend está rodando em `http://localhost:8000`
2. Verifique se o CORS está configurado corretamente na API
3. Tente o botão "Tentar Novamente" no topo da página

### Imagem não aparece
1. Verifique se o formato da imagem é suportado
2. Confira o console do navegador para erros
3. Verifique se o arquivo não está corrompido

### Build de produção
```bash
npm run build
```

Os arquivos estarão na pasta `dist/`

## 📄 Licença

Projeto educacional de código aberto.

---

**Desenvolvido com ❤️ usando React + Vite**
