import React from "react";
import {Modal, Spinner} from "react-bootstrap";

const ConfirmationModal = ({
                             show,
                             onHide,
                             title = "Confirmation",
                             message = "Are you sure?",
                             confirmButtonText = "Confirm",
                             cancelButtonText = "Cancel",
                             onConfirm,
                             onCancel,
                             loading = false,
                           }) => {
  return (
    <Modal show={show} onHide={onHide} centered keyboard={true}>
      <div className="modal-content p-3">
        <Modal.Header className="border-0">
          <Modal.Title className="h2 w-100 text-center">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <h6 className="mb-0">{message}</h6>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center border-0 gap-4">
          <button
            className="btn"
            onClick={onCancel}
          >
            {cancelButtonText}
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {confirmButtonText}
              </>
            ) : (
              confirmButtonText
            )}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
