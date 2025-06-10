import React, { useState } from "react";
import APIService from "../../src/api/API";
import { toast } from "react-toastify";

const api = new APIService();

const DeactivateModal = ({
                           show,
                           onClose,
                           id, // Generic ID (can be postId or userId)
                           type, // "post" or "user" to differentiate
                           onDeactivateSuccess,
                           title = "Confirm Action",
                           message = "Are you sure?",
                         }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = ["Spam", "Inappropriate Content", "Other"];

  const handleConfirm = () => {
    if (!selectedReason) return;

    const finalNote = selectedReason === "Other" ? otherReason.trim() : selectedReason;
    if (!finalNote) return;

    setLoading(true);

    // Determine the API call based on the type (post or user)
    const apiCall = type === "post" ? api.deactivatePost : api.deactivateUser;

    apiCall(id, { note: finalNote }) // Use the appropriate API call
      .then(() => {
        toast.success(`${type === "post" ? "Post" : "User"} Deactivated Successfully`);
        onDeactivateSuccess(); // Trigger data refresh
        onClose(); // Close modal
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || `Error in deactivating ${type}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>
            <div className="modal-body">
              <p className="fw-medium">{message}</p>

              <select
                className="form-select mb-3"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                disabled={loading}
              >
                <option value="">Select Reason</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {selectedReason === "Other" && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter reason"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  disabled={loading}
                />
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirm}
                disabled={
                  loading ||
                  !selectedReason ||
                  (selectedReason === "Other" && !otherReason.trim())
                }
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default DeactivateModal;
