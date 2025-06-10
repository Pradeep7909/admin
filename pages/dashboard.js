import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import APIService from "../src/api/API";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const api = new APIService();

const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [paidUsersData, setPaidUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashBoardData()
      .then((response) => {
        const { usersData, postsData, paidUsersData } = response;
        setUsersData(usersData || []);
        setPostsData(postsData || []);
        setPaidUsersData(paidUsersData || []);
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error fetching dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const renderLegend = ({ payload }) => (
    <ul className="custom-legend">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="legend-item">
          <span className="legend-color me-2" style={{ backgroundColor: entry.color }}></span>
          <span className="font-12">{entry.value}</span>
        </li>
      ))}
    </ul>
  );

  const PieChartSkeleton = () => {
    return (
      <div className="w-100 px-4">
        <div className="w-100 text-center">
          <Skeleton height={160} width={160} circle={true} />
        </div>
        <Skeleton count={3} height={15} width={100} className="mb-1" />
      </div>
    );
  };

  return (
    <div className="container dashboard">
      <h3 className="my-4">Details of User Records and Post Records</h3>
      <div className="row">

        {/* Users Count */}
        <div className="col-md-4">
          <div className="card bg-light-pink p-4">
            <h3 className="count-title">Users Count</h3>
            <div className="card-body">
              {loading
                ? <Skeleton count={3} height={25} className="mb-2" />
                : usersData.map((u, i) => (
                  <p key={i}><strong>{u.name}:</strong> {u.value.toLocaleString()}</p>
                ))}
              <div className="chart-container">
                {loading ? (
                  <PieChartSkeleton />
                ) : (
                  <PieChart width={300} height={250}>
                    <Pie
                      data={usersData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {usersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend content={renderLegend} />
                  </PieChart>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Post Count */}
        <div className="col-md-4">
          <div className="card bg-light-yellow p-4">
            <h3 className="count-title">Post Count</h3>
            <div className="card-body">
              {loading
                ? <Skeleton count={3} height={25} className="mb-2" />
                : postsData.map((p, i) => (
                  <p key={i}><strong>{p.name}:</strong> {p.value.toLocaleString()}</p>
                ))}
              <div className="chart-container">
                {loading ? (
                  <PieChartSkeleton />
                ) : (
                  <PieChart width={300} height={250}>
                    <Pie
                      data={postsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {postsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend content={renderLegend} />
                  </PieChart>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Paid Users */}
        <div className="col-md-4">
          <div className="card bg-light-green p-4">
            <h3 className="count-title">Paid Count</h3>
            <div className="card-body">
              {loading
                ? <Skeleton count={3} height={25} className="mb-2" />
                : paidUsersData.map((p, i) => (
                  <p key={i}><strong>{p.name}:</strong> {p.value.toLocaleString()}</p>
                ))}
              <div className="chart-container">
                {loading ? (
                  <PieChartSkeleton />
                ) : (
                  <PieChart width={300} height={250}>
                    <Pie
                      data={paidUsersData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paidUsersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend content={renderLegend} />
                  </PieChart>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
