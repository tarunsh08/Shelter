import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaHeart,
  FaRegHeart,
  FaExpand,
  FaCalendarAlt,
  FaRulerCombined
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Contact from "../components/Contact";
import { TbZoomMoney } from "react-icons/tb";

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const params = useParams();
  
  SwiperCore.use([Navigation, Pagination, Zoom]);

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

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Add favorite functionality here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Listing Not Found</h2>
          <p className="text-gray-600">We couldn't find the listing you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {listing && !loading && !error && (
        <div>
          {/* Image Gallery */}
          <div className="relative">
            <Swiper 
              modules={[Navigation, Pagination, Zoom]} 
              navigation 
              pagination={{ clickable: true }}
              zoom={true}
              className="h-96 md:h-[500px] lg:h-[600px]"
              onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
            >
              {listing.imageUrls.map((url, index) => (
                <SwiperSlide key={url} virtualIndex={index}>
                  <div className="swiper-zoom-container">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    ></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {activeImageIndex + 1} / {listing.imageUrls.length}
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-6 right-6 z-10 flex gap-3">
              {/* Favorite Button */}
              <button
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={handleFavorite}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorited ? (
                  <FaHeart className="text-red-500 text-lg" />
                ) : (
                  <FaRegHeart className="text-gray-600 text-lg" />
                )}
              </button>
              
              {/* Share Button */}
              <button
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                aria-label="Share listing"
              >
                <FaShare className="text-gray-600 text-lg" />
              </button>
              
              {copied && (
                <div className="absolute top-full right-0 mt-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg animate-fadeIn">
                  Link copied!
                </div>
              )}
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="max-w-6xl mx-auto px-4 pt-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-gray-700">Home</a>
              <IoIosArrowForward className="text-xs" />
              <a href="/search" className="hover:text-gray-700">Listings</a>
              <IoIosArrowForward className="text-xs" />
              <span className="text-gray-800">{listing.name}</span>
            </nav>
          </div>

          {/* Listing Details */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 lg:p-10">
              {/* Title and Price */}
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {listing.name}
                    </h1>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <span className="text-sm">{listing.address}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {listing.offer ? (
                        <>
                          ${listing.discountPrice.toLocaleString("en-US")}
                          <span className="text-gray-500 line-through text-lg ml-2">
                            ${listing.regularPrice.toLocaleString("en-US")}
                          </span>
                        </>
                      ) : (
                        `$${listing.regularPrice.toLocaleString("en-US")}`
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.type === "rent" ? "per month" : "total price"}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    listing.type === "rent" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {listing.type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  
                  {listing.offer && (
                    <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      ${(listing.regularPrice - listing.discountPrice).toLocaleString("en-US")} Off
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TbZoomMoney className="text-2xl" />
                  Property Description
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">{listing.description}</p>
              </div>

              {/* Features Grid */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FaBed className="text-gray-600 text-xl" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{listing.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FaBath className="text-gray-600 text-xl" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{listing.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FaParking className="text-gray-600 text-xl" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {listing.parking ? "Yes" : "No"}
                      </div>
                      <div className="text-sm text-gray-600">Parking</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FaChair className="text-gray-600 text-xl" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {listing.furnished ? "Furnished" : "Unfurnished"}
                      </div>
                      <div className="text-sm text-gray-600">Furnishing</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-5 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-600" />
                    Availability
                  </h3>
                  <p className="text-gray-700">Immediate move-in available</p>
                </div>
                
                <div className="bg-green-50 p-5 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaRulerCombined className="text-green-600" />
                    Property Size
                  </h3>
                  <p className="text-gray-700">1,200 sq ft • 3 rooms</p>
                </div>
              </div>

              {/* Contact Section */}
              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <div className="border-t border-gray-100 pt-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Interested in this property?</h3>
                    <button
                      onClick={() => setContact(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Contact Property Owner
                    </button>
                  </div>
                </div>
              )}
              
              {contact && (
                <div className="border-t border-gray-100 pt-8">
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