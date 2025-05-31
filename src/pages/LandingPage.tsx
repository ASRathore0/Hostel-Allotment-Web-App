import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building, CheckCircle, Clock, UserPlus, Mail, Phone, MapPin,} from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  const getDashboardLink = () => {
    if (!isAuthenticated) return '/login';
    return isAdmin ? '/admin/dashboard' : '/student/dashboard';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-bold text-xl">Room8</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Online Hostel Room Allocation System
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                Streamline your hostel application process and room allocation with our easy-to-use platform.
              </p>
              <div className="mt-8">
                <Link
                  to={isAuthenticated ? getDashboardLink() : '/register'}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                </Link>
              </div>
            </div>
            <div className="mt-12 md:mt-0 md:w-1/2">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img
                  src=" https://i0.wp.com/stanzaliving.wpcomstaging.com/wp-content/uploads/2024/05/b1067-benefits-of-booking-accomodation-early.jpg?fit=1000%2C561&ssl=1"
                  alt="Hostel building"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our platform simplifies the hostel room allocation process for both students and administrators.
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow transition duration-300">
                <div className="bg-blue-100 rounded-lg inline-flex p-3 mb-4">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Apply Online</h3>
                <p className="mt-2 text-gray-500">
                  Students can easily register and submit their hostel applications with preferences online.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow transition duration-300">
                <div className="bg-blue-100 rounded-lg inline-flex p-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Quick Processing</h3>
                <p className="mt-2 text-gray-500">
                  Administrators can quickly review and approve applications based on merit and availability.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow transition duration-300">
                <div className="bg-blue-100 rounded-lg inline-flex p-3 mb-4">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Room Assignment</h3>
                <p className="mt-2 text-gray-500">
                  Get automatically assigned to rooms based on your preferences and eligibility criteria.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow transition duration-300">
                <div className="bg-blue-100 rounded-lg inline-flex p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Instant Confirmation</h3>
                <p className="mt-2 text-gray-500">
                  Receive instant notifications about your application status and room assignment.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow transition duration-300">
                <div className="bg-blue-100 rounded-lg inline-flex p-3 mb-4">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Room Availability</h3>
                <p className="mt-2 text-gray-500">
                  Check real-time room availability before applying to make informed choices.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow transition duration-300">
                <div className="bg-blue-100 rounded-lg inline-flex p-3 mb-4">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Admin Dashboard</h3>
                <p className="mt-2 text-gray-500">
                  Comprehensive dashboard for administrators to manage rooms and applications efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Ready to streamline your hostel allocation?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Join our platform today and experience a hassle-free hostel room allocation process.
            </p>
            <div className="mt-8">
              <Link
                to={isAuthenticated ? getDashboardLink() : '/register'}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Sign Up Now'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
 
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand Info */}
            <div>
              <h3 className="text-2xl font-bold text-white">Room8</h3>
              <p className="mt-4 text-sm text-gray-400">
                A modern, intelligent platform for effortless hostel room allocation.
                Designed for students and administrators.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaLinkedinIn className="w-5 h-5" />
                </a>
              </div>

            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase">Navigation</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
                <li><Link to={isAuthenticated ? getDashboardLink() : "/"} className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase">Features</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Online Application</li>
                <li>Smart Room Allocation</li>
                <li>Admin Dashboard</li>
                <li>Real-Time Notifications</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase">Contact Us</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a href="mailto:support@room8.com" className="hover:text-white">support@room8.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <a href="tel:+1234567890" className="hover:text-white">+1 234 567 890</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  New Delhi, India
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Room8. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;