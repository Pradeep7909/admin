import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import APIService from "../api/API";
import { toast } from "react-toastify";
import { images } from "../../constant";

const api = new APIService();

const UpdatePasswordModal = ({ show, onHide }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSave = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    api
      .updateAdminPassword({ oldPassword, newPassword })
      .then(() => {
        toast.success("Password updated successfully.");
        onHide();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error updating password.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Old Password</Form.Label>
            <div className="input-group position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
              />
            </div>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>New Password</Form.Label>
            <div className="input-group position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="eye-button"
                onClick={togglePasswordVisibility}
              >
                <img
                  src={
                    showPassword
                      ? images.eye.default.src
                      : images.eye_off.default.src
                  }
                  alt="Toggle Password"
                  className="img-25"
                />
              </button>
            </div>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Confirm New Password</Form.Label>
            <div className="input-group position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Update Password"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdatePasswordModal;
