"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Calendar, Clock, Award, ArrowRight, Sparkles, TrendingUp, Users, DollarSign, Search, Filter, ChevronDown, X } from "lucide-react"
import { format } from 'date-fns'
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import CompetitionApplicationForm from "./CompetitionApplicationForm"

// Types
interface Competition {
  _id: string
  title: string
  description: string
  competitionImage: string
  bannerImage?: string
  startDate: string
  endDate: string
  applicationFee: number
  status: 'upcoming' | 'active' | 'completed'
  participants: any[]
  daysUntilStart: number
  daysUntilEnd: number
}

interface ApiResponse {
  success: boolean
  data: Competition[]
  totalCompetitions: number
  currentPage: number
  totalPages: number
  error?: string
}

// Constants
const API_BASE_URL = "http://localhost:3000";
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

// Sample data for fallback
const sampleCompetitions = [
  {
    _id: "1",
    title: "Summer Fashion Show 2024",
    description: "Join us for the most prestigious fashion event of the summer season. Showcase your talent and style.",
    image: "/placeholder.svg?height=240&width=360",
  },
  {
    _id: "2",
    title: "Model of the Year 2024",
    description: "Annual competition to discover the next top model. Open for all aspiring models.",
    image: "/placeholder.svg?height=240&width=360",
  },
  {
    _id: "3",
    title: "Photogenic Contest",
    description: "Show your best angles and win amazing prizes in our photogenic competition.",
    image: "/placeholder.svg?height=240&width=360",
  },
];

// Error Alert Component
const ErrorAlert = ({ message }: { message: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 p-5 text-red-500 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-r-lg shadow-lg"
  >
    <AlertCircle className="h-5 w-5" />
    <p className="text-sm font-medium">{message}</p>
  </motion.div>
);

// Status Badge Helper - Updated for consistent color scheme
const getStatusStyles = (status: string) => {
  switch(status) {
    case 'active':
      return {
        bg: 'bg-[#344c3d]',
        text: 'text-white',
        icon: <TrendingUp className="w-3 h-3 mr-1" />
      };
    case 'upcoming':
      return {
        bg: 'bg-amber-500',
        text: 'text-white',
        icon: <Calendar className="w-3 h-3 mr-1" />
      };
    default:
      return {
        bg: 'bg-gray-500',
        text: 'text-white',
        icon: <Clock className="w-3 h-3 mr-1" />
      };
  }
};

// Main Component
interface Props {
  initialCompetition?: string | null;
}

export default function CompetitionSection({ initialCompetition }: Props) {
  // State variables remain unchanged
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(initialCompetition || null);
  const [formOpen, setFormOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  // Refs
  const competitionsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('modelToken');
    setIsAuthenticated(!!token);
    
    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      const token = localStorage.getItem('modelToken');
      setIsAuthenticated(!!token);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch competitions data
  const fetchCompetitions = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      let queryParams = `page=${page}&limit=6`;
      if (searchTerm) queryParams += `&search=${encodeURIComponent(searchTerm)}`;
      if (filterStatus) queryParams += `&status=${filterStatus}`;
      
      const response = await fetch(`${API_BASE_URL}/api/competitions?${queryParams}`);
      const result: ApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch competitions');
      }
      
      if (result.success && Array.isArray(result.data)) {
        const formattedCompetitions = result.data.map(competition => ({
          ...competition,
          image: competition.competitionImage 
            ? `${API_BASE_URL}/${competition.competitionImage.replace(/\\/g, "/")}`
            : "/placeholder.svg?height=240&width=360"
        }));
        
        setCompetitions(prev => page === 1 ? formattedCompetitions : [...prev, ...formattedCompetitions]);
        setHasMore(result.currentPage < result.totalPages);
      } else {
        throw new Error("Invalid data structure received from API");
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
      if (import.meta.env.DEV || retryCount >= RETRY_COUNT) {
        // Use sample data in development or after max retries
        const formattedSampleData: Competition[] = sampleCompetitions.map(comp => ({
          _id: comp._id,
          title: comp.title,
          description: comp.description,
          competitionImage: comp.image,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          applicationFee: 0,
          status: 'upcoming',
          participants: [],
          daysUntilStart: 0,
          daysUntilEnd: 30
        }));
        setCompetitions(formattedSampleData);
        setHasMore(false);
      } else {
        // Retry with exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(() => fetchCompetitions(retryCount + 1), delay);
        setError('Failed to load competitions. Retrying...');
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterStatus]);
  
  // Load competitions on mount and when page changes
  useEffect(() => {
    setPage(1); // Reset page when search or filter changes
    fetchCompetitions();
  }, [fetchCompetitions, searchTerm, filterStatus]);

  // Handle apply button click
  const handleApply = (competitionId: string) => {
    if (isAuthenticated) {
      setSelectedCompetition(competitionId);
      setFormOpen(true);
    } else {
      toast.error('Please sign in to apply for competitions');
      navigate('/login', { 
        state: { 
          returnTo: '/competitions',
          competitionId 
        } 
      });
    }
  };

  // Close application form
  const closeForm = () => {
    setFormOpen(false);
    setSelectedCompetition(null);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.current) {
      setSearchTerm(searchRef.current.value);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    if (searchRef.current) {
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };

  // Handle filter change
  const handleFilterChange = (status: string | null) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
  };

  // Handle card click for expanded view
  const handleCardClick = (id: string) => {
    setSelectedCard(id === selectedCard ? null : id);
  };

  // Render competition cards - Simplified design
  const renderCompetitionCards = () => {
    if (loading && competitions.length === 0) {
      return Array.from({ length: 3 }).map((_, index) => (
        <motion.div 
          key={`skeleton-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm animate-pulse"
        >
          <div className="h-64 bg-gray-100"></div>
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-100 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
            <div className="h-10 bg-gray-100 rounded-lg w-full mt-4"></div>
          </div>
        </motion.div>
      ));
    }
    
    if (competitions.length === 0) {
      return (
        <div className="col-span-full text-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-lg shadow-md max-w-lg mx-auto border border-gray-200"
          >
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Competitions Available</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus 
                ? "No competitions match your search criteria. Try adjusting your filters."
                : "We're preparing something extraordinary. Check back soon for exclusive modeling opportunities."}
            </p>
            {(searchTerm || filterStatus) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus(null);
                  if (searchRef.current) searchRef.current.value = "";
                }}
                className="mt-6 px-6 py-2 bg-[#344c3d] text-white rounded-md text-sm font-medium hover:bg-[#2a3e31] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        </div>
      );
    }
    
    return competitions.map((competition, index) => (
      <motion.div
        key={competition._id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={`group relative ${viewMode === 'list' ? 'col-span-full' : ''}`}
        onClick={() => viewMode === 'list' && handleCardClick(competition._id)}
      >
        <div className={`bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
          {/* Card Image */}
          <div className={`relative ${viewMode === 'list' ? 'w-1/3 min-w-[240px]' : 'aspect-[3/4]'} overflow-hidden`}>
            <img 
              src={competition.bannerImage 
                ? `${API_BASE_URL}/${competition.bannerImage.replace(/\\/g, '/')}`
                : competition.competitionImage 
                  ? `${API_BASE_URL}/${competition.competitionImage.replace(/\\/g, '/')}`
                  : "/placeholder.svg?height=400&width=300"
              }
              alt={competition.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg?height=400&width=300";
              }}
            />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-20">
              <div className={`${getStatusStyles(competition.status).bg} px-3 py-1.5 rounded-md text-xs font-medium flex items-center shadow-sm`}>
                {getStatusStyles(competition.status).icon}
                <span>{competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}</span>
              </div>
            </div>
            
            {/* Featured Tag - Example for special competitions */}
            {index === 0 && (
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-purple-600 px-3 py-1.5 rounded-md text-xs font-medium flex items-center shadow-sm text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span>Featured</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Card Content */}
          <div className={`p-6 flex flex-col flex-grow ${viewMode === 'list' ? 'w-2/3' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                {competition.title}
              </h3>
              
              {viewMode === 'list' && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {format(new Date(competition.startDate), 'MMM dd')} - {format(new Date(competition.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
            
            <p className={`text-gray-600 text-sm mb-4 ${viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2'} flex-grow`}>
              {competition.description}
            </p>
            
            {viewMode === 'grid' && (
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {format(new Date(competition.startDate), 'MMM dd')} - {format(new Date(competition.endDate), 'MMM dd, yyyy')}
                </span>
              </div>
            )}
            
            {/* Stats Row */}
            <div className={`grid ${viewMode === 'list' ? 'grid-cols-4 gap-4' : 'grid-cols-3 gap-2'} mb-5`}>
              <div className="bg-gray-50 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 mb-1">Participants</p>
                <p className="text-sm font-semibold text-gray-900">{competition.participants?.length || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 mb-1">Entry Fee</p>
                <p className="text-sm font-semibold text-gray-900">${competition.applicationFee}</p>
              </div>
              <div className="bg-gray-50 rounded-md p-2 text-center">
                <p className="text-xs text-gray-500 mb-1">Days Left</p>
                <p className="text-sm font-semibold text-gray-900">{competition.daysUntilEnd}</p>
              </div>
              {viewMode === 'list' && (
                <div className="bg-gray-50 rounded-md p-2 text-center">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{competition.status}</p>
                </div>
              )}
            </div>
            
            {/* Apply Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApply(competition._id);
              }}
              disabled={competition.status === 'completed'}
              className={`w-full py-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2
                ${competition.status === 'completed' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#344c3d] text-white hover:bg-[#2a3e31]'
                }`}
            >
              {competition.status === 'completed' ? (
                'Competition Ended'
              ) : (
                <>
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Expanded Card Details (for list view) - Simplified */}
        {viewMode === 'list' && selectedCard === competition._id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white rounded-lg p-6 shadow-md border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Competition Details</h4>
                <p className="text-gray-600 mb-4">{competition.description}</p>
                
                <h4 className="text-lg font-bold text-gray-900 mb-3">Requirements</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                  <li>Age: 18-30 years</li>
                  <li>Professional portfolio</li>
                  <li>Valid ID/Passport</li>
                  <li>Application fee: ${competition.applicationFee}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#344c3d] flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Application Period</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(competition.startDate), 'MMMM dd, yyyy')} - {format(new Date(competition.endDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#344c3d]/80 flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Selection Process</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(competition.endDate), 'MMMM dd, yyyy')} - {format(new Date(new Date(competition.endDate).getTime() + 14 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#344c3d]/60 flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Final Event</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(new Date(competition.endDate).getTime() + 30 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(competition._id);
                  }}
                  disabled={competition.status === 'completed'}
                  className={`mt-6 w-full py-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2
                    ${competition.status === 'completed' 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#344c3d] text-white hover:bg-[#2a3e31]'
                    }`}
                >
                  {competition.status === 'completed' ? (
                    'Competition Ended'
                  ) : (
                    <>
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    ));
  };

  return (
    <div className="w-full py-24 sm:py-32 bg-w -mt-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 pointer-events-none"></div>
      <motion.div 
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-[#344c3d]/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border border-[#344c3d]/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container mx-auto px-4 max-w-[1920px] relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center mb-4 px-4 py-1.5 bg-[#344c3d]/10 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-[#344c3d] mr-2" />
            <span className="text-[#344c3d] font-medium text-sm">Exclusive Opportunities</span>
          </motion.div>
          
          <div     
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            Join Our Exclusive Competition
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#344c3d] to-transparent mx-auto mb-8"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-neutral-500 mx-auto text-lg leading-relaxed"
          >
            Showcase your talent on the global stage. Our prestigious competitions connect you with 
            industry leaders, offering unparalleled exposure and career-defining opportunities.
          </motion.p>
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-4 shadow-lg mb-10 mx-4 sm:mx-6 lg:mx-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search competitions..."
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#344c3d]/10 focus:outline-none focus:ring-2 focus:ring-[#344c3d]/20 focus:border-[#344c3d]/30"
                defaultValue={searchTerm}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>
            
            <div className="flex gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#344c3d]/10 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-5 w-5 text-[#344c3d]" />
                  <span className="text-[#344c3d]">
                    {filterStatus ? `Status: ${filterStatus}` : "Filter"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-[#344c3d] transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#344c3d]/10 overflow-hidden z-50">
                    <div className="p-2">
                      <button
                        onClick={() => handleFilterChange(null)}
                        className="w-full text-left px-3 py-2 text-sm text-[#344c3d] hover:bg-[#344c3d]/5 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>All Competitions</span>
                        {filterStatus === null && <div className="w-2 h-2 rounded-full bg-[#344c3d]"></div>}
                      </button>
                      <button
                        onClick={() => handleFilterChange('active')}
                        className="w-full text-left px-3 py-2 text-sm text-[#344c3d] hover:bg-[#344c3d]/5 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>Active</span>
                        {filterStatus === 'active' && <div className="w-2 h-2 rounded-full bg-[#344c3d]"></div>}
                      </button>
                      <button
                        onClick={() => handleFilterChange('upcoming')}
                        className="w-full text-left px-3 py-2 text-sm text-[#344c3d] hover:bg-[#344c3d]/5 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>Upcoming</span>
                        {filterStatus === 'upcoming' && <div className="w-2 h-2 rounded-full bg-[#344c3d]"></div>}
                      </button>
                      <button
                        onClick={() => handleFilterChange('completed')}
                        className="w-full text-left px-3 py-2 text-sm text-[#344c3d] hover:bg-[#344c3d]/5 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>Completed</span>
                        {filterStatus === 'completed' && <div className="w-2 h-2 rounded-full bg-[#344c3d]"></div>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            
              {/* View Mode Toggle */}
              <div className="flex rounded-xl border border-[#344c3d]/10 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 flex items-center justify-center ${
                    viewMode === 'grid' 
                      ? 'bg-[#344c3d] text-white' 
                      : 'bg-white text-[#344c3d] hover:bg-[#344c3d]/5'
                  } transition-colors`}
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 flex items-center justify-center ${
                    viewMode === 'list' 
                      ? 'bg-[#344c3d] text-white' 
                      : 'bg-white text-[#344c3d] hover:bg-[#344c3d]/5'
                  } transition-colors`}
                  aria-label="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Error message */}
        {error && (
          <div className="mb-8">
            <ErrorAlert message={error} />
          </div>
        )}
        
        {/* Competition Cards */}
        <div 
          ref={competitionsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mt-8 px-4 sm:px-6 lg:px-8"
        >
          {renderCompetitionCards()}
        </div>
        
        {/* Load More Button */}
        {!loading && competitions.length > 0 && hasMore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-[#344c3d]/20 text-[#344c3d] rounded-full hover:bg-[#344c3d]/5 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
            >
              <span>Discover More Competitions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        
   
        
   
      </div>
      

      {formOpen && selectedCompetition && (
        <CompetitionApplicationForm
          isOpen={formOpen}
          onClose={closeForm}
          competitionId={selectedCompetition}
        />
      )}
    </div> 
  );
}