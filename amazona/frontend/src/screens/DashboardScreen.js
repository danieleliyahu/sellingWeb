import React, { useEffect, PureComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";
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
const DashboardScreen = () => {
  const salePerHourSaller = useSelector((state) => state.salePerHourSaller);
  const {
    loading: loadingSellerSalesPerHour,
    sellerSalesPerHour,
    error: errorSellerSalesPerHour,
  } = salePerHourSaller;
  const orderSummary = useSelector((state) => state.orderSummary);
  const { loading, summary, error } = orderSummary;
  console.log(orderSummary);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(summaryOrder());
    dispatch(salePerHourForSaller());
  }, [dispatch]);
  console.log(salePerHourSaller);

  return (
    <div>
      <div className="row">
        <h1>Dashboard</h1>
      </div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <ul className="row summary">
            <li>
              <div className="summary-title color1">
                <span>
                  <i className="fa fa-users"></i>Users
                </span>
              </div>
              <div className="summary-body">{summary.users[0].numUsers}</div>
            </li>
            <li>
              <div className="summary-title color2">
                <span>
                  <i className="fa fa-shopping-cart"></i>Orders
                </span>
              </div>
              <div className="summary-body">
                {summary.orders[0] ? summary.orders[0].numOrders : 0}
              </div>
            </li>
            <li>
              <div className="summary-title color3">
                <span>
                  <i className="fa fa-money"></i>Sales
                </span>
              </div>
              <div className="summary-body">
                $
                {summary.orders[0]
                  ? summary.orders[0].totalSales.toFixed(2)
                  : 0}
              </div>
            </li>
          </ul>
          <div>
            <div>
              <h2>Sales</h2>
              {console.log(summary.ThisMonthDailyOrders)}
              {console.log(summary.lastMonthDailyOrders)}
              {summary.ThisMonthDailyOrders.length === 0 ? (
                <MessageBox>No Sale</MessageBox>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={summary.ThisMonthDailyOrders}>
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
                      data={summary.ThisMonthDailyOrders}
                      stroke="#82ca9d"
                      dataKey="sales"
                      fill="url(#thisMonth)"></Area>{" "}
                    <Area
                      name="last month sales"
                      data={summary.lastMonthDailyOrders}
                      stroke="#8884d8"
                      dataKey="sales"
                      fill="url(#lastMonth)"></Area>
                    <Tooltip></Tooltip>
                    <CartesianGrid
                      opacity={0.8}
                      vertical={false}></CartesianGrid>
                    <Legend />
                    <Scatter
                      data={summary.ThisMonthDailyOrders}
                      fill="#8884d8"
                      line
                      shape="cross"
                    />
                    <Scatter
                      data={summary.lastMonthDailyOrders}
                      fill="#82ca9d"
                      line
                      shape="diamond"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                // <Chart
                //   width="100%"
                //   height="400px"
                //   chartType="AreaChart"
                //   loader={<div>Loading Cart</div>}
                //   data={[
                //     ["Date", "Sales"],
                //     ...summary.ThisMonthDailyOrders.map((x) => [
                //       x._id,
                //       x.sales,
                //     ]),
                //   ]}></Chart>
              )}
            </div>
          </div>
          <div>
            <div>
              <h2>Sales per hour</h2>
              {sellerSalesPerHour ? (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="AreaChart"
                  loader={<div>Loading Cart</div>}
                  data={[
                    ["Date", "Sales"],
                    ...sellerSalesPerHour.dailyOrdersToday.map((x) => [
                      x._id,
                      x.orders,
                    ]),
                  ]}></Chart>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <div>
              <h2>orders per hour</h2>
              {sellerSalesPerHour ? (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="AreaChart"
                  loader={<div>Loading Cart</div>}
                  data={[
                    ["Date", "Sales"],
                    ...sellerSalesPerHour.dailyOrdersToday.map((x) => [
                      x._id,
                      x.sales,
                    ]),
                  ]}></Chart>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <div>
              <h2>Categories</h2>
              {summary.productCategories.length === 0 ? (
                <MessageBox>No Sale</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="PieChart"
                  loader={<div>Loading Cart</div>}
                  data={[
                    ["Category", "Products"],
                    ...summary.productCategories.map((x) => [x._id, x.count]),
                  ]}></Chart>
              )}
            </div>
          </div>
          <div>
            <h2>Today Orders comper to Yesterday</h2>
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
                  <linearGradient id="yesterday" x1="0" y1="0" x2="0" y2="1">
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
                <CartesianGrid opacity={0.8} vertical={false}></CartesianGrid>
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2>Today Sales comper to Yesterday</h2>
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
                  <linearGradient id="yesterday" x1="0" y1="0" x2="0" y2="1">
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
                <CartesianGrid opacity={0.8} vertical={false}></CartesianGrid>
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
      )}
    </div>
  );
};

export default DashboardScreen;
