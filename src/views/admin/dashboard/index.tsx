"use client";

import { useState, useEffect } from "react";
import type { FC } from "react";
import {
  Users,
  BookOpen,
  CreditCard,
  TrendingUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dashboardAPI from "../../../api/dashboardAPI";

interface DashboardStats {
  totalUsers: number;
  totalKanjis: number;
  totalWords: number;
}

interface ChartDataPoint {
  label: string;
  month: number;
  year: number;
  count: number;
}

interface ChartData {
  period: string;
  startDate: string;
  endDate: string;
  data: ChartDataPoint[];
  total: number;
}

const Dashboard: FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("12 tháng");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalKanjis: 0,
    totalWords: 0,
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const periodOptions = ["3 tháng", "6 tháng", "12 tháng", "24 tháng"];

  // Hàm chuyển đổi từ text sang số
  const getPeriodNumber = (periodText: string): number => {
    return parseInt(periodText.split(" ")[0]);
  };

  // Hàm format số
  const formatNumber = (num: number): string => {
    return num.toLocaleString("vi-VN");
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await dashboardAPI.getStats();
      if (response.data.success) {
        setDashboardStats(response.data.data);
      } else {
        setError("Không thể tải thống kê dashboard");
      }
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err);
      setError("Lỗi khi tải thống kê dashboard");
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Fetch chart data
  const fetchChartData = async (period: string) => {
    try {
      setIsLoadingChart(true);
      const periodNumber = getPeriodNumber(period);
      const response = await dashboardAPI.getChart(periodNumber);
      if (response.data.success) {
        setChartData(response.data.data);
      } else {
        setError("Không thể tải dữ liệu biểu đồ");
      }
    } catch (err: any) {
      console.error("Error fetching chart data:", err);
      setError("Lỗi khi tải dữ liệu biểu đồ");
    } finally {
      setIsLoadingChart(false);
    }
  };

  // Load data khi component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Load chart data khi selectedPeriod thay đổi
  useEffect(() => {
    fetchChartData(selectedPeriod);
  }, [selectedPeriod]);

  const stats = [
    {
      title: "Tổng người dùng",
      value: formatNumber(dashboardStats.totalUsers),
      icon: Users,
      color: "bg-red-50 text-red-600",
      iconBg: "bg-red-100",
    },
    {
      title: "Tổng số Hán tự",
      value: formatNumber(dashboardStats.totalKanjis),
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Tổng từ vựng",
      value: formatNumber(dashboardStats.totalWords),
      icon: CreditCard,
      color: "bg-yellow-50 text-yellow-600",
      iconBg: "bg-yellow-100",
    },
  ];

  // Custom tooltip cho biểu đồ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800">{`Tháng: ${label}`}</p>
          <p className="text-sm text-blue-600">
            {`Người dùng mới: ${formatNumber(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Có lỗi xảy ra</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchDashboardStats();
              fetchChartData(selectedPeriod);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.title}
                </p>
                {isLoadingStats ? (
                  <div className="flex items-center mt-1">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-400">Đang tải...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                )}
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color.split(" ")[1]}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Số lượng người dùng đăng ký mới
            </h3>
            {chartData && (
              <p className="text-sm text-gray-500 mt-1">
                Tổng: {formatNumber(chartData.total)} người dùng mới trong{" "}
                {chartData.period}
              </p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              disabled={isLoadingChart}
            >
              <span className="text-sm text-gray-700">{selectedPeriod}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {periodOptions.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      selectedPeriod === period
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          {isLoadingChart ? (
            <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                <p className="text-gray-500">Đang tải dữ liệu biểu đồ...</p>
              </div>
            </div>
          ) : chartData && chartData.data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
