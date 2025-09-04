import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { nanoid } from "@reduxjs/toolkit";

export default function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 1) {
        setShowMore(true);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (["all", "rent", "sale"].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    } else if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    } else if (["parking", "furnished", "offer"].includes(e.target.id)) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    } else if (e.target.id === "sort_order") {
      const [sort = "created_at", order = "desc"] = e.target.value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 2) setShowMore(false);
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar Filters */}
      <div className="p-6 border-b border-gray-200 md:border-b-0 md:border-r md:min-h-screen bg-gray-50 w-full md:w-80">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Filters</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Search Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Enter search term..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <div className="space-y-2">
              {[
                { id: "all", label: "Rent & Sale" },
                { id: "rent", label: "Rent" },
                { id: "sale", label: "Sale" },
              ].map((type) => (
                <div key={type.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={type.id}
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    onChange={handleChange}
                    checked={sidebardata.type === type.id}
                  />
                  <label htmlFor={type.id} className="ml-2 text-gray-700">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="space-y-2">
              {[
                { id: "parking", label: "Parking" },
                { id: "furnished", label: "Furnished" },
                { id: "offer", label: "Special Offer" },
              ].map((amenity) => (
                <div key={amenity.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={amenity.id}
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    onChange={handleChange}
                    checked={sidebardata[amenity.id]}
                  />
                  <label htmlFor={amenity.id} className="ml-2 text-gray-700">
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              onChange={handleChange}
              defaultValue="created_at_desc"
              id="sort_order"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
            >
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="createdAt_desc">Date: Newest First</option>
              <option value="createdAt_asc">Date: Oldest First</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
          Listing Results
        </h1>
        
        <div className="space-y-6">
          {!loading && listings.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">No listings found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
            </div>
          )}
          
          {loading && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">Loading listings...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading &&
              listings.map((listing) => (
                <ListingItem key={nanoid()} listing={listing} />
              ))}
          </div>

          {showMore && (
            <div className="text-center mt-8">
              <button
                onClick={onShowMoreClick}
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Load More Listings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}