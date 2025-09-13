import { JSONObject } from "@builder.io/qwik-city";
import { links } from "~/const/api.const";

export const useSMSAPI = {
    post: async (data: JSONObject) => {
        try {
            console.log("DATA: ", data)
            const res = await fetch(`${links.serverLink}/sms/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const ans = await res.json();

            console.log("Bulk sms api response: ", ans)
            
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                        error.message : 
                        "Something went wrong in post SMS API"
            }
        }
    },
    get: async (): Promise<{
        success: boolean;
        message: string;
        count? : number;
    }> => {
        try {
            const res = await fetch(`${links.serverLink}/sms/total`, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            })
            const ans: number = await res.json();
            return {
                success: true,
                message: "Total sms fetched successfully",
                count: ans
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                        error.message : 
                        "Something wrong occured in get total sms"
            }
        }
    }
}