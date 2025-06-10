import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import APIService from "../api/API";
import { toast } from "react-toastify";
import { images } from "../../constant";

const api = new APIService();

const ForgotPasswordModal = ({ show, onHide }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = email step, 2 = otp + password step

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleEmailSubmit = () => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    setIsLoading(true);
    api
      .sendVerificationCode({ email })
      .then(() => {
        toast.success("Verification code sent to your email.");
        setStep(2); // Move to OTP + password step
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error sending verification code.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleResetPassword = () => {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    api
      .verifyOtpAndResetPassword({ email, otp, newPassword })
      .then(() => {
        toast.success("Password reset successfully.");
        onHide();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error resetting password.");
      })
      .finally(() => setIsLoading(false));
  };


  const resetState = () => {
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setIsLoading(false);
    setStep(1);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        resetState();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 1 ? "Forgot Password" : "Verify OTP & Reset Password"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {step === 1 && (
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>
          )}

          {step === 2 && (
            <>
              <Form.Group>
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to your email"
                />
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
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        {step === 1 ? (
          <Button variant="primary" onClick={handleEmailSubmit} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleResetPassword} disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ForgotPasswordModal;
