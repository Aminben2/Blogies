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
    const response = await fetch(`http://localhost:4000/api/blogs/${id}`, {
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

export const getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async (id) => {
    const user = JSON.parse(localStorage.getItem("login"));
    try {
      const response = await fetch(`http://localhost:4000/api/profile/${id}`, {
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
  }
);
export const getUserPostsListing = createAsyncThunk(
  "posts/getUserPostsListing",
  async (id) => {
    const user = JSON.parse(localStorage.getItem("login"));
    try {
      const response = await fetch(`http://localhost:4000/api/profile/${id}`, {
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
  }
);
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    onePost: {},
    userPosts: [],
    userPostsListing: [],
    isLoading: false,
    isLoadingOnePost: false,
    isLoadingUserPosts: false,
    isLoadingUserPostsListing: false,
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
    removeReaction(state, action) {
      let { postId, reaction } = action.payload;
      let existingPost = state.posts.find((post) => post._id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]--;
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
      const wantedPost = state.userPosts.find(
        (post) => post._id === action.payload.postId
      );
      if (wantedPost) {
        wantedPost.private = !wantedPost.private;
      }
    },
    delComment(state, action) {
      const { commentId, postId } = action.payload;
      const wantedPost = state.userPosts.find((post) => post._id === postId);
      if (wantedPost) {
        wantedPost.comments = wantedPost.comments.filter(
          (e) => e._id !== commentId
        );
      }
    },
    pinCom(state, action) {
      const { postId, commentId } = action.payload;
      const existingPost = state.userPosts.find((post) => post._id === postId);
      if (existingPost) {
        const existingCommentIndex = existingPost.comments.findIndex(
          (comment) => comment._id === commentId
        );
        if (existingCommentIndex !== -1) {
          existingPost.comments[existingCommentIndex].pinned =
            !existingPost.comments[existingCommentIndex].pinned;
        }
      }
    },
    apreCom(state, action) {
      const { postId, commentId } = action.payload;
      const existingPost = state.userPosts.find((post) => post._id === postId);
      if (existingPost) {
        const existingCommentIndex = existingPost.comments.findIndex(
          (comment) => comment._id === commentId
        );
        if (existingCommentIndex !== -1) {
          existingPost.comments[existingCommentIndex].loved =
            !existingPost.comments[existingCommentIndex].loved;
        }
      }
    },
    toggleCmnts(state, action) {
      const { id } = action.payload;
      const existingPost = state.userPosts.find((post) => post._id === id);
      if (existingPost) {
        existingPost.ifCommentsEnabaled = !existingPost.ifCommentsEnabaled;
      }
    },
    editBlog(state, action) {
      const updatedBlog = action.payload;
      const index = state.userPosts.findIndex(
        (blog) => blog._id === updatedBlog._id
      );
      if (index !== -1) {
        state.userPosts[index] = updatedBlog;
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
      })
      .addCase(getUserPostsListing.pending, (state) => {
        state.isLoadingUserPostsListing = true;
      })
      .addCase(getUserPostsListing.fulfilled, (state, action) => {
        state.isLoadingUserPostsListing = false;
        state.userPostsListing = action.payload;
      })
      .addCase(getUserPostsListing.rejected, (state) => {
        state.isLoadingUserPostsListing = false;
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
  pinCom,
  toggleCmnts,
  apreCom,
  editBlog,
  removeReaction,
} = postSlice.actions;
export default postSlice;
