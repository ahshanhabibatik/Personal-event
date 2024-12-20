import { Outlet } from "react-router-dom";

const Root = () => {
    return (
        <div className=" space-x-6">
            <Outlet />
        </div>
    );
};

export default Root;