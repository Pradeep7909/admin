import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import APIService from "../api/API";
import {toast} from "react-toastify";

const api = new APIService();

const AdminModal = ({show, onHide, admin, onSave}) => {
  // Form state
  const [name, setName] = useState(admin?.name || "");
  const [role, setRole] = useState(admin?.role || "");
  const [permission, setPermission] = useState(admin?.permission || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [password, setPassword] = useState(""); // Only for adding
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSave = () => {
    if (!name.trim() || !role.trim() || !permission.trim() || !email.trim()) {
      toast.error("All fields are required.");
      return;
    }

    if (!admin && !password.trim()) {
      toast.error("Password is required for new admins.");
      return;
    }

    setIsLoading(true);

    const adminData = {
      name, role, permission, email, password: admin ? undefined : password, // Only include password for new admins
    };

    const request = admin ? api.updateAdmin(admin._id, adminData) // Update existing admin
      : api.createAdmin(adminData); // Create new admin

    request
      .then(() => {
        onSave(); // Refresh admin list
        onHide(); // Close modal
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response?.data?.error || "Error saving admin");
      });
  };

  return (<Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>{admin ? "Edit Admin" : "Add Admin"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </Form.Group>

        {/* Role */}
        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select role</option>
            <option value="Owner">Owner</option>
            <option value="Manager">Manager</option>
          </Form.Select>
        </Form.Group>

        {/* Permission */}
        <Form.Group className="mb-3">
          <Form.Label>Permission</Form.Label>
          <Form.Select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            <option value="">Select permission</option>
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </Form.Select>
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            disabled={!!admin} // Disable email field when editing
          />
        </Form.Group>

        {/* Password (only for adding) */}
        {!admin && (<Form.Group className="mb-3 position-relative">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </Form.Group>)}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" className="btn-cancel" onClick={onHide}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </Modal.Footer>
  </Modal>);
};

export default AdminModal;
