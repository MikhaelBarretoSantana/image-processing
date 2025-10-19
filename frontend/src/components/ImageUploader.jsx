import React, { useCallback } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        alert('Por favor, selecione um arquivo de imagem válido.');
      }
    }
  }, [onImageUpload]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`image-uploader ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        accept="image/*"
        onChange={handleFileInput}
        disabled={isLoading}
        style={{ display: 'none' }}
      />
      
      <label htmlFor="file-input" className="upload-label">
        {isLoading ? (
          <>
            <div className="spinner"></div>
            <p>Fazendo upload...</p>
          </>
        ) : (
          <>
            <svg
              className="upload-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="upload-text">
              {isDragging
                ? 'Solte a imagem aqui'
                : 'Arraste uma imagem ou clique para selecionar'}
            </p>
            <p className="upload-hint">
              Formatos suportados: JPG, PNG, BMP, GIF
            </p>
          </>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
