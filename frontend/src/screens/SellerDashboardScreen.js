import React, { useEffect, PureComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";
import { sellerMoney, sellerMonthlyMoney } from "../actions/analysisActions";
import { salePerHourForSaller, summaryOrder } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Scatter,
  ResponsiveContainer,
} from "recharts";
const SellerDashboardScreen = () => {
  const salePerHourSaller = useSelector((state) => state.salePerHourSaller);
  const { loading, sellerSalesPerHour, error } = salePerHourSaller;

  const sellerMonthlyAnalysis = useSelector(
    (state) => state.sellerMonthlyAnalysis
  );
  const {
    loading: loadingMonthlyAnalysis,
    monthlyAnalysis,
    error: errorMonthlyAnalysis,
  } = sellerMonthlyAnalysis;

  const sellerMoneyAnalysis = useSelector((state) => state.sellerMoneyAnalysis);
  const {
    loading: loadingSellerMoneyAnalysis,
    moneyAnalysis,
    error: errorSellerMoneyAnalysis,
  } = sellerMoneyAnalysis;

  console.log(monthlyAnalysis);
  console.log(sellerMonthlyAnalysis);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(sellerMoney());
    dispatch(salePerHourForSaller());
    dispatch(sellerMonthlyMoney());
  }, [dispatch]);
  console.log(salePerHourSaller);

  return (
    <div>
      <div>
        <h1 className="title" style={{ fontSize: "8rem" }}>
          Seller Dashboard
        </h1>
      </div>
      {loadingSellerMoneyAnalysis ? (
        <LoadingBox></LoadingBox>
      ) : errorSellerMoneyAnalysis ? (
        <MessageBox variant="danger">{errorSellerMoneyAnalysis}</MessageBox>
      ) : (
        <>
          {moneyAnalysis ? (
            <>
              <h2 className="title">Revenues</h2>
              <ul className="row summary ">
                <li>
                  <div className="summary-title color2 ">
                    <span className="textdeshbord">All time</span>
                  </div>
                  <div className="summary-body">
                    ${moneyAnalysis.allTime[0].money}
                  </div>
                </li>
                <li>
                  <div className="summary-title color2">
                    <span className="textdeshbord">Today's</span>
                  </div>
                  <div className="summary-body">
                    ${moneyAnalysis.moneyMadeToday[0].money}
                  </div>
                </li>
                <li>
                  <div className="summary-title color2">
                    <span className="textdeshbord">Yesterday's</span>
                  </div>
                  <div className="summary-body">
                    ${moneyAnalysis.moneyMadeYesterday[0].money}
                  </div>
                </li>
                <li>
                  <div className="summary-title color2">
                    <span className="textdeshbord">Last Week</span>
                  </div>
                  <div className="summary-body">
                    ${moneyAnalysis.moneyMadeLastWeek[0].money}
                  </div>
                </li>{" "}
                <li>
                  <div className="summary-title color2">
                    <span className="textdeshbord">Last Month</span>
                  </div>
                  <div className="summary-body">
                    ${moneyAnalysis.lastMonth[0].money}
                  </div>
                </li>
              </ul>
            </>
          ) : (
            ""
          )}

          {sellerSalesPerHour && monthlyAnalysis ? (
            <>
              <div>
                <div>
                  <h2 className="title">Monthly sales</h2>

                  {monthlyAnalysis.ThisMonthDailyOrders.length === 0 ? (
                    <MessageBox>No Sale</MessageBox>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={monthlyAnalysis.ThisMonthDailyOrders}>
                        <defs>
                          <linearGradient
                            id="thisMonth"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1">
                            <stop
                              offset="0%"
                              stopColor="82ca9d"
                              stopOpacity={0.4}></stop>
                            <stop
                              offset="75%"
                              stopColor="82ca9d"
                              stopOpacity={0.05}></stop>
                          </linearGradient>
                          <linearGradient
                            id="lastMonth"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1">
                            <stop
                              offset="0%"
                              stopColor="8884d8"
                              stopOpacity={0.4}></stop>
                            <stop
                              offset="75%"
                              stopColor="8884d8"
                              stopOpacity={0.05}></stop>
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="_id"
                          allowDuplicatedCategory={false}></XAxis>
                        <YAxis></YAxis>
                        <Area
                          name="this month sales"
                          data={monthlyAnalysis.ThisMonthDailyOrders}
                          stroke="#82ca9d"
                          dataKey="sales"
                          fill="url(#thisMonth)"></Area>{" "}
                        <Area
                          name="last month sales"
                          data={monthlyAnalysis.lastMonthDailyOrders}
                          stroke="#8884d8"
                          dataKey="sales"
                          fill="url(#lastMonth)"></Area>
                        <Tooltip></Tooltip>
                        <CartesianGrid
                          opacity={0.8}
                          vertical={false}></CartesianGrid>
                        <Legend />
                        <Scatter
                          data={monthlyAnalysis.ThisMonthDailyOrders}
                          fill="#8884d8"
                          line
                          shape="cross"
                        />
                        <Scatter
                          data={monthlyAnalysis.lastMonthDailyOrders}
                          fill="#82ca9d"
                          line
                          shape="diamond"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              <div>
                <h2 className="title">Today's Orders </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={sellerSalesPerHour.dailyOrdersToday}>
                    <defs>
                      <linearGradient id="today" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="82ca9d"
                          stopOpacity={0.4}></stop>
                        <stop
                          offset="75%"
                          stopColor="82ca9d"
                          stopOpacity={0.05}></stop>
                      </linearGradient>
                      <linearGradient
                        id="yesterday"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="0%"
                          stopColor="8884d8"
                          stopOpacity={0.4}></stop>
                        <stop
                          offset="75%"
                          stopColor="82ca9d"
                          stopOpacity={0.05}></stop>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="_id"></XAxis>
                    <YAxis></YAxis>
                    <Area
                      name="today orders"
                      data={sellerSalesPerHour.dailyOrdersToday}
                      stroke="#82ca9d"
                      dataKey="orders"
                      fill="url(#color)"></Area>{" "}
                    <Area
                      name="yesterday orders"
                      data={sellerSalesPerHour.dailyOrdersYesterDay}
                      stroke="#8884d8"
                      dataKey="orders"
                      fill="url(#yesterday)"></Area>
                    <Tooltip></Tooltip>
                    <CartesianGrid
                      opacity={0.8}
                      vertical={false}></CartesianGrid>
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h2 className="title">Today's Sales </h2>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={sellerSalesPerHour.dailyOrdersToday}>
                    <defs>
                      <linearGradient id="today" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="82ca9d"
                          stopOpacity={0.4}></stop>
                        <stop
                          offset="75%"
                          stopColor="82ca9d"
                          stopOpacity={0.05}></stop>
                      </linearGradient>
                      <linearGradient
                        id="yesterday"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="0%"
                          stopColor="8884d8"
                          stopOpacity={0.4}></stop>
                        <stop
                          offset="75%"
                          stopColor="8884d8"
                          stopOpacity={0.05}></stop>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="_id"></XAxis>
                    <YAxis></YAxis>
                    <Area
                      name="today sales"
                      data={sellerSalesPerHour.dailyOrdersToday}
                      stroke="#82ca9d"
                      dataKey="sales"
                      fill="url(#color)"></Area>{" "}
                    <Area
                      name="yesterday sales"
                      data={sellerSalesPerHour.dailyOrdersYesterDay}
                      stroke="#8884d8"
                      dataKey="sales"
                      fill="url(#yesterday)"></Area>
                    <Tooltip></Tooltip>
                    <CartesianGrid
                      opacity={0.8}
                      vertical={false}></CartesianGrid>
                    <Legend />
                    <Scatter
                      data={sellerSalesPerHour.dailyOrdersToday}
                      fill="#8884d8"
                      line
                      shape="cross"
                    />
                    <Scatter
                      data={sellerSalesPerHour.dailyOrdersYesterDay}
                      fill="#82ca9d"
                      line
                      shape="diamond"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};

export default SellerDashboardScreen;
