import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../utils/axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");

const initialState = {
  posts: [], // Array of posts
  currentPost: null, // To hold the currently fetched post
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (_, thunkapi) => {
    try {
      setAuthToken(token);
      const res = await api.get("posts");
      return res.data;
    } catch (e) {
      return thunkapi.rejectWithValue(
        e.response?.data || { message: "An error occurred" }
      );
    }
  }
);

export const fetchPostsById = createAsyncThunk(
  "post/fetchPostsById",
  async (postId, thunkapi) => {
    try {
      setAuthToken(token); // Ensure token is set
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (e) {
      return thunkapi.rejectWithValue(
        e.response?.data || { message: "An error occurred" }
      );
    }
  }
);

export const likePostToggle = createAsyncThunk(
  "post/likePostToggle",
  async (likeDetails, thunkapi) => {
    try {
      setAuthToken(token); // Ensure token is set
      const res = await api.post("likes", likeDetails);
      return res.data;
    } catch (e) {
      console.log(e);
      return thunkapi.rejectWithValue(
        e.response?.data || { message: "An error occurred" }
      );
    }
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    likeNumberChange: (state, action) => {
      const post = state.posts[action.payload];
      if (post.likedByUser) {
        post.likes -= 1;
      } else {
        post.likes += 1;
      }
      post.likedByUser = !post.likedByUser;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload.reverse();
        state.loading = false;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchPostsById.fulfilled, (state, action) => {
        state.currentPost = action.payload; // Store the fetched post
        state.loading = false;
      })
      .addCase(fetchPostsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(likePostToggle.fulfilled, (state) => {
        state.loading = false; // Reset loading state
      })
      .addCase(likePostToggle.pending, (state) => {
        state.loading = true;
      })
      .addCase(likePostToggle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
  // toggleLikedPosts: (state, action) => {
  //   state.likedPosts[action.payload].postLiked =
  //     !state.likedPosts[action.payload].postLiked;
  // },
});

export const { likeNumberChange } = postSlice.actions;

export default postSlice.reducer;
