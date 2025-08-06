import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { FiEdit, FiMail, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full border-4 border-white"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                  <p className="text-blue-100 capitalize">{user?.role}</p>
                  <div className="flex items-center mt-2">
                    <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-white text-sm">4.9 (127 reviews)</span>
                  </div>
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {user?.bio || 'No bio available. Click "Edit Profile" to add your bio.'}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {user?.skills?.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added yet.</p>
                    )}
                  </div>
                </div>

                {user?.role === 'freelancer' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Languages</h2>
                    <div className="space-y-2">
                      {user?.languages?.length > 0 ? (
                        user.languages.map((language, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-700">{language.name}</span>
                            <span className="text-sm text-gray-500 capitalize">{language.level}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No languages added yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">{user?.email}</span>
                    </div>
                    {user?.location && (
                      <div className="flex items-center">
                        <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        Member since {new Date(user?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {user?.role === 'freelancer' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response time:</span>
                        <span className="font-medium">1 hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recent delivery:</span>
                        <span className="font-medium">1 day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Orders completed:</span>
                        <span className="font-medium">{user?.completedOrders || 0}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user?.isEmailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Phone</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user?.isPhoneVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user?.isPhoneVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
