import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ImageCropper from "../components/ImageCropper";
import APIService from "../api/API";
import {toast} from "react-toastify";
import Cookies from "universal-cookie";

const api = new APIService();
const cookies = new Cookies();

const AdminDetailsUpdateModal = ({show, onHide, adminData, onSave}) => {
  const [name, setName] = useState(adminData?.name || "");
  const [email, setEmail] = useState(adminData?.email || "");
  const [image, setImage] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState(adminData?.image || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setCropperOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (image) formData.append("image", image);

    api
      .updateAdminDetails(formData)
      .then((response) => {
        toast.success("Admin details updated.");
        const adminDetails = JSON.stringify(response.admin);
        // Update user info cookie
        cookies.set("user_info", adminDetails, {
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        onSave();
        onHide();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error updating admin");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Admin Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange}/>
            </Form.Group>

            {(tempImage || image) && (
              <div className="mt-3 text-center">
                <img
                  src={image ? URL.createObjectURL(image) : tempImage}
                  alt="Profile Preview"
                  className="img-fluid rounded"
                  style={{maxHeight: "150px", objectFit: "contain"}}
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isLoading}>
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

export default AdminDetailsUpdateModal;
