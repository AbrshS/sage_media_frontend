import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, UserPlus, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// API URL
const API_URL = 'http://localhost:3000/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModelAuth, setShowModelAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [modelUser, setModelUser] = useState<null | {id: string, name: string, profileImage?: string}>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setActiveSection] = useState<string>("");
  const headerRef = useRef<HTMLElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  
  // Transform values for header appearance
  const headerOpacity = useTransform(
    scrollY, 
    [0, 100, 200], 
    [0, 0.9, 1]
  );
  
  const headerBackdrop = useTransform(
    scrollY,
    [0, 100, 200],
    ["blur(0px)", "blur(5px)", "blur(10px)"]
  );
  
  const headerShadow = useTransform(
    scrollY,
    [0, 100, 200],
    ["0 0 0 rgba(0,0,0,0)", "0 4px 20px rgba(0,0,0,0.05)", "0 8px 30px rgba(0,0,0,0.1)"]
  );
  
  const logoScale = useTransform(
    scrollY,
    [0, 100],
    [0.8, 1]
  );
  
  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Determine active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);  // section.id is already a string, no need for type assertion
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if model is logged in on component mount and fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const modelToken = localStorage.getItem('modelToken');
      
      if (!modelToken) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch user data from the /me endpoint
        const response = await axios.get(`${API_URL}/public/me`, {
          headers: {
            'Authorization': `Bearer ${modelToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setModelUser({
            id: userData.id,
            name: userData.fullName || "Model User",
            profileImage: userData.profileImage
          });
        } else {
          // If API call was successful but returned error
          console.error("Failed to fetch user data:", response.data.message);
          localStorage.removeItem('modelToken');
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        
        // For development only - set mock user if API fails
        if (process.env.NODE_ENV === 'development') {
          setModelUser({ id: "model-123", name: "Model User" });
        } else {
          localStorage.removeItem('modelToken');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Simple modal for model authentication
  const ModelAuthModal = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Update the handleSubmit function to use the API
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      
      try {
        if (authMode === "login") {
          // Call the login API endpoint
          const response = await axios.post(`${API_URL}/public/login`, {
            email,
            password
          });
          
          console.log('Login response:', response.data);
          
          if (response.data.success) {
            // Store the token in localStorage
            localStorage.setItem('modelToken', response.data.token);
            
            // Set user data
            setModelUser({ 
              id: response.data.user?.id || "model-123", 
              name: response.data.user?.fullName || email.split('@')[0] 
            });
            
            toast.success("Logged in successfully!");
            setShowModelAuth(false);
            navigate('/profile');
          } else {
            setError(response.data.message || 'Login failed. Please try again.');
          }
        } else {
          // Call the register API endpoint
          const response = await axios.post(`${API_URL}/public/register`, {
            fullName: name,
            email,
            password
          });
          
          console.log('Register response:', response.data);
          
          if (response.data.success) {
            // Store the token in localStorage
            localStorage.setItem('modelToken', response.data.token);
            
            // Set user data
            setModelUser({ 
              id: response.data.user?.id || "model-123", 
              name: response.data.user?.fullName || name 
            });
            
            toast.success("Registered successfully!");
            setShowModelAuth(false);
            navigate('/profile');
          } else {
            setError(response.data.message || 'Registration failed. Please try again.');
          }
        }
      } catch (err: any) {
        console.error('Auth error:', err);
        setError(
          err.response?.data?.message || 
          `An error occurred during ${authMode === "login" ? "login" : "registration"}. Please try again.`
        );
        
        // For development/testing - use mock login if API fails
        if (process.env.NODE_ENV === 'development') {
          console.log(`Using mock ${authMode} for development`);
          localStorage.setItem('modelToken', 'model-token-123');
          
          if (authMode === "login") {
            setModelUser({ id: "model-123", name: email.split('@')[0] });
          } else {
            setModelUser({ id: "model-123", name: name });
          }
          
          toast.success(`Development ${authMode} successful!`);
          setShowModelAuth(false);
          navigate('/profile');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
          <button 
            onClick={() => setShowModelAuth(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold text-[#344c3d] mb-2">
            {authMode === "login" ? "Model Login" : "Model Registration"}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {authMode === "login" 
              ? "Sign in to apply for competitions and manage your profile" 
              : "Create a model account to showcase your talent and join competitions"}
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rest of the form remains the same */}
            {authMode === "register" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#344c3d]"
                  placeholder="Your full name"
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#344c3d]"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#344c3d]"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-[#344c3d] text-white py-3 rounded-md hover:bg-[#344c3d]/90 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                authMode === "login" ? "Sign In" : "Create Account"
              )}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {authMode === "login" ? "Don't have a model account?" : "Already have an account?"}{" "}
                <button 
                  type="button"
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="text-[#344c3d] font-medium hover:underline"
                >
                  {authMode === "login" ? "Register now" : "Sign in"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add a function to navigate to the login page instead of showing modal
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Add a function to navigate to the register page
  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleModelLogout = () => {
    localStorage.removeItem('modelToken');
    setModelUser(null);
    toast.success("Logged out successfully");
    navigate('/');
  };

  // Navigation items with dropdown support
  const navItems = [
    { name: "Home", path: "/" },
    { 
      name: "Competitions", 
      path: "/competitions",
      dropdown: [
        { name: "Current Competitions", path: "/competitions/current" },
        { name: "Past Winners", path: "/competitions/winners" },
        { name: "How It Works", path: "/competitions/how-it-works" },
      ]
    },
    { name: "Models", path: "/models" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];

  return (
    <>
      <motion.header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 py-4 w-full transition-all duration-300 ${isHomePage ? 'pointer-events-auto' : 'bg-white/80'}`}
        style={isHomePage ? {
          opacity: headerOpacity,
          backdropFilter: headerBackdrop,
          boxShadow: headerShadow,
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        } : undefined}
        initial={isHomePage ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-[1920px] mx-auto flex justify-between items-center px-4 sm:px-6 relative">
          {/* Logo with animation */}
          <motion.div 
            className="relative z-10"
            style={isHomePage ? { scale: logoScale } : undefined}
          >
            <Link to="/">
              <img
                src="/logo.png"
                alt="Sage Media"
                className="h-8 w-auto object-contain"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation - Enhanced with dropdowns and active indicators */}
          <nav className="hidden lg:flex gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                <Link
                  to={item.path}
                  className={`text-[#344c3d] hover:text-[#344c3d]/80 transition-colors font-medium py-2 flex items-center gap-1 ${
                    location.pathname === item.path ? 'font-semibold' : ''
                  }`}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                  )}
                </Link>
                
                {/* Active indicator */}
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#344c3d]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {/* Dropdown menu */}
                {item.dropdown && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[200px]">
                      {item.dropdown.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="block px-4 py-3 text-[#344c3d] hover:bg-[#344c3d]/5 transition-colors text-sm"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Auth/Profile Buttons - Enhanced with animations */}
          <div className="hidden lg:flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : !modelUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Are you a model?</span>
                <motion.button 
                  onClick={handleLoginClick}
                  className="bg-[#344c3d] text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-1 hover:bg-[#344c3d]/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in <span className="text-xs">→</span>
                </motion.button>
                <motion.button 
                  onClick={handleRegisterClick}
                  className="border border-[#344c3d] text-[#344c3d] px-4 py-2 rounded-full font-medium text-sm flex items-center gap-1 hover:bg-[#344c3d]/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register <UserPlus size={16} />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {modelUser.profileImage ? (
                    <img 
                      src={modelUser.profileImage} 
                      alt={modelUser.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#344c3d]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#344c3d] text-white flex items-center justify-center font-medium">
                      {modelUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.div>
                
                <div className="text-sm font-medium text-gray-700">
                  Hello, {modelUser.name}
                </div>
                
                <motion.button
                  onClick={() => navigate('/profile')}
                  className="p-2 rounded-full bg-[#344c3d]/10 hover:bg-[#344c3d]/20 transition-colors"
                  title="View Profile"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(52, 76, 61, 0.2)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <User size={18} className="text-[#344c3d]" />
                </motion.button>
                
                <motion.button
                  onClick={handleModelLogout}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                  title="Log out"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut size={18} className="text-red-600" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button with animation */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative z-10 p-2 text-[#344c3d] hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>

          {/* Mobile Menu - Enhanced with animations */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="fixed inset-0 bg-white z-50"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="container mx-auto pt-24 px-6 space-y-8">
                  <nav className="flex flex-col gap-6">
                    {navItems.map((item, index) => (
                      <div key={index}>
                        <Link
                          to={item.path}
                          className="text-[#344c3d] text-lg font-medium hover:text-[#344c3d]/80 transition-colors flex items-center justify-between"
                          onClick={() => !item.dropdown && setIsMenuOpen(false)}
                        >
                          {item.name}
                          {item.dropdown && (
                            <ChevronDown size={20} className="text-gray-400" />
                          )}
                        </Link>
                        
                        {item.dropdown && (
                          <div className="mt-2 ml-4 space-y-2">
                            {item.dropdown.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.path}
                                className="block py-2 text-[#344c3d]/80 hover:text-[#344c3d] transition-colors text-base"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {modelUser ? (
                      <>
                        <div className="border-t border-gray-200 pt-4 mt-2">
                          <div className="text-sm font-medium text-gray-700 mb-4">
                            Model Account: {modelUser.name}
                          </div>
                          
                          <motion.button
                            onClick={() => {
                              navigate('/profile');
                              setIsMenuOpen(false);
                            }}
                            className="text-[#344c3d] text-lg font-medium hover:text-[#344c3d]/80 transition-colors flex items-center gap-2 text-left mb-4 w-full"
                            whileHover={{ x: 5 }}
                          >
                            <User size={20} />
                            View Profile
                          </motion.button>
                          
                          <motion.button
                            onClick={() => {
                              handleModelLogout();
                              setIsMenuOpen(false);
                            }}
                            className="text-red-600 text-lg font-medium hover:text-red-700 transition-colors flex items-center gap-2 text-left w-full"
                            whileHover={{ x: 5 }}
                          >
                            <LogOut size={20} />
                            Log out
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <div className="border-t border-gray-200 pt-4 mt-2">
                        <div className="text-sm font-medium text-gray-700 mb-4">
                          Model Account
                        </div>
                        
                        <motion.button
                          onClick={() => {
                            navigate('/login');
                            setIsMenuOpen(false);
                          }}
                          className="text-[#344c3d] text-lg font-medium hover:text-[#344c3d]/80 transition-colors flex items-center gap-2 text-left mb-4 w-full"
                          whileHover={{ x: 5 }}
                        >
                          <User size={20} />
                          Sign In
                        </motion.button>
                        
                        <motion.button
                          onClick={() => {
                            navigate('/register');
                            setIsMenuOpen(false);
                          }}
                          className="text-[#344c3d] text-lg font-medium hover:text-[#344c3d]/80 transition-colors flex items-center gap-2 text-left w-full"
                          whileHover={{ x: 5 }}
                        >
                          <UserPlus size={20} />
                          Register
                        </motion.button>
                      </div>
                    )}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Spacer to prevent content from being hidden under the fixed header when scrolled */}
      {isScrolled && <div className="h-16"></div>}

      {/* Auth Modal */}
      {showModelAuth && <ModelAuthModal />}
    </>
  );
}