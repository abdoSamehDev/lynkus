import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../utils/axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const token = cookies.get("token") || null;
const cookieUserData = cookies.get("user");

const initialState = {
  authUserData: cookieUserData || {},
  userData: {},
  isOwnProfile: false,
  userPosts: null,
  userLikedPosts: null,
  userFollowers: null,
  userFollowings: null,
  userRecommendation: [],
  message: null,
  loading: false,
  err: null,
};

export const fetchUserDataFromCookies = createAsyncThunk(
  "user/fetchUserDataFromCookies",
  async (_, { rejectWithValue }) => {
    try {
      const userData = cookies.get("user");
      if (userData) {
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch user data from cookies" + error);
    }
  }
);

//API CALLS
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (userId, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const [posts, likedPosts, followers, followings] = await Promise.all([
        api.get(`/posts/user/${userId}`),
        api.get(`/posts/likes/${userId}`),
        api.get(`/follows/followers/${userId}?page=1&limit=50`),
        api.get(`/follows/following/${userId}?page=1&limit=50`),
      ]);
      return {
        posts: posts.data,
        likedPosts: likedPosts.data,
        followers: followers.data.data,
        followings: followings.data.data,
      };
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

export const recommendedUsers = createAsyncThunk(
  "user/recommendedUsers",
  async (_, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const res = await api.get(`/follows/recommended`);
      return res.data.recommendedUsers;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (username, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const res = await api.get(`/users/profile/${username}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const editUserProfile = createAsyncThunk(
  "user/editUserProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const res = await api.put("/users", updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  "user/deleteUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const res = await api.delete("/users");
      return res.data.message;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
export const toggleFollow = createAsyncThunk(
  "user/toggleFollow",
  async (userId, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const res = await api.post(`/follows/${userId}`);
      return res.data.message;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const toggleLikeUserPost = createAsyncThunk(
  "user/toggleLikeUserPost",
  async (postId, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const res = await api.post(`/likes`, {
        postId: postId,
      });
      return res.data.message;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.userData = null;
      state.userPosts = null;
      state.userLikedPosts = null;
      state.userFollowers = null;
      state.userFollowings = null;
    },
    checkOwnProfile: (state, action) => {
      const userData = cookies.get("user");
      if (userData) {
        const username = state.authUserData.userName
          ? state.authUserData?.userName
          : state.authUserData.data?.userName;
        state.isOwnProfile = username === action.payload;
      } else {
        state.isOwnProfile = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDataFromCookies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDataFromCookies.fulfilled, (state, action) => {
        state.loading = false;
        state.authUserData = action.payload;
      })
      .addCase(fetchUserDataFromCookies.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(getUserData.pending, (state) => {
        state.err = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.err = null;
        if (state.isOwnProfile) {
          state.authUserData = action.payload;
          cookies.set("user", JSON.stringify(action.payload), { path: "/" });
        } else {
          state.userData = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchUserData.pending, (state) => {
        // state.loading = true;
        state.err = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload.posts;
        state.userLikedPosts = action.payload.likedPosts;
        state.userFollowers = action.payload.followers;
        state.userFollowings = action.payload.followings;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(editUserProfile.pending, (state) => {
        state.loading = true;
        state.err = null;
      })
      .addCase(editUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.err = null;
        state.authUserData = { ...state.authUserData, ...action.payload };
        state.loading = false;
      })
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = true;
        state.err = null;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(deleteUserProfile.fulfilled, (state, action) => {
        state.err = null;
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.err = null;
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(recommendedUsers.pending, (state) => {
        state.loading = true;
        state.err = null;
      })
      .addCase(recommendedUsers.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(recommendedUsers.fulfilled, (state, action) => {
        state.userRecommendation = action.payload;
        state.loading = false;
      })
      .addCase(toggleLikeUserPost.fulfilled, (state) => {
        state.err = null;
        state.loading = false;
      })
      .addCase(toggleLikeUserPost.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload.message;
      });
  },
});

// export const { fetchUserDataFromCookies, checkOwnProfile } = userSlice.actions;
export const { checkOwnProfile, clearUserData } = userSlice.actions;

export default userSlice.reducer;
