import Axios from "../axios.js";
import {
  PRODUCT_ANALYSIS_FAIL,
  PRODUCT_ANALYSIS_REQUEST,
  PRODUCT_ANALYSIS_SUCCESS,
  SELLER_ANALYSIS_FAIL,
  SELLER_ANALYSIS_REQUEST,
  SELLER_ANALYSIS_SUCCESS,
  SELLER_MONTHLY_ANALYSIS_MONTHLY_FAIL,
  SELLER_MONTHLY_ANALYSIS_MONTHLY_REQUEST,
  SELLER_MONTHLY_ANALYSIS_MONTHLY_SUCCESS,
} from "../constants/analysisConstants.js";

export const productAnalysisInfo = (productId) => async (dispatch) => {
  console.log(productId);
  dispatch({ type: PRODUCT_ANALYSIS_REQUEST, payload: productId });

  try {
    const { data } = await Axios.get(`/api/analysis/order/${productId}`);
    console.log(data);
    dispatch({ type: PRODUCT_ANALYSIS_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_ANALYSIS_FAIL, payload: message });
  }
};
export const sellerMoney = () => async (dispatch) => {
  dispatch({ type: SELLER_ANALYSIS_REQUEST });

  try {
    const { data } = await Axios.get(`/api/analysis/sellerMoney`);
    console.log(data);
    dispatch({ type: SELLER_ANALYSIS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: SELLER_ANALYSIS_FAIL, payload: message });
  }
};

export const sellerMonthlyMoney = () => async (dispatch) => {
  dispatch({ type: SELLER_MONTHLY_ANALYSIS_MONTHLY_REQUEST });

  try {
    const { data } = await Axios.get(`/api/analysis/sallermoneymonth`);
    dispatch({ type: SELLER_MONTHLY_ANALYSIS_MONTHLY_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: SELLER_MONTHLY_ANALYSIS_MONTHLY_FAIL, payload: message });
  }
};
