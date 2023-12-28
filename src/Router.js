import { createBrowserRouter } from "react-router-dom";
import Backend from "./layouts/Backend";
import Dashboard from "./backend/component/Dashboard";
import Frontend from "./layouts/Frontend";
import DestinationCreate from "./backend/component/trip/destination/DestinationCreate";
import DestinationList from "./backend/component/trip/destination/DestinationList";

const router = createBrowserRouter([
    {
        path: "admin/",
        element: <Backend />,
        children: [
            {
                index: '/',
                element: <Dashboard />,
            },
            {
                path: 'destination/create',
                element: <DestinationCreate />,
            },
            {
                path: 'destination/list',
                element: <DestinationList />,
            },
        ],
    },
    {
        path: "/",
        element: <Frontend />
    }
]);

export default router;