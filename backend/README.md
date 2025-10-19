# Backend - API de Processamento de Imagens

Backend Python com FastAPI para processamento de imagens (ajuste de brilho e contraste).

## 🚀 Início Rápido

```powershell
# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
python start_api.py
```

Acesse:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

## 📁 Estrutura

```
backend/
├── src/
│   ├── processamento_imagem.py    # Lógica de processamento
│   └── api.py                     # API REST
├── images/                        # Imagens de entrada
├── output/                        # Imagens processadas
├── temp/                          # Cache da API
├── exemplo.py                     # Exemplos Python
├── start_api.py                   # Iniciar servidor
└── requirements.txt               # Dependências
```

## 💻 Uso

### API
```powershell
python start_api.py
```

### Python direto
```python
from src.processamento_imagem import ProcessadorImagem

proc = ProcessadorImagem("images/foto.jpg")
proc.ajustar_brilho_contraste(1.5, 1.3)
proc.salvar("output/resultado.jpg")
```

### Exemplos interativos
```powershell
python exemplo.py
```

## 📚 Documentação

Veja [API_GUIDE.md](../API_GUIDE.md) na raiz do projeto.
