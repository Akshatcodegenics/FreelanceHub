import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { gigAPI } from '../../services/api';
import { FiUpload, FiX, FiPlus, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Validation schema
const gigSchema = z.object({
  title: z.string().min(1, 'Title is required').max(80, 'Title must be less than 80 characters'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  description: z.string().min(1, 'Description is required').min(120, 'Description must be at least 120 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(5, 'Maximum 5 tags allowed'),
  basicPrice: z.number().min(5, 'Minimum price is $5').max(10000, 'Maximum price is $10,000'),
  basicDeliveryTime: z.number().min(1, 'Minimum delivery time is 1 day').max(30, 'Maximum delivery time is 30 days'),
  basicDescription: z.string().min(1, 'Package description is required'),
  basicFeatures: z.array(z.string()).min(1, 'At least one feature is required'),
});

const CreateGig = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [features, setFeatures] = useState(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      tags: [],
      basicFeatures: [''],
    },
  });

  const categories = [
    { value: 'graphics-design', label: 'Graphics & Design' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'writing-translation', label: 'Writing & Translation' },
    { value: 'video-animation', label: 'Video & Animation' },
    { value: 'music-audio', label: 'Music & Audio' },
    { value: 'programming-tech', label: 'Programming & Tech' },
  ];

  const addTag = () => {
    if (newTag.trim() && tags.length < 5 && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const updateFeature = (index, value) => {
    const updatedFeatures = features.map((feature, i) => i === index ? value : feature);
    setFeatures(updatedFeatures);
    setValue('basicFeatures', updatedFeatures.filter(f => f.trim()));
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      const updatedFeatures = features.filter((_, i) => i !== index);
      setFeatures(updatedFeatures);
      setValue('basicFeatures', updatedFeatures.filter(f => f.trim()));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const gigData = {
        ...data,
        images,
        pricing: {
          basic: {
            price: data.basicPrice,
            deliveryTime: data.basicDeliveryTime,
            description: data.basicDescription,
            features: data.basicFeatures.filter(f => f.trim()),
            revisions: 1,
          },
        },
      };

      const response = await gigAPI.create(gigData);
      toast.success('Gig created successfully!');
      navigate(`/gigs/${response.data.slug}`);
    } catch (error) {
      console.error('Error creating gig:', error);
      toast.error('Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Gig</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gig Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="I will do something I'm really good at"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <input
                    {...register('subcategory')}
                    type="text"
                    placeholder="e.g., Logo Design"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  placeholder="Describe your service in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Tags *
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={tags.length >= 5}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
                )}
              </div>
            </div>

            {/* Pricing & Packages */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Pricing & Packages</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Package</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      {...register('basicPrice', { valueAsNumber: true })}
                      type="number"
                      min="5"
                      max="10000"
                      placeholder="25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.basicPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.basicPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time (days) *
                    </label>
                    <input
                      {...register('basicDeliveryTime', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="30"
                      placeholder="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.basicDeliveryTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.basicDeliveryTime.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Description *
                  </label>
                  <textarea
                    {...register('basicDescription')}
                    rows={3}
                    placeholder="Describe what's included in this package..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  {errors.basicDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.basicDescription.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features Included *
                  </label>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="e.g., High-resolution files"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <FiPlus className="w-4 h-4 mr-1" />
                      Add Feature
                    </button>
                  </div>
                  {errors.basicFeatures && (
                    <p className="mt-1 text-sm text-red-600">{errors.basicFeatures.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/freelancer')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Gig'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
