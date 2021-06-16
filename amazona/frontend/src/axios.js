import axios from "axios";
import Cookies from "js-cookie";
axios.interceptors.request.use((req) => {
  console.log(Cookies.get());

  const accessToken = Cookies.get("accessToken");
  console.log(Cookies.get("accessToken"));
  if (accessToken) req.headers.authorization = "Bearer " + accessToken;
  return req;
});

axios.interceptors.response.use(
  (res) => {
    console.log(res);
    // when signout
    if (res.data.success) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return res;
    }
    if (res.data.accessToken)
      Cookies.set("accessToken", res.data.accessToken, { expires: 1 });
    if (res.data.refreshToken)
      Cookies.set("refreshToken", res.data.refreshToken, { expires: 1 });
    return res;
  },
  async (err) => {
    console.log(err);
    if (err.response.status !== 403) return err.response.data;
    if (err.response.data === "Password incorrect") return err.response.data;
    const originalRequest = err.config;
    try {
      const refreshToken = Cookies.get("refreshToken");
      const newTokenRes = await axios.post("/api/users/refresh_token", {
        refreshToken: refreshToken ? refreshToken : "",
      });

      if (newTokenRes instanceof Error) throw newTokenRes;

      const { accessToken } = newTokenRes.data.accessToken;
      Cookies.set("accessToken", accessToken, { expires: 1 });
      const originalResponse = await axios(originalRequest);
      return originalResponse;
    } catch (e) {
      return e.response.data;
    }
  }
);

export default axios;
