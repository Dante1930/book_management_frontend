import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import EditBook from './components/EditBook';

function App() {

  return (

    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/booklist" element={<BookList />} />
        <Route path="book/add" element={<BookForm isEditMode={false}/>} />
        <Route path="book/edit/:id" element={<EditBook />} />
      </Routes>
    </Router>
  );
}

export default App;
