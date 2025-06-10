import React, {useState, useEffect, useCallback} from "react";
import APIService from "../src/api/API";
import Pagination from "../src/components/Pagination";
import {debounce} from "lodash"; // Import debounce from lodash
import DatePicker from "react-datepicker"; // Import React Date Picker
import "react-datepicker/dist/react-datepicker.css"; // Import its CSS
import Skeleton from "react-loading-skeleton"; // Import Skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Import Skeleton CSS
import {useRouter} from "next/router";
import Link from "next/link";
import {toast} from "react-toastify";

const api = new APIService();

const Content = () => {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "", status: "", startDate: null, // Use null for DatePicker
    endDate: null, // Use null for DatePicker
  });
  const [pagination, setPagination] = useState({
    currentPage: 1, totalPages: 1, totalPosts: 0, limit: 20,
  });
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  // Fetch posts data
  const fetchPosts = async (page = 1) => {
    setLoading(true); // Start loading
    try {
      const response = await api.searchPost({
        ...filters,
        startDate: filters.startDate
          ? filters.startDate.toLocaleDateString("en-CA") // Local YYYY-MM-DD
          : "",
        endDate: filters.endDate
          ? filters.endDate.toLocaleDateString("en-CA") // Local YYYY-MM-DD
          : "",
        page,
        limit: pagination.limit,
      });
      setPosts(response.posts);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching posts");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({...prev, [filterType]: value}));
    setPagination((prev) => ({...prev, currentPage: 1})); // Reset to page 1
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    fetchPosts(page);
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
      keyword: "", status: "", startDate: null, endDate: null,
    });
    setPagination((prev) => ({...prev, currentPage: 1})); // Reset to page 1
  };

  // Debounced keyword search
  const debouncedFetchPosts = useCallback(debounce(() => {
      fetchPosts(pagination.currentPage);
    }, 500), [filters]
  );

  // Fetch posts on component mount and filter change
  useEffect(() => {
    debouncedFetchPosts();
    return () => debouncedFetchPosts.cancel(); // Cleanup debounce
  }, [filters]); // Include pagination.currentPage in dependencies

  return (<div className="container mt-4 content">
    <h3 className="mb-2 fw-semibold">Total Posts</h3>

    {/* Filters and Search */}
    <div className="d-flex flex-wrap my-4">
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
        {["Active", "Inactive", "Paid", "Wrapped", "Deactivated"].map((filter, index) => (<button
          key={index}
          className={`filter-btn px-2 ${filters.status === filter.toLowerCase() ? "active" : ""}`}
          onClick={() => handleFilterChange("status", filter.toLowerCase())}
        >
          {filter}
        </button>))}
      </div>
    </div>

    {/* Date Selector and Reset Button */}
    <div className="d-flex justify-content-between align-items-center mb-4 col-lg-10">
      {/* Date Inputs */}
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span>Date from</span>
        <DatePicker
          selected={filters.startDate}
          onChange={(date) => handleFilterChange("startDate", date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select start date"
          className="form-control w-auto"
        />
        <span>To</span>
        <DatePicker
          selected={filters.endDate}
          onChange={(date) => handleFilterChange("endDate", date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select end date"
          className="form-control w-auto"
        />
      </div>

      {/* Reset Button */}
      <button className="btn btn-outline-secondary" onClick={handleReset}>
        Reset
      </button>
    </div>

    <hr/>

    {/* Posts Grid */}
    {loading ? (// Skeleton Loader
      <div className="d-flex flex-wrap gap-3 post-container py-2">
        {Array.from({length: 12}).map((_, index) => (<div key={index} className="post-view text-center">
          <Skeleton height={150} width={150}/>
          <hr className="my-0"/>
          <Skeleton height={20} width={120} className="mt-2"/>
          <Skeleton height={16} width={80} className="mb-2"/>
        </div>))}
      </div>) : posts.length > 0 ? (// Actual Posts
      <div className="d-flex flex-wrap gap-3 post-container py-2">
        {posts.map((post) => (<Link key={post._id} href={`/post/${post.postId}`} passHref>
          <div className="post-view text-center text-black" style={{cursor: "pointer"}}>
            <img
              src={post.productImage}
              alt={post.itemName}
              className="post-img"
            />
            <hr className="my-0"/>
            <h6 className="mt-2 mb-0 px-1">{post.itemName}</h6>
            <p className="mb-2">Price: Rs{post.price}</p>
          </div>
        </Link>))}
      </div>) : (// No Posts Found
      <div className="text-center py-5 text-muted">
        <h5>No posts found for selected filters</h5>
      </div>)}

    <hr/>
    {/* Pagination */}
    <div className="d-flex justify-content-center align-items-center pb-5 position-relative">
      <h6 className="post-per-page">20 Posts per page</h6>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  </div>);
};

export default Content;
