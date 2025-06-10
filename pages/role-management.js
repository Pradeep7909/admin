import React, {useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import APIService from "../src/api/API";
import {formatDateTime, getUserDetails} from "../src/helper";
import Pagination from "../src/components/Pagination";
import {images} from "../constant";
import AdminModal from "../src/components/AdminModal";
import ConfirmationModal from "../src/components/ConfirmationModal";
import {toast} from "react-toastify";

const api = new APIService();

const AdminManagement = () => {
  const userDetails = getUserDetails();
  const hasPermission = userDetails?.role === "Owner";
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({status: "all"}); // Default status is "all"
  const [pagination, setPagination] = useState({currentPage: 1, totalPages: 1});
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [currentAdmin, setCurrentAdmin] = useState(null); // Admin being edited
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null); // Store the item to delete/restore
  const [loadingAction, setLoadingAction] = useState(false);

  const fetchAdmins = async (status, page) => {
    setLoading(true);
    try {
      const response = await api.getAdmins({
        page, status: status === "all" ? "" : status, // Pass empty string for "All"
      });
      setAdmins(response.admins);
      setPagination({
        currentPage: response.currentPage, totalPages: response.totalPages,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching admins");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admins when filters or pagination changes
  useEffect(() => {
    fetchAdmins(filters.status, pagination.currentPage);
  }, [filters, pagination.currentPage]);

  // Function to handle deactivate/restore action
  const handleDeactivateOrRestore = (item) => {
    setDeleteItem({...item});
    setShowDeleteModal(true);
  };

  const openModal = (admin = null) => {
    setCurrentAdmin(admin); // Set the admin being edited (null for adding)
    setShowModal(true); // Show the modal
  };

  const handleSaveSuccess = () => {
    fetchAdmins(filters.status, pagination.currentPage); // Refresh the admin list
  };

  // Handle filter changes
  const handleFilterChange = (status) => {
    setFilters({status});
    setPagination((prev) => ({...prev, currentPage: 1})); // Reset to page 1
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setPagination((prev) => ({...prev, currentPage: page}));
  };

  const confirmDeactivateOrRestore = () => {
    if (!deleteItem) return;
    setLoadingAction(true);
    const isDeactivate = !deleteItem.deletedAt;
    const action = isDeactivate ? api.deactivateAdmin(deleteItem._id) : api.restoreAdmin(deleteItem._id)


    action
      .then(() => {
        setShowDeleteModal(false);
        setDeleteItem(null);
        handleSaveSuccess();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error in status update");
      })
      .finally(() => {
        setLoadingAction(false);
      });
  };

  return (<div className="container admins mt-4">
    <h3 className="mb-2 fw-semibold">Admin Management</h3>

    {/* Filters and Add Admin Button */}
    <div className="d-flex flex-wrap mt-4">
      {/* Filters Label and Buttons */}
      <div className="d-flex gap-2 align-items-center">
        <h5 className="fw-semibold mb-0">Filters</h5>
        {["All", "Active", "Deactivated"].map((filter, index) => (<button
          key={index}
          className={`filter-btn px-2 ${filters.status === filter.toLowerCase() || (filter === "All" && filters.status === "") ? "active" : ""}`}
          onClick={() => handleFilterChange(filter.toLowerCase())}
        >
          {filter}
        </button>))}
      </div>

      {/* Add Admin Button */}
      {hasPermission && <button className="btn btn-outline-secondary ms-auto" onClick={() => openModal()}>
        Add Admin
      </button>}
    </div>
    <hr className="mb-2"/>

    {/* Loading State with Skeleton */}
    {loading ? (<div className="table-responsive">
      <table className="table table-striped">
        <thead>
        <tr>
          <th>Profile</th>
          <th>Name</th>
          <th>Role</th>
          <th>Permission</th>
          <th>Status</th>
          <th>Created At</th>
          {hasPermission && <th>Actions</th>}
        </tr>
        </thead>
        <tbody>
        {[...Array(8)].map((_, index) => (<tr key={index}>
          <td>
            <Skeleton circle width={40} height={40}/>
          </td>
          <td>
            <Skeleton width={150}/>
          </td>
          <td>
            <Skeleton width={100}/>
          </td>
          <td>
            <Skeleton width={100}/>
          </td>
          <td>
            <Skeleton width={100}/>
          </td>
          <td>
            <Skeleton width={120}/>
          </td>
          {hasPermission && <td>
            <Skeleton width={80}/>
          </td>}
        </tr>))}
        </tbody>
      </table>
    </div>) : (<div className="table-responsive">
      <table className="table table-striped">
        <thead>
        <tr>
          <th>Profile</th>
          <th>Name</th>
          <th>Role</th>
          <th>Permission</th>
          <th>Status</th>
          <th>Created At</th>
          {hasPermission && <th>Action</th>}
        </tr>
        </thead>
        <tbody>
        {admins.length > 0 ? (admins.map((admin) => (<tr key={admin._id}>
          <td>
            <img
              src={admin.image || images.default.default.src}
              alt="profile"
              className="rounded-circle img-40 border"
            />
          </td>
          <td className="text-capitalize">{admin.name}</td>
          <td>{admin.role}</td>
          <td className="text-capitalize">{admin.permission}</td>
          <td>
                      <span
                        className={`badge ${admin.deletedAt ? "bg-danger" : "bg-success"}`}
                      >
                        {admin.deletedAt ? "Deactivated" : "Active"}
                      </span>
          </td>
          <td>{formatDateTime(admin.createdAt)}</td>
          {hasPermission && <td>
            {userDetails?._id === admin._id ? (<span className="badge bg-purple">You</span>) : (<>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => openModal(admin)} // Open modal for editing
              >
                Edit
              </button>
              <button
                className={`ms-3 btn ${admin.deletedAt ? "btn-success" : "btn-danger"}`}
                onClick={() => handleDeactivateOrRestore(admin)}
              >
                {admin.deletedAt ? "Restore" : "Deactivate"}
              </button>
            </>)}
          </td>}
        </tr>))) : (<tr>
          <td colSpan="7" className="text-center py-5">
            No admins found.
          </td>
        </tr>)}
        </tbody>
      </table>
    </div>)}

    {/* Pagination */}
    <div className="d-flex justify-content-center align-items-center pb-5 position-relative">
      <h6 className="post-per-page">10 Admins per page</h6>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>

    {/* Admin Modal */}
    {showModal && <AdminModal
      show={showModal}
      onHide={() => setShowModal(false)}
      admin={currentAdmin}
      onSave={handleSaveSuccess}
    />}

    {/* Confirmation Modal */}
    <ConfirmationModal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      title={deleteItem?.deletedAt ? "Restore" : "Deactivate"}
      message={deleteItem ? `Are you sure you want to ${deleteItem.deletedAt ? "restore" : "deactivate"} ${deleteItem.name}?` : "Are you sure?"}
      confirmButtonText={deleteItem?.deletedAt ? "Restore" : "Deactivate"}
      cancelButtonText="Cancel"
      onConfirm={confirmDeactivateOrRestore}
      onCancel={() => {
        setShowDeleteModal(false);
        setDeleteItem(null);
      }}
      loading={loadingAction}
    />

  </div>);
};

export default AdminManagement;
