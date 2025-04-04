"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Instagram, Star, Twitter, Eye, Award, TrendingUp, ArrowRight } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

interface Contestant {
  uniqueKey: string
  _id: string
  fullName: string
  portraitPhoto: string
  votes: {
    count: number
  }
  competition: {
    title: string
  }
  socialLinks?: {
    instagram?: string
    twitter?: string
    tiktok?: string
  }
}

const API_BASE_URL = "http://localhost:3000/api"

export default function FeaturedModels() {
  const navigate = useNavigate()
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [ref, inView] = useInView({ threshold: 0 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  
  // Colors based on the design spec
  const colors = {
    color1: "#FFFFFF", // Text for names
    color2: "#D4AF37", // Text for titles and indicator dots
    color3: "#B8860B", // Borders and navigation arrows
    color4: "#1E3A29", // Social proof badges and gradient end
    color5: "#0A1F14", // Gradient start
  }
  
  const fetchContestants = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/applications/approved?page=${page}&limit=6`)
      if (!response.ok) throw new Error("Failed to fetch contestants")
      
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        const newContestants = data.data.map((contestant: any) => ({
          ...contestant,
          uniqueKey: `${contestant._id}_${Math.random().toString(36).substr(2, 9)}`
        }))
        
        setContestants(prev => {
          const existingIds = new Set(prev.map(c => c._id))
          const filteredNew = newContestants.filter((c: Contestant) => !existingIds.has(c._id));
          return [...prev, ...filteredNew]
        })
        
        setHasMore(data.currentPage < data.totalPages)
      }
    } catch (error) {
      console.error("Error fetching contestants:", error)
      setError("Failed to load featured models. Please try again later.")
      
      // In development, use sample data
      if (import.meta.env.DEV) {
        const sampleData = Array.from({ length: 6 }, (_, i) => ({
          uniqueKey: `sample_${i}_${Math.random().toString(36).substr(2, 9)}`,
          _id: `sample_${i}`,
          fullName: ["Sophia Laurent", "Alexander Black", "Isabella Montero", "Marcus Chen", "Zara Williams", "James Okonkwo"][i],
          portraitPhoto: `/sample-model-${i + 1}.jpg`,
          votes: { count: Math.floor(Math.random() * 1000) + 100 },
          competition: { title: "Elite Model Search 2023" },
          socialLinks: {
            instagram: "https://instagram.com",
            twitter: "https://twitter.com"
          }
        }))
        setContestants(sampleData)
      }
    } finally {
      setLoading(false)
    }
  }, [page])
  
  // Load more when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1)
    }
  }, [inView, hasMore, loading])
  
  // Initial load
  useEffect(() => {
    fetchContestants()
  }, [fetchContestants])
  
  // Autoplay carousel
  useEffect(() => {
    if (autoplay && contestants.length > 0) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % Math.ceil(contestants.length / 3))
      }, 5000)
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay, contestants.length])
  
  // Handle vote click
  const handleVote = async (id: string) => {
    const token = localStorage.getItem('modelToken')
    if (!token) {
      toast.error("Please sign in to vote")
      navigate('/login', { state: { returnTo: '/' } })
      return
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        toast.success("Vote recorded successfully!")
        setContestants(prev => 
          prev.map(contestant => 
            contestant._id === id 
              ? { 
                  ...contestant, 
                  votes: { 
                    ...contestant.votes, 
                    count: contestant.votes.count + 1 
                  } 
                } 
              : contestant
          )
        )
      } else {
        toast.error(data.message || "Failed to record vote")
      }
    } catch (error) {
      console.error("Error voting:", error)
      toast.error("Failed to record vote. Please try again.")
    }
  }
  
  // Handle profile click
  const handleProfileClick = (id: string) => {
    navigate(`/models/${id}`)
  }
  
  // Navigation functions
  const nextSlide = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    setAutoplay(false)
    setActiveIndex(prev => (prev + 1) % Math.ceil(contestants.length / 3))
  }
  
  const prevSlide = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    setAutoplay(false)
    setActiveIndex(prev => (prev - 1 + Math.ceil(contestants.length / 3)) % Math.ceil(contestants.length / 3))
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div 
        key={`skeleton-${index}`} 
        className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-lg animate-pulse"
      >
        <div className="aspect-[2/3] bg-gradient-to-b from-[#1E3A29]/10 to-[#0A1F14]/5"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-white/10 rounded-lg w-2/3"></div>
          <div className="h-4 bg-white/10 rounded-lg w-1/2"></div>
          <div className="flex justify-between items-center pt-4">
            <div className="h-8 bg-white/10 rounded-full w-24"></div>
            <div className="h-8 bg-white/10 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#F8F9FA]">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F0F2F5] opacity-80"></div>
      <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] bg-repeat opacity-5"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-[#D4AF37]/5 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-t from-[#1E3A29]/5 to-transparent rounded-tr-full"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center mb-4 px-4 py-1.5 bg-[#1E3A29]/5 rounded-full"
          >
            <Award className="w-4 h-4 text-[#D4AF37] mr-2" />
            <span className="text-[#1E3A29] font-medium text-sm">Elite Talent Showcase</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E3A29] mb-6 font-['Clash_Display'] tracking-tight"
          >
            Featured Models
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-[#1E3A29]/80 mx-auto text-lg leading-relaxed"
          >
            Discover our exceptional talent portfolio showcasing the most promising models in the industry.
            These rising stars represent the pinnacle of elegance, poise, and professional excellence.
          </motion.p>
        </div>

        {/* Carousel Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-lg text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all duration-300"
            aria-label="Previous models"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(contestants.length / 3) }).map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => {
                  setActiveIndex(index)
                  setAutoplay(false)
                  if (autoplayRef.current) clearInterval(autoplayRef.current)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-[#D4AF37] w-8' 
                    : 'bg-[#D4AF37]/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-lg text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-all duration-300"
            aria-label="Next models"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Models Carousel */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`carousel-${activeIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {loading && contestants.length === 0
                ? renderSkeletons()
                : contestants
                    .slice(activeIndex * 3, activeIndex * 3 + 3)
                    .map((contestant) => (
                      <motion.div
                        key={contestant.uniqueKey}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative group"
                      >
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl h-full transform transition-transform duration-500 group-hover:scale-[1.02]">
                          {/* Premium badge for top models */}
                          {contestants.indexOf(contestant) < 2 && (
                            <div className="absolute top-4 right-4 z-30">
                              <div className="bg-[#1E3A29] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 text-white shadow-lg">
                                <TrendingUp className="w-3 h-3" />
                                <span>Top Model</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Model Image with radial gradient overlay */}
                          <div className="aspect-[2/3] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F14] via-[#1E3A29]/50 to-transparent z-10"></div>
                            <img
                              src={contestant.portraitPhoto ? `http://localhost:3000/${contestant.portraitPhoto.replace(/\\/g, "/")}` : "/placeholder-model.jpg"}
                              alt={contestant.fullName}
                              className="w-full h-full object-cover transition-transform duration-5000 ease-in-out group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 10}.jpg`;
                              }}
                            />
                            
                            {/* Circular avatar with color-3 border */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
                              <div className="w-20 h-20 rounded-full border-4 border-[#B8860B] overflow-hidden bg-white">
                                <img
                                  src={contestant.portraitPhoto ? `http://localhost:3000/${contestant.portraitPhoto.replace(/\\/g, "/")}` : "/placeholder-model.jpg"}
                                  alt={contestant.fullName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 10}.jpg`;
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Model Info */}
                          <div className="p-6 pt-12 text-center">
                            <h3 className="text-xl font-bold text-[#1E3A29] mb-1 font-['Clash_Display']">{contestant.fullName}</h3>
                            <p className="text-[#D4AF37] text-sm mb-4 font-medium">{contestant.competition?.title || "Elite Model"}</p>
                            
                            {/* Social proof badge in color-4 */}
                            <div className="flex justify-center mb-6">
                              <div className="bg-[#1E3A29]/10 rounded-full px-4 py-1.5 inline-flex items-center gap-2">
                                <Star className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-[#1E3A29] font-medium">{contestant.votes?.count || 0} Votes</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-center items-center gap-4">
                              {/* Vote Button */}
                              <button
                                onClick={() => handleVote(contestant._id)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#1E3A29] hover:bg-[#0A1F14] text-white rounded-full transition-all duration-300"
                              >
                                <Star className="w-4 h-4" />
                                <span>Vote</span>
                              </button>
                              
                              {/* View Profile Button */}
                              <button
                                onClick={() => handleProfileClick(contestant._id)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1E3A29] text-[#1E3A29] hover:bg-[#1E3A29] hover:text-white rounded-full transition-all duration-300"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Profile</span>
                              </button>
                            </div>
                            
                            {/* Social Links */}
                            <div className="flex justify-center items-center gap-3 mt-4">
                              {contestant.socialLinks?.instagram && (
                                <a
                                  href={contestant.socialLinks.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-[#1E3A29]/10 hover:bg-[#1E3A29] flex items-center justify-center text-[#1E3A29] hover:text-white transition-all duration-300"
                                >
                                  <Instagram className="w-4 h-4" />
                                </a>
                              )}
                              {contestant.socialLinks?.twitter && (
                                <a
                                  href={contestant.socialLinks.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-[#1E3A29]/10 hover:bg-[#1E3A29] flex items-center justify-center text-[#1E3A29] hover:text-white transition-all duration-300"
                                >
                                  <Twitter className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate('/models')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E3A29] text-white rounded-full hover:bg-[#0A1F14] transition-all duration-300 font-medium shadow-lg"
          >
            <span>Explore All Models</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Loading indicator */}
        {loading && contestants.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#1E3A29]/20 border-t-[#D4AF37] animate-spin"></div>
          </div>
        )}

        {/* Invisible element for infinite scroll */}
        {hasMore && !loading && <div ref={ref} className="h-10 mt-8" />}
      </div>
    </section>
  )
}

