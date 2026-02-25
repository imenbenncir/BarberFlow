import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';
import { ChartSkeleton } from '../../components/Skeleton';

export const RevenueTrends = () => {
    const { data: trends, isLoading } = useQuery({
        queryKey: ['analytics-trends'],
        queryFn: async () => {
            const response = await api.get('/analytics/trends');
            return response.data;
        }
    });

    if (isLoading) return <ChartSkeleton />;

    return (
        <div className="h-[300px] w-full bg-card p-6 rounded-[2rem] border border-primary/5 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="_id"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 11, fontWeight: '600' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 11, fontWeight: '600' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '16px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#f59e0b"
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
