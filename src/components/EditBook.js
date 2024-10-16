import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchBooks } from '../features/books/bookSlice';
import BookForm from './BookForm';

const EditBook = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the book ID from the URL parameters
  const { books, loading } = useSelector((state) => state.books);
  
  // Fetching the existing book
  const existingBook = books.find((book) => book._id === id); // Find the book to edit

  useEffect(() => {
    // Fetch books to get the existing book details
    if (!books.length) {
      dispatch(fetchBooks({ title: '', author: '', genre: '', page: 1 }));
    }
  }, [dispatch, books.length]);

  if (loading) return <p>Loading...</p>;
  if (!existingBook) return <p>Book not found!</p>;

  return (
    <BookForm isEditMode={true} existingBook={existingBook} />
  );
};

export default EditBook;
