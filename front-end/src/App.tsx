import { getBooksAPI } from './API/Books';
import type { GetBookDto } from './API/DTOs/Books';
import './App.css'
import Card from './components/Card/card'
///
import { useState, useEffect, use } from 'react';
///
function App() {
  const [data, setData] = useState<GetBookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getBooksAPI();
        setData(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (data.length === 0) return <p>No books found.</p>;
 return (
   <div style={{ padding: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
       {data.map(book => (
        <Card
          key={String(book.book_id)}
          title={book.title}
          description={book.description ?? ''}
          tags={book.tags ?? ['No Tags']}
        />
      ))}
     </div> ); 
    };


export default App
