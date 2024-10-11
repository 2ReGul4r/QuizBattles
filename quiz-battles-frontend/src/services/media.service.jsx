import axios from "axios";
import { API_URL } from "./settings.axios";
import toast from "react-hot-toast";

export const uploadFile = async (formData) => {
    const toastId = toast.loading('Uploading media file...');
    try {
        const response = await axios.post(`${API_URL}/media/upload-file`, formData, { 
            withCredentials: true,
            headers: {"Content-Type": "multipart/form-data"},
        });
        toast.success('Upload successful', {
            id: toastId,
        });
        return response.data.fileUrl;
    } catch (error) {
        console.error("Upload failed", error);
        toast.error('Upload failed', {
            id: toastId,
        });
        return
    }
};
