import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hook/UseAxiosPublic";
import { toast, Toaster } from "react-hot-toast";

const UpdateJobInfo = () => {
    const data = useLoaderData(); // This will get the job information to be edited
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    // Use React Hook Form to manage form state
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Pre-fill form fields with the existing job data
    const [jobInfo, setJobInfo] = useState(data);

    const onSubmit = async (updatedData) => {
        const token = localStorage.getItem('access-token');

        if (!token) {
            toast.error("No access token found");
            return;
        }

        try {
            const response = await axiosPublic.put(
                `/jobInfo/${jobInfo._id}`,
                updatedData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            if (response.data) {
                toast.success("Job event updated successfully");
                navigate('/dashboard/home');
            }
        } catch (error) {
            toast.error("Failed to update job event");
            console.error("Error:", error);
        }
    };

    // Reset form values when the modal is closed
    const closeModal = () => {
        reset();
        navigate('/dashboard/home'); // Go to home page when cancel is clicked
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-8">
            <Toaster position="top-center" />

            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Update Job Event</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Job Name Field */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Job Name</label>
                    <input
                        type="text"
                        id="name"
                        defaultValue={jobInfo.name}
                        {...register("name", { required: "Job name is required" })}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                {/* Job Link Field */}
                <div className="mb-4">
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link</label>
                    <input
                        type="url"
                        id="link"
                        defaultValue={jobInfo.link}
                        {...register("link", { required: "Job link is required" })}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.link && <p className="text-red-500 text-xs">{errors.link.message}</p>}
                </div>

                {/* Username Field */}
                <div className="mb-4">
                    <label htmlFor="applyUsername" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        id="applyUsername"
                        defaultValue={jobInfo.applyUsername}
                        {...register("applyUsername", { required: "Username is required" })}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.applyUsername && <p className="text-red-500 text-xs">{errors.applyUsername.message}</p>}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="text"
                        id="password"
                        defaultValue={jobInfo.password}
                        {...register("password", { required: "Password is required" })}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                {/* Submit Button and Cancel Button */}
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="px-2 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Update Job Event
                    </button>

                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-2 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateJobInfo;
