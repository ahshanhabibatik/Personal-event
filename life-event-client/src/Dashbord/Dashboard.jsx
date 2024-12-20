import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaAd, FaBook, FaHome, FaList } from "react-icons/fa";
import { BsArrowsCollapseVertical } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import '../../src/font.css'

const DashBoard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const sidebarRef = useRef(null);
    const profileRef = useRef(null);

    const { logOut, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
    const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current && !sidebarRef.current.contains(event.target) &&
                profileRef.current && !profileRef.current.contains(event.target)
            ) {
                setShowMobileMenu(false);
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logOut()
            .then(() => {
                navigate("/"); // Redirect to login page
            })
            .catch((error) => console.error("Logout failed:", error));
    };

    return (
        <div className="flex min-h-screen bg-gray-100 poppins">

            {/* Mobile Menu Button */}
            <div className="p-4 fixed z-20 md:hidden">
                <button onClick={toggleMobileMenu} className="text-purple-600">
                    <FiMenu size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed md:relative z-10 bg-gradient-to-b from-purple-600 to-indigo-700 text-white md:min-h-screen ${collapsed ? 'w-20' : 'w-60'} ${showMobileMenu ? 'block' : 'hidden'} md:block transition-all duration-300`}
            >
                <div className="p-4 flex justify-between items-center">
                    <h2 className={`text-lg font-bold ${collapsed && 'hidden'}`}>Dashboard</h2>
                    <button onClick={toggleSidebar} className="text-white hover:text-gray-300">
                        <BsArrowsCollapseVertical size={24} />
                    </button>
                </div>

                {/* Menu items */}
                <ul className="menu space-y-2 mt-4">
                    <li>
                        <NavLink
                            to="/dashboard/home"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <FaHome size={20} />
                            {!collapsed && <span>User Home</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/ManyManagement"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <FaAd size={20} />
                            {!collapsed && <span>Money Management</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/costAmount"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <FaList size={20} />
                            {!collapsed && <span>Cost Amount</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/reading"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <FaBook size={20} />
                            {!collapsed && <span>Reading</span>}
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Main content area */}
            <div className="flex-1 md:p-4 p-[10px] bg-white md:ml-0 overflow-y-auto">
                <div className="flex justify-end items-center space-x-4 ">
                    {/* User Profile */}
                    <div className="relative" ref={profileRef}>
                        <button onClick={toggleProfileDropdown} className="flex items-center focus:outline-none">
                            <img
                                src={user?.photoURL || "https://via.placeholder.com/40"}
                                alt="User"
                                className="w-10 h-10 rounded-full border border-gray-300"
                            />
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-purple-500 rounded-lg border ">
                                <p className="px-4 py-2 text-white font-semibold mb-1 mt-1 ">Hello, {user?.displayName?.split(" ")[0] || "Guest"}!!</p>
                                <hr className="" />
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-3 hover:bg-stone-500 text-white bg-red-500 rounded-b-lg font-bold text-center"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default DashBoard;
