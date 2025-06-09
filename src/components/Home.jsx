import { Outlet, useNavigate } from "react-router";
import { NavBar } from "../commonComponents/NavBar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../store/slices/userSlice";
import { useEffect } from "react";
import { createSocketConnection } from "../utils/Socket";

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingUser = useSelector((state) => state.user);

  const userProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`);
      dispatch(addUser(res?.data?.data));
    } catch (error) {
      if (error.status == 400) {
        navigate("/login");
        return;
      }
      console.error(error.status);
    }
  };

  useEffect(() => {
    !existingUser && userProfile();
  }, []);

  useEffect(() => {
    const socket = createSocketConnection();
    if (existingUser) {
      socket.emit("userOnline", existingUser?._id);
    }

    // socket.on("userStatusUpdate", ({ userId, status }) => {
    //   dispatch(addUser(res?.data?.data));

    //   setUserStatus((prev) => ({ ...prev, [userId]: status }));
    // });

    return () => {
      socket.disconnect(); // triggers backend 'disconnect'
    };
  }, [existingUser]);

  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};
