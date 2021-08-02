// import {
//   GET_ALL_USERS,
//   GET_TOKEN,
//   GET_USER,
//   LOGIN,
// } from "../constants/tokenConstants";

// const token = "";

// export const tokenReducer = (state = token, action) => {
//   switch (action.type) {
//     case GET_TOKEN:
//       return action.payload;
//     default:
//       return state;
//   }
// };

// const initialState = {
//   user: [],
//   isLogged: false,
//   isAdmin: false,
// };

// export const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOGIN:
//       return {
//         ...state,
//         isLogged: true,
//       };
//     case GET_USER:
//       return {
//         ...state,
//         user: action.payload.user,
//         isAdmin: action.payload.isAdmin,
//       };
//     default:
//       return state;
//   }
// };
// const users = [];

// export const usersReducer = (state = users, action) => {
//   switch (action.type) {
//     case GET_ALL_USERS:
//       return action.payload;
//     default:
//       return state;
//   }
// };
