import { Outlet, Navigate } from "react-router-dom";
import React from "react";
import { useUser } from "../contexts/UserContext";

const AdminRoutes = () => {
    const { userState } = useUser();

    if (userState.loading) {
        return (
            <div className="flex flex-col items-center justify-center m-16">
                <p className="text-2xl mb-4">Loading...</p>
                <progress className="progress progress-primary w-96" />
            </div>
        );
    }

    return (
        userState.isAdmin ? (
                <Outlet/>
            ) : (
                <Navigate to="/"/>
            )
    )
}

export default AdminRoutes;