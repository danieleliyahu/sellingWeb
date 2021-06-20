import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  useHistory,
} from "react-router-dom";
import { signout, userInformation } from "./actions/userActions";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import SellerRoute from "./components/SellerRoute";
import SellerScreen from "./screens/SellerScreen";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import { useEffect, useState } from "react";
import { listProductCategories } from "./actions/productActions";
import LoadingBox from "./components/LoadingBox";
import MessageBox from "./components/MessageBox";
import DashboardScreen from "./screens/DashboardScreen";
import ProductPostScreen from "./screens/ProductPostScreen";
import UserActivateScreen from "./screens/UserActivateScreen";
import Axios from "axios";
import {
  dispatchGetUser,
  dispatchLogin,
  fetchUser,
} from "./actions/tokenActions";
import Cookies from "js-cookie";

function App() {
  const cart = useSelector((state) => state.cart);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userInformation);
  const { userInfo, error } = userSignin;
  console.log(userSignin);
  const dispatch = useDispatch();
  const history = useHistory();
  const signoutHandler = async () => {
    dispatch(signout());
    dispatch(userInformation());
  };

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  console.log(userSignin && userSignin);
  // if (userInfo && userInfo.message === "Login success!") {
  //   console.log("hi");
  //   Axios.post("/api/users/refresh_token");
  //   dispatch(userInformation());
  // }
  console.log(userInfo);
  useEffect(async () => {
    console.log("11111");

    await Axios.post("/api/users/refresh_token");
    console.log("22222");
    dispatch(userInformation());

    console.log("33333");
  }, [dispatch, error]);

  // useEffect(() => {
  //   if (userInfo) {
  //
  //   }
  // }, [error]);
  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <Link className="brand" to="/">
              amazona
            </Link>
          </div>
          <div>
            <Route
              render={({ history }) => (
                <SearchBox history={history}></SearchBox>
              )}></Route>
          </div>
          <div>
            <Link to="/cart">
              Cart
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length} </span>
              )}
            </Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.name}
                  <i className={"fa fa-caret-down"} />
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">User profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Order History</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Sing In</Link>
            )}
            {userInfo && userInfo.isSeller && (
              <div className="dropdown">
                <Link to="#admin">
                  Seller <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/productlist/seller">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/seller">Orders</Link>
                  </li>
                </ul>
              </div>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  Admin <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/productlist">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        <aside className={sidebarIsOpen ? "open" : ""}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button">
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    onClick={() => setSidebarIsOpen(false)}
                    to={`/search/category/${c}`}>
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <main>
          <Route path="/seller/:id" component={SellerScreen}></Route>
          <Route
            path="/postproduct"
            component={ProductPostScreen}
            exact></Route>
          <Route path="/product/:id" component={ProductScreen} exact></Route>
          <Route
            path="/product/:id/edit"
            component={ProductEditScreen}
            exact></Route>
          <Route path="/cart/:id?" component={CartScreen}></Route>
          <Route path="/signin" component={SigninScreen}></Route>
          <Route path="/register" component={RegisterScreen}></Route>
          <Route path="/registerasseller" component={RegisterScreen}></Route>
          <Route path="/shipping" component={ShippingAddressScreen}></Route>
          <Route path="/payment" component={PaymentMethodScreen}></Route>
          <Route path="/placeorder" component={PlaceOrderScreen}></Route>
          <Route path="/order/:id" component={OrderScreen}></Route>
          <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
          <Route
            path="/user/activate/:activation_token"
            component={UserActivateScreen}></Route>
          <Route
            path="/search/name/:name?"
            component={SearchScreen}
            exact></Route>
          <Route
            path="/search/category/:category"
            component={SearchScreen}
            exact></Route>
          <Route
            path="/search/category/:category/name/:name"
            component={SearchScreen}
            exact></Route>{" "}
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
            component={SearchScreen}
            exact></Route>
          <PrivateRoute
            path="/profile"
            component={ProfileScreen}></PrivateRoute>
          <AdminRoute
            exact
            path="/productlist"
            component={ProductListScreen}></AdminRoute>{" "}
          <AdminRoute
            exact
            path="/productlist/pageNumber/:pageNumber"
            component={ProductListScreen}></AdminRoute>
          <AdminRoute
            exact
            path="/orderlist"
            component={OrderListScreen}></AdminRoute>
          <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute>
          <AdminRoute
            path="/user/:id/edit"
            component={UserEditScreen}></AdminRoute>{" "}
          <AdminRoute
            path="/dashboard"
            component={DashboardScreen}></AdminRoute>
          <SellerRoute
            path="/productlist/seller"
            component={ProductListScreen}
            exact></SellerRoute>
          <SellerRoute
            path="/productlist/seller/pageNumber/:pageNumber"
            component={ProductListScreen}
            exact></SellerRoute>
          <SellerRoute
            path="/orderlist/seller"
            component={OrderListScreen}></SellerRoute>
          <Route path="/" component={HomeScreen} exact></Route>
        </main>
        <footer className="row center">All right reserved</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
