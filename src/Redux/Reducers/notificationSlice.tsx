import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  allNotification: any[];
  newOrdersMsg: any[];
}

const initialState: NotificationState = {
  allNotification: [],
  newOrdersMsg: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNewOrderMsg: (state, action: PayloadAction<any>) => {
      state.newOrdersMsg.push({ ...action.payload });
    },
    removeReadMsg: (state, action: PayloadAction<any>) => {
      state.newOrdersMsg = [];
    },
    saveAllNotification: (state, action: PayloadAction<any>) => {
      state.allNotification = action.payload;
    },
  },
});

export const { addNewOrderMsg, saveAllNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
