import React, {useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton"; // Import Skeleton
import "react-loading-skeleton/dist/skeleton.css";
import APIService from "../../src/api/API";
import Pagination from "../../src/components/Pagination";
import {formatDateTime} from "../../src/helper"; // Custom Pagination
import {debounce} from "lodash";
import {toast} from "react-toastify";
import Link from "next/link"; // Import debounce from lodash

const api = new APIService();

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({keyword: "", status: ""});
  const [pagination, setPagination] = useState({currentPage: 1, totalPages: 1});

  // Debounced function for keyword search
  const debouncedFetchUsers = debounce(async (keyword, status, page) => {
    setLoading(true);
    try {
      const response = await api.getUsers({
        page, keyword, status,
      });
      setUsers(response.data);
      setPagination({
        currentPage: response.pagination.currentPage, totalPages: response.pagination.totalPages,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching categories");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, 500); // 500ms debounce delay

  // Fetch users when filters or pagination changes
  useEffect(() => {
    debouncedFetchUsers(filters.keyword, filters.status, pagination.currentPage);
  }, [filters, pagination.currentPage]);

  // Reset all filters
  const handleReset = () => {
    setFilters({
      keyword: "", status: ""
    });
    setPagination((prev) => ({...prev, currentPage: 1})); // Reset to page 1
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({...prev, [key]: value}));
    setPagination((prev) => ({...prev, currentPage: 1})); // Reset to page 1
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setPagination((prev) => ({...prev, currentPage: page}));
  };

  return (<div className="container users mt-4">
      <h3 className="mb-2 fw-semibold">Users</h3>

      {/* Filters and Search */}
      <div className="d-flex flex-wrap mt-4">
        {/* Search Input */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by keyword"
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
        />

        {/* Filters Label and Buttons */}
        <div className="d-flex gap-2 align-items-center">
          <h5 className="fw-semibold mb-0">Filters</h5>
          {["Paid", "Deactivated"].map((filter, index) => (<button
              key={index}
              className={`filter-btn px-2 ${filters.status === filter.toLowerCase() ? "active" : ""}`}
              onClick={() => handleFilterChange("status", filter.toLowerCase())}
            >
              {filter}
            </button>))}
        </div>
        {/* Reset Button */}
        <button className="btn btn-outline-secondary ms-auto" onClick={handleReset}>
          Reset
        </button>
      </div>
      <hr className="mb-2"/>

      {/* Loading State with Skeleton */}
      {loading ? (<div className="table-responsive">
          <table className="table table-striped">
            <thead>
            <tr>
              <th>Avatar</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Account Status</th>
              <th>Created At</th>
            </tr>
            </thead>
            <tbody>
            {[...Array(8)].map((_, index) => (<tr key={index}>
                <td>
                  <Skeleton circle width={40} height={40}/>
                </td>
                <td>
                  <Skeleton width={100}/>
                </td>
                <td>
                  <Skeleton width={150}/>
                </td>
                <td>
                  <Skeleton width={200}/>
                </td>
                <td>
                  <Skeleton width={100}/>
                </td>
                <td>
                  <Skeleton width={120}/>
                </td>
              </tr>))}
            </tbody>
          </table>
        </div>) : (<div className="table-responsive">
          <table className="table table-striped">
            <thead>
            <tr>
              <th>Avatar</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Account Status</th>
              <th>Created At</th>
            </tr>
            </thead>
            <tbody>
            {users.length > 0 ? (users.map((user) => (<tr key={user._id}>
                  <td>
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="rounded-circle img-40 border"
                    />
                  </td>
                  <td>
                    {user._id ? (<Link
                        href={`/users/${user._id}`}
                        className="text-primary fw-medium text-decoration-none"
                      >
                        {user._id}
                      </Link>) : ("N/A")}
                  </td>
                  <td>
                    {user.firstName || "N/A"} {user.lastName || ""}
                  </td>
                  <td>{user.email}</td>
                  <td>
                      <span
                        className={`badge ${user.deletedAt ? "bg-danger" : "bg-success"}`}
                      >
                        {user.deletedAt ? "Deactivated" : "Active"}
                      </span>
                  </td>
                  <td>{formatDateTime(user.createdAt)}</td>
                </tr>))) : (<tr>
                <td colSpan="6" className="text-center py-5">
                  No users found.
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>)}

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center pb-5 position-relative">
        <h6 className="post-per-page">10 Posts per page</h6>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>);
};

export default Users;
