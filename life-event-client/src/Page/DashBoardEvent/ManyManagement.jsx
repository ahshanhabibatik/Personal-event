import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import useAxiosPublic from "../../Hook/UseAxiosPublic";
import CreateManyPage from "./CreateManyPage";

const ManyManagement = () => {
    const [jobEvents, setJobEvents] = useState([]);
    const [costInfo, setCostInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();

    const fetchJobEvents = async () => {
        setLoading(true);
        try {
            const response = await axiosPublic.get("/amountInfo", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                },
            });
            setJobEvents(response.data);
        } catch (error) {
            toast.error("Failed to fetch job events.");
            console.error("Error fetching job events:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCostInfo = async () => {
        try {
            const response = await axiosPublic.get("/costInfo", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                },
            });
            setCostInfo(response.data);
        } catch (error) {
            toast.error("Failed to fetch cost information.");
            console.error("Error fetching cost information:", error);
        }
    };

    useEffect(() => {
        fetchJobEvents();
        fetchCostInfo();
    }, [axiosPublic]);

    const handleDelete = async (id) => {
        try {
            await axiosPublic.delete(`/amountInfo/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                },
            });
            setJobEvents(jobEvents.filter((job) => job._id !== id));
            toast.success("Job event deleted successfully");
        } catch (error) {
            toast.error("Failed to delete job event");
            console.error("Error deleting job event:", error);
        }
    };

    // Calculate last month's total amount
    const getLastMonthTotal = () => {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Start of last month
        const startOfLastMonth = lastMonth.getTime();
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getTime(); // End of last month

        // Filter job events for last month
        const lastMonthEvents = jobEvents.filter((job) => {
            const jobDate = new Date(job.date).getTime();
            return jobDate >= startOfLastMonth && jobDate <= endOfLastMonth;
        });

        // Calculate the total amount for last month
        return lastMonthEvents.reduce((sum, job) => sum + Number(job.total || 0), 0);
    };

    const getCurrentMonthTotal = () => {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime(); // Start of the current month
        const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime(); // End of the current month

        // Filter job events for the current month
        const currentMonthEvents = jobEvents.filter((job) => {
            const jobDate = new Date(job.date).getTime();
            return jobDate >= startOfThisMonth && jobDate <= endOfThisMonth;
        });

        // Calculate the total amount for the current month
        return currentMonthEvents.reduce((sum, job) => sum + Number(job.total || 0), 0);
    };

    const getCurrentMonthCost = () => {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime(); // Start of the current month
        const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime(); // End of the current month

        // Filter costInfo for the current month (assuming costInfo has a date property)
        const currentMonthCosts = costInfo.filter((cost) => {
            const costDate = new Date(cost.date).getTime();
            return costDate >= startOfThisMonth && costDate <= endOfThisMonth;
        });

        // Calculate the total cost for the current month
        return currentMonthCosts.reduce((sum, cost) => sum + Number(cost.amount || 0), 0);
    };

    // Calculate the remaining amount
    const getRemainingAmount = () => {
        const currentMonthTotal = getCurrentMonthTotal();
        const currentMonthCost = getCurrentMonthCost();
        return currentMonthTotal - currentMonthCost;
    };

    return (
        <div>
            <LoadingBar
                color="#3498db"
                progress={loading ? 100 : 0}
                height={3}
                onLoaderFinished={() => setLoading(false)}
            />
            <h1 className=" mt-4">
                <span>Total Amount: </span>
                <span className="font-bold">
                    {jobEvents.length > 0
                        ? jobEvents.reduce((sum, job) => sum + Number(job.total || 0), 0)
                        : 0}
                </span>
            </h1>
            <h1 className=" mt-4">
                <span>Last Month ({new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', { month: 'long' })}): </span>
                <span className="font-bold">{getLastMonthTotal()}</span>
            </h1>

            <h1 className="mt-4">
                <span>Current Month({new Date().toLocaleString('default', { month: 'long' })}): </span>
                <span className="font-bold">{getCurrentMonthTotal()}</span>
            </h1>
            <h1 className="mt-4">
                <span>Current Cost({new Date().toLocaleString('default', { month: 'long' })}):</span>
                <span className="font-bold">{getCurrentMonthCost()}</span>
            </h1>

            <h1 className="mt-4">
                <span>Remaining({new Date().toLocaleString('default', { month: 'long' })}):</span>
                <span className="font-bold">{getRemainingAmount()}</span>
            </h1>

            {/* Job Events Table */}
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-2 py-2 text-center">Index</th>
                            <th className="px-2 py-2 text-center">Date</th>
                            <th className="px-2 py-2 text-center">Amount</th>
                            <th className="px-2 py-2 text-center">Source</th>
                            <th className="px-2 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobEvents.map((job, index) => (
                            <tr key={job._id} className="border-b hover:bg-gray-100">
                                <td className="px-2 py-2 text-center">{index + 1}</td>
                                <td className="px-2 py-2 text-center">{new Date(job.date).toLocaleDateString()}</td>
                                <td className="px-2 py-2 text-center">{job.total}</td>
                                <td className="px-2 py-2 text-center">{job.source}</td>
                                <td className="px-2 py-2 flex space-x-4 justify-center">
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Many Page */}
            <CreateManyPage onJobEventCreated={fetchJobEvents} />
        </div>
    );
};

export default ManyManagement;
