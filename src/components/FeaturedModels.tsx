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
  
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1)
    }
  }, [inView, hasMore, loading])
  
  useEffect(() => {
    fetchContestants()
  }, [fetchContestants])
  
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
  
  const handleProfileClick = (id: string) => {
    navigate(`/models/${id}`)
  }
  
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
        className="bg-white rounded-lg overflow-hidden border border-[#344c3d]/10 shadow-md animate-pulse"
      >
        <div className="aspect-[2/3] bg-gradient-to-b from-[#344c3d]/5 to-[#344c3d]/10"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-[#344c3d]/10 rounded-lg w-2/3"></div>
          <div className="h-4 bg-[#344c3d]/10 rounded-lg w-1/2"></div>
          <div className="flex justify-between items-center pt-4">
            <div className="h-8 bg-[#344c3d]/10 rounded-full w-24"></div>
            <div className="h-8 bg-[#344c3d]/10 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Unique background pattern - diagonal grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, #344c3d 1px, transparent 1px), linear-gradient(to bottom, #344c3d 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Unique decorative elements - hexagonal shapes */}
      <div className="absolute top-20 left-20 w-64 h-64 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#344c3d]">
          <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 w-96 h-96 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#344c3d]">
          <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Unique section header with staggered text */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center mb-4 px-4 py-1.5 bg-[#344c3d]/10 rounded-md"
          >
            <Award className="w-4 h-4 text-[#344c3d] mr-2" />
            <span className="text-[#344c3d] font-medium text-sm">TALENT SHOWCASE</span>
          </motion.div>
          
          <div className="relative h-24 mb-6 overflow-hidden">
            {["Exceptional", "Featured", "Talented"].map((word, i) => (
              <motion.h2
                key={word}
                className="text-4xl md:text-5xl font-bold text-[#344c3d] absolute w-full left-0 right-0"
                initial={{ opacity: 0, y: 40 }}
                animate={{ 
                  opacity: activeIndex % 3 === i ? 1 : 0,
                  y: activeIndex % 3 === i ? 0 : 40
                }}
                transition={{ duration: 0.6 }}
              >
                {word} <span className="text-[#344c3d]/70">Models</span>
              </motion.h2>
            ))}
          </div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[2px] w-24 bg-[#344c3d] mx-auto mb-8 origin-center"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-600 mx-auto text-lg leading-relaxed"
          >
            Discover our exceptional talent portfolio showcasing the most promising models in the industry.
            These rising stars represent the pinnacle of elegance, poise, and professional excellence.
          </motion.p>
        </div>

        {/* Unique carousel navigation - vertical dots with numbers */}
        <div className="flex justify-between items-center mb-12">
          <div className="hidden md:flex flex-col items-center gap-4 absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
            {Array.from({ length: Math.ceil(contestants.length / 3) }).map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => {
                  setActiveIndex(index)
                  setAutoplay(false)
                  if (autoplayRef.current) clearInterval(autoplayRef.current)
                }}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-[#344c3d] text-white' 
                    : 'bg-[#344c3d]/10 text-[#344c3d] hover:bg-[#344c3d]/20'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {/* Mobile navigation dots */}
          <div className="flex md:hidden items-center gap-2 mx-auto">
            {Array.from({ length: Math.ceil(contestants.length / 3) }).map((_, index) => (
              <button
                key={`dot-mobile-${index}`}
                onClick={() => {
                  setActiveIndex(index)
                  setAutoplay(false)
                  if (autoplayRef.current) clearInterval(autoplayRef.current)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-[#344c3d] w-8' 
                    : 'bg-[#344c3d]/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Unique models display - hexagonal grid layout */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`carousel-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
            >
              {loading && contestants.length === 0
                ? renderSkeletons()
                : contestants
                    .slice(activeIndex * 3, activeIndex * 3 + 3)
                    .map((contestant, idx) => (
                      <motion.div
                        key={contestant.uniqueKey}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="group"
                        style={{ 
                          transform: `translateY(${idx % 2 === 1 ? '40px' : '0px'})` 
                        }}
                      >
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-md border border-[#344c3d]/10 transition-all duration-500 group-hover:shadow-xl">
                          {/* Unique model image presentation with clip path */}
                          <div className="aspect-[3/4] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#344c3d] via-transparent to-transparent z-10 opacity-60"></div>
                            
                            {/* Unique image mask with clip-path */}
                            <div className="absolute inset-0 z-0" style={{ 
                              clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)'
                            }}>
                              <img
                                src={contestant.portraitPhoto ? `http://localhost:3000/${contestant.portraitPhoto.replace(/\\/g, "/")}` : "/placeholder-model.jpg"}
                                alt={contestant.fullName}
                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70) + 10}.jpg`;
                                }}
                              />
                            </div>
                            
                            {/* Top model badge */}
                            {idx === 0 && (
                              <div className="absolute top-4 right-4 z-30">
                                <div className="bg-[#344c3d] px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 text-white shadow-lg">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>Featured</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Unique vote count display */}
                            <div className="absolute bottom-4 left-4 z-20">
                              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 text-[#344c3d] shadow-sm">
                                <Star className="w-3 h-3 fill-[#344c3d]" />
                                <span>{contestant.votes?.count || 0} Votes</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Model Info with unique layout */}
                          <div className="p-6 relative">
                            {/* Unique name display with background element */}
                            <div className="relative mb-4">
                              <div className="absolute -left-2 -top-2 w-12 h-12 bg-[#344c3d]/10 rounded-md -z-10"></div>
                              <h3 className="text-xl font-bold text-[#344c3d] leading-tight">
                                {contestant.fullName}
                              </h3>
                              <p className="text-[#344c3d]/70 text-sm font-medium">
                                {contestant.competition?.title || "Elite Model"}
                              </p>
                            </div>
                            
                            {/* Action buttons with unique hover effects */}
                            <div className="flex items-center gap-3 mb-4">
                              <button
                                onClick={() => handleVote(contestant._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#344c3d] text-white rounded-md transition-all duration-300 overflow-hidden relative group/btn"
                              >
                                <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                <Star className="w-4 h-4 relative z-10 transition-colors duration-300 group-hover/btn:text-[#344c3d]" />
                                <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-[#344c3d]">Vote</span>
                              </button>
                              
                              <button
                                onClick={() => handleProfileClick(contestant._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#344c3d] text-[#344c3d] rounded-md transition-all duration-300 overflow-hidden relative group/btn"
                              >
                                <div className="absolute inset-0 bg-[#344c3d] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                <Eye className="w-4 h-4 relative z-10 transition-colors duration-300 group-hover/btn:text-white" />
                                <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">Profile</span>
                              </button>
                            </div>
                            
                            {/* Social links with unique animated hover */}
                            <div className="flex items-center justify-center gap-4">
                              {contestant.socialLinks?.instagram && (
                                <a
                                  href={contestant.socialLinks.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-9 h-9 rounded-md bg-[#344c3d]/10 flex items-center justify-center text-[#344c3d] transition-all duration-300 hover:bg-[#344c3d] hover:text-white hover:scale-110"
                                >
                                  <Instagram className="w-4 h-4" />
                                </a>
                              )}
                              {contestant.socialLinks?.twitter && (
                                <a
                                  href={contestant.socialLinks.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-9 h-9 rounded-md bg-[#344c3d]/10 flex items-center justify-center text-[#344c3d] transition-all duration-300 hover:bg-[#344c3d] hover:text-white hover:scale-110"
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
          
          {/* Unique navigation arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 md:translate-x-0 w-12 h-12 rounded-md flex items-center justify-center bg-white shadow-lg text-[#344c3d] hover:bg-[#344c3d] hover:text-white transition-all duration-300 z-20 opacity-80 hover:opacity-100"
            aria-label="Previous models"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 md:translate-x-0 w-12 h-12 rounded-md flex items-center justify-center bg-white shadow-lg text-[#344c3d] hover:bg-[#344c3d] hover:text-white transition-all duration-300 z-20 opacity-80 hover:opacity-100"
            aria-label="Next models"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Unique CTA button with animated arrow */}
        <div className="mt-16 text-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate('/leaderboard')}
            className="group inline-flex items-center gap-2 px-8 py-3 bg-[#344c3d] text-white rounded-md hover:bg-[#2a3e31] transition-all duration-300 font-medium shadow-md relative overflow-hidden"
          >
            <span className="relative z-10">View All Models</span>
            <motion.div
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
            <div className="absolute inset-0 bg-[#2a3e31] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </motion.button>
        </div>

        {/* Loading indicator */}
        {loading && contestants.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div className="w-12 h-12 rounded-md border-2 border-[#344c3d]/20 border-t-[#344c3d] animate-spin"></div>
          </div>
        )}

        {/* Invisible element for infinite scroll */}
        {hasMore && !loading && <div ref={ref} className="h-10 mt-8" />}
      </div>
    </section>
  )
}

