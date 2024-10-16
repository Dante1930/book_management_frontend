import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, deleteBook } from '../features/books/bookSlice';
import { Link } from 'react-router-dom';

const BookList = () => {
  const dispatch = useDispatch();
  const { books, loading, error, currentPage, totalPages } = useSelector((state) => state.books);

  const [filters, setFilters] = useState({ title: '', author: '', genre: '', page: 1 });

  useEffect(() => {
    dispatch(fetchBooks(filters));
  }, [dispatch, filters]);

  const handleDelete = (id) => {
    dispatch(deleteBook(id));
  };

  const handlePagination = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="container">
      <h2>Book List</h2>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Title"
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Author"
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Genre"
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          />
        </div>
      </div>

      {/* Book List */}
      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Publication Date</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{new Date(book.publicationDate).toLocaleDateString()}</td>
                <td> <img
                src={`http://localhost:4000/uploads/${book.coverImage}`}// Display book cover image
                alt={book.title}
                className="card-img-top"
                style={{ height: '100px', objectFit: 'cover' }}
              /></td>
                <td>
                <Link to={`book/edit/${book._id}`} className="btn btn-warning me-2">Edit</Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(book._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
              onClick={() => handlePagination(index + 1)}
            >
              <button className="page-link">{index + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default BookList;
