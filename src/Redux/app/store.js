import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import AuthSlice from "../features/adminAuth/authSlice";
import ChatDataSlice from "../features/Chat/chatSlice";
import { thunk } from "redux-thunk";
import languageReducer from "../features/Language/languageSlice";

const authReducer = combineReducers({
  AuthSlice,
});

const appReducer = combineReducers({
  authReducer,
  language: languageReducer,
  ChatDataSlice,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET") {
    state = undefined;
  }
  return appReducer(state, action);
};
const persistedReducer = persistReducer(
  { key: "root", version: 1, storage },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.VITE_PROTECTION === "developer" ? true : false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk,
    }),
});

export const persistor = persistStore(store);
export default store;
