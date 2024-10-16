import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthToken = () => localStorage.getItem('token');

// Async action to fetch books with filtering, sorting, and pagination
export const fetchBooks = createAsyncThunk('books/fetchBooks', async ({ title, author, genre, page }) => {
  const response = await axios.get('http://localhost:4000/api/books', { 
    params: { title, author, genre, page },
    headers: {
      Authorization: `Bearer ${getAuthToken()}`, // Include the token in the header
    },
  });
  return response.data;
});

// Async action to add a new book
export const addBook = createAsyncThunk('books/addBook', async (formData) => {
  const response = await axios.post('http://localhost:4000/api/books', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Required for file upload
      Authorization: `${getAuthToken()}`, // Pass the token in the Authorization header
    },
  });
  return response.data;
});

// Async action to update an existing book
export const updateBook = createAsyncThunk('books/updateBook', async ({ id, formData }) => {
  const response = await axios.put(`http://localhost:4000/api/books/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${getAuthToken()}`, // Include the token in the header
    },
  });
  return response.data;
});

// Async action to delete a book
export const deleteBook = createAsyncThunk('books/deleteBook', async (id) => {
  await axios.delete(`http://localhost:4000/api/books/${id}`, {
    headers: {
      Authorization: `${getAuthToken()}`, // Include the token in the header
    },
  });
  return id;
});

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    // Optional: You can add reducers for setting the current page or clearing errors
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex((book) => book._id === action.payload._id);
        if (index !== -1) {
          state.books[index] = action.payload; // Update the book in the array
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book._id !== action.payload);
      });
  },
});

// Export actions and reducer
export const { setCurrentPage, clearError } = bookSlice.actions;
export default bookSlice.reducer;
