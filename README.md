# 🎨 Sistema de Processamento de Imagens

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![React](https://img.shields.io/badge/React-18.2+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Sistema completo de processamento de imagens com ajuste de **brilho** e **contraste**. Inclui backend Python (FastAPI) e frontend React moderno com interface intuitiva.

[Começar](#-início-rápido) • [Documentação](#-documentação) • [Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias)

</div>

---

## 📸 Preview

- ✨ Interface moderna e responsiva
- 🎚️ Controles interativos com sliders
- ⚖️ Modo comparação (antes/depois)
- 📤 Upload com drag & drop
- 💾 Download de resultados processados

---

## 🚀 Início Rápido

### Pré-requisitos

- **Python** 3.8 ou superior
- **Node.js** 16 ou superior
- **pip** (gerenciador de pacotes Python)
- **npm** (gerenciador de pacotes Node)

### Instalação em 3 passos

#### 1️⃣ **Backend (API)**

```powershell
# Entrar na pasta backend
cd backend

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
python start_api.py
```

✅ API disponível em: **http://localhost:8000**  
📚 Documentação interativa: **http://localhost:8000/docs**

#### 2️⃣ **Frontend (React)**

```powershell
# Abrir novo terminal e entrar na pasta frontend
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

✅ Aplicação disponível em: **http://localhost:5173**

#### 3️⃣ **Usar a aplicação! 🎉**

1. Abra **http://localhost:5173** no navegador
2. Arraste ou clique para fazer upload de uma imagem
3. Ajuste **brilho** (0.0-3.0) e **contraste** (0.0-3.0) com os sliders
4. Clique em **"Aplicar Ajustes"**
5. Compare o resultado lado a lado
6. Baixe sua imagem processada!

---

## ✨ Funcionalidades

### 🔧 Backend (Python + FastAPI)

- 🖼️ **Processamento de Imagens** - Ajuste preciso de brilho e contraste
- 📤 **Upload/Download** - Envio e recuperação de imagens
- 🔄 **Preview Base64** - Visualização sem necessidade de download
- 📊 **Informações da Imagem** - Detalhes técnicos (dimensões, formato, tamanho)
- 📚 **Documentação Automática** - Swagger UI e ReDoc
- 🔌 **CORS Configurado** - Pronto para integração com frontend
- ⚡ **API REST Completa** - 9 endpoints totalmente funcionais

### 🎨 Frontend (React + Vite)

- 💅 **Interface Moderna** - Design limpo e responsivo
- 📤 **Drag & Drop** - Upload fácil e intuitivo
- 🎚️ **Controles em Tempo Real** - Sliders interativos
- ⚖️ **Modo Comparação** - Visualize antes e depois simultaneamente
- 💾 **Download Direto** - Baixe resultados processados
- 📱 **Totalmente Responsivo** - Funciona em desktop, tablet e mobile
- 🔄 **Feedback Visual** - Indicadores de carregamento e status
- ✅ **Validação de Arquivos** - Suporte a JPG, PNG, BMP, GIF

---

## 📁 Estrutura do Projeto

```
processamento-imagens/
│
├── 📂 backend/                       # Backend Python/FastAPI
│   ├── src/
│   │   ├── processamento_imagem.py     # Lógica de processamento
│   │   └── api.py                      # API REST
│   ├── images/                         # Pasta para imagens de entrada
│   ├── output/                         # Pasta para imagens processadas
│   ├── temp/                           # Cache temporário da API
│   │   ├── uploads/                    # Uploads temporários
│   │   └── outputs/                    # Outputs temporários
│   ├── exemplo.py                      # Script com exemplos de uso
│   ├── start_api.py                    # Script de inicialização
│   ├── requirements.txt                # Dependências Python
│   ├── .gitignore                      # Arquivos ignorados
│   └── README.md                       # Documentação do backend
│
├── 📂 frontend/                      # Frontend React/Vite
│   ├── src/
│   │   ├── components/                 # Componentes React
│   │   │   ├── ImageUploader.jsx       # Upload com drag-drop
│   │   │   ├── ImageAdjustments.jsx    # Controles de ajuste
│   │   │   └── ImagePreview.jsx        # Preview e comparação
│   │   ├── services/
│   │   │   └── api.js                  # Cliente da API
│   │   ├── App.jsx                     # Componente principal
│   │   ├── App.css                     # Estilos
│   │   └── main.jsx                    # Entry point
│   ├── package.json                    # Dependências Node
│   ├── vite.config.js                  # Configuração Vite
│   └── README.md                       # Documentação do frontend
│
├── 📄 README.md                      # Este arquivo

```

---

## 💻 Modos de Uso

### 🌐 Interface Web (Recomendado)

A forma mais fácil e intuitiva de usar o sistema:

1. Inicie o backend e frontend (veja [Início Rápido](#-início-rápido))
2. Acesse http://localhost:5173
3. Faça upload, ajuste e baixe suas imagens!

### 🐍 Python (Linha de Comando)

Para uso direto via Python:

```python
cd backend
from src.processamento_imagem import ProcessadorImagem

# Carregar imagem
proc = ProcessadorImagem("images/foto.jpg")

# Ajustar brilho e contraste
proc.ajustar_brilho_contraste(brilho=1.5, contraste=1.3)

# Salvar resultado
proc.salvar("output/resultado.jpg")

# Visualizar (abre em janela)
proc.visualizar()
```

### 📜 Script Interativo

Execute o script de exemplo com modo interativo:

```powershell
cd backend
python exemplo.py
```

O script oferece 3 modos:
1. **Modo 1**: Ajustar brilho e contraste
2. **Modo 2**: Apenas brilho
3. **Modo 3**: Apenas contraste

---

## 🎨 Guia de Valores

### Brilho (Brightness)

| Valor | Descrição | Quando Usar |
|-------|-----------|-------------|
| `0.0` | Preto completo | - |
| `0.5` | Muito escuro | Efeito dramático, silhueta |
| `0.8` | Levemente escuro | Ajuste sutil para reduzir exposição |
| **`1.0`** | **🔹 Original** | **Sem alteração** |
| `1.2` | Levemente claro | Corrigir fotos levemente subexpostas |
| `1.5` | Claro | Iluminar fotos escuras |
| `2.0` | Muito claro | Fotos muito escuras |
| `3.0` | Extremamente claro | Efeito high-key |

### Contraste (Contrast)

| Valor | Descrição | Quando Usar |
|-------|-----------|-------------|
| `0.0` | Cinza uniforme | - |
| `0.5` | Muito suave | Efeito nebuloso, sonhador |
| `0.8` | Levemente suave | Suavizar foto com muito contraste |
| **`1.0`** | **🔹 Original** | **Sem alteração** |
| `1.3` | Levemente realçado | Melhorar definição |
| `1.5` | Realçado | Foto desbotada ou sem definição |
| `2.0` | Muito realçado | Efeito dramático |
| `3.0` | Extremamente realçado | Efeito artístico |

**💡 Dica**: Valores ao redor de `1.0` produzem ajustes sutis e naturais. Valores extremos (perto de 0 ou 3) criam efeitos artísticos.

---

## 🛠️ Tecnologias

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | 3.8+ | Linguagem principal |
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) | 0.104+ | Framework web moderno e rápido |
| ![Uvicorn](https://img.shields.io/badge/Uvicorn-2C2D72?style=flat) | 0.24+ | Servidor ASGI de alta performance |
| ![Pillow](https://img.shields.io/badge/Pillow-0C4B33?style=flat) | 10.0+ | Biblioteca de processamento de imagens |
| ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white) | 1.24+ | Computação numérica |

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | 18.2+ | Framework JavaScript |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | 5.0+ | Build tool ultra-rápido |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | ES6+ | Linguagem do frontend |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | - | Estilização |

---

## 📚 Documentação

### 📖 Guias Disponíveis

- **[API_GUIDE.md](API_GUIDE.md)** - Documentação completa da API REST com exemplos em curl e JavaScript
- **[GUIA_COMPLETO.md](GUIA_COMPLETO.md)** - Documentação técnica detalhada do sistema completo
- **[backend/README.md](backend/README.md)** - Documentação específica do backend Python
- **[frontend/README.md](frontend/README.md)** - Documentação específica do frontend React

### 🔌 API Endpoints

A API REST oferece os seguintes endpoints:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Informações da API e lista de endpoints |
| `GET` | `/health` | Verificação de saúde da API |
| `POST` | `/upload` | Upload de imagem |
| `POST` | `/process/{id}` | Processar imagem (brilho/contraste) |
| `GET` | `/preview/{id}` | Preview em base64 |
| `GET` | `/download/{id}` | Download da imagem |
| `GET` | `/info/{id}` | Informações da imagem |
| `DELETE` | `/delete/{id}` | Deletar imagem |
| `POST` | `/process-base64` | Processar imagem via base64 |

**📚 Documentação Interativa**: Acesse **http://localhost:8000/docs** quando a API estiver rodando.

---

## 🔍 Exemplos de Código

### Upload e Processamento (JavaScript)

```javascript
// 1. Upload da imagem
const formData = new FormData();
formData.append('file', imageFile);

const uploadResponse = await fetch('http://localhost:8000/upload', {
  method: 'POST',
  body: formData
});
const { id } = await uploadResponse.json();

// 2. Processar
const processData = new FormData();
processData.append('brightness', 1.5);
processData.append('contrast', 1.3);

await fetch(`http://localhost:8000/process/${id}`, {
  method: 'POST',
  body: processData
});

// 3. Download
const downloadUrl = `http://localhost:8000/download/${id}?processed=true`;
window.open(downloadUrl, '_blank');
```

### Processamento em Lote (Python)

```python
from pathlib import Path
from src.processamento_imagem import ProcessadorImagem

# Processar todas as imagens de uma pasta
for arquivo in Path("images").glob("*.jpg"):
    proc = ProcessadorImagem(str(arquivo))
    proc.ajustar_brilho_contraste(1.3, 1.2)
    proc.salvar(f"output/processada_{arquivo.name}")
    print(f"✅ Processada: {arquivo.name}")
```

---

## 🐛 Solução de Problemas

### ❌ API não inicia

```powershell
# Verificar se a porta 8000 está em uso
netstat -ano | findstr :8000

# Reinstalar dependências
cd backend
pip install -r requirements.txt --force-reinstall

# Verificar versão do Python
python --version  # Deve ser 3.8+
```

### ❌ Frontend não conecta à API

1. ✅ Verifique se a API está rodando: http://localhost:8000/health
2. 🔍 Abra o console do navegador (F12) e verifique erros
3. 🔄 Limpe o cache do navegador (Ctrl + Shift + Delete)
4. 🌐 Verifique se o CORS está habilitado na API

### ❌ Erro ao processar imagem

1. 📝 Verifique se o formato é suportado: **JPG, PNG, BMP, GIF**
2. 🔄 Teste com uma imagem diferente
3. 📊 Verifique os logs no terminal da API
4. 💾 Verifique se há espaço em disco suficiente

### ❌ Erro de dependências no frontend

```powershell
cd frontend
# Limpar cache e reinstalar
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

---

## 🚀 Deploy

### Backend (Produção)

```powershell
cd backend

# Linux/Mac (com Gunicorn)
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.api:app --bind 0.0.0.0:8000

# Windows (com Uvicorn)
pip install uvicorn[standard]
uvicorn src.api:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend (Build para Produção)

```powershell
cd frontend

# Criar build otimizado
npm run build

# Arquivos otimizados estarão em frontend/dist/
# Hospede esses arquivos em qualquer servidor web estático
```

---

## 📝 Roadmap

### Planejado

- [ ] 🎨 Mais filtros (sépia, blur, sharpen, saturação)
- [ ] ✂️ Recorte de imagens
- [ ] 📏 Redimensionamento inteligente
- [ ] 🔄 Rotação e flip
- [ ] 📦 Processamento em lote (múltiplas imagens)
- [ ] 📜 Histórico de processamentos


---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. 🍴 Faça um **Fork** do projeto
2. 🌿 Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. 💾 **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. 📤 **Push** para a branch (`git push origin feature/MinhaFeature`)
5. 🔄 Abra um **Pull Request**

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido por **Mikhael Barreto Santana**

- 🔗 GitHub: [@MikhaelBarretoSantana](https://github.com/MikhaelBarretoSantana)
- 📧 Email: mikhaelbarretos@gmail.com

---

## 🙏 Agradecimentos

- [FastAPI](https://fastapi.tiangolo.com/) - Framework web incrível
- [React](https://react.dev/) - Biblioteca UI poderosa
- [Vite](https://vitejs.dev/) - Build tool ultra-rápido
- [Pillow](https://pillow.readthedocs.io/) - Processamento de imagens Python

---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela!

**Desenvolvido com ❤️ usando Python, FastAPI e React**

[⬆ Voltar ao topo](#-sistema-de-processamento-de-imagens)

</div>
