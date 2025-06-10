import React, {useState, useEffect} from "react";
import APIService from "../src/api/API";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const api = new APIService();

const PostStats = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPostStatsByCategory()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error fetching post stats.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid category-data mt-4 pb-4">
      <h3 className="py-2">Total posts created till date by categories:</h3>
      <div className="category-box mb-4">
        {loading ? (
          [...Array(11)].map((_, index) => (
            <Skeleton key={index} height={30} width={200} className="m-2"/>
          ))
        ) : (
          categories.map((category, index) => (
            <h5 key={index} className="p-2">
              <strong>{category.name}:</strong> {category.totalPosts}
            </h5>
          ))
        )}
      </div>

      <h3 className="py-2">Total paid posts created till date by categories:</h3>
      <div className="category-box">
        {loading ? (
          [...Array(11)].map((_, index) => (
            <Skeleton key={index} height={30} width={200} className="m-2"/>
          ))
        ) : (
          categories.map((category, index) => (
            <h5 key={index} className="p-2">
              <strong>{category.name}:</strong> {category.paidPosts}
            </h5>
          ))
        )}
      </div>
    </div>
  );
};

export default PostStats;
