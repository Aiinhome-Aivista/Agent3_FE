import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchRuleBooks = createAsyncThunk(
  "ruleBooks/list",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/rule-books");
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to load rule books",
      );
    }
  },
);

export const createRuleBook = createAsyncThunk(
  "ruleBooks/create",
  async ({ file, connectorType }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (connectorType) formData.append("connector_type", connectorType);

      const res = await api.post("/api/rule-books/create", formData);
      dispatch(fetchRuleBooks());
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to create rule book",
      );
    }
  },
);

export const deleteRuleBook = createAsyncThunk(
  "ruleBooks/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/api/rule-books/${id}`);
      dispatch(fetchRuleBooks());
      return { id };
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to delete rule book",
      );
    }
  },
);

export const searchSimilarRuleBooks = createAsyncThunk(
  "ruleBooks/search",
  async ({ id, topK }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/rule-books/${id}/search-similar`, {
        params: { top_k: topK },
      });
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || "Search failed");
    }
  },
);

export const fetchRuleBookDetails = createAsyncThunk(
  "ruleBooks/fetchDetails",
  async (ruleBookId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/rule-books/${ruleBookId}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to load rule book details",
      );
    }
  },
);

export const fetchRuleBookRules = createAsyncThunk(
  "ruleBooks/fetchRules",
  async (ruleBookId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/rule-books/${ruleBookId}/rules`);
      return { ruleBookId, rules: res.data };
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to load rules",
      );
    }
  },
);

export const addRuleToRuleBook = createAsyncThunk(
  "ruleBooks/addRule",
  async (
    { ruleBookId, ruleName, ruleType, ruleConfig },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await api.post(`/api/rule-books/${ruleBookId}/rules`, null, {
        params: {
          rule_name: ruleName,
          rule_type: ruleType,
          rule_config: ruleConfig,
        },
      });
      dispatch(fetchRuleBookRules(ruleBookId));
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || "Failed to add rule");
    }
  },
);

export const deleteRuleFromRuleBook = createAsyncThunk(
  "ruleBooks/deleteRule",
  async ({ ruleBookId, ruleId }, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/api/rule-books/${ruleBookId}/rules/${ruleId}`);
      dispatch(fetchRuleBookRules(ruleBookId));
      return { ruleId };
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to delete rule",
      );
    }
  },
);

export const fetchProposedRules = createAsyncThunk(
  "ruleBooks/fetchProposed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/rule-books/proposed");
      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to load proposed rules",
      );
    }
  },
);

export const updateProposedRule = createAsyncThunk(
  "ruleBooks/updateProposed",
  async ({ ruleId, ruleText, statusId }, { rejectWithValue, dispatch }) => {
    try {
      await api.put(`/api/rule-books/proposed/${ruleId}`, {
        rule_text: ruleText,
        status_id: statusId
      });
      dispatch(fetchProposedRules());
      return { ruleId };
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to update proposed rule",
      );
    }
  },
);

export const createProposedRule = createAsyncThunk(
  "ruleBooks/createProposed",
  async ({ connectorId, ruleText, ruleType }, { rejectWithValue, dispatch }) => {
    try {
      await api.post("/api/rule-books/proposed", {
        connector_id: connectorId,
        rule_text: ruleText,
        rule_type: ruleType
      });
      dispatch(fetchProposedRules());
      return { success: true };
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.detail || "Failed to create proposed rule",
      );
    }
  },
);

const slice = createSlice({
  name: "ruleBooks",
  initialState: {
    list: [],
    loading: false,
    error: null,
    searchResults: [],
    currentRuleBookRules: [],
    selectedRuleBook: null,
    selectedRuleBookLoading: false,
    proposedRules: [],
    proposedRulesLoading: false,
  },
  reducers: {
    clearSearchResults(state) {
      state.searchResults = [];
    },
    clearError(state) {
      state.error = null;
    },
    clearCurrentRules(state) {
      state.currentRuleBookRules = [];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchRuleBooks.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchRuleBooks.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchRuleBooks.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchRuleBookDetails.pending, (s) => {
        s.selectedRuleBookLoading = true;
      })
      .addCase(fetchRuleBookDetails.fulfilled, (s, a) => {
        s.selectedRuleBookLoading = false;
        s.selectedRuleBook = a.payload;
      })
      .addCase(fetchRuleBookDetails.rejected, (s) => {
        s.selectedRuleBookLoading = false;
      })
      .addCase(searchSimilarRuleBooks.fulfilled, (s, a) => {
        s.searchResults = a.payload;
      })
      .addCase(fetchRuleBookRules.fulfilled, (s, a) => {
        s.currentRuleBookRules = a.payload.rules;
      })
      .addCase(fetchProposedRules.pending, (s) => {
        s.proposedRulesLoading = true;
      })
      .addCase(fetchProposedRules.fulfilled, (s, a) => {
        s.proposedRulesLoading = false;
        s.proposedRules = a.payload;
      })
      .addCase(fetchProposedRules.rejected, (s) => {
        s.proposedRulesLoading = false;
      });
  },
});

export const { clearSearchResults, clearError, clearCurrentRules } =
  slice.actions;
export default slice.reducer;
