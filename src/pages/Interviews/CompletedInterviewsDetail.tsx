import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Code } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { useInterviewStore } from "../../store/interviewStore";
import { formatDate } from "../../utils/dateFormatter";

const CompletedInterviewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const fetchInterviewDetails = useInterviewStore((s) => s.fetchInterviewDetails);
    const deleteInterview = useInterviewStore((s) => s.deleteInterview);

    const [interview, setInterview] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchInterviewDetails(id!);
            if (data) {
                setInterview(data.interview);
                setCandidates(data.candidates);
            }
            setLoading(false);
        };
        load();
    }, [id]);  // eslint-disable-line react-hooks/exhaustive-deps

    // Loading UI
    if (loading || !interview) {
        return (
            <div className="p-8 text-center text-gray-500">
                Loading interview details...
            </div>
        );
    }


    return (
        <div className="p-8">
            {/* Back Button */}
            <div className="flex items-center gap-4 mb-4 justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                {interview.status === "scheduled" && (
                    <button
                        onClick={async () => {
                            if (!confirm("Are you sure you want to delete this interview?")) return;
                            await deleteInterview(interview.id);
                            navigate("/scheduledInterviews");
                        }}
                        className="text-red-600 border border-red-400 px-4 py-2 rounded-lg hover:bg-red-100"
                    >
                        Delete Interview
                    </button>
                )}
            </div>

            <h2 className="text-2xl font-bold mb-6">Interview Detail</h2>

            <div className="bg-white p-8 rounded-xl shadow">
                {/* Job Title + Duration + Info */}
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold">{interview.role}</h3>

                        <div className="flex items-center gap-2 mt-1 text-gray-600">
                            <Clock size={18} /> {interview.duration} Min
                        </div>
                    </div>

                    <div className="text-gray-700 mt-4 md:mt-0">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            {formatDate(interview.created_at)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <Code size={18} /> Technical Interview
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="mb-8">
                    <h4 className="font-bold text-lg mb-2">Job Description</h4>
                    <p className="text-gray-700 leading-relaxed">
                        {interview.job_description}
                    </p>
                </div>

                {/* Interview Questions */}
                <div>
                    <h4 className="font-bold text-lg mb-3">Interview Questions</h4>

                    <ol className="list-decimal ml-5 space-y-4 text-gray-800">
                        {interview.questions.map((q: any, idx: number) => (
                            <li key={idx}>{q.question}</li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Candidates Section */}
            <div className="mt-5">
                <h3 className="text-xl font-semibold mb-4">
                    Candidates ({candidates.length})
                </h3>

                {candidates.length === 0 && (
                    <p className="text-gray-500">No candidates have completed the interview.</p>
                )}

                {candidates.map((c) => (
                    <div
                        key={c.id}
                        className="bg-white rounded-xl shadow p-5 flex items-center justify-between mb-4"
                    >
                        {/* Left Section */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                                {c.name.charAt(0)}
                            </div>

                            <div>
                                <p className="text-lg font-semibold">{c.name}</p>
                                <p className="text-gray-500 text-sm">
                                    {c.status} on: {formatDate(c.updated_at)}
                                </p>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-6">
                            {/* Score */}
                            <p className="text-green-600 font-semibold text-lg">
                                {c.report?.score || 0}/10
                            </p>

                            <button
                                onClick={() => setOpen(true)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-blue-600 hover:bg-gray-100 transition"
                            >
                                View Report
                            </button>
                        </div>

                        {/* Modal */}
                        <FeedbackModal
                            id={c.id}
                            open={open}
                            onClose={() => setOpen(false)}
                            report={{
                                score: c.report?.score || 0,
                                candidate: c.name,
                                email: c.email,
                                skills: c.report?.skills || {
                                    technical: 0,
                                    problemSolving: 0,
                                    communication: 0,
                                    experience: 0,
                                },
                                summary:
                                    c.report?.summary || "The candidate performed well overall. Review answers for detailed breakdown.",
                                recommendation: c.report?.recommendation ||
                                    "Recommended for next round based on performance.",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletedInterviewsDetail;
