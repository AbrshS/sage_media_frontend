import  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CompetitionSection from '../../components/CompetitionSection';

const Competitions = () => {
  const location = useLocation();
  const [openApplication, setOpenApplication] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a competition ID to open from navigation state
    if (location.state?.openApplication) {
      setOpenApplication(location.state.openApplication);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <CompetitionSection initialCompetition={openApplication} />
    </div>
  );
};

export default Competitions;
