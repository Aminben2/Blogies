import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./postsSlice";
import usersSlice from "./usersSlice";
import authSlice from "./authSlice";
import themeSlice from "./modeSlice";
import categorySlice from "./categorySlice";
import likedPostsSlice from "./likedPostsSlice";
const store = configureStore({
  reducer: {
    posts: postSlice.reducer,
    users: usersSlice.reducer,
    auth: authSlice.reducer,
    theme: themeSlice.reducer,
    categories: categorySlice.reducer,
    likedPosts: likedPostsSlice.reducer,
  },
});

export default store;
