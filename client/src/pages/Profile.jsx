import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { 
  FaPen, 
  FaTrash, 
  FaSignOutAlt, 
  FaUserEdit, 
  FaPlusCircle,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaUpload,
  FaUserCircle
} from "react-icons/fa";
import { MdEmail, MdPassword, MdDeleteForever } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserLisings] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; 
          const MAX_HEIGHT = 400; 
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedDataUrl);
        };
      };
    });
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      setFileError('Please upload an image file');
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError('Image size should be less than 5MB');
      return;
    }

    try {
      setFilePerc(0);
      setFileError(false);
      
      const compressedImage = await compressImage(file);
      setFormData(prev => ({
        ...prev,
        avatar: compressedImage
      }));
      
      setFilePerc(100);
    } catch (error) {
      console.error('Error processing image:', error);
      setFileError('Failed to process image');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/signout`,  {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  };

  const handleShowListing = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/listings/${currentUser._id}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setShowListingError(false);
      setUserLisings(data);
      setActiveTab('listings');
    } catch (err) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserLisings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and listings</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium text-sm md:text-base transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={handleShowListing}
            className={`px-6 py-3 font-medium text-sm md:text-base transition-colors ${
              activeTab === 'listings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Listings
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center md:w-1/3">
                <div className="relative group">
                  <img
                    onClick={() => fileRef.current.click()}
                    src={formData?.avatar || currentUser.avatar}
                    alt="Profile"
                    className="rounded-full object-cover h-32 w-32 cursor-pointer border-4 border-gray-100 shadow-lg hover:border-blue-200 transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
                    <FaUpload className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                />
                
                <button
                  onClick={() => fileRef.current.click()}
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                >
                  <FaUpload className="w-4 h-4" />
                  Change Photo
                </button>
                
                <div className="mt-4 text-center">
                  {fileError ? (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <RiErrorWarningFill />
                      {fileError}
                    </div>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <div className="text-blue-600 text-sm">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${filePerc}%` }}
                        ></div>
                      </div>
                      Uploading {filePerc}%
                    </div>
                  ) : filePerc === 100 ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg">
                      <FaCheckCircle />
                      Image uploaded successfully!
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="relative">
                      <FaUserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Username"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        id="username"
                        defaultValue={currentUser.username}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        id="email"
                        defaultValue={currentUser.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <MdPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        placeholder="New Password (leave blank to keep current)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        id="password"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <FaUserEdit className="w-5 h-5" />
                    )}
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </form>

                {/* Status Messages */}
                <div className="mt-6 space-y-3">
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
                      <RiErrorWarningFill />
                      {error}
                    </div>
                  )}
                  {updateSuccess && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl text-sm">
                      <FaCheckCircle />
                      Profile updated successfully!
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                  <Link
                    to={"/create-listing"}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300"
                  >
                    <FaPlusCircle className="w-5 h-5" />
                    Create New Listing
                  </Link>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 flex items-center justify-center gap-2 text-red-600 border border-red-200 py-3 rounded-xl font-medium hover:bg-red-50 transition-all duration-300"
                    >
                      <MdDeleteForever className="w-5 h-5" />
                      Delete Account
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex-1 flex items-center justify-center gap-2 text-gray-600 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
              <button
                onClick={handleShowListing}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <FaEye className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {showListingError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm mb-6">
                <RiErrorWarningFill />
                Error fetching your listings
              </div>
            )}

            {userListings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaPlusCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-6">Start by creating your first property listing</p>
                <Link
                  to={"/create-listing"}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <FaPlusCircle className="w-5 h-5" />
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <Link to={`/listing/${listing._id}`} className="flex items-center gap-4 flex-1 group">
                      <img
                        src={listing.imageUrls[0]}
                        alt="Listing cover"
                        className="h-16 w-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium truncate group-hover:text-blue-600 transition-colors">
                          {listing.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          ${listing.offer ? listing.discountPrice : listing.regularPrice}
                          {listing.type === 'rent' && '/month'}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link to={`/update-listing/${listing._id}`}>
                        <button
                          className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300"
                          title="Edit listing"
                        >
                          <FaPen className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                        title="Delete listing"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <RiErrorWarningFill className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Account</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MdDeleteForever className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}