import React, { useState, useEffect } from "react";
import Pagination from "../src/components/Pagination";
import APIService from "../src/api/API";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {formatDateTime} from "../src/helper";
import {toast} from "react-toastify";

const api = new APIService();

const App = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const getReportedPosts = (page = 1) => {
    setLoading(true);
    api
      .getReportedPosts({ page })
      .then((response) => {
        if (response.success) {
          setReports(response.data);
          setPagination({
            currentPage: response.pagination.currentPage,
            totalPages: response.pagination.totalPages,
          });
        } else {
          setReports([]);
        }
      })
      .catch((error) => {
          toast.error(error.response?.data?.error || "Error fetching reported posts");
          setReports([])
        }
      )
      .finally(() => setLoading(false));
  };

  const handlePageChange = (newPage) => {
    getReportedPosts(newPage);
  };

  useEffect(() => {
    getReportedPosts();
  }, []);

  return (
    <div className="container mt-4 reports">
      <div className="mb-4">
        <h5 className="bg-success text-white p-3 rounded-top text-center">
          List of All Reported Posts
        </h5>
        <table className="table table-striped">
          <thead>
          <tr>
            <th>Post ID</th>
            <th>Item Name</th>
            <th>Reported By</th>
            <th>Title</th>
            <th>Details</th>
            <th>Reported At</th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td><Skeleton width={100} height={20} /></td>
                <td><Skeleton width={100} height={20} /></td>
                <td className="d-flex align-items-center">
                  <Skeleton circle width={40} height={40} className="me-2" />
                  <Skeleton width={80} height={20} />
                </td>
                <td><Skeleton width={120} height={20} /></td>
                <td><Skeleton width={180} height={20} /></td>
                <td><Skeleton width={100} height={20} /></td>
              </tr>
            ))
          ) : reports.length > 0 ? (
            reports.map((post, index) => (
              <tr key={index}>
                <td>
                  {post.postId ? (<a href={`/post/${post.postId}`} className="text-primary fw-medium text-decoration-none">
                      {post.postId}
                    </a>) : ("N/A")}
                </td>
                <td>{post.itemName || "N/A"}</td>
                <td>
                  <img
                    src={post.user?.avatar}
                    alt="User Avatar"
                    className="img-40 rounded-circle me-2"
                  />
                  {post.user?.firstName} {post.user?.lastName}
                </td>
                <td>{post.title}</td>
                <td className="detail">{post.details}</td>
                <td>{formatDateTime(post.reportedAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-5">
                No reported posts found
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
      <hr className="border-2"/>

      <div className="d-flex justify-content-center align-items-center pb-5 position-relative">
        <h6 className="post-per-page">10 Posts per page</h6>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default App;
