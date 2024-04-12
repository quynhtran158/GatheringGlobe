import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GatheringGlobe from "../images/GatheringGlobe.png";
import axios from "axios";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterUser } from "@/services/api";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const handleRegistration = async (data: any) => {
    try {
      // const response = await axios.post(`${baseURL}/api/users/register`, data);
      RegisterUser(data);

      console.log("Registration sucessful");
    } catch (error: any) {
      console.error("Registartion failed", error.response || error);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: "#cce7c9" }}
    >
      <form onSubmit={handleSubmit(handleRegistration)}>
        <div className="flex flex-col w-[400px]">
          <img
            src={GatheringGlobe}
            alt="GatheringGlobe Logo"
            className="justify-items-start mx-28 "
            style={{ width: "200px", height: "190px" }}
          />
          <Tabs defaultValue="account" className="w-[400px] ">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Log in</TabsTrigger>
              <TabsTrigger value="password">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Sign in to GatheringGlobe
                  </CardTitle>
                  <CardDescription className="text-center">
                    Discover, host, and buy event tickets with us
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      {...register("email", { required: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      {...register("password", { required: true })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full mb-2 rounded-full" type="submit">
                    Sign in
                  </Button>
                </CardFooter>
                <div className="flex flex-col">
                  <Button
                    className="w-80 h-8 bg-red-600 text-white rounded mx-10 mb-3.5"
                    type="submit"
                  >
                    Sign in with Google
                  </Button>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>New user?</CardTitle>
                  <CardDescription>
                    Join us to unlock exclusive features now
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Enter your email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { required: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="current">Enter your password</Label>
                    <Input
                      id="current"
                      type="password"
                      {...register("password", { required: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">Confirm your password</Label>
                    <Input
                      id="new"
                      type="password"
                      {...register("confirmPassword", { required: true })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Sign Up</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </div>
  );
};
export { RegisterForm };
