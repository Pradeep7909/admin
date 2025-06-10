import axios from "axios";
import Cookies from "universal-cookie";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const cookies = new Cookies(); // Create an instance of Cookies


const request = async (method, path, body = null, hasFiles = false) => {
  const url = `${baseURL}${path}`;
  const token = cookies.get("user_token");


  const options = {
    method,
    url,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    ...(body && { data: body })
  };

  console.log('Request Payload:', options); // Debugging log

  const response = await axios(options);

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

  return response.data; // Return only response data
};

export default class APIService {
  login(data) {
    return request('POST', `admin/login`, data);
  }

  getAdminDetails(){
    return request('GET', `admin/admin-details`);
  }

  updateAdminDetails(data){
    return request('PUT', `admin/admin-details`, data);
  }

  updateAdminPassword(data){
    return request('PUT', `admin/admin-password`, data);
  }

  sendVerificationCode(data) {
    return request('POST', `admin/send-verification-code`, data);
  }

  verifyOtpAndResetPassword (data) {
    return request('POST', `admin/verify-otp-reset-password`, data);
  }

  searchPost(data) {
    return request('POST', `admin/search-post`, data);
  }

  getCategories() {
    return request('GET', `admin/categories`);
  }

  deactivateCategory(id) {
    return request('DELETE', `admin/categories/${id}`);
  }

  deactivateSubcategory(id) {
    return request('DELETE', `admin/subcategories/${id}`);
  }

  restoreCategory(id) {
    return request('PATCH', `admin/categories/${id}/restore`);
  }

  restoreSubcategory(id) {
    return request('PATCH', `admin/subcategories/${id}/restore`);
  }

  updateSubcategory(id, data) {
    return request('PUT', `admin/subcategories/${id}`, data);
  }

  createSubcategory(data){
    return request('POST', `admin/subcategories/create`, data);
  }

  updateCategory(id, data) {
    return request('PUT', `admin/categories/${id}`, data);
  }

  createCategory(data){
    return request('POST', `admin/categories/create`, data);
  }

  getSinglePost(id) {
    return request('GET', `admin/single-post/${id}`);
  }

  deactivatePost(id, data) {
    return request('PUT', `admin/deactivate-post/${id}`, data);
  }

  getReportedPosts(data){
    return request('POST', `admin/get-reports`, data);
  }

  getUsers(data){
    return request('POST', `admin/get-users`, data);
  }

  getSingleUser(id){
    return request('GET', `admin/single-user/${id}`);
  }

  deactivateUser(id, data) {
    return request('PUT', `admin/deactivate-user/${id}`, data);
  }

  getAdmins(data){
    return request('POST', `admin/get-admins`, data);
  }

  updateAdmin(id, data) {
    return request('PUT', `admin/update-admin/${id}`, data);
  }

  createAdmin(data){
    return request('POST', `admin/create`, data);
  }

  deactivateAdmin(id, data) {
    return request('PUT', `admin/deactivate-admin/${id}`, data);
  }

  restoreAdmin(id, data) {
    return request('PUT', `admin/restore-admin/${id}`, data);
  }

  getPostStatsByCategory(){
    return request('GET', `admin/get-post-stats`);
  }

  getDeactivatedData(){
    return request('GET', `admin/deactivated-data`);
  }

  getDashBoardData() {
    return request('GET', `admin/dashboard-data`);
  }
}
