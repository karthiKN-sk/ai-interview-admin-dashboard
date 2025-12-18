import { Video, Copy, Send } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPieChart from "./DashboardPieChart";
import { useDashboardStore, type InterviewList } from "../../store/dashboardStore";
// import type { InterviewItem } from "../../store/dashboardStore";
import { STAT_COLORS } from "../../data/statsConfig";
import { useEffect } from "react";
import { formatDate } from "../../utils/dateFormatter";





const DashboardPage = () => {
    const { stats, interviewsList, isInterviewsAvailable, fetchStats, fetchScheduledInterviews } = useDashboardStore();

    useEffect(() => {
        fetchStats();
        fetchScheduledInterviews();

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>

            <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>

            {/* Overview Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Stats Section (Left 2 Columns) */}
                <div className="col-span-1 lg:col-span bg-white p-6 shadow rounded-xl flex items-center justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-2 w-full gap-8 text-center">

                        {stats.map((item) => (
                            <div key={item.name}>
                                <p className="text-gray-500 text-x font-bold">{item.name}</p>
                                <h3
                                    className="text-2xl font-bold pt-2"
                                    style={{ color: STAT_COLORS[item.name as keyof typeof STAT_COLORS] }}
                                >
                                    {item.value}
                                </h3>
                            </div>
                        ))}

                    </div>
                </div>

                {/* Pie Chart Section (Right 1 Column) */}
                <div className="bg-white p-6 lg:col-span-2 shadow rounded-xl flex items-center justify-center">
                    <DashboardPieChart data={stats} />
                </div>

            </div>




            <h2 className="text-xl font-bold mb-4">Create Interview</h2>
            {/* ---------- TOP CARDS ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {/* Create Interview Card */}
                <Link
                    to="/interviews/create"
                    className="p-6 bg-white shadow rounded-xl flex items-start gap-4 hover:shadow-lg transition"
                >
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Video className="text-blue-600" size={30} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Create New Interview</h2>
                        <p className="text-gray-500 text-sm">
                            Create AI Interviews and schedule them with Candidates
                        </p>
                    </div>
                </Link>

                {/* Phone Screening
                <div className="p-6 bg-white shadow rounded-xl flex items-start gap-4 hover:shadow-lg transition">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Phone className="text-blue-600" size={30} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Create Phone Screening Call</h2>
                        <p className="text-gray-500 text-sm">
                            Schedule phone screening call with candidates
                        </p>
                    </div>
                </div> */}
            </div>

            {/* ---------- PREVIOUS INTERVIEWS ---------- */}

            {isInterviewsAvailable && (
                <h2 className="text-2xl font-semibold mb-4">
                    Previously Created Interviews
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
                {interviewsList.map((item) => (
                    <InterviewCard key={item.id} data={item} />
                ))}
            </div>
        </div >
    );
};

export function InterviewCard({ data }: { data: InterviewList }) {
    return (
        <div className="p-5 bg-white rounded-xl shadow hover:shadow-md transition">
            <div className="flex justify-between mb-2">
                <div className="h-6 w-6 rounded-full bg-blue-600" />
                <span className="text-gray-500 text-sm">{formatDate(data.date)}</span>
            </div>

            <h3 className="font-semibold text-lg mb-1">{data.position}</h3>
            <p className="text-gray-600 text-sm mb-4">{data.duration} Min</p>

            {/* Buttons */}
            <div className="flex items-center gap-3">
                <button
                    className="flex items-center gap-2 border px-3 py-2 rounded-md hover:bg-gray-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigator.clipboard.writeText(data.link);
                    }}
                >
                    <Copy size={16} /> Copy Link
                </button>

                <a
                    href={`mailto:?subject=Interview Invitation&body=${encodeURIComponent(
                        data.link
                    )}`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    <Send size={16} /> Send
                </a>
            </div>
        </div>
    );
}

export default DashboardPage;
