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

const TodayInsight = () => {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [insightData, setInsightData] = useState(null);
    const [suggestion, setSuggestion] = useState(false);

    const fetchTodayInsight = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/daily-insight`,
                { date },
                { withCredentials: true }
            );

            const data = res.data;

            if (data?.result?.length > 0) {
                setInsightData({
                    result: data.result,
                    totalPrepared: data.totalPrepared,
                    totalConsumed: data.totalConsumed,
                    totalWaste: data.totalWaste
                });
                toast.success('Fetched Daily Insight Successfully');
            } else if (data?.result?.length == 0) {
                setInsightData(null);
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
                data: insightData ? [
                    insightData.totalPrepared,
                    insightData.totalConsumed,
                    insightData.totalWaste
                ] : [0, 0, 0],
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

    useEffect(() => {
        fetchTodayInsight();
    }, []);

    return (
        <div className="mt-5">
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input input-bordered"
                />
                <button onClick={fetchTodayInsight} className="btn btn-accent">
                    Get Insight
                </button>
                <button className="btn btn-accent"
                    onClick={() => {
                        setSuggestion(suggestion ? false : true);
                    }}
                >
                    Suggestion
                </button>
            </div>

            {insightData && (
                <>
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-2">Daily Insight</h2>
                        <Bar data={overallBarChart} options={chartOptions} />
                        {suggestion && (
                            <div className="absolute top-9/12 left-6/12 transform -translate-x-1/2 -translate-y-full bg-base-100 p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md border border-base-300 z-20">
                                <h2 className="text-lg font-semibold">Suggestions</h2>
                                <ul className="list-disc pl-5">
                                    {insightData.result.map((dish, idx) => (
                                        <li key={idx}>{dish.suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Dish Wise Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {insightData.result.map((dish, index) => (
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

export default TodayInsight;