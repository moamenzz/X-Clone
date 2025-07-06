import { useState } from "react";
import X from "../components/X.jsx";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { MdDriveFileRenameOutline } from "react-icons/md";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
  });

  const { signup, error } = useAuthStore();
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    await signup(
      formData.email,
      formData.name,
      formData.username,
      formData.password,
      navigate
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-[100vh] bg-black flex items-center justify-center">
      <div className="mx-auto px-6 py-4">
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
                Join Today.
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
              <label className="input input-bordered rounded flex items-center gap-2 bg-black">
                <FaUser />
                <input
                  type="name"
                  className="grow"
                  placeholder="Full name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </label>
              <label className="input input-bordered rounded flex items-center gap-2 bg-black">
                <MdDriveFileRenameOutline />
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
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
                  Register
                </button>
                <h1 className="text-2xl font-bold line-clamp-2">
                  Already have an account?
                </h1>
                <Link to="/login">
                  <button
                    type="button"
                    className="w-full py-3 border rounded-full font-semibold cursor-pointer"
                  >
                    Login
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
