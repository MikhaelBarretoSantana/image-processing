import React from 'react';
import './ImageAdjustments.css';

const ImageAdjustments = ({
  brightness,
  contrast,
  onBrightnessChange,
  onContrastChange,
  onProcess,
  onReset,
  isProcessing,
  hasImage
}) => {
  return (
    <div className="image-adjustments">
      <h3 className="adjustments-title">⚙️ Ajustes</h3>
      
      <div className="adjustment-group">
        <div className="adjustment-header">
          <label htmlFor="brightness">☀️ Brilho</label>
          <span className="adjustment-value">{brightness.toFixed(1)}</span>
        </div>
        <input
          type="range"
          id="brightness"
          min="0"
          max="3"
          step="0.1"
          value={brightness}
          onChange={(e) => onBrightnessChange(parseFloat(e.target.value))}
          disabled={!hasImage || isProcessing}
          className="slider"
        />
        <div className="adjustment-labels">
          <span>Escuro</span>
          <span className="center-label">Normal (1.0)</span>
          <span>Claro</span>
        </div>
      </div>

      <div className="adjustment-group">
        <div className="adjustment-header">
          <label htmlFor="contrast">🎨 Contraste</label>
          <span className="adjustment-value">{contrast.toFixed(1)}</span>
        </div>
        <input
          type="range"
          id="contrast"
          min="0"
          max="3"
          step="0.1"
          value={contrast}
          onChange={(e) => onContrastChange(parseFloat(e.target.value))}
          disabled={!hasImage || isProcessing}
          className="slider"
        />
        <div className="adjustment-labels">
          <span>Baixo</span>
          <span className="center-label">Normal (1.0)</span>
          <span>Alto</span>
        </div>
      </div>

      <div className="adjustment-info">
        <div className="info-item">
          <strong>💡 Dicas:</strong>
          <ul>
            <li>1.0 = valor original</li>
            <li>{'<'} 1.0 = reduz o efeito</li>
            <li>{'>'} 1.0 = aumenta o efeito</li>
          </ul>
        </div>
      </div>

      <div className="adjustment-buttons">
        <button
          onClick={onReset}
          disabled={!hasImage || isProcessing || (brightness === 1.0 && contrast === 1.0)}
          className="btn btn-secondary"
        >
          🔄 Resetar
        </button>
        <button
          onClick={onProcess}
          disabled={!hasImage || isProcessing}
          className="btn btn-primary"
        >
          {isProcessing ? (
            <>
              <span className="btn-spinner"></span>
              Processando...
            </>
          ) : (
            <>✨ Aplicar Ajustes</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageAdjustments;
