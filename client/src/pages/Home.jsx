import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { 
  House, 
  BriefcaseBusiness, 
  Lock, 
  ArrowRight, 
  Star, 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Search,
  Building,
  Key
} from "lucide-react";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  SwiperCore.use([Navigation, Pagination, Autoplay]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?searchTerm=${encodeURIComponent(searchTerm)}`;
    }
  };

  const heroImages = [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center px-4 py-6 md:px-8 lg:px-16 xl:px-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-black/5 z-0"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              Find Your Dream <span className="text-blue-600">Home</span> With Ease
            </h1>
            <p className="text-gray-600 my-6 text-lg">
              Discover the perfect property that matches your lifestyle. From cozy apartments to luxurious villas, we have it all.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={"/search"}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-center hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Browse Properties</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to={"/about"}
                className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-center hover:bg-blue-50 transition-all duration-300"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              navigation
              className="rounded-2xl shadow-2xl"
            >
              {heroImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img 
                    src={image} 
                    alt={`Modern home ${index + 1}`} 
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Properties" },
              { number: "5K+", label: "Happy Clients" },
              { number: "15+", label: "Years Experience" },
              { number: "50+", label: "Expert Agents" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Featured Properties</h2>
            <p className="text-gray-600 text-lg">Discover our most exclusive listings</p>
          </div>
          
          <Swiper 
            navigation 
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            spaceBetween={30}
            className="pb-12"
          >
            {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div className="pb-8">
                  <ListingItem listing={listing} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Choose Shelter</h2>
            <p className="text-gray-600 text-lg">Experience the difference with our premium real estate services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <House className="w-12 h-12 text-blue-600" />,
                title: 'Wide Selection',
                description: 'Explore thousands of properties across prime locations with detailed filters to find your perfect match.'
              },
              {
                icon: <Building className="w-12 h-12 text-blue-600" />,
                title: 'Expert Agents',
                description: 'Our experienced real estate professionals provide personalized guidance throughout your journey.'
              },
              {
                icon: <Shield className="w-12 h-12 text-blue-600" />,
                title: 'Secure Process',
                description: 'Enjoy peace of mind with our verified listings and secure transaction process.'
              },
              {
                icon: <Star className="w-12 h-12 text-blue-600" />,
                title: 'Premium Service',
                description: 'From virtual tours to legal assistance, we provide end-to-end support for all your needs.'
              },
              {
                icon: <MapPin className="w-12 h-12 text-blue-600" />,
                title: 'Prime Locations',
                description: 'Access exclusive properties in the most sought-after neighborhoods and communities.'
              },
              {
                icon: <Key className="w-12 h-12 text-blue-600" />,
                title: 'Easy Ownership',
                description: 'Streamlined paperwork and financing options make your dream home easily accessible.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Categories */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Explore Properties</h2>
            <p className="text-gray-600 text-lg">Browse through our diverse collection of properties</p>
          </div>

          {/* Recent Listings */}
          <div className="space-y-16">
            {offerListings && offerListings.length > 0 && (
              <div className=''>
                <div className='flex justify-between items-center mb-8'>
                  <h2 className='text-2xl md:text-3xl font-semibold text-slate-800'>Special Offers</h2>
                  <Link className='flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium' to={'/search?offer=true'}>
                    View all offers <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {offerListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))}
                </div>
              </div>
            )}
            
            {rentListings && rentListings.length > 0 && (
              <div className=''>
                <div className='flex justify-between items-center mb-8'>
                  <h2 className='text-2xl md:text-3xl font-semibold text-slate-800'>Properties for Rent</h2>
                  <Link className='flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium' to={'/search?type=rent'}>
                    View all rentals <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))}
                </div>
              </div>
            )}
            
            {saleListings && saleListings.length > 0 && (
              <div className=''>
                <div className='flex justify-between items-center mb-8'>
                  <h2 className='text-2xl md:text-3xl font-semibold text-slate-800'>Properties for Sale</h2>
                  <Link className='flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium' to={'/search?type=sale'}>
                    View all sales <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of satisfied clients who found their perfect property through Shelter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={"/search"}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Searching
            </Link>
            <Link
              to={"/contact"}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Shelter</h3>
              <p className="text-gray-400 mb-4">
                Your trusted partner in finding the perfect home. Experience premium real estate services with a personal touch.
              </p>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                    <span className="text-sm">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'About', 'Properties', 'Services', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>New Delhi, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>(+91) 93683 94188</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>info@shelter.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to get updates on new properties and exclusive offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-3 rounded-l-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-gray-400">
            <p>© 2025 Shelter by Tarun. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}