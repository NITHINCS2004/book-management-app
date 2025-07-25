import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/books`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2>User Dashboard</h2>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        books.map(book => (
          <div key={book._id}>
            <h4>{book.title}</h4>
            <p>By {book.author}</p>
            <p>{book.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default UserDashboard;
