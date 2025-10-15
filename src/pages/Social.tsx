import React from 'react';
import { Users, BookOpen, Heart, MessageCircle } from 'lucide-react';

const Social: React.FC = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Social</h1>
        <p className="text-gray-600">Connect with other book lovers</p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
        <div className="mb-6">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We're working on exciting social features to help you connect with fellow readers.
          </p>
        </div>

        {/* Feature Preview */}
        <div className="grid gap-4 mb-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Follow Friends</h3>
              <p className="text-sm text-gray-600">See what your friends are reading</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-green-500 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Share Libraries</h3>
              <p className="text-sm text-gray-600">Share your book collections</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Reading Challenges</h3>
              <p className="text-sm text-gray-600">Join reading challenges with friends</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-orange-500 p-2 rounded-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Book Discussions</h3>
              <p className="text-sm text-gray-600">Discuss books with your community</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Stay tuned for updates! In the meantime, keep building your library.
        </p>
      </div>
    </div>
  );
};

export default Social;