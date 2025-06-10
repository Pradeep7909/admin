import React, {useState, useEffect} from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import APIService from "../src/api/API";
import ConfirmationModal from "../src/components/ConfirmationModal";
import EditSubcategoryModal from "../src/components/EditSubCategoryModal";
import EditCategoryModal from "../src/components/EditCategoryModal";
import {toast} from "react-toastify";
import {formatDateTime} from "../src/helper";
import FullScreenLoader from "../src/components/FullScreenLoader";

const api = new APIService();

const CategoryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null); // Store the item to delete/restore
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditSubcategoryModal, setShowEditSubcategoryModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [editItem, setEditItem] = useState(null); // Store the item to edit
  const [loadingAction, setLoadingAction] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    api
      .getCategories()
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0]._id);
        }
        setLoading(false);
        setShowSpinner(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error fetching categories");
        setLoading(false);
        setShowSpinner(false);
      });
  };

  // Get the selected category details
  const selectedCategoryDetails = categories?.find(
    (category) => category._id === selectedCategory
  );

  // Function to handle deactivate/restore action
  const handleDeactivateOrRestore = (item, type) => {
    setDeleteItem({...item, type}); // Store item and its type (category or subcategory)
    setShowDeleteModal(true); // Show the confirmation modal
  };

  // Function to confirm deactivate/restore
  const confirmDeactivateOrRestore = () => {
    if (!deleteItem) return;
    setLoadingAction(true);
    const isDeactivate = !deleteItem.deletedAt;
    const action = isDeactivate
      ? deleteItem.type === "Category"
        ? api.deactivateCategory(deleteItem._id)
        : api.deactivateSubcategory(deleteItem._id)
      : deleteItem.type === "Category"
        ? api.restoreCategory(deleteItem._id)
        : api.restoreSubcategory(deleteItem._id);

    action
      .then(() => {
        setShowDeleteModal(false);
        setDeleteItem(null);
        setShowSpinner(true)
        fetchCategories();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error in status update");
      })
      .finally(() => {
        setLoadingAction(false);
      });
  };

  // Function to handle edit action for category
  const handleEditCategory = (category) => {
    setEditItem(category);
    setShowEditCategoryModal(true);
  };

  // Function to handle edit action for subcategory
  const handleEditSubcategory = (subcategory) => {
    setEditItem(subcategory);
    setShowEditSubcategoryModal(true);
  };

  // Function to handle add action for category
  const handleAddCategory = () => {
    setEditItem(null); // Reset editItem for adding new category
    setShowAddCategoryModal(true);
  };

  // Function to handle add action for subcategory
  const handleAddSubcategory = () => {
    setEditItem(null); // Reset editItem for adding new subcategory
    setShowAddSubcategoryModal(true);
  };

  // Function to save changes after editing or adding
  const handleSave = () => {
    setShowSpinner(true);
    fetchCategories(); // Refresh the categories list after editing or adding
  };

  return (
    <div className="container mt-4 pb-4 category">
      <FullScreenLoader isLoading={showSpinner} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Category Management</h3>
        {loading ? (
          <Skeleton width={150} height={40}/>
        ) : (
          <button className="btn btn-success" onClick={handleAddCategory}>
            Add Category
          </button>
        )}
      </div>

      {/* Category Selection */}
      <div className="mb-4 d-flex align-items-center">
        <label className="form-label fw-bold me-2 mb-0">Select Category:</label>
        {loading ? (
          <Skeleton width={200} height={36}/>
        ) : (
          <select
            className="form-select w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Selected Category Details */}
      {loading ? (
        <div className="mb-4 bg-light-gray p-3 rounded">
          <Skeleton height={70}/>
        </div>
      ) : (
        selectedCategoryDetails && (
          <div className="mb-4 bg-light-gray p-3 rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={selectedCategoryDetails.image}
                  alt={selectedCategoryDetails.name}
                  className="category-image"
                />
                <div>
                  <span className="fw-bold">{selectedCategoryDetails.name}</span>
                  <span
                    className={`badge ms-2 ${selectedCategoryDetails.isPremium ? "bg-warning text-dark" : "bg-success"}`}
                  >
                    {selectedCategoryDetails.isPremium ? "Paid" : "Free"}
                  </span>
                  {selectedCategoryDetails.deletedAt && (
                    <span className="badge bg-danger ms-2">Deactivated</span>
                  )}
                </div>
              </div>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => handleEditCategory(selectedCategoryDetails)}
                >
                  Edit
                </button>
                <button
                  className={`btn ${selectedCategoryDetails.deletedAt ? "btn-success" : "btn-danger"}`}
                  onClick={() => handleDeactivateOrRestore(selectedCategoryDetails, "Category")}
                >
                  {selectedCategoryDetails.deletedAt ? "Restore" : "Deactivate"}
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* Subcategories Table */}
      <div className="rounded mb-2">
        <div className="py-2 px-4 bg-blue fw-bold rounded-top d-flex justify-content-between align-items-center">
          <span>Subcategories</span>
          {loading ? (
            <Skeleton width={180} height={40}/>
          ) : (
            <button className="btn" onClick={handleAddSubcategory}>
              Add Subcategory
            </button>
          )}
        </div>
        {loading ? (
          <>
            {Array.from({length: 6}).map((_, index) => (
              <Skeleton key={index} height={70} className="mb-2"/>
            ))}
          </>
        ) : (
          <table className="table table-striped">
            <thead>
            <tr>
              <th className="text-start ps-5">Name</th>
              <th>Image</th>
              <th>Modified Date</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {selectedCategoryDetails?.subcategories.map((subcategory) => (
              <tr key={subcategory._id}>
                <td className="text-start ps-5">{subcategory.name}</td>
                <td>
                  <img
                    src={subcategory.image}
                    alt={subcategory.name}
                    className="subcategory-image"
                  />
                </td>
                <td>{formatDateTime(subcategory.updatedAt)}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditSubcategory(subcategory)}
                  >
                    Edit
                  </button>
                  <button
                    className={`ms-4 btn ${subcategory.deletedAt ? "btn-success" : "btn-danger"}`}
                    onClick={() => handleDeactivateOrRestore(subcategory, "Subcategory")}
                  >
                    {subcategory.deletedAt ? "Restore" : "Deactivate"}
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title={deleteItem?.deletedAt ? "Restore" : "Deactivate"}
        message={
          deleteItem
            ? `Are you sure you want to ${deleteItem.deletedAt ? "restore" : "deactivate"} the ${deleteItem.type.toLowerCase()} "${deleteItem.name}"?`
            : "Are you sure?"
        }
        confirmButtonText={deleteItem?.deletedAt ? "Restore" : "Deactivate"}
        cancelButtonText="Cancel"
        onConfirm={confirmDeactivateOrRestore}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteItem(null);
        }}
        loading={loadingAction}
      />

      {/* Edit Category Modal */}
      {(showEditCategoryModal || showAddCategoryModal) && (
        <EditCategoryModal
          show={showEditCategoryModal || showAddCategoryModal}
          onHide={() => {
            setShowEditCategoryModal(false);
            setShowAddCategoryModal(false);
          }}
          category={editItem}
          onSave={handleSave}
        />
      )}

      {/* Edit Subcategory Modal */}
      {(showEditSubcategoryModal || showAddSubcategoryModal) && (
        <EditSubcategoryModal
          show={showEditSubcategoryModal || showAddSubcategoryModal}
          onHide={() => {
            setShowEditSubcategoryModal(false);
            setShowAddSubcategoryModal(false);
          }}
          subcategory={editItem}
          categoryId={selectedCategory}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
