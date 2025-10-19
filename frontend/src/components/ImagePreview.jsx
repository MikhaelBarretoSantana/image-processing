import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({
  originalImage,
  processedImage,
  imageInfo,
  onDownload,
  onNewImage
}) => {
  const [showComparison, setShowComparison] = React.useState(false);

  if (!originalImage && !processedImage) {
    return null;
  }

  return (
    <div className="image-preview">
      <div className="preview-header">
        <h3 className="preview-title">🖼️ Visualização</h3>
        
        {imageInfo && (
          <div className="image-info-compact">
            <span>{imageInfo.width}x{imageInfo.height}px</span>
            <span>•</span>
            <span>{imageInfo.format}</span>
            <span>•</span>
            <span>{(imageInfo.size_bytes / 1024).toFixed(1)} KB</span>
          </div>
        )}
      </div>

      {originalImage && processedImage && (
        <div className="preview-controls">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="btn-toggle"
          >
            {showComparison ? '👁️ Ver Apenas Resultado' : '⚖️ Comparar Original'}
          </button>
        </div>
      )}

      <div className={`preview-container ${showComparison ? 'comparison-mode' : ''}`}>
        {showComparison && originalImage ? (
          <>
            <div className="preview-image-wrapper">
              <div className="image-label">Original</div>
              <img
                src={originalImage}
                alt="Original"
                className="preview-image"
              />
            </div>
            <div className="preview-image-wrapper">
              <div className="image-label processed">Processada</div>
              <img
                src={processedImage || originalImage}
                alt="Processada"
                className="preview-image"
              />
            </div>
          </>
        ) : (
          <div className="preview-image-wrapper full">
            <img
              src={processedImage || originalImage}
              alt="Visualização"
              className="preview-image"
            />
          </div>
        )}
      </div>

      <div className="preview-actions">
        <button
          onClick={onNewImage}
          className="btn btn-secondary"
        >
          🔄 Nova Imagem
        </button>
        {processedImage && (
          <button
            onClick={onDownload}
            className="btn btn-primary"
          >
            💾 Baixar Processada
          </button>
        )}
      </div>

      {imageInfo && (
        <div className="image-info-detailed">
          <h4>📊 Informações Detalhadas</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nome:</span>
              <span className="info-value">{imageInfo.filename}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Formato:</span>
              <span className="info-value">{imageInfo.format}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Modo:</span>
              <span className="info-value">{imageInfo.mode}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Dimensões:</span>
              <span className="info-value">{imageInfo.width} x {imageInfo.height} pixels</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tamanho:</span>
              <span className="info-value">{(imageInfo.size_bytes / 1024).toFixed(2)} KB</span>
            </div>
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value" style={{ fontSize: '0.75rem' }}>{imageInfo.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
