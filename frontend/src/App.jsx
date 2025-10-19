import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageAdjustments from './components/ImageAdjustments';
import ImagePreview from './components/ImagePreview';
import api from './services/api';
import './App.css';

function App() {
  const [imageId, setImageId] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  
  const [brightness, setBrightness] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Verifica status da API ao montar o componente
  React.useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      await api.healthCheck();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('disconnected');
      setError('⚠️ Não foi possível conectar à API. Certifique-se de que o servidor está rodando em http://localhost:8000');
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      setError(null);

      // Upload da imagem
      const uploadResult = await api.uploadImage(file);
      setImageId(uploadResult.id);
      setImageInfo(uploadResult);

      // Obtém preview da imagem original
      const preview = await api.getPreview(uploadResult.id, false);
      setOriginalImage(preview.data);
      setProcessedImage(null);

      // Reseta os ajustes
      setBrightness(1.0);
      setContrast(1.0);

    } catch (error) {
      setError(`❌ Erro ao fazer upload: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcess = async () => {
    if (!imageId) return;

    try {
      setIsProcessing(true);
      setError(null);

      // Processa a imagem
      await api.processImage(imageId, brightness, contrast);

      // Obtém preview da imagem processada
      const preview = await api.getPreview(imageId, true);
      setProcessedImage(preview.data);

    } catch (error) {
      setError(`❌ Erro ao processar: ${error.message}`);
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBrightness(1.0);
    setContrast(1.0);
    setProcessedImage(null);
  };

  const handleNewImage = async () => {
    // Deleta a imagem anterior (opcional)
    if (imageId) {
      try {
        await api.deleteImage(imageId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Reseta o estado
    setImageId(null);
    setImageInfo(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setBrightness(1.0);
    setContrast(1.0);
    setError(null);
  };

  const handleDownload = () => {
    if (!imageId) return;
    
    const downloadUrl = api.getDownloadUrl(imageId, true);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `processada_${imageInfo?.filename || 'imagem.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">
            <span className="title-icon">🎨</span>
            Processamento de Imagens
          </h1>
          <p className="app-subtitle">
            Ajuste brilho e contraste de suas imagens com facilidade
          </p>
          
          <div className="api-status">
            <div className={`status-indicator ${apiStatus}`}>
              <span className="status-dot"></span>
              {apiStatus === 'checking' && 'Verificando conexão...'}
              {apiStatus === 'connected' && 'API Conectada'}
              {apiStatus === 'disconnected' && 'API Desconectada'}
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="alert alert-error">
              {error}
              {apiStatus === 'disconnected' && (
                <button onClick={checkAPIStatus} className="btn-retry">
                  🔄 Tentar Novamente
                </button>
              )}
            </div>
          )}

          {!imageId ? (
            <ImageUploader
              onImageUpload={handleImageUpload}
              isLoading={isUploading}
            />
          ) : (
            <>
              <ImageAdjustments
                brightness={brightness}
                contrast={contrast}
                onBrightnessChange={setBrightness}
                onContrastChange={setContrast}
                onProcess={handleProcess}
                onReset={handleReset}
                isProcessing={isProcessing}
                hasImage={!!imageId}
              />

              <ImagePreview
                originalImage={originalImage}
                processedImage={processedImage}
                imageInfo={imageInfo}
                onDownload={handleDownload}
                onNewImage={handleNewImage}
              />
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            Desenvolvido com ❤️ usando React + FastAPI
          </p>
          <p className="footer-links">
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
              📚 Documentação da API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
