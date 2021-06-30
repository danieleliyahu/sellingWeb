import Axios from "../axios.js";
import {
  PRODUCT_ANALYSIS_FAIL,
  PRODUCT_ANALYSIS_REQUEST,
  PRODUCT_ANALYSIS_SUCCESS,
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
