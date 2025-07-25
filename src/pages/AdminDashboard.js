import React, { useEffect, useState } from 'react';
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
