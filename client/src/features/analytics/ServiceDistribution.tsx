import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../../api/axios';
import { ChartSkeleton } from '../../components/Skeleton';

const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

export const ServiceDistribution = () => {
    const { data: distribution, isLoading } = useQuery({
        queryKey: ['analytics-distribution'],
        queryFn: async () => {
            const response = await api.get('/analytics/distribution');
            return response.data;
        }
    });

    if (isLoading) return <ChartSkeleton />;

    return (
        <div className="h-[300px] w-full bg-card p-6 rounded-[2rem] border border-primary/5 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="_id"
                    >
                        {distribution?.map((_entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '16px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mr-2">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
