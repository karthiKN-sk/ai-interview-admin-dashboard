import { create } from "zustand";
import { DASHBOARD_STATS } from "../data/statsConfig";
import api from "../api/client";


export interface InterviewList {
    id: string;
    position: string;
    duration: string;
    date: string;
    link: string;
}

export interface DashboardStats {
    name: string; value: number;
}

interface DashboardStore {
    stats: DashboardStats[];
    interviewsList: InterviewList[];
    isInterviewsAvailable: boolean;
    fetchStats: () => Promise<void>;
    fetchScheduledInterviews: () => Promise<void>;
}



export const useDashboardStore = create<DashboardStore>((set) => ({
    stats: [],
    interviewsList: [],
    isInterviewsAvailable: false,

    // ---------- Fetch Stats ----------
    fetchStats: async () => {
        try {
            const { data } = await api.get("/admin/dashboard/stats");
            set({
                stats: [
                    { name: "Total Interviews", value: data.total_interviews },
                    { name: "Selected", value: data.selected },
                    { name: "Completed", value: data.completed },
                    { name: "Upcoming", value: data.upcoming },
                    { name: "Rejected", value: data.rejected },
                ],
            });
        } catch (err) {
            console.error("Failed to fetch stats", err);

            // Fallback values
            set({
                stats: [
                    ...DASHBOARD_STATS
                ],
            });
        }
    },


    // ---------- Fetch Recently Created Interview Cards ----------
    fetchScheduledInterviews: async () => {
        try {
            const { data } = await api.get("/admin/interviews/status/scheduled");
            set({ interviewsList: data, isInterviewsAvailable: data.length > 0 });

        } catch (error) {
            console.error("Error fetching scheduled interviews", error);
            set({ interviewsList: [], isInterviewsAvailable: false });
        }
    },
}));
