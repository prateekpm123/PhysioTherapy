import { configureStore } from "@reduxjs/toolkit";
import userSessionReducer from "./userSessionSlice";


const userSessionStore = configureStore({
    reducer: {
        userSession: userSessionReducer,
    }
})

export type UserSessionStateType = ReturnType<typeof userSessionStore.getState>;
export type AppDispatch = typeof userSessionStore.dispatch;
export default userSessionStore;