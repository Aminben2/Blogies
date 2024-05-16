import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const url = "http://localhost:4000/api/notification";

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async () => {
    const user = JSON.parse(localStorage.getItem("login"));
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error("Could not fetch client notifications");
      const data = await res.json();

      return data;
    } catch (error) {
      throw error;
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    isLoading: false,
  },
  reducers: {
    deleteAllNotifications: (state, actions) => {
      state.notifications = [];
    },
    updateAllNotificationsSeen: (state, action) => {
      state.notifications.forEach((notification) => {
        notification.seen = true;
      });
    },
    updateNotificationSeen: (state, action) => {
      const notifId = action.payload;
      const notificationToUpdate = state.notifications.find(
        (notification) => notification._id === notifId
      );
      if (notificationToUpdate) {
        notificationToUpdate.seen = true;
      }
    },
    removeNotif: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter((f) => f._id !== id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotifications.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload;
    });
  },
});

export const {
  deleteAllNotifications,
  updateAllNotificationsSeen,
  updateNotificationSeen,
  removeNotif,
} = notificationsSlice.actions;
export default notificationsSlice;
