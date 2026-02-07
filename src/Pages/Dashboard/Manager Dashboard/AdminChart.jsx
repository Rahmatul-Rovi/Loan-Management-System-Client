import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const AdminChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // সুন্দর ভাইব দেওয়ার জন্য কিছু কালার প্যালেট
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        fetch("http://localhost:3000/admin-stats")
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => console.error("Chart fetch error:", err));
    }, []);

    if (loading) return <p className="text-center font-bold">Loading Chart...</p>;

    return (
        <div className="bg-white dark:bg-[#111B33] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 mt-10">
            <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">Loan Analytics Overview</h2>
            
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 12}}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 12}}
                        />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="top" align="right" iconType="circle" height={40}/>
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminChart;