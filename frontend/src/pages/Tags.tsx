import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';

interface Tag {
  tag_id: number;
  tag_title: string;
  created_at: string;
  updated_at: string;
}

const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: number; title: string } | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTags();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createTag({ tag_title: newTag });
      setNewTag('');
      setShowCreateForm(false);
      fetchTags();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    
    try {
      await apiService.updateTag(editingTag.id, { tag_title: editingTag.title });
      setEditingTag(null);
      fetchTags();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tag');
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      try {
        await apiService.deleteTag(id);
        fetchTags();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete tag');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
        <p className="mt-2 text-gray-600">Organize your content with tags</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <Button onClick={() => setShowCreateForm(true)}>
          Create Tag
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Tag</h2>
          <form onSubmit={handleCreateTag} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Tag name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button type="submit">Create</Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading tags...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {tags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tags found. Create your first tag!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tags.map((tag) => (
                <li key={tag.tag_id} className="px-6 py-4">
                  {editingTag?.id === tag.tag_id ? (
                    <form onSubmit={handleUpdateTag} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={editingTag.title}
                        onChange={(e) => setEditingTag(prev => prev ? { ...prev, title: e.target.value } : null)}
                      />
                      <Button type="submit" size="default">Save</Button>
                      <Button variant="outline" onClick={() => setEditingTag(null)}>
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{tag.tag_title}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(tag.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => setEditingTag({ id: tag.tag_id, title: tag.tag_title })}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => handleDeleteTag(tag.tag_id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Tags;
