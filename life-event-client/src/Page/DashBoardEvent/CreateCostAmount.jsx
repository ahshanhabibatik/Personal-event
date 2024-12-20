import { useContext, useState } from "react";
import useAxiosPublic from "../../Hook/UseAxiosPublic";
import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast, Toaster } from "react-hot-toast";
import LoadingBar from 'react-top-loading-bar';

const CreateCostAmount = ({ onJobEventCreated }) => {
    const axiosPublic = useAxiosPublic();
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(AuthContext);
    const [progress, setProgress] = useState(0);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const onSubmit = async (data) => {
        const token = localStorage.getItem('access-token');

        if (!token) {
            toast.error("No access token found");
            return;
        }

        // Add current date and time
        const currentDate = new Date().toISOString(); // ISO format is standard
        const jobEventData = {
            ...data,
            email: user?.email,
            username: user?.displayName,
            date: currentDate, // Automatically add current date
        };

        try {
            setProgress(30);
            const response = await axiosPublic.post(
                '/costInfo',
                jobEventData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                }
            );

            if (response.data) {
                toast.success("Job event created successfully");
                reset();
                toggleModal();

                if (onJobEventCreated) {
                    onJobEventCreated();
                }
            }
        } catch (error) {
            toast.error("Failed to create job event");
            console.error("Error:", error);
        } finally {
            setProgress(100);
            setTimeout(() => setProgress(0), 500);
        }
    };




    return (
        <div className="relative">
            <Toaster position="top-right" />

            <LoadingBar
                color="#3498db"
                progress={progress}
                height={3}
                onLoaderFinished={() => setProgress(0)}
            />

            <button
                onClick={toggleModal}
                className="fixed md:bottom-10 md:right-10 bottom-2 right-2 bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 transition"
            >
                <FaPlus size={24} />
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-semibold mb-4">Cost Amount</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Total Amount Field */}
                            <div className="mb-4">
                                <label htmlFor="Total Amount" className="block text-sm font-medium text-gray-700">Cost Purpose</label>
                                <input
                                    type="text"
                                    id="cost"
                                    {...register("cost", { required: "Cost Purpose is required" })}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Enter Cost Purpose name"
                                />
                                {errors.cost && <p className="text-red-500 text-xs">{errors.cost.message}</p>}
                            </div>

                            {/* Job Link Field */}
                            <div className="Amount Source">
                                <label htmlFor="link" className="block text-sm font-medium text-gray-700">Cost Amount</label>
                                <input
                                    type="text"
                                    id="amount"
                                    {...register("amount", { required: "Cost Amount is required" })}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Enter cost Amount "
                                />
                                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-between mt-3">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateCostAmount;