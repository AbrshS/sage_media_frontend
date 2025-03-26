import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface PortfolioImage {
  _id: string;
  image: string;
  createdAt: string;
}

interface PortfolioTabProps {
  userId: string;
  isOwnProfile?: boolean;
  loading?: boolean;
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({ userId, isOwnProfile = false, loading = false }) => {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [isLoading, setIsLoading] = useState(loading);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Add the missing handleFileChange function
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchPortfolioImages();
  }, [userId]);

  // Remove this entire fragment of code that's causing the error
  // The proper handleUpload function is already defined below
  
  useEffect(() => {
    fetchPortfolioImages();
  }, [userId]);

  // Update the API endpoints in fetchPortfolioImages
  const fetchPortfolioImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users/portfolio/user/${userId}`);
      setImages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching portfolio images:', error);
      toast.error('Failed to load portfolio images');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the handleUpload function
  // Keep only this version of handleUpload and remove the duplicate one
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }
    
    setIsUploading(true);
    
    const uploadData = new FormData();
    uploadData.append('image', selectedFile);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/users/portfolio/upload`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Image uploaded successfully');
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchPortfolioImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Update the handleDelete function
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/users/portfolio/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        toast.success('Image deleted');
        setImages(images.filter(img => img._id !== id));
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#344c3d]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Upload Section */}
      {isOwnProfile && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Portfolio</h2>
            
            {!previewUrl ? (
              <label className="bg-[#344c3d] text-white px-4 py-2 rounded-md hover:bg-[#344c3d]/90 transition-colors flex items-center cursor-pointer">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            )}
          </div>
          
          {previewUrl && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Upload this photo?</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    This photo will be added to your portfolio.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-4 py-2 bg-[#344c3d] text-white rounded-md hover:bg-[#344c3d]/90 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        'Upload'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Images Grid - Instagram Style */}
      {images.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No photos in portfolio yet</p>
          {isOwnProfile && (
            <label className="mt-4 px-4 py-2 bg-[#344c3d] text-white rounded-md hover:bg-[#344c3d]/90 transition-colors cursor-pointer">
              Add Your First Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
          {images.map(img => (
            <div key={img._id} className="relative aspect-square group">
              <img 
                src={`${API_URL}/uploads/portfolio/${img.image}`} 
                alt="Portfolio" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300?text=Image+Not+Found";
                }}
              />
              
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={() => handleDelete(img._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioTab;