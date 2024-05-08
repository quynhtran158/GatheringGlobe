import { Room } from "@/types/room";
import { SignInFormData } from "@/types/signInFormData";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const serverTest = async () => {
  const response = await axiosInstance.get("/test");
  return response.data;
};

export const useServerTest = () => {
  return useQuery({
    queryKey: ["test"],
    queryFn: serverTest,
  });
};

// Handle registration
export const RegisterUser = async (data: SignInFormData) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5050/api/users/register",
      data,
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
};

// Handle SignIn
export const SignInUser = async (data: SignInFormData) => {
  try {
    const response = await axiosInstance.post("/api/users/login", data);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const createRoom = async (data: { name: string }) => {
  const response = await axiosInstance.post("/api/room", data);
  return response.data;
};

export const getRoom = async ({ roomId }: { roomId: string | undefined }) => {
  const response = await axiosInstance.get<Room>(`/api/room/${roomId}`);
  return response.data;
};

export const editRoom = async (data: {
  name: string;
  roomId: string | undefined;
}) => {
  console.log(data.name);
  const response = await axiosInstance.put<Room>(
    `/api/room/${data.roomId}`,
    data,
  );
  return response.data;
};

export const deleteRoom = async (roomId: string | undefined) => {
  const response = await axiosInstance.delete<Room>(`/api/room/${roomId}`);
  return response.data;
};

export const getRooms = async () => {
  const response = await axiosInstance.get<Room[]>("/api/room");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get<User>("/api/users");
  return response.data;
};

export const validateToken = async () => {
  const response = await axiosInstance.get("/api/users/validate-token");
  return response.data;
};

export const signOutUser = async () => {
  const response = await axiosInstance.post("/api/users/logout");
  return response.data;
};
