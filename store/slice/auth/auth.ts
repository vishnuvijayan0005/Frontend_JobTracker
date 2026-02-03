import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/baseUrl";



export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "companyadmin";
  isprofilefinished: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}



const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, 
  error: null,
};


export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/checkme", {
        withCredentials: true,
      });

      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Not authenticated",
      );
    }
  },
);


export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", data, {
      withCredentials: true,
    });


    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});


export const logoutUser = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
    return true;
  } catch {
    return rejectWithValue("Logout failed");
  }
});


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login error";
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});



export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
