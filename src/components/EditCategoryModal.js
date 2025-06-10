import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ImageCropper from "../components/ImageCropper";
import APIService from "../api/API";
import {toast} from "react-toastify";

const api = new APIService();

const EditCategoryModal = ({ show, onHide, category, onSave }) => {
  const [name, setName] = useState(category?.name || "");
  const [image, setImage] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState(category?.image || null);
  const [isPremium, setIsPremium] = useState(category?.isPremium || false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the selected file for cropping
    setSelectedFile(file);
    setCropperOpen(true);
  };


  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    if (!image && !tempImage) {
      toast.error("Category image is required.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("isPremium", isPremium);
    if (image) formData.append("image", image);

    const request = category
      ? api.updateCategory(category._id, formData)
      : api.createCategory(formData);

    request
      .then(() => {
        onSave();
        onHide();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response?.data?.error || "Error saving category");
      });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{category ? "Edit Category" : "Add Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Category Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>

            {/* Show image preview */}
            {(tempImage || image) && (
              <div className="mt-3 text-center">
                <img
                  src={image || tempImage}
                  alt="Category Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px", objectFit: "contain" }}
                />
              </div>
            )}

            <Form.Group className="mt-3">
              <Form.Check
                type="checkbox"
                label="Premium Category"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-cancel" onClick={onHide}>
            Cancel
          </Button>
          <Button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Cropper Modal */}
      {cropperOpen && (<ImageCropper
        hideModal={() => setCropperOpen(false)}
        setImage={(croppedFile) => {
          setImage(croppedFile); // Store the cropped file
          setTempImage(URL.createObjectURL(croppedFile)); // Generate preview
        }}
        showModal={cropperOpen}
        imagePath={selectedFile ? URL.createObjectURL(selectedFile) : null}
        aspectRatio={1}
      />)}
    </>
  );
};

export default EditCategoryModal;
