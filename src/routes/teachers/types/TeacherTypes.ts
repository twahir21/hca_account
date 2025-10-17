export type fileResponseTypes = {
    success: boolean;
    message: string;
    details: string;
    validData?: {
        validRows: { name: string; phone: string;}[];
        validLength: number;
    },
    invalidData?: {
        invalidRows: { row: number;  data: string[]; }[];
        invalidLength: number;
    },
}

export type fetchContacts = {
    data: { id: string; name: string; phone: string }[],
    total: number
}

export type ContactQuery = {
  limit?: string;
  currentPage?: string;
  search?: string;
};


export type validRows= {
    name: string;
    phone: string
}[]

export type getGroupsResult = {
  groupName: string;
  totalContacts: number;
  groupId: string;
  contacts: {
    contactName: string;
    contactPhone: string;
  }[];
}[];

export type smsAnalytics = {
    success: boolean;
    message: string;
    data: {
        totalContacts: number;
        totalGroups: number;
        smsToday: number;
    }
}

export type recentSMS = {
    success: boolean;
    message: string;
    data: {
        id: string;
        message: string;
        groupName: string;
        createdAt: Date;
    }[],
    totalSMS: number;
}

export type contactFetch = {
    success: boolean;
    message: string;
    data?: fetchContacts | undefined
}