
import { useInterviewStore } from "../../store/interviewStore";
import { useEffect } from "react";
import { InterviewCard } from "../Dashboard/DashboardPage";
import { Link } from "react-router-dom";

const ScheduledInterviews = () => {
    const fetchScheduledInterviews = useInterviewStore((s) => s.fetchScheduledInterviews);
    const { interviews } = useInterviewStore();

    useEffect(() => {
        fetchScheduledInterviews();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 🔥 If no interviews, show empty state
    if (interviews.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <h2 className="text-2xl font-bold mb-4">No Scheduled Interviews</h2>
                <p className="text-gray-400">
                    Scheduled interviews will appear here once candidates sessions Created.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Scheduled Interviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
                {interviews.map((item) => (
                    <Link
                        to={`/completedInterviews/${item.id}`} >
                        <InterviewCard key={item.id} data={item} />
                    </Link >
                ))}
            </div>
        </div>

    );
};

export default ScheduledInterviews;