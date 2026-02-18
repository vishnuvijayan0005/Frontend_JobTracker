"use client";

import api from "@/utils/baseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface Company {
  _id: string;
  companyName: string;
  Companylocation: string;
  companyfield: string;
  email: string;
  phone: number;
  siteid: string;
  approved: boolean;
  userid: {
    isblocked: boolean;
  };
}

/* ================= THUNKS ================= */

// 🔹 Fetch ALL available fields (for filter buttons)
export const fetchCompanyFields = createAsyncThunk<string[]>(
  "company/fetchCompanyFields",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/company-fields", {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue("Failed to fetch fields");
    }
  },
);

// 🔹 Fetch companies with backend filters
export const fetchCompanies = createAsyncThunk<
  Company[],
  { search?: string; field?: string } | void
>("company/fetchCompanies", async (args, { rejectWithValue }) => {
  const search = args?.search ?? "";
  const field = args?.field ?? "";

  try {
    const res = await api.get("/user/companieslist", {
      params: { search, field },
      withCredentials: true,
    });
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue("Failed to fetch companies");
  }
});

/* ================= STATE ================= */

interface CompanyState {
  companies: Company[];
  fields: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  fields: [],
  loading: false,
  error: null,
};

/* ================= SLICE ================= */

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fields
      .addCase(fetchCompanyFields.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyFields.fulfilled, (state, action) => {
        state.fields = action.payload;
      })
      .addCase(fetchCompanyFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default companySlice.reducer;
