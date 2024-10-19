import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../utils/axios";
import Cookies from "universal-cookie";
import { isAuthorized } from "../utils/checkAuth";

const cookies = new Cookies();

const initialState = {
  //   notifications: [
  //     {
  //       type: "follow",
  //       username: "sarah_j",
  //       read: false,
  //     },
  //     {
  //       type: "like",
  //       username: "tech_guru42",
  //       read: true,
  //     },
  //     {
  //       type: "comment",
  //       username: "coffee_lover",
  //       read: false,
  //     },
  //     {
  //       type: "follow",
  //       username: "photo_master",
  //       read: true,
  //     },
  //     {
  //       type: "like",
  //       username: "fitness_freak",
  //       read: false,
  //     },
  //     {
  //       type: "comment",
  //       username: "bookworm99",
  //       read: true,
  //     },
  //     {
  //       type: "like",
  //       username: "travel_addict",
  //       read: false,
  //     },
  //     {
  //       type: "follow",
  //       username: "music_lover22",
  //       read: true,
  //     },
  //     {
  //       type: "comment",
  //       username: "food_explorer",
  //       read: false,
  //     },
  //     {
  //       type: "like",
  //       username: "art_enthusiast",
  //       read: true,
  //     },
  //     {
  //       type: "follow",
  //       username: "nature_seeker",
  //       read: false,
  //     },
  //     {
  //       type: "comment",
  //       username: "movie_buff",
  //       read: true,
  //     },
  //     {
  //       type: "like",
  //       username: "pet_parent",
  //       read: false,
  //     },
  //     {
  //       type: "follow",
  //       username: "code_ninja",
  //       read: true,
  //     },
  //     {
  //       type: "comment",
  //       username: "fashion_icon",
  //       read: false,
  //     },
  //   ],
  notifications: null,
  loading: true,
  err: null,
  message: null,
  hasNewNotifications: false,
};

const token = cookies.get("token");

//API CALLS
export const getAllNotifications = createAsyncThunk(
  "notifications/getAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      if (isAuthorized()) {
        setAuthToken(token);
        const res = await api.get("/notifications");
        return res.data.Notifications;
      }
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const clearNotification = createAsyncThunk(
  "notifications/clearNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const res = await api.delete(`/notifications/${notificationId}`);
      return res.data.message;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  "notifications/clearAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      setAuthToken(token);
      const res = await api.delete("/notifications");
      return res.data.message;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    readNotification: (state, action) => {
      state.notifications[action.payload].read = true;
      state.hasNewNotifications = state.notifications.some((n) => !n.read);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotifications.pending, (state) => {
        console.log("Getting all notifications...");
        state.loading = true;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        console.log("Error getting all notifications");
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        console.log("Done getting all notifications");
        state.err = null;

        const newNotifications = action.payload.filter(
          (newNotification) =>
            !state.notifications?.some(
              (oldNotification) => oldNotification.id === newNotification.id
            )
        );
        state.notifications = action.payload;
        state.hasNewNotifications = newNotifications.length > 0;
        console.log(state.notifications);
        state.loading = false;
      })
      .addCase(clearNotification.pending, (state) => {
        console.log("Clearing notification...");
        // state.loading = true;
      })
      .addCase(clearNotification.rejected, (state, action) => {
        console.log("Error clearing notification");
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(clearNotification.fulfilled, (state, action) => {
        console.log("Done clearing notification");
        state.err = null;
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(clearAllNotifications.pending, (state) => {
        console.log("Clearing all notifications...");
        // state.loading = true;
      })
      .addCase(clearAllNotifications.rejected, (state, action) => {
        console.log("Error clearing all notifications");
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(clearAllNotifications.fulfilled, (state, action) => {
        console.log("Done clearing all notifications");
        state.err = null;
        state.message = action.payload;
        state.loading = false;
      });
  },
});

export const { readNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
