import React, { useEffect, useState, useContext } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosPublic from "../../../Hook/UseAxiosPublic";
import CreateJobEvent from "../../DashBoardEvent/CreateJobEvent";
import LoadingBar from 'react-top-loading-bar';
import { NavLink } from 'react-router-dom';

const Home = () => {
    const [jobEvents, setJobEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();


    const fetchJobEvents = async () => {
        setLoading(true);
        try {
            const response = await axiosPublic.get('/jobInfo', {
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
            await axiosPublic.delete(`/jobInfo/${id}`, {
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

    return (
        <div>
            <LoadingBar
                color="#3498db"
                progress={loading ? 100 : 0}
                height={3}
                onLoaderFinished={() => setLoading(false)}
            />
            <h1 className='font-bold mt-4'>
                <span>Total Job Applications: </span>{jobEvents?.length}
            </h1>

            {/* Job Events Table */}
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-2 py-2 text-center">Job Name</th>
                            <th className="px-2 py-2 text-center">Link</th>
                            <th className="px-2 py-2 text-center">Username</th>
                            <th className="px-2 py-2 text-center">Password</th>
                            <th className="px-2 py-2 text-center">Date</th>
                            <th className="px-2 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobEvents.map((job) => (
                            <tr key={job._id} className="border-b hover:bg-gray-100">
                                <td className="px-2 py-2 text-center">{job.name}</td>
                                <td className="px-2 py-2 text-center">
                                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                                </td>
                                <td className="px-2 py-2 text-center">{job.applyUsername}</td>
                                <td className="px-2 py-2 text-center">{job.password}</td>
                                <td className="px-2 py-2 text-center">{new Date(job.date).toLocaleDateString()}</td>
                                <td className="px-2 py-2 flex space-x-4 justify-center">
                                    <NavLink to={`/dashboard/updateJob/${job._id}`}>
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <FaEdit />
                                        </button>
                                    </NavLink>
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
                <CreateJobEvent onJobEventCreated={fetchJobEvents} />
            </div>
        </div>
    );
};

export default Home;
