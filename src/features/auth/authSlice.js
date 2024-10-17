import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', userData);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;

        // Normalize errors into an array if not already
        if (Array.isArray(errorData.errors)) {
          return rejectWithValue(errorData.errors);
        } else if (errorData.msg) {
          // console.error(errorData.msg)
          return rejectWithValue([{ msg: errorData.msg }]);
        } else {
          return rejectWithValue([{ msg: 'An unknown error occurred' }]);
        }
      } else {
        return rejectWithValue([{ msg: err.message }]);
      }
    }
  }
);


// Async action to register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', userData);
      return response.data;
    } catch (err) {
       if (err.response && err.response.data) {
        // Normalize the error response to always return an array of errors
        const errorData = err.response.data;
        
        // Check if errors is an array, if not, wrap it in an array
        if (Array.isArray(errorData.errors)) {
          return rejectWithValue(errorData.errors);
        } else if (errorData.msg) {
          return rejectWithValue([{ msg: errorData.msg }]);  // Convert single error to array
        } else {
          return rejectWithValue([{ msg: 'An unknown error occurred' }]);
        }
      } else {
        return rejectWithValue([{ msg: err.message }]);
      }
    }
  }
);

// Async action to update user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put('http://localhost:4000/api/auth/me', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data); // Return backend error response
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      const response = await axios.get('http://localhost:4000/api/auth/me', {
        headers: { Authorization: `${token}` },
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue([{ msg: err.message }]);
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null, // Load user from localStorage
    token: localStorage.getItem('token') || null, // Load token from localStorage on init
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove token from localStorage on logout
      localStorage.removeItem('user');   // Clear user from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle successful login
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        // Save token to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));  
      })
      // Handle successful registration
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        // Save token to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));  
      })
      // Handle profile update (no token change, just update user info)
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      // Handle loading states
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle login errors
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle registration errors
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle profile update errors
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));  
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Export the logout action
export const { logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
