"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabaseClient } from "@/supabase";
import { toast } from "@/components/ui/toast"

const Page = () => {
    const supabase = supabaseClient();
    const [userInfo, setUserInfo] = useState({ email: "", password: "" , username: "" });
    const handleUserInfo = (event) => {
        if (event.target.name === "email") {
            setUserInfo({ ...userInfo, email: event.target.value });
        } else if (event.target.name === "password") {
            setUserInfo({ ...userInfo, password: event.target.value });
        } else if (event.target.name === "username") {
            setUserInfo({ ...userInfo, username: event.target.value });
        }
    }
    const signup = async () => {
    const response = await supabase.auth.signUp({
      email: userInfo.email,
      password: userInfo.password,
    });
    if (response.error) {
      toast.add({
        title: "Error",
        description: response.error.message,
        type: "error",
      })
      return;
    }
    console.log(response);
    const userId = response.data.user.id;
    const res = await supabase.from("profile").insert({ id: userId, username: userInfo.username ,});
    console.log(res, "gg");
    toast.add({
  title: "Welcome to Instagram",
  description: "User created successfully",
})
  };
    return (
        <div>
            <Input placeholder="email" name="email" onChange={(e) => handleUserInfo(e)} value={userInfo.email} />
            <Input placeholder="username" name="username" onChange={(e) => handleUserInfo(e)} value={userInfo.username} />
            <Input type="password" placeholder="password" name="password" onChange={(e) => handleUserInfo(e)} value={userInfo.password} />
            <Button onClick={signup}>Create Account</Button>
        </div>
    )
}
export default Page;