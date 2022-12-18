import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import {
  IDBObjectNotFound,
  NotLoggedInError,
  TokenSetNotFoundError,
} from "../error";
import TokenSet from "../models/tokenSet";
import User from "../models/user";
import { RootState } from "../store";
import {
  getFromIDBStore,
  removeFromIDBStore,
  storeInIDBStore,
} from "../utils/indexedDBHelper";
import { LocalStorageKey } from "../utils/localStorage";

interface UserState {
  currentUser: User | null;
  tokenSet: TokenSet | null;
  error: SerializedError | null;
}

interface LoginState {
  user: User;
  tokenSet: TokenSet;
}

const initialUserState = () => {
  const jsonCurrentUser = localStorage.getItem(LocalStorageKey.CURRENT_USER);
  if (!jsonCurrentUser) {
    return {} as UserState;
  }

  const currentUser = JSON.parse(jsonCurrentUser) as User;

  return {
    currentUser: currentUser,
  } as UserState;
};

export const initializeTokenSet = createAsyncThunk<
  TokenSet,
  void,
  { state: RootState }
>("user/initializeTokenSet", async () => {
  return await getFromIDBStore("tokenset");
});

export const setLoginState = createAsyncThunk<LoginState, LoginState>(
  "user/setCurrentUser",
  async (state) => {
    const { tokenSet } = state;
    await storeInIDBStore("tokenset", tokenSet);
    return state;
  }
);

export const removeCurrentUser = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("user/removeCurrentUser", async () => {
  return await removeFromIDBStore("tokenset");
});

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setLoginState.pending, (state) => {
      state.error = null;
    });
    builder.addCase(setLoginState.fulfilled, (state, action) => {
      const { user, tokenSet } = action.payload;

      state.currentUser = user;
      state.tokenSet = tokenSet;

      localStorage.setItem("current_user", JSON.stringify(user));
    });
    builder.addCase(setLoginState.rejected, (state, action) => {
      state.error = action.error;
    });

    builder.addCase(initializeTokenSet.pending, (state) => {
      state.error = null;
    });
    builder.addCase(initializeTokenSet.fulfilled, (state, action) => {
      state.tokenSet = action.payload;
    });
    builder.addCase(initializeTokenSet.rejected, (state, action) => {
      state.currentUser = null;
      state.tokenSet = null;

      if (action.error.message === IDBObjectNotFound) {
        action.error.message = TokenSetNotFoundError;
      }

      state.error = action.error;
    });

    builder.addCase(removeCurrentUser.pending, (state) => {
      state.error = null;
    });
    builder.addCase(removeCurrentUser.fulfilled, (state) => {
      state.currentUser = null;
      state.tokenSet = null;
      state.error = { message: NotLoggedInError };

      localStorage.removeItem("current_user");
    });
    builder.addCase(removeCurrentUser.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export default userSlice.reducer;
