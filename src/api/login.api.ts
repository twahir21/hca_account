import { JSONObject } from "@builder.io/qwik-city"
import { links } from "~/const/api.const";

type Api = {
    success: boolean;
    message: string;
}

interface loginReturn extends Api {
    sessionId: string;
}

interface verifyOTP extends Api {
    authToken: string;
    username: string;
    role: "invalid" | "admin" | "parent" | "teacher"
}

export const LoginAPI = {
    login: async ({ data, sessionId }: { data: JSONObject, sessionId?: string }): Promise<loginReturn> => {
        try {

            const payload = {
                username: data.username,
                password: data.password,
                sessionId: sessionId ? sessionId : ""
            }
            
            const result: loginReturn = await fetch(`${links.serverLink}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).then(r => r.json());

            return result

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in login",
                sessionId: ""
            }
        }
    },
    otp: async ({ otpInput, sessionId }: { otpInput: string, sessionId?: string }): Promise<verifyOTP> => {
        try {

            const payload = {
                otpInput,
                sessionId: sessionId ? sessionId : ""
            }
            
            const result: verifyOTP = await fetch(`${links.serverLink}/verify-OTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).then(r => r.json());

            return result

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in login",
                authToken: "",
                username: "",
                role: "invalid"
            }
        }
    },
    resendOTP: async ({  sessionId }: { sessionId?: string }): Promise<Api> => {
        try {

            const payload = {
                sessionId: sessionId ? sessionId : ""
            }
            
            const result: Api = await fetch(`${links.serverLink}/resend-OTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).then(r => r.json());

            return result

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in resend OTP",
            }
        }
    },
    
}