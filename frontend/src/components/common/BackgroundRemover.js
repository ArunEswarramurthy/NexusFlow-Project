import React, { useRef, useState } from 'react';
import { Upload, Download } from 'lucide-react';

const BackgroundRemover = () => {
  const canvasRef = useRef(null);
  const [processedImage, setProcessedImage] = useState(null);

  const removeBackground = (imageFile) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple background removal (adjust threshold as needed)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // Remove white/light backgrounds
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0; // Make transparent
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    
    img.src = URL.createObjectURL(imageFile);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) removeBackground(file);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'removed-background.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500"
      >
        <Upload className="w-8 h-8 text-gray-400" />
        <span className="ml-2 text-gray-600">Upload Image</span>
      </label>
      
      <canvas ref={canvasRef} className="hidden" />
      
      {processedImage && (
        <div className="mt-4">
          <img src={processedImage} alt="Processed" className="max-w-full h-auto rounded-lg" />
          <button
            onClick={downloadImage}
            className="mt-2 flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;