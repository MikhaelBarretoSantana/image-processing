import React, { useState, useRef, useEffect } from 'react';
import './ImagePreview.css';

const ImagePreview = ({
  originalImage,
  processedImage,
  imageInfo,
  onDownload,
  onNewImage
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [sliderValue, setSliderValue] = useState(50);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, [originalImage, processedImage]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!originalImage && !processedImage) {
    return null;
  }

  const imageStyle = {
    transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
    transition: isDragging ? 'none' : 'transform 0.2s ease'
  };

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
            {showComparison ? '👁️ Ver Apenas Resultado' : '⚖️ Comparar Lado a Lado'}
          </button>
          <button
            onClick={() => {
              setShowComparison('slider');
            }}
            className="btn-toggle"
          >
            🔀 Comparar com Slider
          </button>
        </div>
      )}
      
      <div className="zoom-controls">
        <button onClick={handleZoomOut} disabled={zoomLevel <= 0.5} className="zoom-btn">
          🔍−
        </button>
        <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
        <button onClick={handleZoomIn} disabled={zoomLevel >= 3} className="zoom-btn">
          🔍+
        </button>
        <button onClick={handleZoomReset} className="zoom-btn">
          ↺ Reset
        </button>
      </div>

      <div 
        ref={containerRef}
        className={`preview-container ${showComparison === true ? 'comparison-mode' : ''} ${showComparison === 'slider' ? 'slider-mode' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {showComparison === 'slider' && originalImage && processedImage ? (
          <div className="slider-comparison">
            <div className="slider-images">
              <img
                src={originalImage}
                alt="Original"
                className="preview-image slider-original"
                style={imageStyle}
              />
              <div 
                className="slider-overlay"
                style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
              >
                <img
                  src={processedImage}
                  alt="Processada"
                  className="preview-image slider-processed"
                  style={imageStyle}
                />
              </div>
              <div 
                className="slider-divider"
                style={{ left: `${sliderValue}%` }}
              >
                <div className="slider-handle">
                  <span>←</span>
                  <span>→</span>
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="comparison-slider"
            />
            <div className="slider-labels">
              <span>Original</span>
              <span>Processada</span>
            </div>
          </div>
        ) : showComparison === true && originalImage ? (
          <>
            <div className="preview-image-wrapper">
              <div className="image-label">Original</div>
              <img
                src={originalImage}
                alt="Original"
                className="preview-image"
                style={imageStyle}
                ref={imageRef}
              />
            </div>
            <div className="preview-image-wrapper">
              <div className="image-label processed">Processada</div>
              <img
                src={processedImage || originalImage}
                alt="Processada"
                className="preview-image"
                style={imageStyle}
              />
            </div>
          </>
        ) : (
          <div className="preview-image-wrapper full">
            <img
              src={processedImage || originalImage}
              alt="Visualização"
              className="preview-image"
              style={imageStyle}
              ref={imageRef}
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
