import {  useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import CompetitionSection from '../../components/CompetitionSection';

interface Eligibility {
  minAge?: number;
  maxAge?: number;
  gender: string;
  otherRequirements?: string;
}

interface Competition {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  status: string;
  applicationFee: number;
  eligibility: Eligibility;
  bannerImage?: string;
  competitionImage?: string;
  participants: any[];
  daysUntilStart: number;
  daysUntilEnd: number;
}

const Competitions = () => {
  const [openApplication, setOpenApplication] = useState<string | null>(null);
  const [competitions] = useState<Competition[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-emerald-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            International Fashion Competitions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Showcase your talent on the global stage and compete with the world's finest models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.map((competition) => (
            <motion.div
              key={competition._id}
              className="relative h-[500px] rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredId(competition._id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              {/* Competition Image */}
              <img
                src={competition.bannerImage || competition.competitionImage || '/default-competition.jpg'}
                alt={competition.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay with Competition Details */}
              <motion.div
                className="absolute inset-0 bg-black/70 p-6 flex flex-col justify-between transform transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === competition._id ? 1 : 0 }}
              >
                <div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-white text-sm mb-4 ${getStatusColor(competition.status)}`}>
                    {competition.status}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{competition.title}</h3>
                  <p className="text-gray-200 mb-4">{competition.description}</p>

                  {/* Competition Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {format(new Date(competition.startDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{competition.daysUntilEnd} days left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">${competition.applicationFee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{competition.participants.length} participants</span>
                    </div>
                  </div>

                  {/* Eligibility Section */}
                  <div className="mt-6">
                    <h4 className="text-white font-semibold mb-2">Eligibility</h4>
                    <ul className="text-gray-200 text-sm space-y-1">
                      {competition.eligibility.minAge && (
                        <li>Age: {competition.eligibility.minAge} - {competition.eligibility.maxAge} years</li>
                      )}
                      <li>Gender: {competition.eligibility.gender}</li>
                      {competition.eligibility.otherRequirements && (
                        <li>{competition.eligibility.otherRequirements}</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  className="w-full py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpenApplication(competition._id)}
                >
                  Apply Now
                </motion.button>
              </motion.div>

              {/* Category Badge */}
              {competition.category && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                  {competition.category}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {openApplication && (
        <CompetitionSection initialCompetition={openApplication} />
      )}
    </div>
  );
};

export default Competitions;
