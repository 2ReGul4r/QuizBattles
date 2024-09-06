import toast from "react-hot-toast";

const handleSocketErrors = (socket) => {
    socket.on("userNotAuthenticated", (data) => {
        if (data.error) {
            toast.error(data.error);
        }
    })
    socket.on("roomDoesNotExist", (data) => {
        if (data.error) {
            toast.error(data.error);
        }
    })
    socket.on("roomIsFull", (data) => {
        if (data.error) {
            toast.error(data.error);
        }
    })
};

export default handleSocketErrors;
