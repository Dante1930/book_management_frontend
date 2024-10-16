import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchBooks } from '../features/books/bookSlice'; // Import action to fetch books
import { Link } from 'react-router-dom';
import BookList from './BookList';
import BookForm from './BookForm';

const Home = () => {
  const { token } = useSelector((state) => state.auth); // Check if the user is logged in
//   const { books, loading } = useSelector((state) => state.books);
  const dispatch = useDispatch();

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchBooks());
//     }
//   }, [dispatch, token]);

  if (!token) {
    return (
      <div className="container">
        <h2>Welcome to the Book Management System</h2>
        <p>
          This is a simple app for managing books. You can add, edit, and delete
          books once you log in. To get started, please{' '}
          <Link to="/login">Login</Link> or{' '}
          <Link to="/register">Register</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Book Management</h2>
      {/* <BookForm /> */}
      <Link to="/book/add" className="btn btn-primary">Add New Book</Link>
      <BookList/>
    </div>
  );
};

export default Home;
