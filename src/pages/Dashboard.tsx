import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, Target } from 'lucide-react';
import { UserStats } from '../types';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await apiService.getUserStats();
        setStats(userStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <p className="text-gray-500 text-center">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: BookOpen,
      label: 'Total Books',
      value: stats.total_books,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      label: 'To Read',
      value: stats.to_read,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Clock,
      label: 'Reading',
      value: stats.reading,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: stats.read,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {stats.username}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {statCards.map(({ icon: Icon, label, value, color, bgColor }) => (
          <div key={label} className={`${bgColor} rounded-2xl p-6 transition-all hover:scale-105`}>
            <div className="flex items-center space-x-3">
              <div className={`${color} p-2 rounded-xl`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Progress */}
      {stats.total_books > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reading Progress</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-semibold text-gray-900">
                {Math.round((stats.read / stats.total_books) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.read / stats.total_books) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{stats.read} completed</span>
              <span>{stats.total_books} total</span>
            </div>
          </div>
        </div>
      )}

      {stats.total_books === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Library</h3>
          <p className="text-gray-600 mb-4">
            Use the scan button to add your first books and start tracking your reading journey.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;