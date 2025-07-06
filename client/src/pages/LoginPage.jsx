import { useState } from "react";
import X from "../components/X.jsx";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, error } = useAuthStore();
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    await login(formData.email, formData.password, navigate);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="max-w-[60rem] mx-auto px-6 py-4">
        <div className="grid grid-cols-1 text-center items-center justify-center space-x-16 lg:grid-cols-2 lg:gap-6">
          {/* Logo */}
          <div className="hidden lg:grid lg:grid-cols-1 w-[20rem]">
            <div className="">
              <X className="fill-white" />
            </div>
          </div>
          {/* Register Form */}
          <main className="grid-cols-1">
            <form
              onSubmit={submitForm}
              className="space-y-6 flex flex-col items-center"
            >
              <h1 className="text-4xl font-bold text-center py-6 lg:text-start">
                Let's go
              </h1>
              <label className="input input-bordered rounded flex items-center gap-2 bg-black">
                <MdOutlineMail />
                <input
                  type="email"
                  className="grow"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>

              <label className="input input-bordered rounded flex items-center gap-2 bg-black ">
                <MdPassword />
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </label>
              {error && (
                <div className="text-md font-semibold text-red-600">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-primary rounded-full font-semibold cursor-pointer"
                >
                  Login
                </button>
                <h1 className="text-2xl font-bold line-clamp-2">
                  Don't have an account?
                </h1>
                <Link to="/register">
                  <button
                    type="button"
                    className="w-full py-3 border rounded-full font-semibold cursor-pointer"
                  >
                    Register
                  </button>
                </Link>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
