import {
  PRODUCT_ANALYSIS_FAIL,
  PRODUCT_ANALYSIS_REQUEST,
  PRODUCT_ANALYSIS_RESET,
  PRODUCT_ANALYSIS_SUCCESS,
} from "../constants/analysisConstants.js";
export const productAnalysisReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_ANALYSIS_REQUEST:
      return { loading: true };
    case PRODUCT_ANALYSIS_SUCCESS:
      return { loading: false, success: true, productSold: action.payload };
    case PRODUCT_ANALYSIS_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_ANALYSIS_RESET:
      return {};
    default:
      return state;
  }
};
