import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../Page/Home/Home/Home";
import Login from "../Page/Login&Register/Login/Login";
import Register from "../Page/Login&Register/Login/Register/Register";
import Dashboard from "../Dashbord/Dashboard";
import Root from "../Root/Root";
import UpdateJobInfo from "../Page/DashBoardEvent/UpdateJobInfo";
import MonyManagement from "../Page/DashBoardEvent/ManyManagement";
import CostAmountHome from "../Page/DashBoardEvent/CostAmountHome";
import ReadingTimeHome from "../Page/DashBoardEvent/ReadingTimeHome";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        children: [
            {
                path: "/register",
                element: <Register></Register>,
            },
            {
                path: "/",
                element: <Login></Login>,
            },
        ],


    },

    {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
        children: [
            {
                path: '/dashboard/home',
                element: <Home></Home>,

            },
            {
                path: '/dashboard/updateJob/:id',
                element: <UpdateJobInfo></UpdateJobInfo>,
                loader: ({ params }) => fetch(`https://life-event-server.vercel.app/jobinfo/${params.id}`)
            },
            {
                path: '/dashboard/ManyManagement',
                element: <MonyManagement></MonyManagement>,

            },
            {
                path: '/dashboard/costAmount',
                element: <CostAmountHome></CostAmountHome>,

            },
            {
                path: '/dashboard/reading',
                element: <ReadingTimeHome></ReadingTimeHome>,

            },


        ]
    }
]);

export default router;