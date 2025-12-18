// import { api } from "./client";

// export type InterviewType = "Technical" | "Behavioral" | "Experience" | "Problem Solving" | "Leadership";

// export interface CreateInterviewPayload {
//     job_position: string;
//     job_description: string;
//     interview_type: InterviewType[];
//     difficulty: "easy" | "medium" | "hard";
//     duration_minutes: number;
//     candidate_name: string;
//     candidate_email: string;
// }

// export async function createInterview(payload: CreateInterviewPayload) {
//     const res = await api.post("/v1/admin/interviews", payload);
//     return res.data as { interview_id: string; link: string };
// }

// export async function getScheduledInterviews() {
//     const res = await api.get("/v1/admin/interviews/scheduled");
//     return res.data;
// }

// export async function getCompletedInterviews() {
//     const res = await api.get("/v1/admin/interviews/completed");
//     return res.data;
// }
