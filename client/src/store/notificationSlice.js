import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { setAuthToken } from "../utils/axios";
import Cookies from "universal-cookie";
import { isAuthorized } from "../utils/checkAuth";

const cookies = new Cookies();

const initialState = {
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
        state.loading = true;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.err = null;

        const newNotifications = action.payload.filter(
          (newNotification) =>
            !state.notifications?.some(
              (oldNotification) => oldNotification.id === newNotification.id
            )
        );
        state.notifications = action.payload;
        state.hasNewNotifications = newNotifications.length > 0;
        state.loading = false;
      })
      .addCase(clearNotification.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(clearNotification.fulfilled, (state, action) => {
        state.err = null;
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(clearAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload;
      })
      .addCase(clearAllNotifications.fulfilled, (state, action) => {
        state.err = null;
        state.message = action.payload;
        state.loading = false;
      });
  },
});

export const { readNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
