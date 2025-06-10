import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({
                        showModal,
                        hideModal,
                        setImage,
                        imagePath,
                        aspectRatio = 1,
                        headerText = "Crop Image"
                      }) => {
  const [cropper, setCropper] = useState();

  const getCropData = (e) => {
    e.preventDefault();
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (!blob) return;

        // Convert Blob to File
        const file = new File([blob], "cropped-image.png", { type: "image/png" });

        setImage(file); // Send the File object to parent component
        hideModal();
      }, "image/png");
    }
  };





  console.log("imagePath", imagePath)

  return (
    <Modal show={showModal} className="image-cropper-modal" aria-labelledby="image-cropper-modal" scrollable style={{ zIndex: 9999 }}>
      <Modal.Header className="p-3">
        <Modal.Title as="h4" className="fw-medium">{headerText}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">
        <div className="col-12 form-details">
          <Cropper
            key={imagePath} // Force re-render when imagePath changes
            src={imagePath || ""} // Ensure imagePath is set, or provide an empty string
            onInitialized={(instance) => setCropper(instance)}
            background={false}
            zoomable={false}
            aspectRatio={aspectRatio}
            preview=".img-preview"
            guides={false}
            viewMode={1}
            dragMode="move"
            cropBoxMovable
          />
        </div>
        <hr/>
        <div className="d-flex justify-content-end gap-2 flex-row">
          <button onClick={hideModal} className="btn btn-cancel">Cancel</button>
          <button onClick={getCropData} className="btn btn-primary">Crop</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImageCropper;
