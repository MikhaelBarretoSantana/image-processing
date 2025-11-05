import React, { useEffect, useRef } from 'react';
import './Histogram.css';

const Histogram = ({ data, title = "Histograma" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const isRGB = data.red && data.green && data.blue;
    const isGray = data.gray;

    if (isRGB) {
      const maxValue = Math.max(
        ...data.red,
        ...data.green,
        ...data.blue
      );

      drawChannel(ctx, data.red, maxValue, 'rgba(255, 0, 0, 0.5)', width, height);
      drawChannel(ctx, data.green, maxValue, 'rgba(0, 255, 0, 0.5)', width, height);
      drawChannel(ctx, data.blue, maxValue, 'rgba(0, 0, 255, 0.5)', width, height);
    } else if (isGray) {
      const maxValue = Math.max(...data.gray);
      drawChannel(ctx, data.gray, maxValue, 'rgba(100, 100, 100, 0.7)', width, height);
    }

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 1);
    ctx.lineTo(width, height - 1);
    ctx.stroke();

  }, [data]);

  const drawChannel = (ctx, channelData, maxValue, color, width, height) => {
    if (!channelData || channelData.length === 0) return;

    const barWidth = width / channelData.length;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, height);

    channelData.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = (value / maxValue) * (height - 10);
      const y = height - barHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  };

  if (!data) {
    return (
      <div className="histogram-container">
        <div className="histogram-header">
          <h3>{title}</h3>
        </div>
        <div className="histogram-empty">
          <p>Nenhum dado de histograma disponível</p>
        </div>
      </div>
    );
  }

  const isRGB = data.red && data.green && data.blue;

  return (
    <div className="histogram-container">
      <div className="histogram-header">
        <h3>{title}</h3>
        {isRGB && (
          <div className="histogram-legend">
            <span className="legend-item red">🔴 Vermelho</span>
            <span className="legend-item green">🟢 Verde</span>
            <span className="legend-item blue">🔵 Azul</span>
          </div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="histogram-canvas"
      />
      <div className="histogram-footer">
        <span>0</span>
        <span>127</span>
        <span>255</span>
      </div>
    </div>
  );
};

export default Histogram;
