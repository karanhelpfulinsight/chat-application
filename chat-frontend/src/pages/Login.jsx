import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../axios/api";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});
const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const onSubmit = async (obj) => {
        try {
          const {data} = await api.post('/user/login', obj);
          sessionStorage.setItem("user", JSON.stringify(data.data));
          navigate("/")
        }catch(error) {
          console.log(error)
        }
      };
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 shadow-lg bg-white">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                {...register("email")}
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                {...register("password")}
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login