import React from 'react';

interface AboutTabProps {
  profile: any;
  isModelProfile: boolean;
}

const AboutTab: React.FC<AboutTabProps> = ({ profile, isModelProfile }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">About {profile?.fullName}</h2>
        
        <div className="space-y-6">
          {/* Bio */}
          <div>
            <h3 className="text-lg font-medium mb-2">Bio</h3>
            <p className="text-gray-600">{profile?.bio || 'No bio available'}</p>
          </div>

          {/* Location */}
          {profile?.location && (
            <div>
              <h3 className="text-lg font-medium mb-2">Location</h3>
              <p className="text-gray-600">
                {profile.location.city}{profile.location.country ? `, ${profile.location.country}` : ''}
              </p>
            </div>
          )}

          {/* Social Media */}
          {profile?.socialMedia && Object.keys(profile.socialMedia).length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Social Media</h3>
              <div className="flex space-x-4">
                {Object.entries(profile.socialMedia).map(([platform, link]) => (
                  link && (
                    <a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#344c3d] transition-colors"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Model-specific information */}
          {isModelProfile && (
            <>
              <div>
                <h3 className="text-lg font-medium mb-2">Professional Experience</h3>
                <p className="text-gray-600">
                  {profile?.experience || 'No experience information available'}
                </p>
              </div>

              {profile?.achievements && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Achievements</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {profile.achievements.map((achievement: string, index: number) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutTab;