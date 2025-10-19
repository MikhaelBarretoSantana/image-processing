"""
Script para iniciar o servidor da API
"""

import uvicorn
import sys
from pathlib import Path

# Adiciona o diretório src ao path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Iniciando API de Processamento de Imagens")
    print("=" * 60)
    print("\n📍 Servidor: http://localhost:8000")
    print("📚 Documentação: http://localhost:8000/docs")
    print("📖 ReDoc: http://localhost:8000/redoc")
    print("\n💡 Pressione Ctrl+C para parar o servidor\n")
    print("=" * 60 + "\n")
    
    uvicorn.run(
        "src.api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
