import { X } from "lucide-react";
import { useInterviewStore, type CandidateReport } from "../../store/interviewStore";

interface FeedbackModalProps {
    id: string;
    open: boolean;
    onClose: () => void;
    report: CandidateReport;
}

function formatSkillLabel(key: string) {
    const labels: Record<string, string> = {
        technical: "Technical Skills",
        problemSolving: "Problem Solving",
        communication: "Communication",
        experience: "Experience",
    };
    return labels[key] || key;
}

export default function FeedbackModal({ id, open, onClose, report }: FeedbackModalProps) {
    const downloadReport = useInterviewStore((s) => s.downloadReport);
    const selectCandidate = useInterviewStore((s) => s.selectCandidate);
    const rejectCandidate = useInterviewStore((s) => s.rejectCandidate);
    const isRecommended = report.score >= 6;
    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 p-10">

            {/* Transparent Background + Blur */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Card */}
            <div className="relative bg-white md:w-[900px] w-full max-h-[90vh] rounded-2xl shadow-xl z-50 flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Feedback</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={22} />
                    </button>
                </div>
                <div className="overflow-y-auto px-6 py-4 flex-1 space-y-6">
                    {/* Candidate Info */}
                    <div className="flex items-center gap-4 justify-between mt-4">
                        <div className="flex gap-2 mt-2 items-center">
                            <div className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                                T
                            </div>
                            <div>
                                <p className="text-gray-500">{report.candidate}</p>
                                <p className="text-gray-500"> {report.email}</p>
                            </div>
                        </div>
                        <p className="text-blue-600 font-bold text-2xl">{report.score}/10</p>
                    </div>

                    {/* Skills Assessment */}
                    <h3 className="font-semibold mt-4 mb-2">Skills Assessment</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(report.skills)
                            .filter(([, value]) => value > 0)
                            .map(([key, value]) => (
                                <SkillBar
                                    key={key}
                                    label={formatSkillLabel(key)}
                                    value={value}
                                />
                            ))}
                    </div>

                    {/* Summary */}
                    <h3 className="font-semibold mt-6 mb-2">Performance Summary</h3>
                    <p className="p-4 bg-gray-100 rounded-lg text-gray-700 leading-relaxed">
                        {report.summary}
                    </p>
                    <button onClick={async () => {
                        try {
                            const pdfBlob = await downloadReport(id);
                            const url = window.URL.createObjectURL(pdfBlob);

                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `report_${id}.pdf`;
                            a.click();

                            window.URL.revokeObjectURL(url);
                        } catch (err) {
                            console.error(err);
                            alert("Failed to download report");
                        }
                    }} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-200 transition">
                        Download Report
                    </button>

                    {/* Recommendation */}
                    <div className={`mt-6 p-4 rounded-lg border ${isRecommended ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"}`}>
                        <p className={`font-semibold ${isRecommended ? "text-green-700" : "text-red-700"}`}>Recommendation:
                        </p>
                        <p className={`mt-1 mb-5 ${isRecommended ? "text-green-600" : "text-red-600"}`} >
                            {report.recommendation}
                        </p>
                        <a
                            href={`mailto:?subject=Interview Invitation&body=${encodeURIComponent(
                                report.summary
                            )}`}
                            className={`px-4 py-2 text-white rounded-lg transition ${isRecommended ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                            Send Msg
                        </a>
                    </div>
                </div>
                {/* Decision Actions */}
                <div className="px-6 py-4 flex justify-end gap-4">
                    <button
                        onClick={async () => {
                            await selectCandidate(id);
                            onClose();
                        }}
                        disabled={report.score < 6}
                        className={`px-5 py-2 rounded-lg text-white font-medium transition ${report.score >= 6
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Select Candidate
                    </button>

                    <button
                        onClick={async () => {
                            await rejectCandidate(id);
                            onClose();
                        }}
                        className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                    >
                        Reject Candidate
                    </button>
                </div>

            </div>
        </div>
    );
}

function SkillBar({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <div className="flex justify-between text-sm font-medium mb-1">
                <span>{label}</span>
                <span>{value}/10</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                    className="h-2 bg-blue-600 rounded-full transition-all"
                    style={{ width: `${value * 10}%` }}
                ></div>
            </div>
        </div>
    );
}


