export type fileResponseTypes = {
    success: boolean;
    message: string;
    details: string;
    validData?: {
        validRows: { name: string; phone: string; message: string; }[];
        validLength: number;
    },
    invalidData?: {
        invalidRows: { row: number;  data: string[]; }[];
        invalidLength: number;
    },
}

export type bulkLoaderProp = {
    count?: number;
}