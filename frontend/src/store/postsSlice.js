import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";

export const getPosts = createAsyncThunk("posts/getPosts", async () => {
  const user = JSON.parse(localStorage.getItem("login"));

  try {
    const response = await fetch("http://localhost:4000/api/blogs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch the blogs");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error('Error:', error);
    throw error; // Rethrow the error to propagate it to the component
  }
});

export const getOnePost = createAsyncThunk("post/getOnePost", async (id) => {
  const user = JSON.parse(localStorage.getItem("login"));

  try {
    const response = await fetch(`/api/blogs/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Could not fetch the blog");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});

export const getUserPosts = createAsyncThunk("posts/getUserPosts", async () => {
  const user = JSON.parse(localStorage.getItem("login"));
  try {
    const response = await fetch(`/api/profile/${user._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Could not fetch user blogs");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    onePost: {},
    userPosts: [],
    isLoading: false,
    isLoadingOnePost: false,
    isLoadingUserPosts: false,
  },
  reducers: {
    addPost(state, action) {
      state.posts.push(action.payload);
    },
    addReaction(state, action) {
      let { postId, reaction } = action.payload;
      let existingPost = state.posts.find((post) => post._id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    addComment(state, action) {
      const { commentContent, userId } = action.payload;
      state.onePost.comments.push({
        commentId: nanoid(),
        userId: userId,
        comment: commentContent,
        createdAt: new Date().toISOString(),
      });
    },
    deleteUserPost(state, action) {
      const { postId } = action.payload;

      state.userPosts = state.userPosts.filter((post) => post._id !== postId);
    },
    changePrivacy(state, action) {
      //   const { private, postId } = action.payload;
      const wantedPost = state.userPosts.find(
        (post) => post._id === action.payload.postId
      );
      if (wantedPost) {
        wantedPost.privacy = !wantedPost.private;
      }
    },
    delComment(state, action) {
      const { commentId, postId } = action.payload;
      const wantedPost = state.userPosts.find((post) => post._id === postId);
      if (wantedPost) {
        wantedPost.comments = wantedPost.comments.filter(
          (e) => e.commentId !== commentId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getOnePost.pending, (state) => {
        state.isLoadingOnePost = true;
      })
      .addCase(getOnePost.fulfilled, (state, action) => {
        state.isLoadingOnePost = false;
        state.onePost = action.payload;
      })
      .addCase(getOnePost.rejected, (state) => {
        state.isLoadingOnePost = false;
      })
      .addCase(getUserPosts.pending, (state) => {
        state.isLoadingUserPosts = true;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.isLoadingUserPosts = false;
        state.userPosts = action.payload;
      })
      .addCase(getUserPosts.rejected, (state) => {
        state.isLoadingUserPosts = false;
      });
  },
});

export const {
  addPost,
  addReaction,
  addComment,
  deleteUserPost,
  changePrivacy,
  delComment,
} = postSlice.actions;
export default postSlice;
