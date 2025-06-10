import Link from "next/link";
import React, {useEffect, useState} from "react";
import {getUserDetails} from "../src/helper";
import {images} from "../constant";
import {toast} from "react-toastify";
import APIService from "../src/api/API";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ConfirmationModal from "../src/components/ConfirmationModal";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import AdminDetailsUpdateModal from "../src/components/AdminDetailsUpdateModal";
import UpdatePasswordModal from "../src/components/UpdatePasswordModal";

const api = new APIService();
const cookies = new Cookies();

const App = () => {
  const  router = useRouter()
  const [deactivatedData, setDeactivatedData] = useState({
    deactivatedUsers: [], deactivatedPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userDetails, setUserDetails] = useState(getUserDetails());
  const [showPasswordModal, setShowPasswordModal] = useState(false);


  const handleSave = () => {
    setUserDetails(getUserDetails());
  };

  const handleLogout = () => {
    router.push("/login");
    cookies.remove("user_token");
    cookies.remove("user_info");
  };

  useEffect(() => {
    api.getDeactivatedData()
      .then((response) => {
        setDeactivatedData(response);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error fetching data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (<div className="container mt-4 settings">
    <h1>Your Role: <span className="text-primary">{userDetails?.role}</span></h1>

    <div className="row">
      {/* Left Section - Blacklisted Users & Removed Posts */}
      <div className="col-lg-6">
        <div>
          <h5 className="mb-2">Users You Made Blacklisted</h5>
          <div className="scroll-container">
            <h4 className="list-header">User ID</h4>
            <div className="scrollable-list">
              {loading ?
                ([...Array(8)].map((_, index) => (<Skeleton key={index} height={30}/>))) :
                deactivatedData.deactivatedUsers.length > 0 ?
                  (deactivatedData.deactivatedUsers.map((user) =>
                    (<Link key={user._id} href={`/users/${user._id}`}>
                      ID: {user._id}
                    </Link>))) :
                  (<p className="text-muted">No deactivated users found.</p>)}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h5>Posts You Removed from Platform</h5>
          <div className="scroll-container">
            <h4 className="list-header">Post ID</h4>
            <div className="scrollable-list">
              {loading ?
                ([...Array(8)].map((_, index) => (
                  <Skeleton key={index} height={30}/>))) :
                deactivatedData.deactivatedPosts.length > 0 ?
                  (deactivatedData.deactivatedPosts.map((post) =>
                    (<Link key={post._id} href={`/post/${post.postId}`}>
                      ID: {post.postId}
                    </Link>))) :
                  (<p className="text-muted">No deactivated posts found.</p>)}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Admin Profile */}
      <div className="col-lg-6 mt-2 mt-lg-0">
        <div className="admin-profile">
          <h3 className="fw-semibold text-center">Account Details</h3>
          <div className="text-center p-3">
            <button
              className="btn-danger logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
            <img src={userDetails?.image || images.default.default.src} alt="Admin" className="profile-pic mb-3"/>

            <div className="profile-info text-start mt-2">
              <label className="fw-medium my-1">Name</label>
              <div className="profile-field">{userDetails?.name}</div>

              <label className="fw-medium my-1">Email</label>
              <div className="profile-field">{userDetails?.email}</div>

              <label className="fw-medium my-1">Permission</label>
              <div className="profile-field text-capitalize">{userDetails?.permission}</div>
            </div>

            {/* Buttons Section */}
            <div className="mt-4 d-flex justify-content-between">
              <button className="btn" onClick={() => setShowUpdateModal(true)}>
                Update Details
              </button>
              <button className="btn" onClick={() => setShowPasswordModal(true)}>
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Confirmation Modal */}
    <ConfirmationModal
      show={showLogoutModal}
      onHide={() => setShowLogoutModal(false)}
      title={"Logout"}
      message={"Are you sure you want to logout?"}
      confirmButtonText="Yes"
      cancelButtonText="No"
      onConfirm={handleLogout}
      onCancel={() => {
        setShowLogoutModal(false);
      }}
    />

    {showUpdateModal &&
      <AdminDetailsUpdateModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        adminData={userDetails}
        onSave={handleSave}
      />
    }

    {showPasswordModal &&
      <UpdatePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      />
    }

  </div>);
};

export default App;
