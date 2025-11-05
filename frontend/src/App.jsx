import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageAdjustments from './components/ImageAdjustments';
import ImagePreview from './components/ImagePreview';
import Histogram from './components/Histogram';
import api from './services/api';
import './App.css';

function App() {
  const [imageId, setImageId] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  
  const [brightness, setBrightness] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [saturation, setSaturation] = useState(1.0);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  
  const [histogramOriginal, setHistogramOriginal] = useState(null);
  const [histogramProcessed, setHistogramProcessed] = useState(null);
  const [showHistogram, setShowHistogram] = useState(false);
  
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  const addToHistory = (state) => {
    if (isUndoRedo) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    
    if (newHistory.length > 20) {
      newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = async () => {
    if (!canUndo) return;
    
    setIsUndoRedo(true);
    const previousState = history[historyIndex - 1];
    
    setBrightness(previousState.brightness);
    setContrast(previousState.contrast);
    setSaturation(previousState.saturation);
    
    setHistoryIndex(historyIndex - 1);
    
    if (imageId) {
      await applyStateProcessing(previousState);
    }
    
    setTimeout(() => setIsUndoRedo(false), 100);
  };

  const handleRedo = async () => {
    if (!canRedo) return;
    
    setIsUndoRedo(true);
    const nextState = history[historyIndex + 1];
    
    setBrightness(nextState.brightness);
    setContrast(nextState.contrast);
    setSaturation(nextState.saturation);
    
    setHistoryIndex(historyIndex + 1);
    
    if (imageId) {
      await applyStateProcessing(nextState);
    }
    
    setTimeout(() => setIsUndoRedo(false), 100);
  };

  const applyStateProcessing = async (state) => {
    try {
      setIsProcessing(true);
      await api.processImage(imageId, state.brightness, state.contrast, state.saturation);
      const preview = await api.getPreview(imageId, true);
      setProcessedImage(preview.data);
      
      if (showHistogram) {
        loadHistogram(imageId, true);
      }
    } catch (error) {
      console.error('Error applying state:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  React.useEffect(() => {
    checkAPIStatus();
    
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (imageId && processedImage) {
          handleDownload();
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (imageId) {
          if (canUndo) {
            handleUndo();
          } else {
            handleReset();
          }
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        if (canRedo) {
          handleRedo();
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (imageId && !isProcessing) {
          handleProcess();
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (imageId && !isProcessing) {
          handleAutoAdjust();
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        if (imageId) {
          toggleHistogram();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageId, processedImage, isProcessing, canUndo, canRedo]);

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

      const uploadResult = await api.uploadImage(file);
      setImageId(uploadResult.id);
      setImageInfo(uploadResult);

      const preview = await api.getPreview(uploadResult.id, false);
      setOriginalImage(preview.data);
      setProcessedImage(null);

      setBrightness(1.0);
      setContrast(1.0);
      setSaturation(1.0);
      
      const initialState = {
        brightness: 1.0,
        contrast: 1.0,
        saturation: 1.0,
        timestamp: Date.now()
      };
      setHistory([initialState]);
      setHistoryIndex(0);
      
      loadHistogram(uploadResult.id, false);

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

      await api.processImage(imageId, brightness, contrast, saturation);

      const preview = await api.getPreview(imageId, true);
      setProcessedImage(preview.data);
      
      if (!isUndoRedo) {
        addToHistory({
          brightness,
          contrast,
          saturation,
          timestamp: Date.now()
        });
      }
      
      if (showHistogram) {
        loadHistogram(imageId, true);
      }

    } catch (error) {
      setError(`❌ Erro ao processar: ${error.message}`);
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const loadHistogram = async (id, processed) => {
    try {
      const histogram = await api.getHistogram(id, processed);
      if (processed) {
        setHistogramProcessed(histogram.histogram);
      } else {
        setHistogramOriginal(histogram.histogram);
      }
    } catch (error) {
      console.error('Histogram error:', error);
    }
  };

  const handleAutoAdjust = async () => {
    if (!imageId) return;

    try {
      setIsProcessing(true);
      setError(null);

      await api.autoAdjust(imageId);

      const preview = await api.getPreview(imageId, true);
      setProcessedImage(preview.data);

      setBrightness(1.0);
      setContrast(1.0);
      setSaturation(1.0);
      
      if (showHistogram) {
        loadHistogram(imageId, true);
      }

    } catch (error) {
      setError(`❌ Erro no ajuste automático: ${error.message}`);
      console.error('Auto adjust error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyClahe = async () => {
    if (!imageId) return;

    try {
      setIsProcessing(true);
      setError(null);

      await api.applyClahe(imageId, 2.0, 8);

      const preview = await api.getPreview(imageId, true);
      setProcessedImage(preview.data);
      
      if (showHistogram) {
        loadHistogram(imageId, true);
      }

    } catch (error) {
      setError(`❌ Erro ao aplicar CLAHE: ${error.message}`);
      console.error('CLAHE error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplySCurve = async () => {
    if (!imageId) return;

    try {
      setIsProcessing(true);
      setError(null);

      await api.applySCurve(imageId, 0.5);

      const preview = await api.getPreview(imageId, true);
      setProcessedImage(preview.data);
      
      if (showHistogram) {
        loadHistogram(imageId, true);
      }

    } catch (error) {
      setError(`❌ Erro ao aplicar curva S: ${error.message}`);
      console.error('S-curve error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBrightness(1.0);
    setContrast(1.0);
    setSaturation(1.0);
    setProcessedImage(null);
    setHistogramProcessed(null);
    
    const initialState = {
      brightness: 1.0,
      contrast: 1.0,
      saturation: 1.0,
      timestamp: Date.now()
    };
    setHistory([initialState]);
    setHistoryIndex(0);
  };
  
  const toggleHistogram = () => {
    const newShowHistogram = !showHistogram;
    setShowHistogram(newShowHistogram);
    
    if (newShowHistogram && imageId) {
      loadHistogram(imageId, false);
      if (processedImage) {
        loadHistogram(imageId, true);
      }
    }
  };

  const handleNewImage = async () => {
    if (imageId) {
      try {
        await api.deleteImage(imageId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    setImageId(null);
    setImageInfo(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setBrightness(1.0);
    setContrast(1.0);
    setSaturation(1.0);
    setError(null);
    setHistogramOriginal(null);
    setHistogramProcessed(null);
    setShowHistogram(false);
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
                saturation={saturation}
                onBrightnessChange={setBrightness}
                onContrastChange={setContrast}
                onSaturationChange={setSaturation}
                onProcess={handleProcess}
                onReset={handleReset}
                onAutoAdjust={handleAutoAdjust}
                onApplyClahe={handleApplyClahe}
                onApplySCurve={handleApplySCurve}
                isProcessing={isProcessing}
                hasImage={!!imageId}
                hasProcessedImage={!!processedImage}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />

              <ImagePreview
                originalImage={originalImage}
                processedImage={processedImage}
                imageInfo={imageInfo}
                onDownload={handleDownload}
                onNewImage={handleNewImage}
              />
              
              <div className="histogram-controls">
                <button 
                  onClick={toggleHistogram}
                  className="btn btn-secondary"
                >
                  📊 {showHistogram ? 'Ocultar' : 'Mostrar'} Histograma
                </button>
              </div>
              
              {showHistogram && (
                <div className="histogram-section">
                  <div className="histogram-grid">
                    <Histogram 
                      data={histogramOriginal} 
                      title="Histograma Original" 
                    />
                    {processedImage && histogramProcessed && (
                      <Histogram 
                        data={histogramProcessed} 
                        title="Histograma Processado" 
                      />
                    )}
                  </div>
                </div>
              )}
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
