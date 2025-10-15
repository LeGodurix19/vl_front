import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, CheckCircle, Trash2 } from 'lucide-react';
import { LibraryBook } from '../types';
import { apiService } from '../services/api';

const BookDetail: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useState<LibraryBook | null>(location.state?.book || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!book && isbn) {
      // Si pas de book dans le state, récupérer depuis l'API
      const fetchBook = async () => {
        setIsLoading(true);
        try {
          const library = await apiService.getLibrary();
          const foundBook = library.find(b => b.book.isbn === isbn);
          if (foundBook) {
            setBook(foundBook);
          } else {
            setError('Livre non trouvé');
          }
        } catch (err) {
          setError('Erreur lors du chargement du livre');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBook();
    }
  }, [isbn, book]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_read': return 'bg-yellow-500';
      case 'reading': return 'bg-blue-500';
      case 'read': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'to_read': return Target;
      case 'reading': return Clock;
      case 'read': return CheckCircle;
      default: return Target;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'to_read': return 'À lire';
      case 'reading': return 'En cours';
      case 'read': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!book) return;
    
    setIsLoading(true);
    try {
      await apiService.updateBookStatus(book.book.isbn, newStatus);
      setBook({
        ...book,
        status: newStatus as 'to_read' | 'reading' | 'read'
      });
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBook = async () => {
    if (!book) return;
    
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce livre de votre bibliothèque ?');
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await apiService.removeBooks([book.book.isbn]);
      navigate('/library');
    } catch (err) {
      setError('Erreur lors de la suppression du livre');
      setIsLoading(false);
    }
  };

  if (isLoading && !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Livre non trouvé'}</p>
          <button
            onClick={() => navigate('/library')}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl"
          >
            Retour à la bibliothèque
          </button>
        </div>
      </div>
    );
  }

  const CurrentStatusIcon = getStatusIcon(book.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/library')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Détails du livre</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Book Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex space-x-4 mb-6">
            <img
              src={book.book.image_thumbnail || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'}
              alt={book.book.title}
              className="w-24 h-32 object-cover rounded-xl shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop';
              }}
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{book.book.title}</h2>
              <p className="text-gray-600 mb-2">{book.book.authors.join(', ')}</p>
              {book.book.publisher && (
                <p className="text-sm text-gray-500 mb-1">{book.book.publisher}</p>
              )}
              {book.book.published_date && (
                <p className="text-sm text-gray-500 mb-3">{book.book.published_date}</p>
              )}
              
              {/* Current Status */}
              <div className="flex items-center space-x-2">
                <div className={`${getStatusColor(book.status)} p-2 rounded-full`}>
                  <CurrentStatusIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">{getStatusLabel(book.status)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {book.book.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{book.book.description}</p>
            </div>
          )}

          {/* Book Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {book.book.page_count && (
              <div>
                <span className="text-gray-500">Pages:</span>
                <span className="ml-2 font-medium">{book.book.page_count}</span>
              </div>
            )}
            {book.book.language && (
              <div>
                <span className="text-gray-500">Langue:</span>
                <span className="ml-2 font-medium">{book.book.language}</span>
              </div>
            )}
            {book.book.categories && book.book.categories.length > 0 && (
              <div className="col-span-2">
                <span className="text-gray-500">Catégories:</span>
                <span className="ml-2 font-medium">{book.book.categories.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Change */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut de lecture</h3>
          <div className="space-y-3">
            {['to_read', 'reading', 'read'].map((status) => {
              const StatusIcon = getStatusIcon(status);
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isLoading}
                  className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${
                    book.status === status 
                      ? `${getStatusColor(status)} text-white shadow-lg` 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    book.status === status ? 'bg-white/20' : getStatusColor(status)
                  }`}>
                    <StatusIcon className={`w-5 h-5 ${
                      book.status === status ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <span className="font-medium text-lg">{getStatusLabel(status)}</span>
                  {book.status === status && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Remove Book */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <button
            onClick={handleRemoveBook}
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Trash2 size={20} />
            <span>Supprimer de la bibliothèque</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;