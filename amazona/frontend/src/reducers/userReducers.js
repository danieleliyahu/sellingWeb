import {
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_RESET,
  USER_DELETE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_RESET,
  USER_DETAILS_RESET,
  USER_TOPSELLERS_LIST_REQUEST,
  USER_TOPSELLERS_LIST_SUCCESS,
  USER_TOPSELLERS_LIST_FAIL,
  USER_REVIEW_CREATE_REQUEST,
  USER_REVIEW_CREATE_SUCCESS,
  USER_REVIEW_CREATE_FAIL,
  USER_REVIEW_CREATE_RESET,
  USER_ACTIVATE_REQUEST,
  USER_ACTIVATE_SUCCESS,
  USER_ACTIVATE_FAIL,
  USER_INFO_FAIL,
  USER_INFO_SUCCESS,
  USER_INFO_REQUEST,
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

export const userSigninReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return { loading: true };
    case USER_SIGNIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_SIGNIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_SIGNOUT:
      return {};
    default:
      return state;
  }
};

export const userInformationReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_INFO_REQUEST:
      return { loading: true };
    case USER_INFO_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_INFO_FAIL:
      return { loading: false, error: action.payload };
    case USER_SIGNOUT:
      return {};
    default:
      return state;
  }
};
export const userRegisterReducer = (state = {}, action, success = false) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload, success: true };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};
export const sellerRegisterReducer = (state = {}, action, success = false) => {
  switch (action.type) {
    case SELLER_REGISTER_REQUEST:
      return { loading: true };
    case SELLER_REGISTER_SUCCESS:
      return { loading: false, message: action.payload, success: true };
    case SELLER_REGISTER_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};
export const forgotPasswordReducer = (state = {}, action, success = false) => {
  switch (action.type) {
    case USER_FORGOT_PASSWORD_REQUEST:
      return { loading: true };
    case USER_FORGOT_PASSWORD_SUCCESS:
      return { loading: false, message: action.payload, success: true };
    case USER_FORGOT_PASSWORD_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};
export const resetPasswordReducer = (state = {}, action, success = false) => {
  switch (action.type) {
    case USER_RESET_PASSWORD_REQUEST:
      return { loading: true };
    case USER_RESET_PASSWORD_SUCCESS:
      return { loading: false, message: action.payload, success: true };
    case USER_RESET_PASSWORD_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};
export const userActivateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_ACTIVATE_REQUEST:
      return { loading: true };
    case USER_ACTIVATE_SUCCESS:
      return { loading: false, message: action.payload, success: true };
    case USER_ACTIVATE_FAIL:
      return { loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};
export const userDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { loading: true };
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case USER_DETAILS_RESET:
      return { loading: true };
    default:
      return state;
  }
};

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true };
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case USER_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

export const userListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { loading: true };
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { loading: true };
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case USER_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return { loading: true };
    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case USER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case USER_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const userTopSellersListReducer = (
  state = { loading: true },
  action
) => {
  switch (action.type) {
    case USER_TOPSELLERS_LIST_REQUEST:
      return { loading: true };
    case USER_TOPSELLERS_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_TOPSELLERS_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REVIEW_CREATE_REQUEST:
      return { loading: true };
    case USER_REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true, review: action.payload };
    case USER_REVIEW_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case USER_REVIEW_CREATE_RESET:
      return {};
    default:
      return state;
  }
};
