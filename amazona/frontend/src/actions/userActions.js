import Cookies from "js-cookie";
import Axios from "../axios.js";
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_LIST_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_TOPSELLERS_LIST_REQUEST,
  USER_TOPSELLERS_LIST_SUCCESS,
  USER_TOPSELLERS_LIST_FAIL,
  USER_REVIEW_CREATE_REQUEST,
  USER_REVIEW_CREATE_SUCCESS,
  USER_REVIEW_CREATE_FAIL,
  USER_ACTIVATE_REQUEST,
  USER_ACTIVATE_SUCCESS,
  USER_ACTIVATE_FAIL,
  USER_INFO_REQUEST,
  USER_INFO_SUCCESS,
  USER_INFO_FAIL,
  SELLER_REGISTER_REQUEST,
  SELLER_REGISTER_SUCCESS,
  SELLER_REGISTER_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
} from "../constants/userConstants";
import { passwordValidate, validateEmail } from "../utils";

export const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post("/api/users/signin", { email, password });
    // if (data === undefined) {
    //   dispatch({
    //     type: USER_SIGNIN_FAIL,
    //     payload:
    //       data.response && data.response.data.message
    //         ? data.response.data.message
    //         : data.message,
    //   });
    // }
    console.log(data);

    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    // localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    console.log(error);

    dispatch({
      type: USER_SIGNIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const userInformation = () => async (dispatch) => {
  dispatch({ type: USER_INFO_REQUEST });
  try {
    const { data } = await Axios.get("/api/users/info");
    dispatch({ type: USER_INFO_SUCCESS, payload: data });
    console.log(data);
    if (data === undefined) {
      return dispatch({
        type: USER_INFO_FAIL,
      });
    }
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    console.log(error);

    console.log(error, "sssssssssssssssssssss");

    dispatch({
      type: USER_INFO_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const ActivateUser = (activation_token) => async (dispatch) => {
  dispatch({ type: USER_ACTIVATE_REQUEST, payload: { activation_token } });
  try {
    const { data } = await Axios.post("/api/users/activate", {
      activation_token,
    });
    dispatch({ type: USER_ACTIVATE_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: USER_ACTIVATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const forgot = (email) => async (dispatch) => {
  dispatch({ type: USER_FORGOT_PASSWORD_REQUEST, payload: { email } });
  try {
    const { data } = await Axios.post("/api/users/forgot", {
      email,
    });
    dispatch({ type: USER_FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const reset = (password) => async (dispatch) => {
  dispatch({ type: USER_RESET_PASSWORD_REQUEST, payload: { password } });
  if (!passwordValidate) {
    return dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload:
        "Password most contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
    });
  }
  try {
    const { data } = await Axios.post("/api/users/reset", {
      password,
    });
    dispatch({ type: USER_RESET_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const register =
  (name, email, password, confirmPassword) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST, payload: { email, password } });

    if (!passwordValidate(password)) {
      return dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          "Password most contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
      });
    }
    if (!validateEmail(email)) {
      return dispatch({
        type: USER_REGISTER_FAIL,
        payload: "email not valid",
      });
    }
    try {
      const { data } = await Axios.post("/api/users/register", {
        name,
        email,
        password,
        confirmPassword,
      });

      dispatch({ type: USER_REGISTER_SUCCESS, payload: data.message });
      // dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
export const sellerRegister =
  (
    name,
    email,
    password,
    confirmPassword,
    sellerName,
    sellerLogo,
    sellerDescription
  ) =>
  async (dispatch) => {
    dispatch({ type: SELLER_REGISTER_REQUEST, payload: { email, password } });

    if (!passwordValidate(password)) {
      return dispatch({
        type: SELLER_REGISTER_FAIL,
        payload:
          "Password most contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
      });
    }
    if (!validateEmail(email)) {
      return dispatch({
        type: SELLER_REGISTER_FAIL,
        payload: "email not valid",
      });
    }
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !sellerName ||
      !sellerLogo ||
      !sellerDescription
    ) {
      return dispatch({
        type: SELLER_REGISTER_FAIL,
        payload: "Fill in all the fields",
      });
    }
    try {
      const { data } = await Axios.post("/api/users/sellerRegister", {
        name,
        email,
        password,
        confirmPassword,
        sellerName,
        sellerLogo,
        sellerDescription,
      });
      console.log(data);
      dispatch({ type: SELLER_REGISTER_SUCCESS, payload: data.message });
    } catch (error) {
      dispatch({
        type: SELLER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
export const signout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingAddress");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");

  dispatch({ type: USER_SIGNOUT });
  document.location.href = "/signin";
};

export const detailsUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/users/${userId}`);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_DETAILS_FAIL, payload: message });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/users/profile`, user);
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_UPDATE_PROFILE_FAIL, payload: message });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  dispatch({ type: USER_LIST_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get("/api/users/allusers");

    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_LIST_FAIL, payload: message });
  }
};
export const deleteUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_DELETE_REQUEST, payload: userId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.delete(`/api/users/${userId}`);
    dispatch({ type: USER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_DELETE_FAIL, payload: message });
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/users/${user._id}`, user);
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_UPDATE_FAIL, payload: message });
  }
};

export const listTopSellers = () => async (dispatch, getState) => {
  dispatch({ type: USER_TOPSELLERS_LIST_REQUEST });

  try {
    const { data } = await Axios.get("/api/users/top-sellers");
    dispatch({ type: USER_TOPSELLERS_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_TOPSELLERS_LIST_FAIL, payload: message });
  }
};
export const userReview = (sellerId, review) => async (dispatch, getState) => {
  dispatch({ type: USER_REVIEW_CREATE_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(`/api/users/${sellerId}/reviews`, review);
    dispatch({
      type: USER_REVIEW_CREATE_SUCCESS,
      payload: data.review,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_REVIEW_CREATE_FAIL, payload: message });
  }
};
