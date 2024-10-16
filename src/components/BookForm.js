import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addBook, updateBook } from '../features/books/bookSlice';
import { useNavigate } from 'react-router-dom';

const BookForm = ({ isEditMode, existingBook = {} }) => {
  let { _id, title = '', author = '', genre = '', publicationDate = '', coverImage = '' } = existingBook;
  
  // Format the date to YYYY-MM-DD for the input field
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { 
      title, 
      author, 
      genre, 
      publicationDate: formatDate(publicationDate) 
    }
  });

  if(coverImage !== ''){
    coverImage =  `http://localhost:4000/uploads/${coverImage}`
  }
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(coverImage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedCoverImage(null);
      setImagePreview(coverImage ? `http://localhost:4000/uploads/${coverImage}` : null);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('genre', data.genre);
    formData.append('publicationDate', data.publicationDate);
    if (selectedCoverImage) formData.append('coverImage', selectedCoverImage);

    if (isEditMode) {
      await dispatch(updateBook({ id: _id, formData }));
    } else {
      await dispatch(addBook(formData));
    }

    navigate('/');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            id="author"
            className={`form-control ${errors.author ? 'is-invalid' : ''}`}
            {...register('author', { required: 'Author is required' })}
          />
          {errors.author && <div className="invalid-feedback">{errors.author.message}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="genre" className="form-label">Genre</label>
          <input
            type="text"
            id="genre"
            className={`form-control ${errors.genre ? 'is-invalid' : ''}`}
            {...register('genre', { required: 'Genre is required' })}
          />
          {errors.genre && <div className="invalid-feedback">{errors.genre.message}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="publicationDate" className="form-label">Publication Date</label>
          <input
            type="date"
            id="publicationDate"
            className={`form-control ${errors.publicationDate ? 'is-invalid' : ''}`}
            {...register('publicationDate', { required: 'Publication Date is required' })}
          />
          {errors.publicationDate && <div className="invalid-feedback">{errors.publicationDate.message}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="coverImage" className="form-label">Book Cover</label>
          <input
            type="file"
            id="coverImage"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" style={{ width: '200px', height: '300px' }} />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Update Book' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default BookForm;