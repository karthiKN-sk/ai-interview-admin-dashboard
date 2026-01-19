import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: global 401 handling
let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: any = error.config;
        const authStore = useAuthStore.getState();

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            authStore.refreshToken
        ) {
            originalRequest._retry = true;

            // Queue requests while refreshing
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest) as unknown);
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    {
                        refresh_token: authStore.refreshToken,
                    }
                );

                const newAccessToken = res.data.access_token;

                authStore.setAccessToken(newAccessToken);

                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                authStore.logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
