/*import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', description: '' });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchBooks = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBooks(res.data);
  };

  //useEffect(() => { fetchBooks(); }, []);
  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/books/${editId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/books`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setForm({ title: '', author: '', description: '' });
    setEditId(null);
    fetchBooks();
  };

  const handleEdit = book => {
    setEditId(book._id);
    setForm(book);
  };

  const handleDelete = async id => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBooks();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <button type="submit">{editId ? 'Update' : 'Add'} Book</button>
      </form>

      <h3>Books:</h3>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        books.map(book => (
          <div key={book._id}>
            <h4>{book.title}</h4>
            <p>By {book.author}</p>
            <p>{book.description}</p>
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
*/
// frontend/src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '' });
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        localStorage.setItem(file.name, base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert('Please select a file');

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/books`,
        {
          title: form.title,
          author: form.author,
          fileName: file.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setForm({ title: '', author: '' });
      setFile(null);
      fetchBooks();
    } catch (err) {
      console.error('Error uploading book:', err);
    }
  };

  const handleReplace = (book) => {
    setEditId(book._id);
    setForm({ title: book.title, author: book.author });
    setFile(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept=".pdf,.epub,.docx"
          onChange={handleFileChange}
          required={!editId}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>
          {editId ? 'Replace Book' : 'Add Book'}
        </button>
      </form>

      <h3>Books:</h3>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        books.map((book) => (
          <div
            key={book._id}
            style={{ border: '1px solid #ccc', marginBottom: '15px', padding: '10px' }}
          >
            <h4>{book.title}</h4>
            <p>By {book.author}</p>
            {book.fileUrl && localStorage.getItem(book.fileUrl) && (
              <a
                href={localStorage.getItem(book.fileUrl)}
                download={book.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                📥 Download Book
              </a>
            )}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleReplace(book)} style={{ marginRight: '10px' }}>
                Replace
              </button>
              <button onClick={() => handleDelete(book._id)} style={{ color: 'red' }}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
