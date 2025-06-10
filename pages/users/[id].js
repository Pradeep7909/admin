import React, {useState, useEffect} from "react";
import {useRouter} from "next/router";
import APIService from "../../src/api/API";
import "bootstrap/dist/css/bootstrap.min.css";
import {formatDateTime} from "../../src/helper";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeactivateModal from "../../src/components/DeactivateModal";
import {toast} from "react-toastify";

const api = new APIService();

// Helper function to handle null/undefined values
const displayValue = (value) => {
  return value !== null && value !== undefined ? value : "--";
};

const UserDetails = () => {
  const router = useRouter();
  const {id} = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to fetch user data
  const fetchUserData = () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    api
      .getSingleUser(id)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error fetching user details");
        setError("Error fetching user details. Please try again.");
      })
      .finally(() => {
        setLoading(false);
        setShowModal(false);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!loading && !user) return <div className="alert alert-warning mt-4">No user found.</div>;

  const userStatus = user?.deletedAt ? "Account has been deactivated" : null;

  return (
    <div className="container-fluid user-details mt-4 pb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>User Details</h3>
        {loading ? (
          <Skeleton width={150} height={40}/>
        ) : (
          <button className="btn btn-danger" onClick={() => setShowModal(true)} disabled={user.deletedAt}>
            Deactivate User
          </button>
        )}
      </div>
      {userStatus && <div className="alert alert-info text-center">Status: {userStatus}</div>}
      <div className="row">
        <div className="col-md-4">
          <div className="image-wrapper text-center shadow-sm rounded overflow-hidden">
            {loading ? (
              <Skeleton height={400} className="img-fluid"/>
            ) : (
              <img
                src={user.avatar || "https://via.placeholder.com/400"}
                alt={`${user.firstName} ${user.lastName}`}
                className="user-image img-fluid"
              />
            )}
          </div>
        </div>
        <div className="col-md-8">
          <div className="p-4 shadow rounded">
            <h4 className="mb-3">
              {loading ? (
                <Skeleton width={200}/>
              ) : (
                `${displayValue(user.firstName)} ${displayValue(user.lastName)}`
              )}
            </h4>
            <p className="detail">
              <strong>Username:</strong> {loading ? <Skeleton width={100}/> : displayValue(user.userName)}
            </p>
            <p className="detail">
              <strong>Email:</strong> {loading ? <Skeleton width={150}/> : displayValue(user.email)}
            </p>
            <p className="detail">
              <strong>Birthdate:</strong>{" "}
              {loading ? <Skeleton width={120}/> : displayValue(formatDateTime(user.birthdate))}
            </p>
            <p className="detail">
              <strong>Gender:</strong> {loading ? <Skeleton width={80}/> : displayValue(user.gender)}
            </p>
            <p className="detail">
              <strong>Home Location:</strong>{" "}
              {loading ? <Skeleton width={150}/> : displayValue(user.homelocation)}
            </p>
            <p className="detail">
              <strong>Phone Number:</strong>{" "}
              {loading ? <Skeleton width={100}/> : displayValue(user.phoneNumber)}
            </p>
            <p className="detail">
              <strong>Verification Status:</strong>{" "}
              {loading ? <Skeleton width={100}/> : displayValue(user.verificationStatus)}
            </p>
            <p className="detail">
              <strong>User Rating:</strong> {loading ? <Skeleton width={50}/> : displayValue(user.UserRating)}
            </p>
            <p className="detail">
              <strong>Bio:</strong> {loading ? <Skeleton width={200}/> : displayValue(user.bio)}
            </p>
            <p className="detail">
              <strong>Social Media Link:</strong>{" "}
              {loading ? <Skeleton width={200}/> : displayValue(user.SocialMediaLink)}
            </p>
            <p className="detail">
              <strong>Address:</strong>{" "}
              {loading ? <Skeleton width={200}/> : displayValue(user.address?.address_text)}
            </p>
            <p className="detail">
              <strong>Latitude:</strong>{" "}
              {loading ? <Skeleton width={100}/> : displayValue(user.address?.latitude)}
            </p>
            <p className="detail">
              <strong>Longitude:</strong>{" "}
              {loading ? <Skeleton width={100}/> : displayValue(user.address?.longitude)}
            </p>
            <p className="detail">
              <strong>Created At:</strong>{" "}
              {loading ? <Skeleton width={120}/> : displayValue(formatDateTime(user.createdAt))}
            </p>
            <p className="detail">
              <strong>Updated At:</strong>{" "}
              {loading ? <Skeleton width={120}/> : displayValue(formatDateTime(user.updatedAt))}
            </p>
            {user?.deactivatedByAdmin && (<>
                <p className="detail"><strong>Deactivated by Admin:</strong> {user.deactivatedByAdmin.name}</p>
                <p className="detail"><strong>Deactivation Note:</strong> {user.deactivationNote}</p>
                <p className="detail"><strong>Deactivated At:</strong> {formatDateTime(user.deletedAt)}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <DeactivateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        id={id}
        type="user"
        onDeactivateSuccess={fetchUserData}
        title="Deactivate User"
        message="Please select a reason for deactivating this user:"
      />
    </div>
  );
};

export default UserDetails;
