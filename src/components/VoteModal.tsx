import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestant: {
    _id: string;
    fullName: string;
    portraitPhoto: string;
    votes?: { count: number };
  };
  onVoteSuccess: () => void;
}

export default function VoteModal({ isOpen, onClose, contestant, onVoteSuccess }: VoteModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Vote amount options
  const regularVotes = [5, 10, 15];
  const premiumVotes = [1000, 2000, 5000];

  // Check if user has already voted for this contestant
  useEffect(() => {
    if (isOpen && contestant._id) {
      checkPreviousVote();
    }
  }, [isOpen, contestant._id]);

  const checkPreviousVote = () => {
    // Get voted contestants from localStorage
    const votedContestants = JSON.parse(localStorage.getItem('votedContestants') || '[]');
    
    // Check if current contestant is in the list
    if (votedContestants.includes(contestant._id)) {
      setHasVoted(true);
    } else {
      setHasVoted(false);
    }
  };

  const handleVoteSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsConfirming(true);
  };

  const handleVoteSubmit = async () => {
    if (!selectedAmount) return;
    if (hasVoted) {
      toast.error("You've already voted for this contestant");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/votes', {
        applicationId: contestant._id,
        voteAmount: selectedAmount
      });

      // Save voted contestant to localStorage
      const votedContestants = JSON.parse(localStorage.getItem('votedContestants') || '[]');
      votedContestants.push(contestant._id);
      localStorage.setItem('votedContestants', JSON.stringify(votedContestants));
      
      toast.success(`Successfully voted for ${contestant.fullName}!`);
      onVoteSuccess();
      onClose();
    } catch (error: any) {
      console.error('Vote error:', error);
      
      // Check if error is due to already voted
      if (error.response?.status === 403 && error.response?.data?.message?.includes('already voted')) {
        // Update local storage to match server state
        const votedContestants = JSON.parse(localStorage.getItem('votedContestants') || '[]');
        if (!votedContestants.includes(contestant._id)) {
          votedContestants.push(contestant._id);
          localStorage.setItem('votedContestants', JSON.stringify(votedContestants));
        }
        toast.error("You've already voted for this contestant");
      } else {
        toast.error(error.response?.data?.message || 'Failed to cast vote');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cancelVote = () => {
    setIsConfirming(false);
    setSelectedAmount(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-[#344c3d] to-[#4a5d4c]"></div>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
              >
                <X className="w-4 h-4 text-[#344c3d]" />
              </button>
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${contestant.portraitPhoto}`}
                    alt={contestant.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#344c3d]">{contestant.fullName}</h3>
                <div className="flex items-center justify-center mt-2">
                  <Heart className="w-4 h-4 text-rose-500 mr-1.5" />
                  <span className="text-sm text-[#6b5d4d]">
                    {contestant.votes?.count?.toLocaleString() || 0} votes
                  </span>
                </div>
              </div>

              {hasVoted ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center text-amber-600 mb-2">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <h4 className="font-medium">You've already voted</h4>
                  </div>
                  <p className="text-sm text-center text-amber-700">
                    You have already cast your vote for this contestant. Each person can only vote once per contestant.
                  </p>
                  <Button 
                    className="w-full mt-4 bg-[#344c3d] hover:bg-[#344c3d]/90 text-white"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              ) : !isConfirming ? (
                <>
                  <div className="text-center mb-4">
                    <h4 className="font-medium text-[#344c3d]">Choose your vote amount</h4>
                    <p className="text-sm text-[#6b5d4d] mt-1">Support this contestant with your votes</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Heart className="w-4 h-4 text-rose-500 mr-1.5" />
                        <h5 className="text-sm font-medium text-[#344c3d]">Regular Votes</h5>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {regularVotes.map(amount => (
                          <button
                            key={amount}
                            onClick={() => handleVoteSelect(amount)}
                            className="bg-[#f5f5f0] hover:bg-[#e8f4ff] border border-[#344c3d]/10 rounded-lg p-3 transition-colors flex flex-col items-center"
                          >
                            <span className="font-bold text-[#344c3d]">{amount}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Sparkles className="w-4 h-4 text-amber-500 mr-1.5" />
                        <h5 className="text-sm font-medium text-[#344c3d]">Premium Votes (3% discount)</h5>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {premiumVotes.map(amount => (
                          <button
                            key={amount}
                            onClick={() => handleVoteSelect(amount)}
                            className="bg-[#fff4e0] hover:bg-[#ffe8c0] border border-amber-200 rounded-lg p-3 transition-colors flex flex-col items-center relative"
                          >
                            <span className="font-bold text-[#344c3d]">{amount}</span>
                            <span className="text-xs text-[#6b5d4d] mt-1">
                              {(amount - (amount * 0.03)).toFixed(0)} ETB
                            </span>
                            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">-3%</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[#f5f5f0] rounded-xl p-4 mb-4">
                  <h4 className="font-medium text-[#344c3d] text-center mb-3">Confirm your vote</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#6b5d4d]">Vote amount:</span>
                      <span className="font-medium text-[#344c3d]">{selectedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b5d4d]">Total cost:</span>
                      <span className="text-[#94f87d]">Free</span>   
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#f0e6db] hover:bg-[#e6dcd1] text-[#6b5d4d]"
                      onClick={cancelVote}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-[#344c3d] hover:bg-[#344c3d]/90 text-white flex items-center justify-center"
                      onClick={handleVoteSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-1.5" /> Vote Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}