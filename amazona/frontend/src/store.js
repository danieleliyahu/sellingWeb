import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import {
  productCategoryListReducer,
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productReviewCreateReducer,
  productUpdateReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  forgotPasswordReducer,
  resetPasswordReducer,
  sellerRegisterReducer,
  userActivateReducer,
  userDeleteReducer,
  userDetailsReducer,
  userInformationReducer,
  userListReducer,
  userRegisterReducer,
  userReviewCreateReducer,
  userSigninReducer,
  userTopSellersListReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  orderCreateReducer,
  orderDeleteReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderListReducer,
  orderMineListReducer,
  orderPayReducer,
  orderSummaryReducer,
  salePerHourForSallerSummaryReducer,
} from "./reducers/orderReducers";
import {
  productAnalysisReducer,
  sellerMoneyAnalysisReducer,
  sellerMonthlyAnalysisReducer,
} from "./reducers/analysisReducers";

const initialState = {
  userSignin: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: "paypal",
  },
};
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  sellerRegister: sellerRegisterReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderMineList: orderMineListReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
  orderDeliver: orderDeliverReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  userTopSellersList: userTopSellersListReducer,
  productCategoryList: productCategoryListReducer,
  productReviewCreate: productReviewCreateReducer,
  orderSummary: orderSummaryReducer,
  userReviewCreate: userReviewCreateReducer,
  userActivate: userActivateReducer,
  userInformation: userInformationReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  salePerHourSaller: salePerHourForSallerSummaryReducer,
  productAnalysis: productAnalysisReducer,
  sellerMoneyAnalysis: sellerMoneyAnalysisReducer,
  sellerMonthlyAnalysis: sellerMonthlyAnalysisReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
