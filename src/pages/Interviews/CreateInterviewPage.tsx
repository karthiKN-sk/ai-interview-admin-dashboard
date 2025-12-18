import { useState } from "react";
import { ArrowLeft, Code, Briefcase, Brain, Users } from "lucide-react";
import { useInterviewStore, type Questions } from "../../store/interviewStore";
import { useNavigate } from "react-router-dom";

const INTERVIEW_TYPES = [
    { label: "Technical", icon: <Code size={18} /> },
    { label: "Behavioral", icon: <Users size={18} /> },
    { label: "Experience", icon: <Briefcase size={18} /> },
    { label: "Problem Solving", icon: <Brain size={18} /> },
];

const DURATIONS = ["15 Min", "30 Min", "45 Min", "60 Min"];

const CreateInterviewPage = () => {
    const createInterview = useInterviewStore((s) => s.createInterview);
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [link, setLink] = useState("");
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    const toggleType = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    // -------------------------------
    // CALL REAL FASTAPI ENDPOINT
    // -------------------------------

    const generateQuestions = async () => {
        if (!role || !duration || selectedTypes.length === 0) {
            alert("Please fill all fields!");
            return;
        }

        setStep(2);
        setLoadingQuestions(true);

        try {
            const result = await createInterview({
                role,
                job_description: description,
                duration,
                types: selectedTypes,
            });

            setQuestions(result.questions);
            setLink(result.candidate_link);

        } catch (error) {
            console.error(error);
            alert("Failed to generate interview questions.");
        } finally {
            setLoadingQuestions(false);
        }
    };

    const finishInterview = () => {
        setStep(3);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">

            {step > 1 && (
                <button
                    className="flex items-center gap-2 mb-4 text-blue-600"
                    onClick={() => setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3)}
                >
                    <ArrowLeft size={20} /> Back
                </button>
            )}

            <h2 className="text-2xl font-bold mb-6">Create New Interview</h2>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
                <div
                    className={`h-2 bg-blue-600 rounded-full transition-all duration-500
                    ${step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"}`}
                ></div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
                <div className="bg-white p-6 rounded-xl shadow space-y-6">

                    <div>
                        <label className="font-medium">Job Position</label>
                        <input
                            className="w-full border rounded-lg p-3 mt-1"
                            placeholder="Full Stack Developer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-medium">Job Description</label>
                        <textarea
                            className="w-full border rounded-lg p-3 mt-1 h-28"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="font-medium">Interview Duration</label>
                        <select
                            className="w-full border rounded-lg p-3 mt-1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <option value="">Select Duration</option>
                            {DURATIONS.map((d) => (
                                <option key={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* Types */}
                    <div>
                        <label className="font-medium">Interview Type</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {INTERVIEW_TYPES.map((t) => (
                                <button
                                    key={t.label}
                                    type="button"
                                    onClick={() => toggleType(t.label)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition 
                                        ${selectedTypes.includes(t.label)
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-100"}
                                    `}
                                >
                                    {t.icon}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={generateQuestions}
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-4 w-full"
                    >
                        Generate Questions →
                    </button>
                </div>
            )}

            {/* STEP 2 — Loading */}
            {step === 2 && (
                <div className="bg-white p-6 rounded-xl shadow">

                    {/* Loading Box */}
                    {loadingQuestions ? (
                        <div className="border rounded-xl p-5 bg-blue-50 text-blue-700">
                            <p className="font-medium">Generating Interview Questions...</p>
                            <p className="text-sm">Our AI is crafting personalized questions based on your job position.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-semibold text-lg mb-4">Generated Interview Questions:</h3>

                            <div className="space-y-4">
                                {questions.map((q, i) => (
                                    <div
                                        key={i}
                                        className="border rounded-xl p-4 bg-white shadow-sm"
                                    >
                                        <p className="text-gray-800">{q.question}</p>
                                        <p className="text-blue-600 text-sm mt-2">
                                            Type: {q.type}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={finishInterview}
                                className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-5 w-full hover:bg-blue-700"
                            >
                                Create Interview Link & Finish
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* STEP 3 — Show Results */}
            {step === 3 && (
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <p className="text-green-600 text-5xl mb-4">✔</p>
                    <h3 className="text-xl font-bold mb-2">Your AI Interview is Ready!</h3>

                    <div className="border p-4 rounded-xl mt-6 flex justify-between items-center">
                        <input className="w-full outline-none" readOnly value={link} />
                        <button
                            onClick={() => navigator.clipboard.writeText(link)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Copy
                        </button>
                    </div>

                    <button
                        onClick={() => { navigate("/"); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-10"
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateInterviewPage;
