import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("likedPosts"));

const likedPostsSlice = createSlice({
  name: "likedPosts",
  initialState: initialState || [],
  reducers: {
    addLikedPost(state, action) {
      localStorage.setItem(
        "likedPosts",
        JSON.stringify([...state, action.payload])
      );
    },
    removeLikedPost(state, action) {
      const newLikedPosts = state.filter((p) => p !== action.payload);
      localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
    },
  },
});

export const { addLikedPost, removeLikedPost } = likedPostsSlice.actions;
export default likedPostsSlice;
