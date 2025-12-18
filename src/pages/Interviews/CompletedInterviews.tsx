import { Link } from "react-router-dom";
import { useInterviewStore } from "../../store/interviewStore";
import { formatDate } from "../../utils/dateFormatter";
import { useEffect } from "react";


const CompletedInterviews = () => {
    const { interviews, fetchCompletedInterviews } = useInterviewStore();

    useEffect(() => {
        fetchCompletedInterviews();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 🔥 If no interviews, show empty state
    if (interviews.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <h2 className="text-2xl font-bold mb-4">No Completed Interviews</h2>
                <p className="text-gray-400">
                    Completed interviews will appear here once candidates finish their sessions.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Completed Interviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
                {interviews.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                    >
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                            <span className="text-gray-500 text-sm">{formatDate(item.date)}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold mb-1">{item.position}</h3>

                        <div className="flex items-center gap-4 lg:col-span-2 justify-between">
                            {/* Duration */}
                            <p className="text-gray-500">{item.duration} Min</p>

                            {/* Candidate Count */}
                            <p className="text-green-600 font-medium">
                                1 Candidate
                            </p>
                        </div>

                        {/* View Details Button */}
                        <Link
                            to={`/completedInterviews/${item.id}`}
                            className="mt-4 block w-full text-center py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium"
                        >
                            View Detail →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletedInterviews;
