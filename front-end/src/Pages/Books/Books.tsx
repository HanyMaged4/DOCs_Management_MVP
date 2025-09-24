
import { deleteBookByIdAPI, getBooksAPI, updateBookByIdAPI } from "../../API/Books";
import type { GetBookDto } from "../../API/DTOs/Books";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from 'react';
import AddBookCard from "./components/Add_book";
import ActionCard from "../../components/Card/ActionCard";
import EditBook from "./components/Edit_book";

function BookPage() {
  const [data, setData] = useState<GetBookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const { logout } = useAuth();
  const [editingBook, setEditingBook] = useState<GetBookDto | null>(null);
  const handleAddBook = (newBook: GetBookDto) => {
    setData(prev => [...prev, newBook]);
  };
  useEffect(() => {
    (async () => {
      try {
        const data = await getBooksAPI();
        setData(data.reverse());
      } catch (err: any) {
        if (err.message === "Unauthorized") {
          logout();
        } else {
          setError(err.message || 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (data.length === 0) return <p>No books found.</p>;
  return (
    <div style={{ padding: "20px", display: "flex", gap: "20px", flexWrap: "wrap", width: "100%" }}>
      <AddBookCard onAdd={handleAddBook} />
      {data.map(book => (
        editingBook?.book_id === book.book_id ? (
          <EditBook
            key={String(book.book_id)}
            book={book}
            onCancel={() => setEditingBook(null)}
            onSave={updated => {
              console.log(updated);
              updateBookByIdAPI(String(book.book_id), updated);
              setData(prev => prev.map(b => b.book_id === updated.book_id ? updated as GetBookDto : b));
              setEditingBook(null);
            }}
          />
        ) : (
          <ActionCard
            key={String(book.book_id)}
            title={book.title}
            description={book.description ?? ''}
            tags={['No Tags']}
            onEdit={() => setEditingBook(book)}
            onDelete={() => {
              const bookId = book.book_id;
              deleteBookByIdAPI(bookId, "dssds")
                .then(() => setData(prev => prev.filter(b => b.book_id !== bookId)))
                .catch(err => setError(err.message || 'Unknown error'));
            }}
          />
        )
      ))}
    </div>
  );
    };



export default BookPage
