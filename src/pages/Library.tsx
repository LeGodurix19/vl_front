import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, CheckCircle, X, Trash2 } from 'lucide-react';
import { LibraryBook } from '../types';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Library: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const library = await apiService.getLibrary();
        setBooks(library);
      } catch (error) {
        console.error('Failed to fetch library:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_read': return 'bg-yellow-500';
      case 'reading': return 'bg-blue-500';
      case 'read': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'to_read': return 'To Read';
      case 'reading': return 'Reading';
      case 'read': return 'Read';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'to_read': return Target;
      case 'reading': return Clock;
      case 'read': return CheckCircle;
      default: return BookOpen;
    }
  };

  const handleBookClick = (book: LibraryBook) => {
    navigate(`/book/${book.book.isbn}`, { state: { book } });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Ma Bibliothèque</h1>
        <p className="text-gray-600">{books.length} livre{books.length !== 1 ? 's' : ''} dans votre collection</p>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun livre</h3>
          <p className="text-gray-600">
            Commencez à construire votre bibliothèque en scannant des codes-barres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((libraryBook) => {
            const StatusIcon = getStatusIcon(libraryBook.status);
            return (
              <div 
                key={libraryBook.book.isbn} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleBookClick(libraryBook)}
              >
                {/* Book Cover */}
                <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
                  <img
                    src={libraryBook.book.image_thumbnail || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'}
                    alt={libraryBook.book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop';
                    }}
                  />
                  
                  {/* Status Icon */}
                  <div className={`absolute top-3 right-3 ${getStatusColor(libraryBook.status)} p-2 rounded-full shadow-lg`}>
                    <StatusIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Library;