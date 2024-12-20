import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import useAxiosPublic from "../../Hook/UseAxiosPublic";
import CreateReadingTime from "./CreateReadingTime";

const ReadingTimeHome = () => {
    const [jobEvents, setJobEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [remainingTimes, setRemainingTimes] = useState([]);
    const axiosPublic = useAxiosPublic();

    const fetchJobEvents = async () => {
        setLoading(true);
        try {
            const response = await axiosPublic.get('/readingInfo', {
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

    useEffect(() => {
        const intervalId = setInterval(() => {
            const updatedTimes = jobEvents.map(job => {
                return calculateTimeDifference(job.startDate, job.startTime, job.endDate, job.endTime);
            });
            setRemainingTimes(updatedTimes);
        }, 1000);

        return () => clearInterval(intervalId);  // Clean up the interval on component unmount
    }, [jobEvents]);

    const handleDelete = async (id) => {
        try {
            await axiosPublic.delete(`/readingInfo/${id}`, {
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

    const formatTimeUTC = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return null;

        let [hours, minutes] = timeStr.split(':');
        const period = minutes.slice(-2); // "AM" or "PM"
        minutes = minutes.slice(0, 2);

        hours = parseInt(hours);
        minutes = parseInt(minutes);

        // Adjust hours for AM/PM format
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        const date = new Date(dateStr); // Use the provided date
        date.setHours(hours, minutes, 0, 0); // Set the exact time
        return date;
    };

    const calculateTimeDifference = (startDate, startTime, endDate, endTime) => {
        const startDateTime = formatTimeUTC(startDate, startTime);
        const endDateTime = formatTimeUTC(endDate, endTime);
        const currentTime = new Date();

        if (!endDateTime) return "Invalid time format";

        const timeDifferenceMs = endDateTime - currentTime;

        if (timeDifferenceMs <= 0) {
            // If the event has ended
            return "Complete";
        }

        const remainingSeconds = Math.floor(timeDifferenceMs / 1000);
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
    };

    return (
        <div>
            <LoadingBar
                color="#3498db"
                progress={loading ? 100 : 0}
                height={3}
                onLoaderFinished={() => setLoading(false)}
            />
            <h1 className=' mt-4'>
                <span className='font-bold'>Topic Name: </span><span className=''>{jobEvents[jobEvents.length - 1]?.topic || 'N/A'}</span>

                <div className='mt-2'>
                    <span className='font-bold'> Remaining Time: </span>{remainingTimes[remainingTimes.length - 1] || 'N/A'}
                </div>
            </h1>

            {/* Job Events Table */}
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-800 text-white text-sm">
                        <tr>
                            <th className="px-2 py-2 text-center">Index</th>
                            <th className="px-2 py-2 text-center">Chapter name</th>
                            <th className="px-2 py-2 text-center">Chapter Unit</th>
                            <th className="px-2 py-2 text-center">Topic Name</th>
                            <th className="px-2 py-2 text-center">Start Time</th>
                            <th className="px-2 py-2 text-center">End Time</th>
                            <th className="px-2 py-2 text-center">Remaining Time</th>
                            <th className="px-2 py-2 text-center">Date</th>
                            <th className="px-2 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobEvents.map((job, index) => (
                            <tr key={job._id} className="border-b hover:bg-gray-100">
                                <td className="px-2 py-2 text-center">{index + 1}</td>
                                <td className="px-2 py-2 text-center">{job.name}</td>
                                <td className="px-2 py-2 text-center">{job.unit}</td>
                                <td className="px-2 py-2 text-center">{job.topic}</td>
                                <td className="px-2 py-2 text-center">{job.startTime}</td>
                                <td className="px-2 py-2 text-center">{job.endTime}</td>
                                <td className="px-2 py-2 text-center">{remainingTimes[index]}</td>
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
                <CreateReadingTime onJobEventCreated={fetchJobEvents} />
            </div>
        </div>
    );
};

export default ReadingTimeHome;
