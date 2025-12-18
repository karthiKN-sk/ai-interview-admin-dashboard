import { create } from "zustand";
import { DASHBOARD_STATS } from "../data/statsConfig";


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
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard/stats`);
            if (!res.ok) throw new Error("Failed to load");

            const data = await res.json();
            console.log("Fetched stats:", data);
            set({
                stats: [
                    { name: "Total Interviews", value: data.total_interviews },
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
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/admin/interviews/status/scheduled`
            );

            const data = await res.json();
            set({ interviewsList: data, isInterviewsAvailable: data.length > 0 });

        } catch (error) {
            console.error("Error fetching scheduled interviews", error);
            set({ interviewsList: [], isInterviewsAvailable: false });
        }
    },
}));
