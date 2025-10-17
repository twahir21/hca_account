import { $, component$, Signal } from "@builder.io/qwik";
import { fileResponseTypes, validRows } from "../../types/adminTypes";
import { links } from "~/const/api.const";

type Prop ={
    fileName: Signal<string>;
    fileResponse: {
        isExist: boolean;
        success: boolean;
        message: string;
        details: string;
        validData: {
            validRows: validRows;
            validLength: number;
        };
    }
}

export const MsgFile = component$<Prop>(({ fileName, fileResponse }) => {
      // 5.1 file drop
      const handleDrop = $((event: DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file && file.name.endsWith(".xlsx")) {
          fileName.value = file.name;
        }
      });
      // 5.2 file drag
      const handleDragOver = $((event: DragEvent) => {
        event.preventDefault();
      });

      // 5.4 file change
      const handleFileChange = $(async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        fileName.value = file ? file.name : "";
        
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
    
        const res = await fetch(`${links.serverLink}/sms/send-via-excel`, {
          method: "POST",
          body: formData,
        });
    
        const data: fileResponseTypes = await res.json();
        fileResponse.isExist = true;
    
        // assign validation data
        fileResponse.success = data.success;
        fileResponse.message = data.message;
        fileResponse.details = data.details;
    
        if (data.validData){
          fileResponse.validData.validRows = data.validData.validRows;
          fileResponse.validData.validLength = data.validData.validLength;
        }
      });
    
    return <>
        <div class="space-y-3">
            {/* Drop Zone */}
            <div
            class="flex flex-col items-center justify-center border-2 border-dashed border-sky-400 rounded-xl p-8 bg-sky-50 hover:bg-sky-100 transition-colors duration-200"
            onDrop$={handleDrop}
            onDragOver$={handleDragOver}
            >
            <i class="fas fa-file-excel text-green-600 text-xl mb-2"></i>
            <p class="text-sky-700 font-semibold">Drag & Drop your Excel file here</p>
            <p class="text-slate-500 text-sm mt-1">or click to browse</p>

            <input
                type="file"
                accept=".xlsx"
                id="file-upload"
                class="hidden"
                onChange$={handleFileChange}
            />
            <label
                for="file-upload"
                class="mt-4 cursor-pointer bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
            >
                {!fileName.value.length ? "Choose File" : "Change File"}
            </label>
            </div>

            {/* Filename preview */}
            {fileName.value && (
            <div class="text-sm text-gray-600">Selected file: {fileName.value}</div>
            )}

            {/* Example download link */}
            <a
            href="/example.xlsx"
            download
            class="inline-block text-sm text-blue-600 hover:underline"
            >
            Download example.xlsx
            </a>
            {/* Modal for file validation  */}
            {fileResponse.isExist && <div class="space-y-4">                                
                <div 
                class = {`flex items-start gap-3 
                        rounded-lg border p-4
                        ${
                            fileResponse.success ?
                            "border-green-400 bg-green-100 text-green-800":
                            "border-red-400 bg-red-100 p-4 text-red-800"
                        } 
                        shadow`}>
                <i class={`fa-solid  
                            text-2xl mt-1 ${fileResponse.success ? 
                                "fa-circle-check text-green-600" : 
                                "fa-circle-xmark text-red-600"}
                            `}></i>
                <div>
                    <h2 class="font-bold">{fileResponse.message}</h2>
                    <p class="text-sm">{fileResponse.details}.</p>
                </div>
                </div>
            </div>}
        </div>
    </>
})