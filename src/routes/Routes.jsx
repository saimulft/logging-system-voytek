import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import Logs from "../pages/Logs/Logs";
import Filter from "../pages/Filter/Filter";
import Setting from "../pages/Setting/Setting";
import LogDetails from "../pages/Logs/LogDetails";
import Authentication from "../pages/Authentication/Authentication";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
        loader: () => fetch('http://localhost:5000/total-projects')
    },
    {
        path: "/project/logs/:id",
        element: <ProtectedRoute><Logs /></ProtectedRoute>,
    },
    {
        path: "/logs/filter",
        element: <ProtectedRoute><Filter /></ProtectedRoute>
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