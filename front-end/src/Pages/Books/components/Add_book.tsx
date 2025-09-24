import React, { useState } from 'react';
import './Add_book.css';
import { createBookAPI } from '../../../API/Books';
import type { CreateBookDto, GetBookDto } from '../../../API/DTOs/Books';
// Props for the AddBook component
interface AddBookProps {
    onAdd: (books: GetBookDto) => void;
}

const AddBook: React.FC<AddBookProps> = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<CreateBookDto>>({});
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
      let data = await createBookAPI(form as CreateBookDto);
      setShowForm(false);
      setForm({});
      console.log(form as CreateBookDto);
      onAdd(data); // Call the onAdd prop to refresh the book list
    } catch (err: any) {
      setError(err.message || 'Failed to add book');
    } finally {
      setSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <div className="add-book-card" onClick={() => setShowForm(true)}>
        <span className="add-icon">+</span>
        <span className="add-text">Add New Book</span>
      </div>
    );
  }

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <input
        name="title"
        type="text"
        placeholder="Title"
        value={form.title || ''}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description || ''}
        onChange={handleChange}
      />
      <input
        name="sec_password"
        type="password"
        placeholder="Security Password"
        value={form.sec_password || ''}
        onChange={handleChange}
      />
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button type="button" onClick={() => setShowForm(false)} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default AddBook;