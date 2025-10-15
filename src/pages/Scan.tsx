import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Plus, Minus, Camera, Trash2 } from 'lucide-react';
import { Book } from '../types';
import { apiService } from '../services/api';
import { barcodeScanner } from '../services/barcodeScanner';
import { validateISBN, formatISBN } from '../utils/isbn';

interface ScannedBook extends Book {
  status: 'to_read' | 'reading' | 'read';
  alreadyOwned?: boolean;
}

const Scan: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isScanningPaused, setIsScanningPaused] = useState(false);
  const [scannedBooks, setScannedBooks] = useState<ScannedBook[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [showBookCard, setShowBookCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [scannedISBNs, setScannedISBNs] = useState<Set<string>>(new Set());
  const [alreadyOwnedISBNs, setAlreadyOwnedISBNs] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  // Démarrer automatiquement le scan au chargement de la page
  useEffect(() => {
    const initCamera = async () => {
      await startScanning();
    };
    
    initCamera();
    
    return () => {
      if (isScanning) {
        barcodeScanner.stopScanning();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startScanning = async () => {
    setError('');
    setCameraError('');

    try {
      if (videoRef.current) {
        setIsScanning(true);
        await barcodeScanner.startScanning(
          videoRef.current,
          handleBarcodeResult,
          handleScanError
        );
      }
    } catch (err) {
      setCameraError(err instanceof Error ? err.message : 'Accès à la caméra refusé ou non disponible');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    barcodeScanner.stopScanning();
    setIsScanning(false);
  };

  const handleBarcodeResult = async (isbn: string) => {
    // Ne pas traiter si le scan est en pause, si une carte est affichée, ou si l'ISBN est déjà traité
    if (isScanningPaused || showBookCard || isLoading) {
      return;
    }

    // Vérifier les doublons dans les livres scannés ET dans la bibliothèque
    if (alreadyOwnedISBNs.has(isbn)) {
      setError('Vous possédez déjà ce livre');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (scannedISBNs.has(isbn) || scannedBooks.some(book => book.isbn === isbn)) {
      setTimeout(() => setError(''), 3000);
      return;
    } 

    // Valider l'ISBN côté client
    if (!validateISBN(isbn)) {
      setError('Code-barres invalide (ISBN requis)');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Marquer l'ISBN comme en cours de traitement pour éviter les doublons
    scannedISBNs.add(isbn);
    setIsLoading(true);
    
    try {
      // Vérifier si le livre est déjà dans la bibliothèque de l'utilisateur
      const library = await apiService.getLibrary();
      const alreadyOwned = library.some(book => book.book.isbn === isbn);

      if (alreadyOwned) {
        setError('Vous possédez déjà ce livre');
        alreadyOwnedISBNs.add(isbn);
        setIsLoading(false);
        setTimeout(() => setError(''), 3000);
        return;
      }

      // Rechercher les informations du livre
      const book = await apiService.lookupBook(isbn);
      setCurrentBook(book);
      setShowBookCard(true);
      setIsScanningPaused(true);
    } catch (err) {
      // Retirer l'ISBN si erreur
      setScannedISBNs(prev => {
        const newSet = new Set(prev);
        newSet.delete(isbn);
        return newSet;
      });
      setError('Livre non trouvé dans la base de données');
      setTimeout(() => setError(''), 3000);
      console.log('Livre non trouvé:', formatISBN(isbn));
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanError = (error: Error) => {
    // Ignorer les erreurs normales de scan (pas de code-barres détecté)
    if (!error.message.includes('No MultiFormat Readers were able to detect the code')) {
      console.error('Erreur de scan:', error);
    }
  };

  const addBookToList = (status: 'to_read' | 'reading' | 'read') => {
    if (currentBook) {
      const scannedBook: ScannedBook = {
        ...currentBook,
        status
      };
      setScannedBooks([scannedBook, ...scannedBooks]);
      setCurrentBook(null);
      setShowBookCard(false);
      setIsScanningPaused(false);
      setError('');
    }
  };

  const discardBook = () => {
    if (currentBook) {
      // Retirer l'ISBN de la liste temporaire si on rejette le livre
      scannedISBNs.delete(currentBook.isbn);
      setCurrentBook(null);
      setShowBookCard(false);
      setIsScanningPaused(false);
    }
  };

  const removeFromList = (isbn: string) => {
    setScannedBooks(scannedBooks.filter(book => book.isbn !== isbn));
    setScannedISBNs(scannedISBNs => {
      const newSet = new Set(scannedISBNs);
      newSet.delete(isbn);
      return newSet;
    });
  };

  const validateAllBooks = async () => {
    if (scannedBooks.length === 0) return;

    setIsLoading(true);
    try {
      const booksToAdd = scannedBooks.map(book => ({
        isbn: book.isbn,
        status: book.status
      }));

      await apiService.addBooks(booksToAdd);
      setScannedBooks([]);
      setScannedISBNs(new Set());
      setAlreadyOwnedISBNs(new Set());
      setError('');
      // Afficher un message de succès
      alert(`${booksToAdd.length} livre${booksToAdd.length !== 1 ? 's' : ''} ajouté${booksToAdd.length !== 1 ? 's' : ''} à votre bibliothèque !`);
    } catch (err) {
      setError('Échec de l\'ajout des livres à la bibliothèque');
    } finally {
      setIsLoading(false);
    }
  };

  // Interface d'erreur caméra
  if (cameraError) {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Scanner des livres</h1>
          <p className="text-gray-600">Scannez les codes-barres pour ajouter des livres</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-sm w-full text-center">
            <Camera className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur caméra</h3>
            <p className="text-red-600 text-sm mb-4">{cameraError}</p>
            <button
              onClick={startScanning}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interface principale avec caméra
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Vue caméra */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      
      {/* Overlay du scanner */}
      <div className="fixed inset-0 bg-black/30 pointer-events-none">
        {/* Zone de scan */}
        <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2">
          <div className="bg-white/10 border-2 border-white rounded-lg h-32 flex items-center justify-center pointer-events-none">
            <div className="text-white text-center">
              <p className="text-lg font-semibold mb-2">Positionnez le code-barres ici</p>
              {isLoading && <p className="text-sm">Recherche du livre...</p>}
            </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="fixed bottom-32 left-4 right-4 pointer-events-none">
            <div className="bg-red-500/90 text-white p-3 rounded-xl text-center pointer-events-none">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Carte de livre intégrée */}
        {showBookCard && currentBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 pointer-events-auto">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl pointer-events-auto">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={currentBook.image_thumbnail || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'}
                  alt={currentBook.title}
                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{currentBook.title}</h3>
                  <p className="text-gray-600 text-xs line-clamp-1">{currentBook.authors.join(', ')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-base font-semibold text-gray-900 mb-3">Ajouter comme :</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addBookToList('to_read')}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-3 rounded-xl text-sm font-semibold transition-colors"
                  >
                    À lire
                  </button>
                  <button
                    onClick={() => addBookToList('reading')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-3 rounded-xl text-sm font-semibold transition-colors"
                  >
                    En cours
                  </button>
                  <button
                    onClick={() => addBookToList('read')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-3 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Fini
                  </button>
                  <button
                    onClick={discardBook}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des livres scannés */}
      {scannedBooks.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Livres scannés ({scannedBooks.length})</h3>
            <button
              onClick={validateAllBooks}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center space-x-1 transition-colors"
            >
              <Check size={14} />
              <span>{isLoading ? 'Ajout...' : 'Tout ajouter'}</span>
            </button>
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {scannedBooks.map((book) => (
              <div key={book.isbn} className="relative flex-shrink-0">
                <div className="w-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={book.image_thumbnail || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'}
                    alt={book.title}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop';
                    }}
                  />
                  <div className="p-1 text-center">
                    <div className={`w-2 h-2 rounded-full mx-auto ${
                      book.status === 'to_read' ? 'bg-yellow-500' :
                      book.status === 'reading' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromList(book.isbn)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <Minus size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;