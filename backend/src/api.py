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

app = FastAPI(
    title="API de Processamento de Imagens",
    description="API REST para ajuste de brilho e contraste em imagens",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("temp/uploads")
OUTPUT_DIR = Path("temp/outputs")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

class ImageAdjustments(BaseModel):
    brightness: float = Field(1.0, ge=0.0, le=3.0, description="Fator de brilho (0.0-3.0)")
    contrast: float = Field(1.0, ge=0.0, le=3.0, description="Fator de contraste (0.0-3.0)")
    saturation: float = Field(1.0, ge=0.0, le=3.0, description="Fator de saturação (0.0-3.0)")

class ImageResponse(BaseModel):
    id: str
    filename: str
    format: str
    mode: str
    width: int
    height: int
    size_bytes: int

class ProcessResponse(BaseModel):
    success: bool
    message: str
    output_id: str
    brightness: float
    contrast: float


@app.get("/")
async def root():
    return {
        "name": "API de Processamento de Imagens",
        "version": "2.0.0",
        "description": "API para ajuste de brilho, contraste, saturação e algoritmos avançados",
        "endpoints": {
            "GET /": "Informações da API",
            "GET /health": "Status da API",
            "POST /upload": "Upload de imagem",
            "POST /process/{image_id}": "Processar imagem (brilho/contraste/saturação)",
            "POST /auto-adjust/{image_id}": "Ajuste automático baseado em histograma",
            "POST /apply-clahe/{image_id}": "Aplicar CLAHE (equalização adaptativa)",
            "POST /apply-s-curve/{image_id}": "Aplicar curva S para contraste",
            "GET /histogram/{image_id}": "Obter histograma da imagem",
            "POST /batch-process": "Processamento em lote de múltiplas imagens",
            "GET /download/{image_id}": "Download da imagem processada",
            "GET /preview/{image_id}": "Preview base64 da imagem",
            "GET /info/{image_id}": "Informações da imagem",
            "DELETE /delete/{image_id}": "Deletar imagem",
            "POST /process-base64": "Processar imagem via base64"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "API funcionando corretamente"
    }

@app.post("/upload", response_model=ImageResponse)
async def upload_image(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
        
        image_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        filename = f"{image_id}{file_extension}"
        file_path = UPLOAD_DIR / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        processador = ProcessadorImagem(str(file_path))
        info = processador.obter_info()
        
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
    contrast: float = Form(1.0, ge=0.0, le=3.0),
    saturation: float = Form(1.0, ge=0.0, le=3.0)
):
    try:
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        if not input_files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        input_path = input_files[0]
        file_extension = input_path.suffix
        
        processador = ProcessadorImagem(str(input_path))
        processador.ajustar_brilho_contraste(brightness, contrast)
        processador.ajustar_saturacao(saturation)
        
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
async def download_image(
    image_id: str, 
    processed: bool = True,
    format: str = None,
    quality: int = 95
):
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
        
        if format and format.lower() in ['jpeg', 'jpg', 'png', 'webp']:
            img = Image.open(file_path)
            
            temp_path = OUTPUT_DIR / f"{image_id}_export.{format.lower()}"
            
            if format.lower() in ['jpeg', 'jpg'] and img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            quality = max(1, min(100, quality))
            
            if format.lower() in ['jpeg', 'jpg']:
                img.save(temp_path, 'JPEG', quality=quality, optimize=True)
            elif format.lower() == 'webp':
                img.save(temp_path, 'WEBP', quality=quality)
            else:
                img.save(temp_path, 'PNG', optimize=True)
            
            file_path = temp_path
        
        return FileResponse(
            path=str(file_path),
            media_type=f"image/{format if format else 'jpeg'}",
            filename=file_path.name
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao baixar: {str(e)}")

@app.get("/preview/{image_id}")
async def preview_image(image_id: str, processed: bool = True):
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
        
        with open(file_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode()
        
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
    try:
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        if not input_files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        file_path = input_files[0]
        
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
    try:
        deleted_files = []
        
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        for file in input_files:
            file.unlink()
            deleted_files.append(str(file))
        
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
    try:
        if "base64," in image_data:
            image_data = image_data.split("base64,")[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        image_id = str(uuid.uuid4())
        temp_input = UPLOAD_DIR / f"{image_id}.png"
        temp_output = OUTPUT_DIR / f"{image_id}_processed.png"
        
        image.save(temp_input)
        
        processador = ProcessadorImagem(str(temp_input))
        processador.ajustar_brilho_contraste(brightness, contrast)
        processador.salvar(str(temp_output))
        
        with open(temp_output, "rb") as f:
            processed_data = base64.b64encode(f.read()).decode()
        
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


@app.post("/auto-adjust/{image_id}")
async def auto_adjust_image(image_id: str):
    try:
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        if not input_files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        input_path = input_files[0]
        file_extension = input_path.suffix
        
        processador = ProcessadorImagem(str(input_path))
        processador.ajuste_automatico()
        
        output_filename = f"{image_id}_processed{file_extension}"
        output_path = OUTPUT_DIR / output_filename
        processador.salvar(str(output_path))
        
        return {
            "success": True,
            "message": "Ajuste automático aplicado com sucesso",
            "output_id": image_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar: {str(e)}")


@app.post("/apply-clahe/{image_id}")
async def apply_clahe(
    image_id: str,
    clip_limit: float = Form(2.0, ge=0.1, le=10.0),
    tile_grid_size: int = Form(8, ge=1, le=32)
):
    try:
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        if not input_files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        input_path = input_files[0]
        file_extension = input_path.suffix
        
        processador = ProcessadorImagem(str(input_path))
        processador.aplicar_clahe(clip_limit, (tile_grid_size, tile_grid_size))
        
        output_filename = f"{image_id}_processed{file_extension}"
        output_path = OUTPUT_DIR / output_filename
        processador.salvar(str(output_path))
        
        return {
            "success": True,
            "message": "CLAHE aplicado com sucesso",
            "output_id": image_id,
            "clip_limit": clip_limit,
            "tile_grid_size": tile_grid_size
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar: {str(e)}")


@app.get("/histogram/{image_id}")
async def get_histogram(image_id: str, processed: bool = False):
    try:
        if processed:
            files = list(OUTPUT_DIR.glob(f"{image_id}_processed.*"))
        else:
            files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        
        if not files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        processador = ProcessadorImagem(str(files[0]))
        histograma = processador.gerar_histograma()
        
        return {
            "image_id": image_id,
            "processed": processed,
            "histogram": histograma
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar histograma: {str(e)}")


@app.post("/apply-s-curve/{image_id}")
async def apply_s_curve(
    image_id: str,
    intensity: float = Form(0.5, ge=0.0, le=2.0)
):
    try:
        input_files = list(UPLOAD_DIR.glob(f"{image_id}.*"))
        if not input_files:
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
        
        input_path = input_files[0]
        file_extension = input_path.suffix
        
        processador = ProcessadorImagem(str(input_path))
        processador.aplicar_curva_s(intensity)
        
        output_filename = f"{image_id}_processed{file_extension}"
        output_path = OUTPUT_DIR / output_filename
        processador.salvar(str(output_path))
        
        return {
            "success": True,
            "message": "Curva S aplicada com sucesso",
            "output_id": image_id,
            "intensity": intensity
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar: {str(e)}")


@app.post("/batch-process")
async def batch_process(
    files: list[UploadFile] = File(...),
    brightness: float = Form(1.0, ge=0.0, le=3.0),
    contrast: float = Form(1.0, ge=0.0, le=3.0),
    saturation: float = Form(1.0, ge=0.0, le=3.0)
):
    try:
        if len(files) > 50:
            raise HTTPException(
                status_code=400, 
                detail=f"Limite de 50 arquivos excedido. Você enviou {len(files)} arquivos."
            )
        
        results = []
        
        for file in files:
            if not file.content_type.startswith("image/"):
                continue
            
            image_id = str(uuid.uuid4())
            file_extension = Path(file.filename).suffix
            filename = f"{image_id}{file_extension}"
            file_path = UPLOAD_DIR / filename
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            processador = ProcessadorImagem(str(file_path))
            processador.ajustar_brilho_contraste(brightness, contrast)
            processador.ajustar_saturacao(saturation)
            
            output_filename = f"{image_id}_processed{file_extension}"
            output_path = OUTPUT_DIR / output_filename
            processador.salvar(str(output_path))
            
            results.append({
                "id": image_id,
                "filename": file.filename,
                "success": True
            })
        
        return {
            "success": True,
            "message": f"{len(results)} imagens processadas com sucesso",
            "results": results,
            "settings": {
                "brightness": brightness,
                "contrast": contrast,
                "saturation": saturation
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no processamento em lote: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
