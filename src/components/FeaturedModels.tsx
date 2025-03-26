"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Instagram, Star, Twitter, Eye } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [ref, inView] = useInView({ threshold: 0 })
  
  const fetchContestants = useCallback(async () => {
    try {
      setLoading(true)
      // Fix the API call to handle the doubled response issue
      const response = await fetch(`${API_BASE_URL}/applications/approved?page=${page}&limit=6`)
      if (!response.ok) throw new Error("Failed to fetch contestants")
      
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        // Process the data to handle potential duplicates by using uniqueKey
        const newContestants = data.data.map((contestant: any) => ({
          ...contestant,
          uniqueKey: `${contestant._id}_${Math.random().toString(36).substr(2, 9)}`
        }))
        
        // Filter out duplicates when adding to existing contestants
        setContestants(prev => {
          const existingIds = new Set(prev.map(c => c._id))
          const filteredNew = newContestants.filter(c => !existingIds.has(c._id))
          return [...prev, ...filteredNew]
        })
        
        setHasMore(data.currentPage < data.totalPages)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast.error("Failed to load contestants")
    } finally {
      setLoading(false)
    }
  }, [page])
  
  useEffect(() => {
    fetchContestants()
  }, [fetchContestants])
  
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1)
    }
  }, [inView, hasMore, loading])
  
  return (
    <section className="w-full bg-gradient-to-b from-[#f8f5f0] to-[#f0ebe0] py-24 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#344c3d]/10 to-transparent pointer-events-none"></div>
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
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center mb-4 px-4 py-1.5 bg-[#344c3d]/10 rounded-full"
          >
            <Star className="w-4 h-4 text-[#344c3d] mr-2" />
            <span className="text-[#344c3d] font-medium text-sm">Rising Stars</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#344c3d] mb-6 font-['Clash_Display'] tracking-tight"
          >
            Featured Models
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#344c3d] to-transparent mx-auto mb-8"
          />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#344c3d]/80 mx-auto text-lg max-w-3xl leading-relaxed"
          >
            Discover our exceptional talent showcasing elegance, charisma, and professionalism.
            These rising stars are making their mark in the fashion industry.
          </motion.p>
        </div>

        {/* Models Grid - Updated with more columns for smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
          {contestants.map((contestant, index) => (
            <ModelCard 
              key={contestant.uniqueKey} 
              contestant={contestant} 
              index={index}
              navigate={navigate}
            />
          ))}
          
          {/* Loading skeletons - Updated for smaller cards */}
          {loading && Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-[#344c3d]/10 animate-pulse shadow-md"
            >
              <div className="aspect-[3/4] bg-[#344c3d]/5"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-[#344c3d]/5 rounded-lg w-3/4"></div>
                <div className="h-4 bg-[#344c3d]/5 rounded-lg w-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Load more trigger */}
        {hasMore && !loading && (
          <div ref={ref} className="h-10 mt-16 flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-12 h-12 border-t-2 border-[#344c3d] rounded-full animate-spin"
            />
          </div>
        )}
        
        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => navigate('/models')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-[#344c3d]/20 text-[#344c3d] rounded-full hover:bg-[#344c3d]/5 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            <span>View All Models</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// Improved ModelCard component with smaller frame and better vote display
function ModelCard({ contestant, index, navigate }: { 
  contestant: Contestant, 
  index: number,
  navigate: (path: string) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
  
  // Format vote count with proper thousands separator
  const formattedVotes = new Intl.NumberFormat('en-US').format(contestant.votes.count)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-[#344c3d]/10 transition-all duration-300 shadow-sm hover:shadow-md hover:translate-y-[-4px] h-full flex flex-col">
        {/* Image container - Smaller and more refined */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
          
          <img
            src={`${apiBaseUrl}/${contestant.portraitPhoto.replace(/\\/g, "/")}`}
            alt={contestant.fullName}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=400&width=300"
            }}
          />
          
          {/* Social links - More subtle and professional */}
          <div className="absolute top-3 right-3 z-20 flex gap-1.5">
            {contestant.socialLinks?.instagram && (
              <a 
                href={contestant.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full hover:bg-white/40 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-white" />
              </a>
            )}
            {contestant.socialLinks?.twitter && (
              <a 
                href={contestant.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full hover:bg-white/40 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5 text-white" />
              </a>
            )}
          </div>
          
          {/* View profile button - Small and elegant */}
          <div className="absolute bottom-3 right-3 z-20">
            <button
              onClick={() => navigate(`/models/${contestant._id}`)}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors"
              aria-label="View profile"
            >
              <Eye className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          
          {/* Name overlay - More compact and elegant */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
            <h3 className="text-base font-semibold mb-0.5 line-clamp-1">{contestant.fullName}</h3>
            <p className="text-xs text-white/80 line-clamp-1">{contestant.competition.title}</p>
          </div>
        </div>
        
        {/* Vote display - Beautiful and professional */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-[2px]"></div>
              <Star className="w-3.5 h-3.5 text-amber-500 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#344c3d] leading-tight">{formattedVotes}</span>
              <span className="text-[10px] text-[#344c3d]/60 leading-tight">votes</span>
            </div>
          </div>
          
          {/* Rank indicator if available */}
          {contestant.votes.count > 0 && (
            <div className="bg-[#344c3d]/5 px-2 py-0.5 rounded-full">
              <span className="text-xs font-medium text-[#344c3d]">
                {contestant.votes.count > 1000 ? "Top Model" : "Rising Star"}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

