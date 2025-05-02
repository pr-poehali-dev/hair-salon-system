
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Main image */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <img
          src={images[activeImage]}
          alt={`${title} - изображение ${activeImage + 1}`}
          className="w-full h-96 object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`w-20 h-20 border rounded overflow-hidden flex-shrink-0 transition-all ${
                activeImage === index 
                  ? "ring-2 ring-primary border-transparent" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${title} - thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
