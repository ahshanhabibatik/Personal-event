import { useContext, useState } from "react";
import useAxiosPublic from "../../Hook/UseAxiosPublic";
import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Provider/AuthProvider";
import { toast, Toaster } from "react-hot-toast";
import LoadingBar from 'react-top-loading-bar';

const CreateManyPage = ({ onJobEventCreated }) => {
    const axiosPublic = useAxiosPublic();
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(AuthContext);
    const [progress, setProgress] = useState(0);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const onSubmit = async (data) => {
        const token = localStorage.getItem("access-token");

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
            date: currentDate,
        };

        try {
            setProgress(30);
            const response = await axiosPublic.post("/amountInfo", jobEventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                toast.success("Amount Inserted Successfully");
                reset();
                toggleModal();

                // Trigger data reload
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
        <div>
            <div className="relative">
                <Toaster position="top-center" />

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
                            <h2 className="text-xl font-semibold mb-4">Total Amount</h2>
                            <form onSubmit={handleSubmit(onSubmit)}>

                                {/* Total Amount Field */}
                                <div className="mb-4">
                                    <label htmlFor="Total Amount" className="block text-sm font-medium text-gray-700">Total Amount</label>
                                    <input
                                        type="number"
                                        id="total"
                                        {...register("total", { required: "Job name is required" })}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter Amount"
                                    />
                                    {errors.total && <p className="text-red-500 text-xs">{errors.total.message}</p>}
                                </div>

                                {/* Job Link Field */}
                                <div className="Amount Source">
                                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">Amount Source</label>
                                    <input
                                        type="text"
                                        id="source"
                                        {...register("source", { required: "Job link is required" })}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter Source Name"
                                    />
                                    {errors.source && <p className="text-red-500 text-xs">{errors.source.message}</p>}
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
        </div>
    );
};

export default CreateManyPage;