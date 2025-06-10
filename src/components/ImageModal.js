import React, {useState, useEffect} from "react";
import {images} from "../../constant";

const ImageModal = ({show, onClose, modalImages = []}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!show) {
      setCurrentIndex(0);
    }
  }, [show]);

  if (!show) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? modalImages.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === modalImages.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
      <div className="modal image-modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">View Image</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="image-container">
                <img src={modalImages[currentIndex]} alt="Preview" className="single-image"/>
                {modalImages.length > 1 && (
                  <>
                    <button className="prev-btn" onClick={handlePrev}>
                      <img className="img-15 tint-white" src={images.chevron_left.default.src} alt="Previous"/>
                    </button>
                    <button className="next-btn" onClick={handleNext}>
                      <img className="img-15 tint-white" src={images.chevron_right.default.src} alt="Next"/>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default ImageModal;
