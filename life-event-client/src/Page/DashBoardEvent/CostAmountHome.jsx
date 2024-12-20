import CreateCostAmount from "./CreateCostAmount";
import React, { useEffect, useState, useContext } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { NavLink } from 'react-router-dom';
import useAxiosPublic from "../../Hook/UseAxiosPublic";


const CostAmountHome = () => {
    const [jobEvents, setJobEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();

    const fetchJobEvents = async () => {
        setLoading(true);
        try {
            const response = await axiosPublic.get('/costInfo', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                }
            });
            setJobEvents(response.data);
        } catch (error) {
            toast.error("Failed to fetch job events.");
            console.error("Error fetching job events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobEvents();
    }, [axiosPublic]);

    const handleDelete = async (id) => {
        try {
            await axiosPublic.delete(`/costInfo/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                }
            });
            setJobEvents(jobEvents.filter(job => job._id !== id));
            toast.success("Job event deleted successfully");
        } catch (error) {
            toast.error("Failed to delete job event");
            console.error("Error deleting job event:", error);
        }
    };

    // Calculate Total Cost
    const getTotalCost = () => {
        return jobEvents.reduce((sum, job) => sum + Number(job.amount || 0), 0);
    };

    // Calculate Current Month Cost
    const getCurrentMonthCost = () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime(); // Start of current month
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime(); // End of current month

        // Filter job events for current month
        const currentMonthEvents = jobEvents.filter((job) => {
            const jobDate = new Date(job.date).getTime();
            return jobDate >= startOfMonth && jobDate <= endOfMonth;
        });

        // Sum up the amounts for the current month
        return currentMonthEvents.reduce((sum, job) => sum + Number(job.amount || 0), 0);
    };

    return (
        <div>
            <LoadingBar
                color="#3498db"
                progress={loading ? 100 : 0}
                height={3}
                onLoaderFinished={() => setLoading(false)}
            />
            <h1 className='font-bold mt-4'>
                <span>Total Cost: </span>
                <span>{getTotalCost()}</span>
            </h1>
            <h1 className='font-bold mt-4'>
                <span>Current Cost({new Date().toLocaleString('default', { month: 'long' })}): </span>
                <span>{getCurrentMonthCost()}</span>
            </h1>

            {/* Job Events Table */}
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-2 py-2 text-center">Index</th>
                            <th className="px-2 py-2 text-center">Cost Purpose</th>
                            <th className="px-2 py-2 text-center">Amount</th>
                            <th className="px-2 py-2 text-center">Date</th>
                            <th className="px-2 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobEvents.map((job, index) => (
                            <tr key={job._id} className="border-b hover:bg-gray-100">
                                <td className="px-2 py-2 text-center">{index + 1}</td>
                                <td className="px-2 py-2 text-center">{job.cost}</td>
                                <td className="px-2 py-2 text-center">{job.amount}</td>
                                <td className="px-2 py-2 text-center">{new Date(job.date).toLocaleDateString()}</td>
                                <td className="px-2 py-2 flex space-x-4 justify-center">
                                    <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:text-red-800">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Job Event Creation Section */}
            <div>
                <CreateCostAmount onJobEventCreated={fetchJobEvents} />
            </div>
        </div>
    );
};

export default CostAmountHome;


