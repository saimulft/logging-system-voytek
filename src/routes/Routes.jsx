import { createBrowserRouter} from "react-router-dom";
import Home from "../pages/Home/Home";
import Setting from "../pages/Setting/Setting";
import Authentication from "../pages/Authentication/Authentication";
import ProtectedRoute from "./ProtectedRoute";
import ProjectLogs from "../pages/ProjectLogs/ProjectLogs";
import LogDetails from "../pages/ProjectLogs/LogDetails";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
        path: "/project/logs/:id",
        element: <ProtectedRoute><ProjectLogs /></ProtectedRoute>,
    },
    {
        path: "/logs/log/:id",
        element: <ProtectedRoute><LogDetails /></ProtectedRoute>
    },
    {
        path: "/setting",
        element: <ProtectedRoute><Setting /></ProtectedRoute>
    },
    {
        path: "/user/authentication",
        element: <Authentication />
    }
]);

export default router;