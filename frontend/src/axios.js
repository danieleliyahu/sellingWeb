import axios from "axios";
import Cookies from "js-cookie";

axios.interceptors.request.use(async (req) => {
  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    req.headers.authorization = "Bearer " + accessToken;
  }
  return req;
});
axios.interceptors.response.use(
  (res) => {
    // when signout
    if (res.data.accessToken)
      Cookies.set("accessToken", res.data.accessToken, { expires: 1 });
    if (res.data.refreshToken)
      Cookies.set("refreshToken", res.data.refreshToken, { expires: 1 });
    return res;
  },
  async (err) => {
    console.log(err);

    if (err.response.status !== 403) return Promise.reject(err);
    if (err.response.data.message !== "Invalid Token") {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage.removeItem("userInfo");
      return Promise.reject(err);
    }
    const originalRequest = err.config;

    try {
      const refreshToken = Cookies.get("refreshToken");
      console.log(refreshToken);
      const newTokenRes = await axios.post("/api/users/refresh_token", {
        refreshToken: refreshToken ? refreshToken : "",
      });

      console.log(newTokenRes);
      if (newTokenRes === undefined) {
        return Promise.reject(err);
      }
      console.log("sssssssssssssssssss");
      const accessToken = newTokenRes.data;
      Cookies.set("accessToken", accessToken, { expires: 1 });
      const originalResponse = await axios(originalRequest);
      console.log(originalResponse);

      // return Promise.reject(err);
      return originalResponse;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);
export default axios;
