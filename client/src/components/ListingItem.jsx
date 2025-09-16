import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn, MdFavorite, MdFavoriteBorder, MdZoomOutMap } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view functionality here
    console.log('Quick view for:', listing._id);
  };

  return (
    <div 
      className='bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl w-full sm:w-[330px] group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/listing/${listing._id}`} className="block relative">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={
              listing.imageUrls[0] ||
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
            }
            alt={listing.name}
            className={`h-[320px] sm:h-[220px] w-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse h-[320px] sm:h-[220px]"></div>
          )}
          
          {/* Overlay on Hover */}
          <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button 
              onClick={handleQuickView}
              className="bg-white text-slate-800 p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100"
            >
              <MdZoomOutMap className="h-5 w-5" />
            </button>
          </div>
          
          {/* Favorite Button */}
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors duration-200"
          >
            {isFavorited ? (
              <MdFavorite className="h-5 w-5 text-red-500" />
            ) : (
              <MdFavoriteBorder className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {/* Listing Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              listing.type === 'rent' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
          
          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full shadow-sm">
            <p className="text-slate-700 font-bold text-sm">
              $
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && <span className="text-xs font-normal">/mo</span>}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='p-4 flex flex-col gap-2 w-full'>
          <p className='text-lg font-semibold text-slate-800 line-clamp-1'>
            {listing.name}
          </p>
          
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-slate-500 flex-shrink-0' />
            <p className='text-sm text-slate-600 truncate'>
              {listing.address}
            </p>
          </div>
          
          <p className='text-sm text-slate-600 line-clamp-2 leading-relaxed'>
            {listing.description}
          </p>
          
          <div className='flex justify-between items-center mt-2'>
            <div className='text-slate-700 flex gap-4'>
              <div className='flex items-center gap-1'>
                <FaBed className='h-4 w-4 text-slate-500' />
                <span className='text-xs font-medium'>
                  {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <FaBath className='h-4 w-4 text-slate-500' />
                <span className='text-xs font-medium'>
                  {listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}
                </span>
              </div>
            </div>
            
            {/* Additional details if available */}
            {listing.size && (
              <div className="text-xs text-slate-500 font-medium">
                {listing.size} sqft
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}