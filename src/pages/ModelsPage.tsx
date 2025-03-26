import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, CheckCircle, TrendingUp, MapPin, Instagram, ChevronDown } from 'lucide-react';

// Update the Model interface to match the API response
interface Model {
  _id: string;
  fullName: string;
  portraitPhoto: string;
  bio: string;
  location: {
    city: string;
    country: string;
  };
  isVerified: boolean;
  socialMedia: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
  status: string;
  votes: {
    count: number;
  };
}

const ModelsPage = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalModels, setTotalModels] = useState(0);
  
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}/api/applications/approved?page=${page}&limit=12`);
        const data = await response.json();
        
        if (data.success) {
          if (page === 1) {
            setModels(data.data);
          } else {
            setModels(prev => [...prev, ...data.data]);
          }
          
          setTotalModels(data.totalCount || 0);
          setHasMore(data.currentPage < data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [page, apiBaseUrl]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'verified' ? model.isVerified :
      filter === 'trending' ? (model.votes?.count > 100) : true;
    return matchesSearch && matchesFilter;
  });

  // Sort the filtered models
  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === 'newest') return 0; // Assume the API already returns newest first
    if (sortBy === 'votes') return (b.votes?.count || 0) - (a.votes?.count || 0);
    if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
    return 0;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f0] to-white">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[40vh] overflow-hidden">
        {/* Background Image with Parallax */}
        <div className="absolute inset-0 bg-[#344c3d] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ y: [0, -15, 0], scale: 1.05 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url("/models-collage.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(3px)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#344c3d]/90 to-[#344c3d]/70"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Discover Our Models
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Explore our diverse portfolio of talented models and find the perfect match for your next project
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f8f5f0] to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-5 mb-10 border border-[#344c3d]/10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search models by name..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#344c3d]/20 focus:outline-none focus:ring-2 focus:ring-[#344c3d]/30 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#344c3d]/5 text-[#344c3d] hover:bg-[#344c3d]/10 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {['all', 'verified', 'trending'].map((filterType) => (
                  <button 
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
                      filter === filterType 
                        ? 'bg-[#344c3d] text-white' 
                        : 'bg-[#344c3d]/5 text-[#344c3d] hover:bg-[#344c3d]/10'
                    }`}
                  >
                    {filterType === 'verified' && <CheckCircle className="h-4 w-4" />}
                    {filterType === 'trending' && <TrendingUp className="h-4 w-4" />}
                    {filterType === 'all' && <Star className="h-4 w-4" />}
                    <span>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                  </button>
                ))}
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-[#344c3d]/20 bg-white text-[#344c3d] focus:outline-none focus:ring-2 focus:ring-[#344c3d]/30"
              >
                <option value="newest">Newest First</option>
                <option value="votes">Most Votes</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
          
          {/* Advanced filters - conditionally shown */}
          {showFilters && (
            <motion.div 
              className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Additional filters can be added here */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-[#344c3d]/20 bg-white text-[#344c3d] focus:outline-none focus:ring-2 focus:ring-[#344c3d]/30">
                  <option value="">All Locations</option>
                  <option value="africa">Africa</option>
                  <option value="europe">Europe</option>
                  <option value="america">America</option>
                  <option value="asia">Asia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-[#344c3d]/20 bg-white text-[#344c3d] focus:outline-none focus:ring-2 focus:ring-[#344c3d]/30">
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-[#344c3d]/20 bg-white text-[#344c3d] focus:outline-none focus:ring-2 focus:ring-[#344c3d]/30">
                  <option value="">All Types</option>
                  <option value="fashion">Fashion</option>
                  <option value="commercial">Commercial</option>
                  <option value="runway">Runway</option>
                  <option value="fitness">Fitness</option>
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-[#344c3d]">
            {loading && page === 1 ? 'Loading models...' : 
             `Showing ${sortedModels.length} ${sortedModels.length === 1 ? 'model' : 'models'}`}
          </h2>
          
          <button 
            onClick={handleSearchFocus}
            className="text-[#344c3d] hover:text-[#344c3d]/70 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Models Grid with Animation */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading && page === 1 ? (
            // Skeleton loaders
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden border border-[#344c3d]/5"
              >
                <div className="aspect-[3/4] bg-[#344c3d]/5"></div>
                <div className="p-5">
                  <div className="h-5 bg-[#344c3d]/5 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-[#344c3d]/5 rounded-lg w-full mb-3"></div>
                  <div className="h-4 bg-[#344c3d]/5 rounded-lg w-2/3"></div>
                </div>
              </motion.div>
            ))
          ) : sortedModels.length > 0 ? (
            sortedModels.map(model => (
              <ModelCard key={model._id} model={model} apiBaseUrl={apiBaseUrl} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-[#344c3d]/30 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-[#344c3d] mb-2">No models found</h3>
                <p className="text-[#344c3d]/70 max-w-md mx-auto">
                  We couldn't find any models matching your search criteria. Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                    setSortBy('newest');
                  }}
                  className="mt-6 px-6 py-2 bg-[#344c3d] text-white rounded-xl hover:bg-[#344c3d]/90 transition-colors"
                >
                  Reset Filters
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
        
        {/* Load More Button */}
        {hasMore && !loading && sortedModels.length > 0 && (
          <div className="flex justify-center mb-16">
            <motion.button
              onClick={loadMore}
              className="px-8 py-3 bg-white border border-[#344c3d]/20 text-[#344c3d] rounded-xl hover:bg-[#344c3d]/5 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Load More Models
            </motion.button>
          </div>
        )}
        
        {/* Loading indicator for pagination */}
        {loading && page > 1 && (
          <div className="flex justify-center mb-16">
            <div className="w-12 h-12 border-t-2 border-[#344c3d] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Separate ModelCard component for better organization
const ModelCard = ({ model, apiBaseUrl }: { model: Model, apiBaseUrl: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/profile/${model._id}`} className="block h-full">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#344c3d]/5 h-full flex flex-col">
          <div className="relative aspect-[3/4] overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
            
            <img
              src={model.portraitPhoto 
                ? `${apiBaseUrl}/${model.portraitPhoto.replace(/\\/g, "/")}` 
                : "/images/default-profile.jpg"}
              alt={model.fullName}
              className="w-full h-full object-cover transition-transform duration-500 ease-out"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            
            {/* Verification badge */}
            {model.isVerified && (
              <div className="absolute top-2 right-2 z-20 bg-white/20 backdrop-blur-sm p-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            
            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-20">
              <h3 className="text-lg font-semibold mb-0.5 line-clamp-1">{model.fullName}</h3>
              
              {/* Location with icon */}
              {model.location?.city && (
                <div className="flex items-center text-sm text-white/80">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  <span className="line-clamp-1">
                    {model.location.city}
                    {model.location.country && `, ${model.location.country}`}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-3 flex-grow flex flex-col justify-between">
            <p className="text-sm text-[#344c3d]/80 line-clamp-2">
              {model.bio || 'No bio available'}
            </p>
            
            {/* Stats and social */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#344c3d]/5">
              {/* Votes count */}
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-sm font-medium text-[#344c3d]">
                  {new Intl.NumberFormat().format(model.votes?.count || 0)}
                </span>
              </div>
              
              {/* Social links */}
              {model.socialMedia?.instagram && (
                <a 
                  href={model.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-full bg-[#344c3d]/5 hover:bg-[#344c3d]/10 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#344c3d]" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ModelsPage;