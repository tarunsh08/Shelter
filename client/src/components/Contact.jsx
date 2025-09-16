import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  User, 
  Home, 
  Send,
  Loader,
  AlertCircle
} from "lucide-react";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (!listing?.userRef) return;

    const fetchLandlord = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${listing.userRef}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch landlord information');
        }
        
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.error('Error fetching landlord:', error);
        setError(error.message || 'Failed to load contact information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLandlord();
  }, [listing?.userRef]);

  if (!listing) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-center gap-3 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <p>No listing information available.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading contact information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3 text-red-800 mb-4">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Error loading contact information</p>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      {landlord && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              {landlord.avatar ? (
                <img
                  src={landlord.avatar}
                  alt={landlord.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg capitalize">
                {landlord.username}
              </h3>
              <p className="text-gray-600 text-sm">Property Owner</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Home className="w-4 h-4" />
              <span className="font-medium">About the property</span>
            </div>
            <p className="text-blue-700 capitalize">
              {listing.name.toLowerCase()}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="4"
                value={message}
                onChange={onChange}
                placeholder="Hello, I'm interested in this property. Could you please provide more information about..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                {message.length}/500 characters
              </p>
            </div>

            <Link
              to={`mailto:${landlord.email}?subject=Regarding ${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
              Send Message
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center">
              Your message will be sent directly to the property owner's email address
            </p>
          </div>
        </div>
      )}
    </>
  );
}