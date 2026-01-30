import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/baseUrl";

/* ================= TYPES ================= */

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

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // important for initial fetchMe()
  error: null,
};

/* ================= THUNKS ================= */

// 🔐 Check logged-in user via cookie
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

// 🔑 Login (cookie set by backend)
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", data, {
      withCredentials: true,
    });
    //  console.log(res.data.user);

    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

// 🚪 Logout (cookie cleared by backend)
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

/* ================= SLICE ================= */

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

/* ================= EXPORTS ================= */

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
