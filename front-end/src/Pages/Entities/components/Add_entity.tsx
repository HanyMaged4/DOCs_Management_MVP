import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createEntityAPI } from '../../../API/entity';
import type {
  CreateEntityInput,
  GetEntityInput
} from '../../../API/DTOs/Entities';

export interface AddEntityFormProps {
  onAdded?: (entity: GetEntityInput) => void;
}

const AddEntityForm: React.FC<AddEntityFormProps> = ({ onAdded }) => {
  const { id: bookId } = useParams<{ id: string }>();
  const [title, setTitle]           = useState('');
  const [content, setContent]       = useState('');
  const [tagsInput, setTagsInput]   = useState('');
  const [files, setFiles]           = useState<File[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId) {
      setError('Book ID is missing');
      return;
    }

    setError(null);
    setLoading(true);

    const payload: CreateEntityInput = {
      book_id: Number(bookId),
      title: title.trim(),
      content: content.trim(),
      tags: tagsInput 
        .split(',')
        .map(s => Number(s.trim()))
        .filter(n => !Number.isNaN(n)),
    };

    try {
      console.log('Creating entity with payload:', payload);
      //if the tags is [0]
      if (!payload.tags || payload.tags.length < 1 || (payload.tags.length === 1 && payload.tags[0] === 0)) {
        delete payload.tags;
      }
      const created = await createEntityAPI(payload, files);
      
      onAdded?.(created);
      // reset form

      setTitle('');
      setContent('');
      setTagsInput('');
      setFiles([]);
    } catch (err: any) {
      setError(err.message || 'Failed to create entity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-entity-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="entity-title">Title*</label>
        <input
          id="entity-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="entity-content">Content</label>
        <textarea
          id="entity-content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="entity-tags">Tags (comma-separated IDs)</label>
        <input
          id="entity-tags"
          type="text"
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
          placeholder="e.g. 1,2,3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="entity-files">Attachments</label>
        <input
          id="entity-files"
          type="file"
          onChange={handleFileChange}
          multiple
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add Entity'}
        </button>
      </div>
    </form>
  );
};

export default AddEntityForm;