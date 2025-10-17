import { validRows } from "../../types/adminTypes";

type ContactPayload = {
  type: "contact";
  phone: number;
  message: string;
  contactSelection: { selectAll: boolean; selected: Record<string, boolean> }
};

type GroupPayload = {
  type: "group";
  selectedGrp: SelectedGrp;
  message: string;
};

type UploadPayload = {
  type: "upload";
  file: validRows;
  message: string;
};

// union of all
export type SmsPayload = ContactPayload | GroupPayload | UploadPayload;

type SelectedGrp ={
  groupName: string;
  totalContacts: number;
  groupId: string;
  contacts: {
      contactName: string;
      contactPhone: string;
  }[];
} | null

export function buildPayload(
  tab: "contact" | "group" | "upload",
  state: {
    singlePhone: number;
    selectedGroup: SelectedGrp;
    uploadFile: validRows;
    message: string;
    contactSelection: { selectAll: boolean; selected: Record<string, boolean> }
  }
): SmsPayload {
  switch (tab) {
    case "contact":
      return {
        type: "contact",
        phone: state.singlePhone,
        message: state.message,
        contactSelection: { selectAll: state.contactSelection.selectAll, selected: state.contactSelection.selected },
      };

    case "group":
      return {
        type: "group",
        selectedGrp: state.selectedGroup,
        message: state.message,
      };
    case "upload":
      return {
        type: "upload",
        file: state.uploadFile,
        message: state.message,
      };
  }
}
