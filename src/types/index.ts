export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Book {
  isbn: string;
  title: string;
  authors: string[];
  publisher?: string;
  published_date?: string;
  description?: string;
  page_count?: number;
  categories?: string[];
  language?: string;
  image_thumbnail?: string;
}

export interface LibraryBook {
  book: Book;
  status: 'to_read' | 'reading' | 'read';
  added_at: string;
}

export interface UserStats {
  id: number;
  username: string;
  email: string;
  total_books: number;
  to_read: number;
  reading: number;
  read: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}