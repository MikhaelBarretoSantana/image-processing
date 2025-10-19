"""
API REST para Processamento de Imagens
Endpoints para ajuste de brilho e contraste
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
import os
import uuid
from pathlib import Path
import shutil
from PIL import Image
import io
import base64

from processamento_imagem import ProcessadorImagem

# Configuração da aplicação
app = FastAPI(
    title="API de Processamento de Imagens",
    description="API REST para ajuste de brilho e contraste em imagens",
    version="1.0.0"
)

# Configuração CORS para permitir requisições do React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React/Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Diretórios para armazenamento temporário
UPLOAD_DIR = Path("temp/uploads")
OUTPUT_DIR = Path("temp/outputs")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Modelos de dados
class ImageAdjustments(BaseModel):
    """Modelo para ajustes de imagem"""
    brightness: float = Field(1.0, ge=0.0, le=3.0, description="Fator de brilho (0.0-3.0)")
    contrast: float = Field(1.0, ge=0.0, le=3.0, description="Fator de contraste (0.0-3.0)")

class ImageResponse(BaseModel):
    """Modelo de resposta com informações da imagem"""
    id: str
    filename: str
    format: str
    mode: str
    width: int
    height: int
    size_bytes: int

class ProcessResponse(BaseModel):
    """Modelo de resposta do processamento"""
    success: bool
    message: str
    output_id: str
    brightness: float
    contrast: float


# Endpoints

@app.get("/")
async def root():
    """Endpoint raiz - informações da API"""
    return {
        "name": "API de Processamento de Imagens",
        "version": "1.0.0",
        "description": "API para ajuste de brilho e contraste",
        "endpoints": {
            "GET /": "Informações da API",
            "POST /upload": "Upload de imagem",
            "POST /process/{image_id}": "Processar imagem",
            "GET /download/{image_id}": "Download da imagem processada",
            "GET /preview/{image_id}": "Preview base64 da imagem",
            "GET /info/{image_id}": "Informações da imagem",
            "DELETE /delete/{image_id}": "Deletar imagem",
            "GET /health": "Status da API"
        }
    }

@app.get("/health")
async def health_check():
    """Verifica o status da API"""
    return {
        "status": "healthy",
        "message": "API funcionando corretamente"
    }

@app.post("/upload", response_model=ImageResponse)
async def upload_image(file: UploadFile = File(...)):
    """
    Upload de uma imagem para processamento
    
    Args:
        file: Arquivo de imagem (JPG, PNG, BMP, GIF, etc.)
    
    Returns:
        Informações da imagem enviada
    """
    try:
        # Valida o tipo de arquivo
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
        
        # Gera ID único para a imagem
        image_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        filename = f"{image_id}{file_extension}"
        file_path = UPLOAD_DIR / filename
        
        # Salva o arquivo
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Obtém informações da imagem
        processador = ProcessadorImagem(str(file_path))
        info = processador.obter_info()
        
        # Obtém tamanho do arquivo
        file_size = os.path.getsize(file_path)
        
        return ImageResponse(
            id=image_id,
            filename=file.filename,
            format=info['formato'],
            mode=info['modo'],
            width=info['largura'],
            height=info['altura'],
            size_bytes=file_size
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload: {str(e)}")

@app.post("/process/{image_id}", response_model=ProcessResponse)
async def process_image(
    image_id: str,
    brightness: float = Form(1.0, ge=0.0, le=3.0),
    contrast: float = Form(1.0, ge=0.0, le=3.0)
):
    """
    Processa uma imagem ajustando brilho e contraste
    
    Args:
        image_id: ID da imagem enviada
        brightness: Fator de brilho (0.0-3.0, padrão: 1.0)
        contrast: Fator de contraste (0.0-3.0, padrão: 1.0)
    
    Returns:
        Informações do processamento
    """
    try:
        # Procura o arquivo de entrada
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        if not input_files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        input_path = input_files[0]
        file_extension = input_path.suffix
        
        # Processa a imagem
        processador = ProcessadorImagem(str(input_path))
        processador.ajustar_brilho_contraste(brightness, contrast)
        
        # Salva a imagem processada
        output_filename = f"{image_id}_processed{file_extension}"
        output_path = OUTPUT_DIR / output_filename
        processador.salvar(str(output_path))
        
        return ProcessResponse(
            success=True,
            message="Imagem processada com sucesso",
            output_id=image_id,
            brightness=brightness,
            contrast=contrast
        )
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Valores inválidos: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar: {str(e)}")

@app.get("/download/{image_id}")
async def download_image(image_id: str, processed: bool = True):
    """
    Baixa uma imagem (original ou processada)
    
    Args:
        image_id: ID da imagem
        processed: True para imagem processada, False para original
    
    Returns:
        Arquivo de imagem
    """
    try:
        if processed:
            # Procura imagem processada
            output_files = list(OUTPUT_DIR.glob(f"{image_id}_processed.*"))
            if not output_files:
                raise HTTPException(status_code=404, detail="Imagem processada não encontrada")
            file_path = output_files[0]
        else:
            # Procura imagem original
            input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
            if not input_files:
                raise HTTPException(status_code=404, detail="Imagem original não encontrada")
            file_path = input_files[0]
        
        return FileResponse(
            path=str(file_path),
            media_type="image/jpeg",
            filename=file_path.name
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao baixar: {str(e)}")

@app.get("/preview/{image_id}")
async def preview_image(image_id: str, processed: bool = True):
    """
    Retorna preview da imagem em base64
    
    Args:
        image_id: ID da imagem
        processed: True para imagem processada, False para original
    
    Returns:
        JSON com imagem em base64
    """
    try:
        if processed:
            output_files = list(OUTPUT_DIR.glob(f"{image_id}_processed.*"))
            if not output_files:
                raise HTTPException(status_code=404, detail="Imagem processada não encontrada")
            file_path = output_files[0]
        else:
            input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
            if not input_files:
                raise HTTPException(status_code=404, detail="Imagem original não encontrada")
            file_path = input_files[0]
        
        # Lê a imagem e converte para base64
        with open(file_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode()
        
        # Determina o tipo MIME
        image = Image.open(file_path)
        mime_type = f"image/{image.format.lower()}"
        
        return {
            "id": image_id,
            "processed": processed,
            "mime_type": mime_type,
            "data": f"data:{mime_type};base64,{image_data}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar preview: {str(e)}")

@app.get("/info/{image_id}", response_model=ImageResponse)
async def get_image_info(image_id: str):
    """
    Obtém informações sobre uma imagem
    
    Args:
        image_id: ID da imagem
    
    Returns:
        Informações da imagem
    """
    try:
        # Procura o arquivo
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        if not input_files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        file_path = input_files[0]
        
        # Obtém informações
        processador = ProcessadorImagem(str(file_path))
        info = processador.obter_info()
        file_size = os.path.getsize(file_path)
        
        return ImageResponse(
            id=image_id,
            filename=file_path.name,
            format=info['formato'],
            mode=info['modo'],
            width=info['largura'],
            height=info['altura'],
            size_bytes=file_size
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter informações: {str(e)}")

@app.delete("/delete/{image_id}")
async def delete_image(image_id: str):
    """
    Deleta uma imagem (original e processada)
    
    Args:
        image_id: ID da imagem
    
    Returns:
        Confirmação da exclusão
    """
    try:
        deleted_files = []
        
        # Deleta imagem original
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        for file in input_files:
            file.unlink()
            deleted_files.append(str(file))
        
        # Deleta imagem processada
        output_files = list(OUTPUT_DIR.glob(f"{image_id}_processed.*"))
        for file in output_files:
            file.unlink()
            deleted_files.append(str(file))
        
        if not deleted_files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        return {
            "success": True,
            "message": f"Imagem {image_id} deletada com sucesso",
            "deleted_files": deleted_files
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar: {str(e)}")

@app.post("/process-base64")
async def process_image_base64(
    image_data: str = Form(...),
    brightness: float = Form(1.0, ge=0.0, le=3.0),
    contrast: float = Form(1.0, ge=0.0, le=3.0)
):
    """
    Processa uma imagem enviada em base64 e retorna o resultado em base64
    
    Args:
        image_data: Imagem em formato base64
        brightness: Fator de brilho (0.0-3.0)
        contrast: Fator de contraste (0.0-3.0)
    
    Returns:
        Imagem processada em base64
    """
    try:
        # Remove o prefixo "data:image/...;base64," se existir
        if "base64," in image_data:
            image_data = image_data.split("base64,")[1]
        
        # Decodifica a imagem
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Salva temporariamente
        image_id = str(uuid.uuid4())
        temp_input = UPLOAD_DIR / f"{image_id}.png"
        temp_output = OUTPUT_DIR / f"{image_id}_processed.png"
        
        image.save(temp_input)
        
        # Processa
        processador = ProcessadorImagem(str(temp_input))
        processador.ajustar_brilho_contraste(brightness, contrast)
        processador.salvar(str(temp_output))
        
        # Converte para base64
        with open(temp_output, "rb") as f:
            processed_data = base64.b64encode(f.read()).decode()
        
        # Limpa arquivos temporários
        temp_input.unlink()
        temp_output.unlink()
        
        return {
            "success": True,
            "brightness": brightness,
            "contrast": contrast,
            "data": f"data:image/png;base64,{processed_data}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
