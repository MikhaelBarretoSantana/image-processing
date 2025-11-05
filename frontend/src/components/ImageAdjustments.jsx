import React from 'react';
import './ImageAdjustments.css';

const ImageAdjustments = ({
  brightness,
  contrast,
  saturation,
  onBrightnessChange,
  onContrastChange,
  onSaturationChange,
  onProcess,
  onReset,
  onAutoAdjust,
  onApplyClahe,
  onApplySCurve,
  isProcessing,
  hasImage,
  hasProcessedImage,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const hasChanges = brightness !== 1.0 || contrast !== 1.0 || saturation !== 1.0 || hasProcessedImage;
  
  return (
    <div className="image-adjustments" role="region" aria-label="Controles de ajuste de imagem">
      <h3 className="adjustments-title">⚙️ Ajustes</h3>
      
      <div className="adjustment-group" role="group" aria-labelledby="brightness-label">
        <div className="adjustment-header">
          <label htmlFor="brightness" id="brightness-label">☀️ Brilho</label>
          <span className="adjustment-value" aria-live="polite">{brightness.toFixed(1)}</span>
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
          aria-label={`Ajustar brilho: ${brightness.toFixed(1)}`}
          aria-valuemin="0"
          aria-valuemax="3"
          aria-valuenow={brightness}
          aria-valuetext={`Brilho em ${brightness.toFixed(1)}`}
        />
        <div className="adjustment-labels" aria-hidden="true">
          <span>Escuro</span>
          <span className="center-label">Normal (1.0)</span>
          <span>Claro</span>
        </div>
      </div>

      <div className="adjustment-group" role="group" aria-labelledby="contrast-label">
        <div className="adjustment-header">
          <label htmlFor="contrast" id="contrast-label">🎨 Contraste</label>
          <span className="adjustment-value" aria-live="polite">{contrast.toFixed(1)}</span>
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
          aria-label={`Ajustar contraste: ${contrast.toFixed(1)}`}
          aria-valuemin="0"
          aria-valuemax="3"
          aria-valuenow={contrast}
          aria-valuetext={`Contraste em ${contrast.toFixed(1)}`}
        />
        <div className="adjustment-labels" aria-hidden="true">
          <span>Baixo</span>
          <span className="center-label">Normal (1.0)</span>
          <span>Alto</span>
        </div>
      </div>

      <div className="adjustment-group" role="group" aria-labelledby="saturation-label">
        <div className="adjustment-header">
          <label htmlFor="saturation" id="saturation-label">🎨 Saturação</label>
          <span className="adjustment-value" aria-live="polite">{saturation.toFixed(1)}</span>
        </div>
        <input
          type="range"
          id="saturation"
          min="0"
          max="3"
          step="0.1"
          value={saturation}
          onChange={(e) => onSaturationChange(parseFloat(e.target.value))}
          disabled={!hasImage || isProcessing}
          className="slider"
          aria-label={`Ajustar saturação: ${saturation.toFixed(1)}`}
          aria-valuemin="0"
          aria-valuemax="3"
          aria-valuenow={saturation}
          aria-valuetext={`Saturação em ${saturation.toFixed(1)}`}
        />
        <div className="adjustment-labels" aria-hidden="true">
          <span>P&B</span>
          <span className="center-label">Normal (1.0)</span>
          <span>Saturado</span>
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
        <div className="info-item">
          <strong>⌨️ Atalhos:</strong>
          <ul>
            <li>Ctrl+Enter = Aplicar</li>
            <li>Ctrl+Z = Desfazer</li>
            <li>Ctrl+Shift+Z / Ctrl+Y = Refazer</li>
            <li>Ctrl+A = Auto Ajuste</li>
            <li>Ctrl+H = Histograma</li>
            <li>Ctrl+S = Salvar</li>
          </ul>
        </div>
      </div>

      <div className="adjustment-buttons" role="group" aria-label="Ações de processamento">
        <div className="button-row">
          <button
            onClick={onUndo}
            disabled={!hasImage || isProcessing || !canUndo}
            className="btn btn-secondary btn-small"
            aria-label="Desfazer última operação"
            title="Desfazer (Ctrl+Z)"
          >
            ↶ Desfazer
          </button>
          <button
            onClick={onRedo}
            disabled={!hasImage || isProcessing || !canRedo}
            className="btn btn-secondary btn-small"
            aria-label="Refazer operação desfeita"
            title="Refazer (Ctrl+Shift+Z)"
          >
            ↷ Refazer
          </button>
          <button
            onClick={onReset}
            disabled={!hasImage || isProcessing || !hasChanges}
            className="btn btn-secondary btn-small"
            aria-label="Resetar todos os ajustes para valores padrão"
            title="Resetar ajustes"
          >
            🔄 Resetar
          </button>
        </div>
        
        <div className="button-row">
          <button
            onClick={onAutoAdjust}
            disabled={!hasImage || isProcessing}
            className="btn btn-secondary"
            aria-label="Aplicar ajuste automático baseado no histograma"
            title="Auto Ajuste (Ctrl+A)"
          >
            ✨ Auto Ajuste
          </button>
          <button
            onClick={onApplyClahe}
            disabled={!hasImage || isProcessing}
            className="btn btn-secondary"
            aria-label="Aplicar algoritmo CLAHE de equalização adaptativa"
            title="Aplicar CLAHE"
          >
            🔧 CLAHE
          </button>
          <button
            onClick={onApplySCurve}
            disabled={!hasImage || isProcessing}
            className="btn btn-secondary"
            aria-label="Aplicar curva S para ajuste de contraste"
            title="Aplicar Curva S"
          >
            📈 Curva S
          </button>
        </div>
        
        <button
          onClick={onProcess}
          disabled={!hasImage || isProcessing}
          className="btn btn-primary btn-full"
          aria-label={isProcessing ? "Processando imagem" : "Aplicar ajustes manuais"}
          aria-busy={isProcessing}
          title="Aplicar Ajustes (Ctrl+Enter)"
        >
          {isProcessing ? (
            <>
              <span className="btn-spinner" role="status" aria-label="Carregando"></span>
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
