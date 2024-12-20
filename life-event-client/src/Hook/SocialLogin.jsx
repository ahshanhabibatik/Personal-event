import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UseAuth from "./UseAuth";
import useAxiosPublic from "./UseAxiosPublic";


const SocialLogin = () => {
    const { googleSignIn } = UseAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log(result.user);
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    role: "admin"
                };
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        console.log(res.data);
                        navigate('/dashboard/home');
                    })
            })
    }

    return (
        <div className="p-8">
            <div className="divider"></div>
            <div>
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold flex items-center justify-center  hover:bg-red-600 focus:outline-none transition duration-300 ease-in-out"
                >
                    <FaGoogle className="text-2xl" />
                    <span className="ml-1"> Continue with Google</span>
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;
