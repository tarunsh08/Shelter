import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
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
import { FaPen, FaTrash } from "react-icons/fa";

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

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
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
      const res = await fetch("/api/auth/signout");
      const data = res.json();
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
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setShowListingError(false);
      setUserLisings(data);
    } catch (err) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserLisings((prev) =>
        prev.filter((listing) => listing.id !== listingId)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">Profile</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData?.avatar || currentUser.avatar}
            alt="Profile"
            className="rounded-full object-cover h-28 w-28 cursor-pointer border-4 border-gray-100 shadow-sm hover:border-gray-200 transition-all duration-200"
          />
          <p className="text-sm mt-3 text-center">
            {fileError ? (
              <span className="text-red-600">
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-gray-600">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-600">Image successfully uploaded!</span>
            ) : (
              ""
            )}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
            id="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
            id="password"
            onChange={handleChange}
          />
        </div>

        <button
          className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        
        <Link
          to={"/create-listing"}
          className="bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-all text-center"
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={handleDeleteUser}
          className="text-gray-600 hover:text-red-600 transition-colors font-medium"
        >
          Delete Account
        </button>
        <button
          onClick={handleSignOut}
          className="text-gray-600 hover:text-red-600 transition-colors font-medium"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {error && (
          <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">{error}</p>
        )}
        {updateSuccess && (
          <p className="text-green-600 bg-green-50 px-4 py-2 rounded-lg text-sm">
            Profile updated successfully
          </p>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={handleShowListing}
          className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all border border-gray-200"
        >
          Show My Listings
        </button>
        
        {showListingError && (
          <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm mt-3">
            Error fetching listings
          </p>
        )}
      </div>

      {userListings && userListings.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Listings</h2>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <Link to={`/listing/${listing._id}`} className="flex items-center gap-4 flex-1">
                <img
                  src={listing.imageUrls[0]}
                  alt="Listing cover"
                  className="h-16 w-20 object-cover rounded-lg"
                />
                <p className="text-gray-800 font-medium truncate hover:underline">
                  {listing.name}
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete listing"
                >
                  <FaTrash />
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    title="Edit listing"
                  >
                    <FaPen />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}