"use client"
import api from "@/utils/baseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export interface Company {
  _id: string;
  companyName: string;
  Companylocation: string;
  companyfield: string;
  email: string;
  phone: number;
  siteid: string;
  approved: boolean;
  userid:{
    isblocked:boolean;
  }
}

export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/companieslist", {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch companies"
      );
    }
  }
);
interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default companySlice.reducer;
