import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import APIService from "../../src/api/API";
import "bootstrap/dist/css/bootstrap.min.css";
import { formatDateTime } from "../../src/helper";
import { images } from "../../constant";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeactivateModal from "../../src/components/DeactivateModal";
import ImageModal from "../../src/components/ImageModal";
import {toast} from "react-toastify";

const api = new APIService();

export const getPostStatus = (clubStatus, expiryAt, deletedAt) => {
  if (deletedAt) return "Group Inactive";
  if (clubStatus === "Wrap") return "Deal Wrapped";
  if (clubStatus === "Inactive") return "Group Inactive";
  if (expiryAt && new Date(expiryAt) < new Date()) return "Group Inactive";
  return null;
};

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);

  // Function to fetch post data
  const fetchPostData = () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    api
      .getSinglePost(id)
      .then((response) => {
        if (response.success) {
          setPost(response.data);
          setModalImages(response.data.productImages);
        } else {
          setError("Post not found.");
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error fetching post details.");
        setError("Error fetching post details. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.productImages.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + post.productImages.length) % post.productImages.length
    );
  };

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!loading && !post) return <div className="alert alert-warning mt-4">No post found.</div>;

  const postStatus = post ? getPostStatus(post.clubStatus, post.expiryAt, post.deletedAt) : null;

  return (
    <div className="container-fluid post-details mt-4 pb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Post Details</h3>
        {loading ? (
          <Skeleton width={150} height={40}/>
        ) : (
          <button className="btn btn-danger" onClick={() => setShowModal(true)} disabled={postStatus}>
            Deactivate Post
          </button>
        )}
      </div>


      {postStatus && <div className="alert alert-info text-center">Status: {postStatus}</div>}
      <div className="row">
        <div className="col-md-4">
          <div className="image-wrapper text-center shadow-sm rounded">
            {loading ? (
              <Skeleton height={400} className="img-fluid"/>
            ) : (
              <>
                <img
                  src={post.productImages[currentImageIndex]}
                  alt={post.itemName}
                  className="post-image img-fluid cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                />
                {post.productImages.length > 1 && (
                  <>
                    <button className="btn-prev" onClick={handlePreviousImage}>
                      <img className="img-15 tint-white" src={images.chevron_left.default.src} alt="Previous"/>
                    </button>
                    <button className="btn-next" onClick={handleNextImage}>
                      <img className="img-15 tint-white" src={images.chevron_right.default.src} alt="Next"/>
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="col-md-8">
          <div className="p-4 shadow rounded">
            <h4 className="mb-3">{loading ? <Skeleton width={200}/> : post.itemName}</h4>
            <p className="detail"><strong>Post ID:</strong> {loading ? <Skeleton width={100}/> : post.postId}</p>
            <p className="detail"><strong>Price:</strong> {loading ? <Skeleton width={80}/> : `Rs ${post.price}/-`}</p>
            <p className="detail"><strong>Club Members Size:</strong> {loading ? <Skeleton width={50}/> : post.clubMembers}</p>
            <p className="detail"><strong>Club Members Joined:</strong> {loading ? <Skeleton width={50}/> : post.members.length}</p>
            <p className="detail"><strong>Post Created:</strong> {loading ? <Skeleton width={120}/> : formatDateTime(post.createdAt)}</p>
            <p className="detail"><strong>Post Expiry:</strong> {loading ? <Skeleton width={120}/> : formatDateTime(post.expiryAt)}</p>
            <p className="detail"><strong>Post Owner:</strong> {loading ? <Skeleton width={150}/> : `${post.postOwnerId?.firstName} ${post.postOwnerId?.lastName}`}</p>
            <p className="detail"><strong>Price division:</strong> {loading ? <Skeleton width={100}/> : post.price_type}</p>
            <p className="detail"><strong>Category:</strong> {loading ? <Skeleton width={100}/> : post.category?.name}</p>
            <p className="detail"><strong>Subcategory:</strong> {loading ? <Skeleton width={100}/> : post.subCategory?.name}</p>
            <p className="detail"><strong>Offer Type:</strong> {loading ? <Skeleton width={100}/> : post.offerType}</p>
            <p className="detail"><strong>Store Location:</strong> {loading ? <Skeleton width={150}/> : post.store_location?.name}</p>
            <p className="detail"><strong>Additional Information:</strong> {loading ? <Skeleton width={200}/> : post.additionalInformation}</p>
            {post?.deactivatedByAdmin && (<>
                <p className="detail"><strong>Deactivated by Admin:</strong> {post.deactivatedByAdmin.name}</p>
                <p className="detail"><strong>Deactivation Note:</strong> {post.deactivationNote}</p>
                <p className="detail"><strong>Deactivated At:</strong> {formatDateTime(post.deletedAt)}</p>
              </>
            )}
          </div>
          <div className="shadow rounded p-4 mt-4">
          <h5>{loading ? <Skeleton width={150}/> : `Group Members (${post.members.length}/${post.clubMembers})`}</h5>
            <hr className="border-2"/>
            {loading ? (
              <ul className="list-unstyled">
                {[1, 2, 3].map((_, index) => (
                  <li key={index} className="d-flex align-items-center">
                    <Skeleton circle width={40} height={40}/>
                    <Skeleton width={150} className="ms-2"/>
                  </li>
                ))}
              </ul>
            ) : post.members.length > 0 ? (
              <ul className="list-unstyled">
                {post.members.map((member) => (
                  <>
                    <li key={member._id} className="d-flex align-items-center">
                      <img src={member.avatar} alt={member.userName} className="member-avatar border"/>
                      <span>{member.firstName} {member.lastName} ({member.userName})</span>
                    </li>
                    <hr className="my-2"/>
                  </>
                ))}
              </ul>
            ) : (
              <p>No members in this group.</p>
            )}
          </div>
        </div>
      </div>

      <DeactivateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        id={id}
        type="post"
        onDeactivateSuccess={fetchPostData}
        title="Deactivate Post"
        message="Please select a reason for deactivating this post:"
      />
      {showImageModal && <ImageModal show={showImageModal} onClose={() => setShowImageModal(false)} modalImages={modalImages}/>}
    </div>
  );
};

export default PostDetails;
