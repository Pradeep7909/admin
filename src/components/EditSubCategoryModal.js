import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ImageCropper from "../components/ImageCropper";
import APIService from "../api/API";
import { toast } from "react-toastify";

const api = new APIService();

const EditSubcategoryModal = ({ show, onHide, subcategory, categoryId, onSave }) => {
  const [name, setName] = useState(subcategory?.name || "");
  const [image, setImage] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState(subcategory?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setCropperOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Subcategory name is required.");
      return;
    }
    if (!image && !tempImage) {
      toast.error("Subcategory image is required.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryId", categoryId);
    if (image) formData.append("image", image);

    const apiCall = subcategory
      ? api.updateSubcategory(subcategory._id, formData)
      : api.createSubcategory(formData);

    apiCall
      .then(() => {
        setIsLoading(false);
        onSave();
        onHide();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response?.data?.error || "Error saving subcategory");
      });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{subcategory ? "Edit Subcategory" : "Add Subcategory"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Subcategory Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Subcategory Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                onClick={(e) => {
                  e.target.value = null;
                }}
              />
            </Form.Group>

            {/* Show image preview */}
            {(tempImage || image) && (
              <div className="mt-3 text-center">
                <img
                  src={tempImage || URL.createObjectURL(image)}
                  alt="Subcategory Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px", objectFit: "contain" }}
                />
              </div>
            )}
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

      {cropperOpen && (
        <ImageCropper
          hideModal={() => setCropperOpen(false)}
          setImage={(croppedFile) => {
            setImage(croppedFile);
            setTempImage(URL.createObjectURL(croppedFile));
          }}
          showModal={cropperOpen}
          imagePath={selectedFile ? URL.createObjectURL(selectedFile) : null}
          aspectRatio={1}
        />
      )}
    </>
  );
};

export default EditSubcategoryModal;
