import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';

interface Entity {
  entity_id: number;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
  book: {
    book_id: number;
    title: string;
  };
}

interface Book {
  book_id: number;
  title: string;
}

const Entities: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEntity, setNewEntity] = useState({
    title: '',
    content: '',
    book_id: 0
  });

  useEffect(() => {
    fetchEntities();
    fetchBooks();
  }, []);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEntities();
      setEntities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch entities');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await apiService.getBooks();
      setBooks(Array.isArray(data) ? data : data.books || []);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createEntity(newEntity);
      setNewEntity({ title: '', content: '', book_id: 0 });
      setShowCreateForm(false);
      fetchEntities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create entity');
    }
  };

  const handleDeleteEntity = async (id: number) => {
    if (confirm('Are you sure you want to delete this entity?')) {
      try {
        await apiService.deleteEntity(id);
        fetchEntities();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete entity');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Entities</h1>
        <p className="mt-2 text-gray-600">Manage your content entities</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <Button onClick={() => setShowCreateForm(true)}>
          Create Entity
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Entity</h2>
          <form onSubmit={handleCreateEntity} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Book</label>
              <select
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newEntity.book_id}
                onChange={(e) => setNewEntity(prev => ({ ...prev, book_id: parseInt(e.target.value) }))}
              >
                <option value={0}>Select a book</option>
                {books.map((book) => (
                  <option key={book.book_id} value={book.book_id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newEntity.title}
                onChange={(e) => setNewEntity(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={5}
                value={newEntity.content}
                onChange={(e) => setNewEntity(prev => ({ ...prev, content: e.target.value }))}
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
        <div className="text-center py-8">Loading entities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No entities found. Create your first entity!
            </div>
          ) : (
            entities.map((entity) => (
              <div key={entity.entity_id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{entity.title}</h3>
                  <p className="text-sm text-blue-600 mb-2">Book: {entity.book.title}</p>
                  {entity.content && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{entity.content}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Created: {new Date(entity.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="default"
                      variant="outline"
                      onClick={() => handleDeleteEntity(entity.entity_id)}
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

export default Entities;
