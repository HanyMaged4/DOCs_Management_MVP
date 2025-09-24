import React, { useState } from 'react';
import './Edit_book.css';
import type { GetBookDto, UpdateBookDto } from '../../../API/DTOs/Books';
import { updateBookByIdAPI } from '../../../API/Books';

interface EditBookProps {
  book: UpdateBookDto & { book_id: number };
  onCancel: () => void;
  onSave: (updated: UpdateBookDto) => void;
}

const EditBook: React.FC<EditBookProps> = ({ book, onCancel, onSave }) => {
  const [form, setForm] = useState<Partial<UpdateBookDto>>({
    title: book.title,
    description: book.description || '',
    sec_password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const updated = await updateBookByIdAPI(String(book.book_id), form as UpdateBookDto);
      onSave(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update book');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="edit-book-form" onSubmit={handleSubmit}>
      <input
        name="title"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="sec_password"
        type="password"
        placeholder="Security Password"
        value={form.sec_password}
        onChange={handleChange}
      />
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
};

export default EditBook;