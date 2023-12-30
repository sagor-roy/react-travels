import { createBrowserRouter } from "react-router-dom";
import Backend from "./layouts/Backend";
import Dashboard from "./backend/component/Dashboard";
import Frontend from "./layouts/Frontend";
import DestinationCreate from "./backend/component/trip/destination/DestinationCreate";
import DestinationList from "./backend/component/trip/destination/DestinationList";
import DestinationEdit from "./backend/component/trip/destination/DestinationEdit";

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
            {
                path: 'destination/edit/:id',
                element: <DestinationEdit />,
            },
        ],
    },
    {
        path: "/",
        element: <Frontend />
    }
]);

export default router;