"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabaseClient } from "@/supabase";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter()
    const supabase = supabaseClient();
        const [userInfo, setUserInfo] = useState({ email: "", password: "" });
        const handleUserInfo = (event) => {
            if (event.target.name === "email") {
                setUserInfo({ ...userInfo, email: event.target.value });
            } else if (event.target.name === "password") {
                setUserInfo({ ...userInfo, password: event.target.value });
            }
        }
        const login = async () => {
        const response = await supabase.auth.signInWithPassword({
          email: userInfo.email,
          password: userInfo.password,
        });
        console.log(response);
      };
    return (
        <div>
            <Input placeholder="email" name="email" onChange={(e) => handleUserInfo(e)} value={userInfo.email} />
            <Input type="password" placeholder="password" name="password" onChange={(e) => handleUserInfo(e)} value={userInfo.password} />
            <Button onClick={login}>Login</Button>
            <Button onClick={() => router.push("/sign-up")}>Create Account</Button>
        </div>
    )
}
export default Page;