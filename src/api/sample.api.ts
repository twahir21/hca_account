import { JSONObject } from "@builder.io/qwik-city";
import { links } from "~/const/api.const";

export const createApi = {
    user: async (token: string) => {
        // logic
        console.log(token)
    },
        login: async (data: JSONObject) => {
        if (data.username === '' || data.password === '') {
            return {
                success: false,
                status: 400,
                message: "Username and password are required",
                role: "",
                username: "",
                token: ""
            }
        }

        try {
            const response = await fetch(`${links.serverLink}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            
            return result as {
                success: boolean;
                status: number;
                message: string;
                token: string;
                role: string
                username: string
            };
        } catch (error) {
            return {
                success: false,
                status: 500,
                role: "",
                username: "",
                token: "",
                message: error instanceof Error
                    ? error.message
                    : "error in login user",
            }
        }
        }
}