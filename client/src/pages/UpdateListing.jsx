import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 100,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const navigate = useNavigate();

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (2 mb max per image");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done.`);
          if (progress === 100) {
            console.log("Upload complete");
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      // convert to number using +
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`)
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId
      const res = await fetch(`/api/listing/get/${listingId}`)
      const data = await res.json();
      setFormData(data);
      if (data.success === false) {
        setError(data.message);
      }
    }
    fetchListing();
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Update Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
              <input
                type="text"
                placeholder="Enter property name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                id="name"
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Describe your property"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none min-h-32"
                id="description"
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                placeholder="Enter full address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                id="address"
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Property Type</label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sale"
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    onChange={handleChange}
                    checked={formData.type === "sale"}
                  />
                  <label htmlFor="sale" className="ml-2 text-gray-700">Sell</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rent"
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                  />
                  <label htmlFor="rent" className="ml-2 text-gray-700">Rent</label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Amenities</label>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parking"
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <label htmlFor="parking" className="ml-2 text-gray-700">Parking</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <label htmlFor="furnished" className="ml-2 text-gray-700">Furnished</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="offer"
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <label htmlFor="offer" className="ml-2 text-gray-700">Special Offer</label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <span className="text-gray-600 whitespace-nowrap">
                  {formData.type === "rent" ? "($ / month)" : ""}
                </span>
              </div>
            </div>

            {formData.offer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <span className="text-gray-600 whitespace-nowrap">
                    {formData.type === "rent" ? "($ / month)" : ""}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <p className="text-sm text-gray-600">
                The first image will be the cover (maximum 6 images allowed)
              </p>
              
              <div className="flex gap-4">
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <label
                  htmlFor="images"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-50 text-center"
                >
                  Select Images
                </label>
                <button
                  type="button"
                  disabled={uploading || files.length === 0}
                  onClick={handleImageSubmit}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
              
              {imageUploadError && (
                <p className="text-red-600 text-sm">{imageUploadError}</p>
              )}
            </div>

            {formData.imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {formData.imageUrls.map((url, index) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt="Listing"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-4">
          <button
            disabled={loading || uploading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Updating Listing..." : "Update Listing"}
          </button>
          
          {error && (
            <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm mt-4 text-center">
              {error}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}