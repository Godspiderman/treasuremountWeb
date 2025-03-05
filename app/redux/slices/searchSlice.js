import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchQuery: "", // Initial state for the search query
    activeSection: "", // Track the active section
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
  },
});

export const { setSearchQuery, setActiveSection } = searchSlice.actions;
export default searchSlice.reducer;
