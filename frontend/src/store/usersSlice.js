import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  const user = JSON.parse(localStorage.getItem("login"));

  try {
    const response = await fetch("http://localhost:4000/api/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Could NOT fetch users from api");
    }
    const users = await response.json();
    return users;
  } catch (error) {
    throw error;
  }
});
export const getUser = createAsyncThunk("users/getUser", async (id) => {
  const user = JSON.parse(localStorage.getItem("login"));

  try {
    const response = await fetch(`http://localhost:4000/api/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Could NOT fetch user from api");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    userData: {},
    isLoading: false,
    isUserIsLoading: false,
  },
  reducers: {
    updateProfilePic(state, action) {
      const { imageUrl } = action.payload;
      state.userData.img = imageUrl;
    },
    updateProfileCover(state, action) {
      const { imageUrl } = action.payload;
      state.userData.cover = imageUrl;
    },
  },
  extraReducers: {
    [getUsers.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {
      state.isLoading = false;
    },
    [getUser.pending]: (state, action) => {
      state.isUserIsLoading = true;
    },
    [getUser.fulfilled]: (state, action) => {
      state.isUserIsLoading = false;
      state.userData = action.payload;
    },
    [getUser.rejected]: (state, action) => {
      state.isUserIsLoading = false;
    },
  },
});

export const { updateProfilePic, updateProfileCover } = usersSlice.actions;

export default usersSlice;
