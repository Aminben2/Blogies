import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("theme"))

const themeSlice = createSlice({
    name: "theme",
    initialState: initialState ,
    reducers: {
        switchTheme(state, action) {
            localStorage.setItem("theme", JSON.parse(!state))
            return !state
        }
    }
})

export const { switchTheme } = themeSlice.actions
export default themeSlice