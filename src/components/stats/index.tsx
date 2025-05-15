import type React from "react";
import reviewAPI from "../../api/reviewAPI";
import { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface StatsViewProps {}

const StatsView: React.FC<StatsViewProps> = () => {
  const [heatmap, setHeatmap] = useState([]);
  const [totalCards, setTotal] = useState(0);
  const [newCards, setNew] = useState(0);
  const [learningCards, setLearning] = useState(0);
  const [reviewCards, setReview] = useState(0);

  const fetchHeatmap = async () => {
    try {
      const res = await reviewAPI.heatmap();
      setHeatmap(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchStatsCard = async () => {
    try {
      const res = await reviewAPI.statsCard();
      const data = res.data;
      setTotal(data.total);
      setNew(data.new);
      setLearning(data.learning);
      setReview(data.review);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatsCard();
    fetchHeatmap();
  }, []);

  const data = [
    { name: "Review", value: reviewCards },
    { name: "Learning", value: learningCards },
    { name: "New", value: newCards },
  ];

  const COLORS = ["#5ab055", "#ff0302", "#FFA500", "#2d60ff"];

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <h2 className="text-xl font-medium text-[#2d60ff] mb-4">
        Thống kê học tập
      </h2>

      <div className="mb-8">
        <CalendarHeatmap
          startDate={new Date(new Date().getFullYear(), 0, 1)}
          endDate={new Date(new Date().getFullYear(), 11, 31)}
          values={heatmap}
          classForValue={(value) => {
            if (
              !value ||
              typeof value.count !== "number" ||
              value.count === 0
            ) {
              return "color-empty";
            }

            const count = Math.min(value.count, 20);
            const bucket = Math.ceil(count / 5);
            return `color-scale-${bucket}`;
          }}
          titleForValue={(value) =>
            value && value.date ? `${value.date}: ${value.count} thẻ` : ""
          }
          showWeekdayLabels
        />
      </div>
      {/* Circular Progress Chart */}
      <div
        className="flex items-center gap-12"
        style={{ justifyContent: "center" }}
      >
        <div className="relative w-48 h-44">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}`, "Cards"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold">{totalCards}</span>
            <span className="text-sm">Cards</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#5ab055] rounded-sm mr-2"></div>
            <span>Ôn tập</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#ff0302] rounded-sm mr-2"></div>
            <span>Đang học tập</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#FFA500] rounded-sm mr-2"></div>
            <span>Đang học</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#2d60ff] rounded-sm mr-2"></div>
            <span>Mới</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="flex mt-8 gap-6" style={{ justifyContent: "center" }}>
        <div className="text-center">
          <span className="text-[#2d60ff]">Mới: {newCards}</span>
        </div>
        <div className="text-center">
          <span className="text-[#FFA500]">Đang học: {learningCards}</span>
        </div>
        <div className="text-center">
          <span className="text-[#5ab055]">Ôn tập: {reviewCards}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
