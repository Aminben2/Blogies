import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./postsSlice";
import usersSlice from "./usersSlice";
import authSlice from "./authSlice";
import themeSlice from "./modeSlice";
import categorySlice from "./categorySlice";
const store = configureStore({
  reducer: {
    posts: postSlice.reducer,
    users: usersSlice.reducer,
    auth: authSlice.reducer,
    theme: themeSlice.reducer,
    categories: categorySlice.reducer,
  },
});

export default store;
