import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gigAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const response = await gigAPI.getById(id);
      setGig(response.data);
    } catch (error) {
      console.error('Error fetching gig:', error);
      navigate('/dashboard/freelancer');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Gig</h1>
          <p className="text-gray-600">Edit gig functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default EditGig;
