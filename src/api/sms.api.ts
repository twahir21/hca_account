import { JSONObject, JSONValue } from "@builder.io/qwik-city";
import { links } from "~/const/api.const";
import { fetchContacts, getGroupsResult, recentSMS, smsAnalytics } from "~/routes/admin/types/adminTypes";

export const useSMSAPI = {
    sendViaExcel: async (data: JSONObject) => {
        try {
            const res = await fetch(`${links.serverLink}/sms/send-via-excel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const ans = await res.json();

            return ans;            
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                        error.message : 
                        "Something went wrong in sending via Excel"
            }
        }
    },
    getTotalSMS: async (): Promise<{
        success: boolean;
        message: string;
        count? : number;
    }> => {
        try {
            const res = await fetch(`${links.serverLink}/sms/get-total-sms`, {
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
    },
    contactPost: async (data: JSONObject): Promise<{
        success: boolean;
        message: string;
    }> => {

        try {
            const res = await fetch(`${links.serverLink}/sms/add-contact`, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data)
            })
            const ans: { success: boolean; message: string } = await res.json();

            return ans;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                        error.message : 
                        "Something wrong occured in adding contact"
            }
        }     
    },
    contactsGet: async ({ currentPage, limit, search }: { currentPage: string, limit: string; search: string }): Promise<{
        success: boolean,
        message: string;
        data?: fetchContacts
    }> => {
        try {
          const request: { 
            success: boolean, 
            message: string,
            fetchContactsData?: fetchContacts
            } = await fetch(`${links.serverLink}/sms/get-contacts?page=${encodeURIComponent(currentPage)}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search)}`).then(r => r.json());

          
          return {
            success: request.success,
            message: request.message,
            data: request.fetchContactsData
          }

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in massive insert contacts"
            }
        }
    },
    massiveContactFile: async (data: JSONValue): Promise<{ success: boolean; message: string }> => {
        try {
            const res = await fetch(`${links.serverLink}/sms/massive-contacts-upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const ans: { success: boolean; message: string } = await res.json();
            return ans;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in massive contacts"
            }
        }
    },
    contactUpdate: async (data: JSONObject) => {
        try {
            const res = await fetch(`${links.serverLink}/sms/update-contact`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const ans: { success: boolean; message: string } = await res.json();
            return {
                success: ans.success,
                message: ans.message
            }
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in updating contacts"
            }
        }
    },
    deleteContact: async (data: JSONObject) => {
        try {
            const res = await fetch(`${links.serverLink}/sms/delete-contact`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const ans: { success: boolean; message: string } = await res.json();
            return ans;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in deleting contacts"
            }
        }
    },
    createGroup: async (data: JSONValue) => {
        try {
            const res = await fetch(`${links.serverLink}/sms/create-group`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const ans: { success: boolean; message: string } = await res.json();
            return ans;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in deleting contacts"
            }
        }
    }, 
    getGroups: async ({ currentPage, limit, search }: { currentPage: string, limit: string; search: string }): Promise<{
        success: boolean,
        message: string;
        totalGroups?: number,
        data?: getGroupsResult
    }> => {
        try {
          const request: { 
                success: boolean, 
                message: string,
                getGroups?: getGroupsResult,
                totalGroups?: number
            } = await fetch(`${links.serverLink}/sms/get-groups?page=${encodeURIComponent(currentPage)}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search)}`).then(r => r.json());

          
          return {
            success: request.success,
            message: request.message,
            data: request.getGroups,
            totalGroups: request.totalGroups,
          }

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in getting groups"
            }
        }
    },
    deleteGrp: async (data: JSONObject) => {
        try {
            const res = await fetch(`${links.serverLink}/sms/delete-group`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const ans: { success: boolean; message: string } = await res.json();
            return ans;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in deleting contacts"
            }
        }
    },
    editGroup: async (data: JSONValue) => {
        try {
            const res = await fetch(`${links.serverLink}/sms/edit-group`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const ans: { success: boolean; message: string } = await res.json();
            return {
                success: ans.success,
                message: ans.message
            }
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                            error.message :
                            "Something went wrong in editing group"
            }
        }
    },
    smsAnalytics : async (authToken: string): Promise<smsAnalytics> => {
        try {
            const res = await fetch(`${links.serverLink}/sms/sms-analytics`, {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            const ans: smsAnalytics = await res.json();
            return ans;


        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                        error.message : 
                        "Something wrong occured in get sms analytics",
                data: {
                    totalContacts: 0,
                    totalGroups: 0,
                    smsToday: 0
                }
            }
        }
    },
    getRecentSMS: async ({ currentPage, limit, search }: { currentPage: string, limit: string; search: string }) => {
        try {
            const res = await fetch(`${links.serverLink}/sms/get-recent-sms?page=${encodeURIComponent(currentPage)}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search)}`, {
                headers: {
                    'Content-Type' : 'application/json'
                }
            })
            const ans: recentSMS = await res.json();
            return ans;

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? 
                        error.message : 
                        "Something wrong occured in get recent sms",
                data: [],
                totalSMS: 0
            }
        }
    }
}