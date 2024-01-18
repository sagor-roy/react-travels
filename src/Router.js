import { createBrowserRouter } from "react-router-dom";
import Backend from "./layouts/Backend";
import Dashboard from "./backend/component/Dashboard";
import Frontend from "./layouts/Frontend";
import DestinationCreate from "./backend/component/trip/destination/DestinationCreate";
import DestinationList from "./backend/component/trip/destination/DestinationList";
import DestinationEdit from "./backend/component/trip/destination/DestinationEdit";
import RouteCreate from "./backend/component/trip/route/RouteCreate";
import RouteList from "./backend/component/trip/route/RouteList";
import RouteEdit from "./backend/component/trip/route/RouteEdit";
import { BackendProvider } from "./context/BackendContext";
import ScheduleCreate from "./backend/component/trip/schedule/ScheduleCreate";
import ScheduleList from "./backend/component/trip/schedule/ScheduleList";
import ScheduleEdit from "./backend/component/trip/schedule/ScheduleEdit";
import FleetCreate from "./backend/component/fleet/fleet/FleetCreate";
import FleetList from "./backend/component/fleet/fleet/FleetList";
import FleetEdit from "./backend/component/fleet/fleet/FleetEdit";
import VehicleCreate from "./backend/component/fleet/vehicle/VehicleCreate";
import VehicleList from "./backend/component/fleet/vehicle/VehicleList";
import VehicleEdit from "./backend/component/fleet/vehicle/VehicleEdit";

const router = createBrowserRouter([
    {
        path: "admin/",
        element: (
            <BackendProvider>
                <Backend />
            </BackendProvider>
        ),
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
            {
                path: 'route/create',
                element: <RouteCreate />,
            },
            {
                path: 'route/list',
                element: <RouteList />,
            },
            {
                path: 'route/edit/:id',
                element: <RouteEdit />,
            },
            {
                path: 'schedule/create',
                element: <ScheduleCreate />,
            },
            {
                path: 'schedule/list',
                element: <ScheduleList />,
            },
            {
                path: 'schedule/edit/:id',
                element: <ScheduleEdit />,
            },
            {
                path: 'fleet/create',
                element: <FleetCreate />,
            },
            {
                path: 'fleet/list',
                element: <FleetList />,
            },
            {
                path: 'fleet/edit/:id',
                element: <FleetEdit />,
            },
            {
                path: 'vehicle/create',
                element: <VehicleCreate />,
            },
            {
                path: 'vehicle/list',
                element: <VehicleList />,
            },
            {
                path: 'vehicle/edit/:id',
                element: <VehicleEdit />,
            },
        ],
    },
    {
        path: "/",
        element: <Frontend />
    }
]);

export default router;