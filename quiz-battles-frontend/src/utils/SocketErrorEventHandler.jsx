import toast from "react-hot-toast";

const handleSocketErrors = (socket) => {
    socket.on("sendError", (data) => {
        if (data.error) {
            toast.error(data.error);
        }
    })
};

export default handleSocketErrors;
