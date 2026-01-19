import { create } from "zustand";
import type { InterviewList } from "./dashboardStore";
import api from "../api/client";


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
    selectCandidate: (id: string) => Promise<void>;
    rejectCandidate: (id: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewState>()((set) => ({
    interviews: [],

    createInterview: async ({ role, job_description, duration, types }) => {
        const { data } = await api.post("/admin/interviews/create", {
            role,
            job_description,
            duration,
            types,
        });

        return {
            questions: data.questions,
            candidate_link: data.candidate_link,
        };
    },

    fetchScheduledInterviews: async () => {
        try {
            const { data } = await api.get("/admin/interviews/status/scheduled");
            set({ interviews: data });

        } catch (error) {
            console.error("Error fetching scheduled interviews", error);
        }
    },
    fetchCompletedInterviews: async () => {
        try {
            const { data } = await api.get("/admin/interviews/status/completed"
            );
            set({ interviews: data });

        } catch (error) {
            console.error("Error fetching completed interviews", error);
        }
    },

    fetchInterviewDetails: async (id: string): Promise<InterviewFullDetails | null> => {
        try {
            const { data } = await api.get(`/admin/interviews/${id}`);

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
        await api.delete(`/admin/interviews/delete/${id}`);

        set((state) => ({
            interviews: state.interviews.filter((i) => i.id !== id),
        }));
    },


    downloadReport: async (candidateId: string) => {
        const res = await api.get(
            `/admin/report/download/${candidateId}`,
            { responseType: "blob" }
        );
        return res.data.blob();
    },

    selectCandidate: async (id: string) => {
        await api.post(`/admin/candidates/${id}/select`);

    },
    rejectCandidate: async (id: string) => {
        await api.post(`/admin/candidates/${id}/reject`);
    },
}));
