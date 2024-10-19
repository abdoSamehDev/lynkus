import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../utils/axios";
import { isAuthorized } from "../utils/checkAuth";
import Cookies from "universal-cookie";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async ({ query }) => {
    const cookies = new Cookies();

    if (isAuthorized()) {
      const token = cookies.get("token");
      setAuthToken(token);
    }

    const [userResponse, postsResponse] = await Promise.all([
      api.get(`/users?search=${query}`),
      api.get(`/posts/searchPost/${query}`),
    ]);

    return {
      users: userResponse.data.data,
      posts: postsResponse.data,
    };
  }
);

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchQuery: "",
    users: [],
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.posts = action.payload.posts;
        state.loading = false;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { setSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
