import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';

interface Book {
  book_id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    description: '',
    sec_password: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (search?: string) => {
    try {
      setLoading(true);
      const data = await apiService.getBooks(search);
      setBooks(Array.isArray(data) ? data : data.books || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createBook(newBook);
      setNewBook({ title: '', description: '', sec_password: '' });
      setShowCreateForm(false);
      fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create book');
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await apiService.deleteBook(id);
        fetchBooks();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete book');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Books</h1>
        <p className="mt-2 text-gray-600">Manage your book collection</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search books..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
        <Button onClick={() => setShowCreateForm(true)}>
          Create Book
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Book</h2>
          <form onSubmit={handleCreateBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newBook.title}
                onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={newBook.description}
                onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Security Password (Optional)</label>
              <input
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newBook.sec_password}
                onChange={(e) => setNewBook(prev => ({ ...prev, sec_password: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Create</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading books...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No books found. Create your first book!
            </div>
          ) : (
            books.map((book) => (
              <div key={book.book_id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{book.title}</h3>
                  {book.description && (
                    <p className="mt-2 text-sm text-gray-600">{book.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Created: {new Date(book.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="default"
                      variant="outline"
                      onClick={() => handleDeleteBook(book.book_id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Books;
