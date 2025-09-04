import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { House, BriefcaseBusiness, Lock } from "lucide-react";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Pagination]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center px-4 py-6 md:px-8 lg:px-16 xl:px-28 bg-gradient-to-r from-blue-50 to-white min-h-screen">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
            Find your next <span className="text-neutral-600">perfect</span> home
          </h1>
          <p className="text-gray-600 my-4 text-sm md:text-base">
            We have a wide range of properties for you to choose from. Find your dream home today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              to={"/search"}
              className="bg-neutral-600 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-neutral-700 transition duration-300"
            >
              Browse Properties
            </Link>
            <Link
              to={"/about"}
              className="border border-neutral-600 text-neutral-600 px-6 py-3 rounded-lg font-medium text-center hover:bg-neutral-50 transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80" 
            alt="Modern home" 
            className="w-full h-auto rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      </div>

      {/* Featured Listings */}
      <div className="py-12 px-4 md:px-8 lg:px-16 xl:px-28 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Featured Properties</h2>
          <p className="text-gray-500 mt-2">Discover our most popular listings</p>
        </div>
        
        <Swiper 
          navigation 
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          spaceBetween={30}
          className="pb-12"
        >
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <ListingItem listing={listing} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-4 md:px-8 lg:px-16 xl:px-28">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <House className="w-6 h-6" />,
                title: 'Wide Selection',
                description: 'Explore thousands of properties across the region.'
              },
              {
                icon: <BriefcaseBusiness className="w-6 h-6" />,
                title: 'Expert Agents',
                description: 'Our experienced agents are here to help you.'
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Secure Process',
                description: 'Safe and reliable property transactions.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-12 px-4 md:px-8 lg:px-16 xl:px-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Shelter</h3>
              <p className="text-gray-300">Finding your dream home made easy with our premium real estate services.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Listings', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <address className="not-italic text-gray-300 space-y-2">
                <p>123 Real Estate St.</p>
                <p>New York, NY 10001</p>
                <p>info@shelter.com</p>
                <p>(123) 456-7890</p>
              </address>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-300 mb-4">Subscribe to get updates on new properties.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-lg text-gray-800 w-full focus:outline-none"
                />
                <button className="bg-neutral-600 hover:bg-neutral-700 px-4 rounded-r-lg transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p> 2025 Shelter by Tarun. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
