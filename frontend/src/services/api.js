const API_BASE_URL = 'http://localhost:8000';

class ImageProcessingAPI {
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      throw error;
    }
  }

  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao fazer upload da imagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  }

  async processImage(imageId, brightness = 1.0, contrast = 1.0, saturation = 1.0) {
    try {
      const formData = new FormData();
      formData.append('brightness', brightness.toString());
      formData.append('contrast', contrast.toString());
      formData.append('saturation', saturation.toString());

      const response = await fetch(`${API_BASE_URL}/process/${imageId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao processar imagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no processamento:', error);
      throw error;
    }
  }

  async getPreview(imageId, processed = false) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/preview/${imageId}?processed=${processed}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao obter preview');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter preview:', error);
      throw error;
    }
  }

  getDownloadUrl(imageId, processed = true) {
    return `${API_BASE_URL}/download/${imageId}?processed=${processed}`;
  }

  async getImageInfo(imageId) {
    try {
      const response = await fetch(`${API_BASE_URL}/info/${imageId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao obter informações');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter informações:', error);
      throw error;
    }
  }

  async deleteImage(imageId) {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao deletar imagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      throw error;
    }
  }

  async processBase64(base64Data, brightness = 1.0, contrast = 1.0) {
    try {
      const formData = new FormData();
      formData.append('image_data', base64Data);
      formData.append('brightness', brightness.toString());
      formData.append('contrast', contrast.toString());

      const response = await fetch(`${API_BASE_URL}/process-base64`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao processar');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no processamento base64:', error);
      throw error;
    }
  }

  async autoAdjust(imageId) {
    try {
      const response = await fetch(`${API_BASE_URL}/auto-adjust/${imageId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro no ajuste automático');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no ajuste automático:', error);
      throw error;
    }
  }

  async applyClahe(imageId, clipLimit = 2.0, tileGridSize = 8) {
    try {
      const formData = new FormData();
      formData.append('clip_limit', clipLimit.toString());
      formData.append('tile_grid_size', tileGridSize.toString());

      const response = await fetch(`${API_BASE_URL}/apply-clahe/${imageId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao aplicar CLAHE');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao aplicar CLAHE:', error);
      throw error;
    }
  }

  async applySCurve(imageId, intensity = 0.5) {
    try {
      const formData = new FormData();
      formData.append('intensity', intensity.toString());

      const response = await fetch(`${API_BASE_URL}/apply-s-curve/${imageId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao aplicar curva S');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao aplicar curva S:', error);
      throw error;
    }
  }

  async getHistogram(imageId, processed = false) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/histogram/${imageId}?processed=${processed}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao obter histograma');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter histograma:', error);
      throw error;
    }
  }

  async batchProcess(files, brightness = 1.0, contrast = 1.0, saturation = 1.0) {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('brightness', brightness.toString());
      formData.append('contrast', contrast.toString());
      formData.append('saturation', saturation.toString());

      const response = await fetch(`${API_BASE_URL}/batch-process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro no processamento em lote');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no processamento em lote:', error);
      throw error;
    }
  }
}

export default new ImageProcessingAPI();
