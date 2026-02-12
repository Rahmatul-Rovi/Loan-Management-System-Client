import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FaMoneyBillWave, FaUsers, FaChartLine } from 'react-icons/fa';

const AdminChart = () => {
    const [data, setData] = useState([]);
    const [totals, setTotals] = useState({});
    const [loading, setLoading] = useState(true);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        fetch("http://localhost:3000/admin-stats")
            .then(res => res.json())
            .then(resData => {
                setData(resData.chartData);
                setTotals(resData.totals);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center font-bold">Loading Premium Analytics...</div>;

    return (
        <div className="p-6 bg-gray-50 dark:bg-[#0A122A] min-h-screen">
            <h1 className="text-3xl font-black mb-8 text-gray-800 dark:text-white">Financial Analytics</h1>

            {/* --- Stats Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Disbursed" value={`$${totals.totalLoaned?.toLocaleString()}`} icon={<FaMoneyBillWave />} color="bg-blue-500" />
                <StatCard title="Expected Return" value={`$${totals.totalRepayable?.toLocaleString()}`} icon={<FaChartLine />} color="bg-green-500" />
                <StatCard title="Active Applications" value={data.reduce((a, b) => a + b.value, 0)} icon={<FaUsers />} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Bar Chart --- */}
                <div className="bg-white text-white dark:bg-[#111B33] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-6">Loan Distribution</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '10px'}} />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                                    {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- Pie Chart --- */}
                <div className="bg-white dark:bg-[#111B33] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl text-white font-bold mb-6">Market Share (Status)</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Small Card Component
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-[#111B33] p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
        <div className={`${color} p-4 rounded-2xl text-white text-2xl`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white">{value}</h3>
        </div>
    </div>
);

export default AdminChart;