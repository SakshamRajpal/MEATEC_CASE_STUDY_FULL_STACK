import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = import.meta.env.VITE_APP_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI + "/api",
  
  // This function attaches your login token to every API request
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  // This line declares the cache tags we use in other files
  tagTypes: ["Tasks", "User"], 
  endpoints: (builder) => ({}),
});