import React, { useState } from 'react';
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

const DailyInsight = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyData, setDailyData] = useState([]);
  const [stats, setStats] = useState({
    totalPrepared: 0,
    totalConsumed: 0,
    totalWaste: 0
  });
  const [suggestion, setSuggestion] = useState(false);

  const fetchDailyInsight = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/daily-insight`,
        { date: selectedDate },
        { withCredentials: true }
      );

      const data = res.data;

      if (data && data.result?.length > 0) {
        setDailyData(data.result);
        setStats({
          totalPrepared: data.totalPrepared,
          totalConsumed: data.totalConsumed,
          totalWaste: data.totalWaste
        });
        toast.success('Fetched Daily Insight Successfully');
      } else if (data?.result?.length == 0) {
        setDailyData([]);
        toast.error('No Insight Available for the Selected Date');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch daily insight');
    }
  };

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input input-bordered"
        />
        <button onClick={fetchDailyInsight} className="btn btn-accent">
          Fetch Daily Insight
        </button>
        <button className="btn btn-accent"
          onClick={() => {
            setSuggestion(suggestion ? false : true);
          }}>
          Suggestion
        </button>
      </div>

      {dailyData.length > 0 && (
        <>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Daily Insight</h2>
            <Bar data={overallBarChart} options={chartOptions} />
            {suggestion && (
              <div className="absolute top-9/12 left-6/12 transform -translate-x-1/2 -translate-y-full bg-base-100 p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md border border-base-300 z-20">
                <h2 className="text-lg font-semibold">Suggestions</h2>
                <ul className="list-disc pl-5">
                  {dailyData.map((dish, idx) => (
                    <li key={idx}>{dish.suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Dish Wise Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyData.map((dish, index) => (
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

export default DailyInsight;
