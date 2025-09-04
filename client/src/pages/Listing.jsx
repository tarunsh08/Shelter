import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="min-h-screen bg-gray-50">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Loading listing details...</p>
        </div>
      )}
      
      {error && (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-800">Something went wrong while fetching the listing.</p>
        </div>
      )}
      
      {listing && !loading && !error && (
        <div>
          {/* Image Gallery */}
          <div className="relative">
            <Swiper modules={[Navigation]} navigation className="h-96 md:h-[500px]">
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${url})` }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Share Button */}
            <div className="absolute top-6 right-6 z-10">
              <button
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                aria-label="Share listing"
              >
                <FaShare className="text-gray-600" />
              </button>
              
              {copied && (
                <div className="absolute top-full right-0 mt-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
                  Link copied!
                </div>
              )}
            </div>
          </div>

          {/* Listing Details */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              {/* Title and Price */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                  {listing.name}
                </h1>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span className="text-sm">{listing.address}</span>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      listing.type === "rent" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {listing.type === "rent" ? "For Rent" : "For Sale"}
                    </span>
                    
                    {listing.offer && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-gray-800">
                          ${listing.discountPrice.toLocaleString("en-US")}
                        </span>
                        <span className="text-gray-500 line-through text-sm">
                          ${listing.regularPrice.toLocaleString("en-US")}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-800">
                    {!listing.offer && `$${listing.regularPrice.toLocaleString("en-US")}`}
                    {listing.type === "rent" && " / month"}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FaBed className="text-gray-600" />
                    <span className="text-gray-700">
                      {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FaBath className="text-gray-600" />
                    <span className="text-gray-700">
                      {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FaParking className="text-gray-600" />
                    <span className="text-gray-700">
                      {listing.parking ? "Parking" : "No Parking"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FaChair className="text-gray-600" />
                    <span className="text-gray-700">
                      {listing.furnished ? "Furnished" : "Unfurnished"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setContact(true)}
                    className="w-full md:w-auto bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Contact Landlord
                  </button>
                </div>
              )}
              
              {contact && (
                <div className="border-t border-gray-200 pt-6">
                  <Contact listing={listing} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}