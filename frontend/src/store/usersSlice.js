import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  const user = JSON.parse(localStorage.getItem("login"));

  try {
    const response = await fetch("http://localhost:4000/api/users/all", {
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
  try {
    const response = await fetch(
      `http://localhost:4000/api/users/oneUser/${id}`
    );

    if (!response.ok) {
      throw new Error("Could NOT fetch user from api");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.log(error);
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
    updatePersonnelInfo: (state, action) => {
      const { lastName, firstName } = action.payload;
      state.userData.lastName = lastName;
      state.userData.firstName = firstName;
    },
    updateContactInfo: (state, action) => {
      const { phone, address, website, dateOfBirth } = action.payload;
      state.userData.dateOfBirth = dateOfBirth;
      state.userData.contactInfo.address = address;
      state.userData.contactInfo.phone = phone;
      state.userData.contactInfo.website = website;
    },
    updateBio: (state, action) => {
      const bio = action.payload;
      state.userData.bio = bio;
    },
    addExperince: (state, action) => {
      const exper = action.payload;
      state.userData.work.push(exper);
    },
    addEducation: (state, action) => {
      const edu = action.payload;
      state.userData.education.push(edu);
    },
    delEducation: (state, action) => {
      const id = action.payload;
      state.userData.education = state.userData.education.filter(
        (edu) => edu._id != id
      );
    },
    delWork: (state, action) => {
      const id = action.payload;
      state.userData.work = state.userData.work.filter((edu) => edu._id != id);
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

export const {
  updateProfilePic,
  updateProfileCover,
  updatePersonnelInfo,
  updateBio,
  updateContactInfo,
  addEducation,
  addExperince,
  delEducation,
  delWork,
} = usersSlice.actions;

export default usersSlice;
