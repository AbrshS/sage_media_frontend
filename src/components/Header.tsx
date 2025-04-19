import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { Info, XCircle } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    [0, 0.8, 0.95]
  );
  
  const headerBackdrop = useTransform(
    scrollY,
    [0, 100, 200],
    ["blur(0px)", "blur(8px)", "blur(10px)"]
  );
  
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0,0,0,0)", "0 4px 20px rgba(58, 75, 60, 0.1)"]
  );

  // Check if user is logged in
  // Add this function at the top of your component
  // First, update the isAuthenticated function
  const isAuthenticated = () => {
    const token = localStorage.getItem('modelToken');
    return !!token;
  };
  
  // Update the useEffect for auth check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('modelToken');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        setModelUser({ 
          id: userId, 
          name: localStorage.getItem('userName') || 'User'
        });
      } else {
        setModelUser(null);
      }
      setLoading(false);
    };
  
    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);


  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('modelToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setModelUser(null);
    navigate('/');
  };

  return (
    <motion.header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.8)" : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        boxShadow: isScrolled ? "0 4px 20px rgba(58, 75, 60, 0.1)" : "none",
        borderBottom: isScrolled ? `1px solid rgba(108, 188, 139, 0.1)` : "none"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Sage Media" className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium transition-colors">
              Home
            </Link>
            <Link to="/competitions" className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium transition-colors">
              Competitions
            </Link>
            <Link to="/models" className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium transition-colors">
              Models
            </Link>
            <Link to="/leaderboard" className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium transition-colors">
              Leaderboard
            </Link>
          </nav>

          {/* Auth Buttons / User Menu */}
       
         
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-[#e2f8e5] animate-pulse" />
            ) : isAuthenticated() ? (
              <div className="flex items-center space-x-2">
                <NotificationDropdown />
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-[#3a4b3c] hover:text-[#6cbc8b]"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost"
                  size="icon" 
                  className="text-[#3a4b3c] hover:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="text-[#3a4b3c] hover:text-[#6cbc8b]"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button 
                  className="bg-[#3a4b3c] text-white hover:bg-[#4e6a56]"
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#3a4b3c]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#6cbc8b]/10 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/competitions" 
              className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Competitions
            </Link>
            <Link 
              to="/models" 
              className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Models
            </Link>
            <Link 
              to="/leaderboard" 
              className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link 
              to="/about" 
              className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-[#3a4b3c] hover:text-[#6cbc8b] font-medium py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="pt-4 border-t border-[#6cbc8b]/10">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-[#e2f8e5] animate-pulse" />
              ) : isAuthenticated() ? (
                <div className="flex flex-col space-y-3">
                  <NotificationDropdown />
                  <Button 
                    variant="ghost" 
                    className="justify-start text-[#3a4b3c] hover:text-[#6cbc8b] hover:bg-white/20"
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span>Profile</span>
                  </Button>
                  <Button 
                    variant="ghost"
                    className="justify-start text-[#3a4b3c] hover:text-red-500"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="ghost" 
                    className="justify-start text-[#3a4b3c] hover:text-[#6cbc8b] hover:bg-white/20"
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    className="bg-[#3a4b3c] text-white hover:bg-[#4e6a56] transition-colors"
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}