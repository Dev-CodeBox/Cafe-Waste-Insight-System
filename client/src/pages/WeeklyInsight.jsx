import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const WeeklyInsight = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    totalPrepared: 0,
    totalConsumed: 0,
    totalWaste: 0
  });

  const fetchWeeklyInsight = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/weekly-insight`,
        {},
        { withCredentials: true }
      );

      const data = res.data;

      if (data && data.result?.length > 0) {
        setWeeklyData(data.result);
        setStats({
          totalPrepared: data.totalPrepared,
          totalConsumed: data.totalConsumed,
          totalWaste: data.totalWaste,
        });
        toast.success('Fetched Weekly Insight Successfully');
      } else if (data?.result?.length == 0) {
        setWeeklyData([]);
        toast.error('No Weekly Insight Available');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch weekly insight');
    }
  };

  useEffect(() => {
    fetchWeeklyInsight();
  }, []);

  const overallBarChart = {
    labels: ['Prepared', 'Consumed', 'Waste'],
    datasets: [
      {
        label: 'Total (in units)',
        data: [stats.totalPrepared, stats.totalConsumed, stats.totalWaste],
        backgroundColor: ['#4CAF50', '#2196F3', '#F44336']
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-4">
        <button onClick={fetchWeeklyInsight} className="btn btn-accent">
          Refresh Weekly Insight
        </button>
      </div>

      {weeklyData.length > 0 && (
        <>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Weekly Insight</h2>
            <Bar data={overallBarChart} options={chartOptions} />
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Dish Wise Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeklyData.map((dish, index) => (
                <div key={index} className="bg-base-200 p-4 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-2">{dish.dish}</h3>
                  <Pie
                    data={{
                      labels: ['Prepared', 'Consumed', 'Waste'],
                      datasets: [
                        {
                          label: dish.dish,
                          data: [dish.prepared, dish.consumed, dish.waste],
                          backgroundColor: ['#4CAF50', '#2196F3', '#F44336']
                        }
                      ]
                    }}
                    options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                  />
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-400">{dish.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyInsight;
