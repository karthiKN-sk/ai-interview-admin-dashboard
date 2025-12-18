import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import type { DashboardStats } from "../../store/dashboardStore";
import { STAT_COLORS } from "../../data/statsConfig";



const DashboardPieChart = ({ data }: { data: DashboardStats[] }) => {
    return (
        <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip />
                    <Pie
                        data={data.map(item => ({ ...item }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={4}
                        cornerRadius={8}
                        stroke="#ffffff"
                        strokeWidth={2}
                    >
                        {data.map((data, index) => (
                            <Cell key={index} fill={STAT_COLORS[data.name as keyof typeof STAT_COLORS]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DashboardPieChart;