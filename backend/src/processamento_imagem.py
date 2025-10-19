"""
Módulo de Processamento de Imagens
Implementa funções para ajuste de brilho e contraste em imagens
"""

from PIL import Image, ImageEnhance
import numpy as np
from typing import Union
import os


class ProcessadorImagem:
    """Classe para processar imagens com ajustes de brilho e contraste"""
    
    def __init__(self, caminho_imagem: str):
        """
        Inicializa o processador com uma imagem
        
        Args:
            caminho_imagem: Caminho para o arquivo de imagem
        """
        if not os.path.exists(caminho_imagem):
            raise FileNotFoundError(f"Arquivo não encontrado: {caminho_imagem}")
        
        self.caminho_original = caminho_imagem
        self.imagem = Image.open(caminho_imagem)
        self.imagem_processada = self.imagem.copy()
    
    def ajustar_brilho(self, fator: float) -> Image.Image:
        """
        Ajusta o brilho da imagem
        
        Args:
            fator: Fator de brilho (0.0 = preto, 1.0 = original, >1.0 = mais brilhante)
        
        Returns:
            Imagem com brilho ajustado
        """
        if fator < 0:
            raise ValueError("O fator de brilho deve ser >= 0")
        
        enhancer = ImageEnhance.Brightness(self.imagem_processada)
        self.imagem_processada = enhancer.enhance(fator)
        return self.imagem_processada
    
    def ajustar_contraste(self, fator: float) -> Image.Image:
        """
        Ajusta o contraste da imagem
        
        Args:
            fator: Fator de contraste (0.0 = cinza, 1.0 = original, >1.0 = mais contraste)
        
        Returns:
            Imagem com contraste ajustado
        """
        if fator < 0:
            raise ValueError("O fator de contraste deve ser >= 0")
        
        enhancer = ImageEnhance.Contrast(self.imagem_processada)
        self.imagem_processada = enhancer.enhance(fator)
        return self.imagem_processada
    
    def ajustar_brilho_contraste(self, fator_brilho: float, fator_contraste: float) -> Image.Image:
        """
        Ajusta brilho e contraste simultaneamente
        
        Args:
            fator_brilho: Fator de brilho (0.0 a infinito, 1.0 = original)
            fator_contraste: Fator de contraste (0.0 a infinito, 1.0 = original)
        
        Returns:
            Imagem com brilho e contraste ajustados
        """
        self.ajustar_brilho(fator_brilho)
        self.ajustar_contraste(fator_contraste)
        return self.imagem_processada
    
    def resetar(self):
        """Reseta a imagem para o estado original"""
        self.imagem_processada = self.imagem.copy()
    
    def salvar(self, caminho_saida: str):
        """
        Salva a imagem processada
        
        Args:
            caminho_saida: Caminho onde a imagem será salva
        """
        # Cria o diretório se não existir
        diretorio = os.path.dirname(caminho_saida)
        if diretorio and not os.path.exists(diretorio):
            os.makedirs(diretorio)
        
        self.imagem_processada.save(caminho_saida)
        print(f"Imagem salva em: {caminho_saida}")
    
    def visualizar(self):
        """Exibe a imagem processada"""
        self.imagem_processada.show()
    
    def obter_info(self) -> dict:
        """
        Retorna informações sobre a imagem
        
        Returns:
            Dicionário com informações da imagem
        """
        return {
            'formato': self.imagem.format,
            'modo': self.imagem.mode,
            'tamanho': self.imagem.size,
            'largura': self.imagem.width,
            'altura': self.imagem.height
        }


def ajustar_brilho_numpy(imagem_array: np.ndarray, fator: float) -> np.ndarray:
    """
    Ajusta o brilho usando NumPy (método alternativo)
    
    Args:
        imagem_array: Array NumPy da imagem
        fator: Fator de brilho (-255 a 255)
    
    Returns:
        Array NumPy com brilho ajustado
    """
    imagem_ajustada = np.clip(imagem_array.astype(np.float32) + fator, 0, 255)
    return imagem_ajustada.astype(np.uint8)


def ajustar_contraste_numpy(imagem_array: np.ndarray, fator: float) -> np.ndarray:
    """
    Ajusta o contraste usando NumPy (método alternativo)
    
    Args:
        imagem_array: Array NumPy da imagem
        fator: Fator de contraste (0.0 a infinito, 1.0 = original)
    
    Returns:
        Array NumPy com contraste ajustado
    """
    # Calcula a média da imagem
    media = np.mean(imagem_array)
    # Aplica o contraste
    imagem_ajustada = media + fator * (imagem_array - media)
    # Garante que os valores estejam entre 0 e 255
    imagem_ajustada = np.clip(imagem_ajustada, 0, 255)
    return imagem_ajustada.astype(np.uint8)


if __name__ == "__main__":
    # Exemplo de uso básico
    print("Módulo de Processamento de Imagens")
    print("Use este módulo importando a classe ProcessadorImagem")
