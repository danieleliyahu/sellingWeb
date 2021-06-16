// import Axios from "axios";
// import { GET_ALL_USERS, GET_USER, LOGIN } from "../constants/tokenConstants";

// export const dispatchLogin = () => {
//   return {
//     type: LOGIN,
//   };
// };

// export const fetchUser = async (token) => {
//   const res = await Axios.get("/api/users/info", {
//     headers: { Authorization: token },
//   });
//   return res;
// };

// export const dispatchGetUser = (res) => {
//   return {
//     type: GET_USER,
//     payload: {
//       user: res.data,
//       isAdmin: res.data.role === 1 ? true : false,
//     },
//   };
// };
// export const fetchAllUsers = async (token) => {
//   const res = await Axios.get("/api/users/all_info", {
//     headers: { Authorization: token },
//   });
//   return res;
// };

// export const dispatchGetAllUsers = (res) => {
//   return {
//     type: GET_ALL_USERS,
//     payload: res.data,
//   };
// };
