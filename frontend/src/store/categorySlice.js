import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const getCategories = createAsyncThunk("getCategories", async () => {
  try {
    const response = await fetch("http://localhost:4000/api/categories/");

    if (!response.ok) {
      throw new Error("Could NOT fetch categories from api");
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    throw error;
  }
});
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    isCategoriesLoading: null,
  },
  reducers: {},
  extraReducers: {
    [getCategories.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    },
    [getCategories.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export default categorySlice;
