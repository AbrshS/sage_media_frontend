import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, ChevronUp, Heart,  Medal, ArrowLeft, Users,  Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import VoteModal from '@/components/VoteModal';
import axios  from 'axios';

// Update the Contestant interface to match the API response
interface Contestant {
  _id: string;
  fullName: string;
  portraitPhoto: string;
  votes: number;  // Changed from { count: number }
  isVerified: boolean;
  competition: {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [activeTab, setActiveTab] = useState<'top' | 'all'>('top');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Vote modal state
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);

  useEffect(() => {
    fetchContestants();
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update the fetchContestants function
  const fetchContestants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/applications/approved');
      if (response.data.success) {
        // Sort contestants by vote count in descending order
        const sortedContestants = response.data.data.sort((a: Contestant, b: Contestant) => 
          (b.votes || 0) - (a.votes || 0)
        );
        setContestants(sortedContestants);
      } else {
        throw new Error(response.data.message || 'Failed to fetch contestants');
      }
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setIsVoteModalOpen(true);
  };

  const handleVoteSuccess = () => {
    // Refresh the leaderboard after successful vote
    fetchContestants();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loading size="lg" fullScreen />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load leaderboard</h2>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <Button onClick={fetchContestants}>Try Again</Button>
      </div>
    );
  }

  const topPerformers = contestants.slice(0, 5);
  const totalVotes = contestants.reduce((sum, contestant) => sum + (contestant.votes || 0), 0);

  return (
    <div className="bg-gradient-to-b from-[#f5f5f0] to-[#fff] min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-[#344c3d] hover:bg-[#344c3d]/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-[#344c3d]">Leaderboard</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 bg-gradient-to-r from-[#344c3d]/10 to-[#f5f5f0] rounded-2xl overflow-hidden shadow-sm border border-[#344c3d]/20"
        >
          <div className="p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-[#344c3d] mb-4"
              >
                Top Models Showcase
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#344c3d]/80 mb-6"
              >
                Discover the most talented models competing for the crown. Vote for your favorites and help them climb the ranks!
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm border border-[#344c3d]/20">
                  <div className="text-sm text-[#344c3d]/70 flex items-center">
                    <Heart className="w-4 h-4 mr-1.5 text-rose-500" />
                    Total Votes
                  </div>
                  <div className="text-2xl font-bold text-[#344c3d]">{totalVotes.toLocaleString()}</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm border border-[#344c3d]/20">
                  <div className="text-sm text-[#344c3d]/70 flex items-center">
                    <Users className="w-4 h-4 mr-1.5 text-[#344c3d]" />
                    Contestants
                  </div>
                  <div className="text-2xl font-bold text-[#344c3d]">{contestants.length}</div>
                </div>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="md:w-1/2 relative"
            >
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {topPerformers.slice(0, 3).map((contestant) => (
                  <div key={contestant._id} className="aspect-[3/4] rounded-lg overflow-hidden shadow-md relative group">
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${contestant.portraitPhoto}`}
                      alt={contestant.fullName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs font-medium truncate">{contestant.fullName}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-2 shadow-lg border border-[#f0e6db]">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs for Top Performers and All Contestants */}
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-[#344c3d]/10 pb-2">
            <button
              onClick={() => setActiveTab('top')}
              className={cn(
                "px-4 py-2 rounded-t-lg font-medium text-sm transition-colors",
                activeTab === 'top' 
                  ? "bg-[#344c3d] text-white" 
                  : "text-[#344c3d]/70 hover:text-[#344c3d] hover:bg-[#344c3d]/5"
              )}
            >
              <Trophy className="w-4 h-4 inline mr-1.5" />
              Top Performers
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-4 py-2 rounded-t-lg font-medium text-sm transition-colors",
                activeTab === 'all' 
                  ? "bg-[#344c3d] text-white" 
                  : "text-[#344c3d]/70 hover:text-[#344c3d] hover:bg-[#344c3d]/5"
              )}
            >
              <Users className="w-4 h-4 inline mr-1.5" />
              All Contestants
            </button>
          </div>
        </div>

        {/* Contestants Grid with Vote Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activeTab === 'top' ? contestants.slice(0, 12) : contestants).map((contestant, index) => (
            <motion.div
              key={contestant._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-[#344c3d]/10"
            >
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${contestant.portraitPhoto}`}
                    alt={contestant.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-bold shadow-sm border border-[#344c3d]/10 flex items-center">
                  {index < 3 ? (
                    <>
                      {index === 0 && <Crown className="w-3.5 h-3.5 text-amber-500 mr-1" />}
                      {index === 1 && <Medal className="w-3.5 h-3.5 text-gray-400 mr-1" />}
                      {index === 2 && <Award className="w-3.5 h-3.5 text-amber-700 mr-1" />}
                      #{index + 1}
                    </>
                  ) : (
                    <>#{index + 1}</>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#344c3d] mb-1 truncate">{contestant.fullName}</h3>
                
                <div className="flex items-center mb-3">
                  <Heart className="w-4 h-4 text-rose-500 mr-1.5" />
                  <span className="text-sm text-[#6b5d4d]">
                    {contestant.votes?.toLocaleString() || 0} votes
                  </span>
                </div>
                <Button 
                  className="w-full bg-[#344c3d] hover:bg-[#344c3d]/90 text-white"
                  onClick={() => handleVoteClick(contestant)}
                >
                  Vote Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-[#344c3d] text-white rounded-full shadow-lg hover:bg-[#344c3d]/90 transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Vote Modal */}
      {selectedContestant && (
        <VoteModal
          isOpen={isVoteModalOpen}
          onClose={() => setIsVoteModalOpen(false)}
          contestant={{
            ...selectedContestant,
            votes: { count: selectedContestant.votes }
          }}
          onVoteSuccess={handleVoteSuccess}
        />
      )}
    </div>
  );
}