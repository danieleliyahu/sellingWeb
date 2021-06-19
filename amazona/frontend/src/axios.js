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
    if (err.response.status !== 403) return err.response.data;
    if (err.response.data.message !== "Not allowed") return err.response.data;
    const originalRequest = err.config;

    try {
      const refreshToken = Cookies.get("refreshToken");
      const newTokenRes = await axios.post("/api/users/refresh_token", {
        refreshToken: refreshToken ? refreshToken : "",
      });

      const { accessToken } = newTokenRes.data.accessToken;
      Cookies.set("accessToken", accessToken, { expires: 1 });
      const originalResponse = await axios(originalRequest);
      console.log(originalResponse);
      return originalResponse;
    } catch (e) {
      return e.response.data;
    }
  }
);
export default axios;
