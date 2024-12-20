import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import eye icons
import { AuthContext } from "../../../Provider/AuthProvider";
import SocialLogin from "../../../Hook/SocialLogin";
import '../../../font.css'

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const onSubmit = (data) => {
        const { email, password } = data;

        setLoading(true);

        signIn(email, password)
            .then(result => {
                const user = result.user;
                console.log(user);

                Swal.fire({
                    title: "User Login Successfully",
                    icon: "success",
                    showClass: {
                        popup: "animate__animated animate__fadeInUp animate__faster"
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOutDown animate__faster"
                    }
                });

                navigate('/dashboard/home');
            })
            .catch(error => {
                console.error("Login error:", error);



                Swal.fire({
                    title: "Login Failed",
                    text: "Wrong password. Please try again.",
                    icon: "error",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center poppins  px-4 sm:px-4 md:px-4 mt-4 mb-4">

            <div className="w-full max-w-lg bg-white p-8 rounded-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Enter a valid email address"
                                }
                            })}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type={showPassword ? "text" : "password"} // Toggle between text and password
                            {...register("password", { required: "Password is required" })}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            placeholder="••••••••"
                        />
                        {/* Eye Icon for toggling password visibility */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 pt-6 text-gray-600"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                            ) : (
                                <AiOutlineEye size={20} />
                            )}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button with loading indicator */}
                    <button
                        type="submit"
                        disabled={loading} // Disable button when loading
                        className={`w-full p-3 rounded-lg font-semibold transition duration-300 ease-in-out ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none`}
                    >
                        {loading ? (
                            <span>Loading...</span> // Show text while loading
                        ) : (
                            <span>Login</span> // Default button text
                        )}
                    </button>
                </form>

                {/* Social Login Button */}
                <div className="mt-6 text-center">
                    <SocialLogin />
                </div>

                <div className=" text-center">
                    <p className="text-sm text-gray-600">Don't have an account? <Link to={'/register'} className="text-indigo-600 hover:text-indigo-700">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
