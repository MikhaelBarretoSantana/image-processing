/**
 * Serviço de comunicação com a API de processamento de imagens
 */

const API_BASE_URL = 'http://localhost:8000';

class ImageProcessingAPI {
  /**
   * Verifica o status da API
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      throw error;
    }
  }

  /**
   * Faz upload de uma imagem
   * @param {File} file - Arquivo de imagem
   * @returns {Promise<Object>} Informações da imagem enviada
   */
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

  /**
   * Processa uma imagem com ajustes de brilho e contraste
   * @param {string} imageId - ID da imagem
   * @param {number} brightness - Fator de brilho (0.0-3.0)
   * @param {number} contrast - Fator de contraste (0.0-3.0)
   * @returns {Promise<Object>} Resultado do processamento
   */
  async processImage(imageId, brightness = 1.0, contrast = 1.0) {
    try {
      const formData = new FormData();
      formData.append('brightness', brightness.toString());
      formData.append('contrast', contrast.toString());

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

  /**
   * Obtém preview da imagem em base64
   * @param {string} imageId - ID da imagem
   * @param {boolean} processed - true para processada, false para original
   * @returns {Promise<Object>} Preview em base64
   */
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

  /**
   * Obtém URL para download da imagem
   * @param {string} imageId - ID da imagem
   * @param {boolean} processed - true para processada, false para original
   * @returns {string} URL para download
   */
  getDownloadUrl(imageId, processed = true) {
    return `${API_BASE_URL}/download/${imageId}?processed=${processed}`;
  }

  /**
   * Obtém informações sobre uma imagem
   * @param {string} imageId - ID da imagem
   * @returns {Promise<Object>} Informações da imagem
   */
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

  /**
   * Deleta uma imagem
   * @param {string} imageId - ID da imagem
   * @returns {Promise<Object>} Confirmação da exclusão
   */
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

  /**
   * Processa imagem via base64 (tudo em uma requisição)
   * @param {string} base64Data - Imagem em base64
   * @param {number} brightness - Fator de brilho
   * @param {number} contrast - Fator de contraste
   * @returns {Promise<Object>} Imagem processada em base64
   */
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
}

// Exporta uma instância singleton
export default new ImageProcessingAPI();
