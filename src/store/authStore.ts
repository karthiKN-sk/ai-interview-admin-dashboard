import { create } from "zustand";
import api from "../api/client";

const API = import.meta.env.VITE_API_BASE_URL;

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: () => boolean;
    setAccessToken: (token: string) => void;
}




export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    loading: false,
    error: null,
    setAccessToken: (token) => {
        localStorage.setItem("accessToken", token);
        set({ accessToken: token });
    },
    login: async (email, password) => {
        try {
            set({ loading: true, error: null });

            const res = await api.post(`${API}/auth/login`, {
                email,
                password,
            });

            const { access_token, refresh_token, admin } = res.data;

            // Persist tokens
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);

            set({
                user: admin,
                accessToken: access_token,
                refreshToken: refresh_token,
                loading: false,
            });

        } catch (err: any) {
            set({
                error:
                    err.response?.data?.detail || "Invalid email or password",
                loading: false,
            });
        }
    },

    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        set({
            user: null,
            accessToken: null,
            error: null,
        });
    },

    isAuthenticated: () => {
        return !!get().accessToken;
    },
}));



