import { useSelector } from "react-redux";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { House } from "lucide-react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both menu and menu button
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          menuButtonRef.current &&
          !menuButtonRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Update search term when URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm('');
    }
  }, [location.search]);

  // Add scroll effect to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-95 border-b border-gray-200' 
          : 'bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center group" onClick={closeMenu}>
            <h1 className="text-xl flex font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-neutral-700 group-hover:to-neutral-500">
              Shelter <House className="ml-1 text-neutral-600" />
            </h1>
          </Link>

          {/* Search Bar - Center on larger screens */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search properties, locations..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-sm transition-all duration-300 focus:outline-none focus:shadow-md hover:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative group ${
                location.pathname === '/' 
                  ? 'text-neutral-900' 
                  : 'text-gray-600 hover:text-neutral-900'
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-700 transition-all duration-300 group-hover:w-full ${location.pathname === '/' ? 'w-full' : ''}`}></span>
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative group ${
                location.pathname === '/about' 
                  ? 'text-neutral-900' 
                  : 'text-gray-600 hover:text-neutral-900'
              }`}
            >
              About
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-700 transition-all duration-300 group-hover:w-full ${location.pathname === '/about' ? 'w-full' : ''}`}></span>
            </Link>
            <Link 
              to="/search?type=all" 
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative group ${
                location.pathname === '/search' 
                  ? 'text-neutral-900' 
                  : 'text-gray-600 hover:text-neutral-900'
              }`}
            >
              Listings
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-700 transition-all duration-300 group-hover:w-full ${location.pathname === '/search' ? 'w-full' : ''}`}></span>
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative group">
                <Link to="/profile" className="flex items-center space-x-2">
                  <img
                    src={currentUser.avatar}
                    alt="Profile"
                    className="rounded-full h-8 w-8 object-cover border-2 border-transparent transition-all duration-300 group-hover:border-neutral-200 group-hover:shadow-sm"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-neutral-900">
                    {currentUser.username}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/sign-in" 
                  className="text-gray-700 hover:text-neutral-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up" 
                  className="bg-gradient-to-r from-neutral-700 to-neutral-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-neutral-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500 transition-colors duration-200"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search - Only visible on small screens */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search properties..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div 
        ref={menuRef}
        className={`md:hidden mobile-menu-container fixed inset-x-0 z-40 transform transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0 visible top-full' 
            : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white shadow-xl rounded-b-lg border-t border-gray-200 transform transition-transform duration-300 ease-in-out">
          <Link
            to="/"
            className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
              location.pathname === '/' 
                ? 'text-neutral-900 bg-gray-100' 
                : 'text-gray-700 hover:text-neutral-900 hover:bg-gray-50'
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
              location.pathname === '/about' 
                ? 'text-neutral-900 bg-gray-100' 
                : 'text-gray-700 hover:text-neutral-900 hover:bg-gray-50'
            }`}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            to="/search?type=all"
            className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
              location.pathname === '/search' 
                ? 'text-neutral-900 bg-gray-100' 
                : 'text-gray-700 hover:text-neutral-900 hover:bg-gray-50'
            }`}
            onClick={closeMenu}
          >
            Listings
          </Link>
          {currentUser ? (
            <Link
              to="/profile"
              className="px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-neutral-900 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
              onClick={closeMenu}
            >
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="rounded-full h-7 w-7 object-cover"
              />
              <span>Profile</span>
            </Link>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-neutral-900 hover:bg-gray-50 transition-colors duration-200"
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="block px-3 py-3 rounded-md text-base font-medium text-white bg-gradient-to-r from-neutral-700 to-neutral-600 hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}