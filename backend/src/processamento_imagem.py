from PIL import Image, ImageEnhance
import numpy as np
import cv2
from skimage import exposure
from typing import Union, Tuple, Dict, List
import os


class ProcessadorImagem:
    
    def __init__(self, caminho_imagem: str):
        if not os.path.exists(caminho_imagem):
            raise FileNotFoundError(f"Arquivo não encontrado: {caminho_imagem}")
        
        self.caminho_original = caminho_imagem
        self.imagem = Image.open(caminho_imagem)
        self.imagem_processada = self.imagem.copy()
    
    def ajustar_brilho(self, fator: float) -> Image.Image:
        if fator < 0:
            raise ValueError("O fator de brilho deve ser >= 0")
        
        enhancer = ImageEnhance.Brightness(self.imagem_processada)
        self.imagem_processada = enhancer.enhance(fator)
        return self.imagem_processada
    
    def ajustar_contraste(self, fator: float) -> Image.Image:
        if fator < 0:
            raise ValueError("O fator de contraste deve ser >= 0")
        
        enhancer = ImageEnhance.Contrast(self.imagem_processada)
        self.imagem_processada = enhancer.enhance(fator)
        return self.imagem_processada
    
    def ajustar_saturacao(self, fator: float) -> Image.Image:
        if fator < 0:
            raise ValueError("O fator de saturação deve ser >= 0")
        
        enhancer = ImageEnhance.Color(self.imagem_processada)
        self.imagem_processada = enhancer.enhance(fator)
        return self.imagem_processada
    
    def ajustar_brilho_contraste(self, fator_brilho: float, fator_contraste: float) -> Image.Image:
        self.ajustar_brilho(fator_brilho)
        self.ajustar_contraste(fator_contraste)
        return self.imagem_processada
    
    def ajuste_automatico(self) -> Image.Image:
        img_array = np.array(self.imagem_processada)
        
        if len(img_array.shape) == 3:
            img_rescaled = np.zeros_like(img_array)
            for i in range(3):
                p2, p98 = np.percentile(img_array[:, :, i], (2, 98))
                
                if p98 - p2 < 1:
                    img_rescaled[:, :, i] = img_array[:, :, i]
                else:
                    img_rescaled[:, :, i] = exposure.rescale_intensity(
                        img_array[:, :, i], in_range=(p2, p98), out_range=(0, 255)
                    )
        else:
            p2, p98 = np.percentile(img_array, (2, 98))
            if p98 - p2 < 1:
                img_rescaled = img_array
            else:
                img_rescaled = exposure.rescale_intensity(
                    img_array, in_range=(p2, p98), out_range=(0, 255)
                )
        
        img_rescaled = np.clip(img_rescaled, 0, 255).astype(np.uint8)
        
        self.imagem_processada = Image.fromarray(img_rescaled)
        return self.imagem_processada
    
    def aplicar_clahe(self, clip_limit: float = 2.0, tile_grid_size: Tuple[int, int] = (8, 8)) -> Image.Image:
        img_array = np.array(self.imagem_processada)
        
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
        
        if len(img_array.shape) == 3:
            img_lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
            img_lab[:, :, 0] = clahe.apply(img_lab[:, :, 0])
            img_array = cv2.cvtColor(img_lab, cv2.COLOR_LAB2RGB)
        else:
            img_array = clahe.apply(img_array)
        
        self.imagem_processada = Image.fromarray(img_array)
        return self.imagem_processada
    
    def aplicar_curva_s(self, intensidade: float = 0.5) -> Image.Image:
        img_array = np.array(self.imagem_processada).astype(np.float32) / 255.0
        
        def curva_s(x, intensidade):
            centro = 0.5
            if intensidade == 0:
                return x
            if x < centro:
                return centro * np.power(x / centro, 1.0 / (1.0 + intensidade))
            else:
                return centro + (1.0 - centro) * np.power((x - centro) / (1.0 - centro), 1.0 + intensidade)
        
        curva_s_vec = np.vectorize(curva_s)
        
        if len(img_array.shape) == 3:
            for i in range(3):
                img_array[:, :, i] = curva_s_vec(img_array[:, :, i], intensidade)
        else:
            img_array = curva_s_vec(img_array, intensidade)
        
        img_array = np.clip(img_array * 255.0, 0, 255).astype(np.uint8)
        self.imagem_processada = Image.fromarray(img_array)
        return self.imagem_processada
    
    def gerar_histograma(self) -> Dict[str, List[int]]:
        img_array = np.array(self.imagem_processada)
        histograma = {}
        
        if len(img_array.shape) == 3:
            cores = ['red', 'green', 'blue']
            for i, cor in enumerate(cores):
                hist = cv2.calcHist([img_array], [i], None, [256], [0, 256])
                histograma[cor] = hist.flatten().tolist()
        else:
            hist = cv2.calcHist([img_array], [0], None, [256], [0, 256])
            histograma['gray'] = hist.flatten().tolist()
        
        return histograma
    
    def resetar(self):
        self.imagem_processada = self.imagem.copy()
    
    def salvar(self, caminho_saida: str):
        diretorio = os.path.dirname(caminho_saida)
        if diretorio and not os.path.exists(diretorio):
            os.makedirs(diretorio)
        
        self.imagem_processada.save(caminho_saida)
        print(f"Imagem salva em: {caminho_saida}")
    
    def visualizar(self):
        self.imagem_processada.show()
    
    def obter_info(self) -> dict:
        return {
            'formato': self.imagem.format,
            'modo': self.imagem.mode,
            'tamanho': self.imagem.size,
            'largura': self.imagem.width,
            'altura': self.imagem.height
        }


def ajustar_brilho_numpy(imagem_array: np.ndarray, fator: float) -> np.ndarray:
    imagem_ajustada = np.clip(imagem_array.astype(np.float32) + fator, 0, 255)
    return imagem_ajustada.astype(np.uint8)


def ajustar_contraste_numpy(imagem_array: np.ndarray, fator: float) -> np.ndarray:
    media = np.mean(imagem_array)
    imagem_ajustada = media + fator * (imagem_array - media)
    imagem_ajustada = np.clip(imagem_ajustada, 0, 255)
    return imagem_ajustada.astype(np.uint8)


if __name__ == "__main__":
    print("Módulo de Processamento de Imagens")
    print("Use este módulo importando a classe ProcessadorImagem")
