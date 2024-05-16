import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./postsSlice";
import usersSlice from "./usersSlice";
import authSlice from "./authSlice";
import themeSlice from "./modeSlice";
import categorySlice from "./categorySlice";
import notificationsSlice from "./NotificationsSlice";
const store = configureStore({
  reducer: {
    posts: postSlice.reducer,
    users: usersSlice.reducer,
    auth: authSlice.reducer,
    theme: themeSlice.reducer,
    categories: categorySlice.reducer,
    notifications: notificationsSlice.reducer,
  },
});

export default store;
