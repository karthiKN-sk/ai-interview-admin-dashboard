import { create } from "zustand";
import type { InterviewList } from "./dashboardStore";


export interface Questions {
    question: string;
    type: string;
}

export interface InterviewDetails {
    id: string;
    role: string;
    job_description: string;
    questions: Questions[];
    status: "scheduled" | "completed" | "in-progress" | "rejected";
    created_at: string;
    duration: string;
}

export interface CandidateReport {
    score: number;
    candidate: string;
    email: string;
    skills: {
        technical: number;
        problemSolving: number;
        communication: number;
        experience: number;
    };
    summary: string;
    recommendation: string;
}


export interface Candidate {
    id: string;
    name: string;
    email: string;
    report: CandidateReport | null;
    status: string;
    answers: any[];
    updated_at: string;
}

export interface InterviewFullDetails {
    interview: InterviewDetails;
    candidates: Candidate[];
}

interface InterviewState {
    interviews: InterviewList[];

    createInterview: (
        payload: {
            role: string;
            job_description: string;
            duration: string;
            types: string[];
        }
    ) => Promise<{
        questions: Questions[];
        candidate_link: string;
    }>;
    fetchScheduledInterviews: () => Promise<void>;
    fetchCompletedInterviews: () => Promise<void>;
    fetchInterviewDetails: (id: string) => Promise<InterviewFullDetails | null>;
    deleteInterview: (id: string) => Promise<void>;
    downloadReport: (id: string) => Promise<Blob>;
}

export const useInterviewStore = create<InterviewState>()((set) => ({
    interviews: [],

    createInterview: async ({ role, job_description, duration, types }) => {
        const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/admin/interviews/create`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    job_description,
                    duration,
                    types,
                }),
            }
        );

        if (!res.ok) {
            throw new Error("Failed to create interview");
        }

        const data = await res.json();

        return {
            questions: data.questions,
            candidate_link: data.candidate_link,
        };
    },

    fetchScheduledInterviews: async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/interviews/status/scheduled`
            );
            const data = await res.json();
            set({ interviews: data });

        } catch (error) {
            console.error("Error fetching scheduled interviews", error);
        }
    },
    fetchCompletedInterviews: async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/interviews/status/completed`
            );
            const data = await res.json();
            set({ interviews: data });

        } catch (error) {
            console.error("Error fetching completed interviews", error);
        }
    },

    fetchInterviewDetails: async (id: string): Promise<InterviewFullDetails | null> => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/interviews/${id}`
            );

            if (!res.ok) {
                console.error("Failed to fetch interview details");
                return null;
            }

            const data = await res.json();

            // Ensure correct mapping
            const interview: InterviewDetails = {
                id: data.interview.id,
                role: data.interview.role,
                job_description: data.interview.job_description,
                questions: data.interview.questions,
                status: data.interview.status,
                created_at: data.interview.created_at,
                duration: data.interview.duration,
            };

            const candidates: Candidate[] = data.candidates.map((c: any) => ({
                id: c.id,
                name: c.name,
                email: c.email,
                status: c.status,
                answers: c.answers ?? [],
                report: c.report ?? null,
                updated_at: c.created_at,
            }));

            return { interview, candidates };

        } catch (error) {
            console.error("Error fetching interview details", error);
            return null;
        }
    },

    deleteInterview: async (id: string) => {
        const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/admin/interviews/delete/${id}`,
            { method: "DELETE" }
        );

        if (!res.ok) throw new Error("Failed to delete interview");

        set((state) => ({
            interviews: state.interviews.filter((i) => i.id !== id),
        }));
    },


    downloadReport: async (candidateId: string) => {
        const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/admin/report/download/${candidateId}`,
            {
                method: "GET",
            }
        );

        if (!res.ok) {
            throw new Error("Failed to download report");
        }

        return await res.blob(); // return PDF blob
    },

}));
