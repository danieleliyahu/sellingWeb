import {
  PRODUCT_ANALYSIS_FAIL,
  PRODUCT_ANALYSIS_REQUEST,
  PRODUCT_ANALYSIS_RESET,
  PRODUCT_ANALYSIS_SUCCESS,
  SELLER_ANALYSIS_FAIL,
  SELLER_ANALYSIS_REQUEST,
  SELLER_ANALYSIS_SUCCESS,
  SELLER_MONTHLY_ANALYSIS_MONTHLY_FAIL,
  SELLER_MONTHLY_ANALYSIS_MONTHLY_REQUEST,
  SELLER_MONTHLY_ANALYSIS_MONTHLY_SUCCESS,
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

export const sellerMoneyAnalysisReducer = (state = {}, action) => {
  switch (action.type) {
    case SELLER_ANALYSIS_REQUEST:
      return { loading: true };
    case SELLER_ANALYSIS_SUCCESS:
      return { loading: false, success: true, moneyAnalysis: action.payload };
    case SELLER_ANALYSIS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
export const sellerMonthlyAnalysisReducer = (state = {}, action) => {
  switch (action.type) {
    case SELLER_MONTHLY_ANALYSIS_MONTHLY_REQUEST:
      return { loading: true };
    case SELLER_MONTHLY_ANALYSIS_MONTHLY_SUCCESS:
      return { loading: false, success: true, monthlyAnalysis: action.payload };
    case SELLER_MONTHLY_ANALYSIS_MONTHLY_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
