import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "../../store/useUserStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    newPassword: "",
    currentPassword: "",
  });

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  const { updateProfile, error, isLoading } = useUserStore();
  const axiosPrivate = useAxiosPrivate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    try {
      e.preventDefault();
      await updateProfile(axiosPrivate, formData);
      toast.success(
        "Profile updated successfully! Changes will take a moment."
      );
      document.getElementById("edit_profile_modal").close();
    } catch (e) {
      console.error(e);
      toast.error(
        `Failed to update profile: ${
          error.message || e.response?.data?.message
        }`
      );
    }
  };

  return (
    <>
      <button
        className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box bg-black border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Name"
                className="flex-1 input bg-black border border-gray-700 rounded p-2 input-md"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input bg-black border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input bg-black border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input bg-black border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input bg-black border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input bg-black border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <button
              className="w-full h-[2rem] rounded-full btn-sm text-black bg-white text-6xl font-semibold cursor-pointer"
              onClick={submitForm}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
