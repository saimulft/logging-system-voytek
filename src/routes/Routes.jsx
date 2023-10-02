import { createBrowserRouter} from "react-router-dom";
import Home from "../pages/Home/Home";
import Logs from "../pages/Logs/Logs";
import Setting from "../pages/Setting/Setting";
import LogDetails from "../pages/Logs/LogDetails";
import Authentication from "../pages/Authentication/Authentication";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
        path: "/project/logs/:id",
        element: <ProtectedRoute><Logs /></ProtectedRoute>,
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