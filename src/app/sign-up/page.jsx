
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/supabase";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation"; 
const supabase = supabaseClient;
const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        username: "",
    });

    const handleUserInfo = (event) => {
        if (event.target.name === "email") {
            setUserInfo({ ...userInfo, email: event.target.value });
        } else if (event.target.name === "password") {
            setUserInfo({ ...userInfo, password: event.target.value });
        } else if (event.target.name === "username") {
            setUserInfo({ ...userInfo, username: event.target.value });
        }
    };

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
            });
            return;
        }

        console.log(response);

        const userId = response.data.user.id;

        const res = await supabase.from("profile").insert({
            id: userId,
            username: userInfo.username,
        });

        console.log(res, "gg");

        toast.add({
            title: "Welcome to Instagram",
            description: "User created successfully",
        });
    };

    return (
        <main className="min-h-[100svh] w-full flex flex-col items-center
            overflow-hidden bg-gradient-to-br from-[#fffaf9] via-[#f1f5fc]
            to-[#f0faf5] px-5
            pt-[clamp(55px,10svh,100px)]
            pb-[calc(18px+env(safe-area-inset-bottom))]
            font-sans">

            <div className="flex justify-center">
                <svg
                    width="76"
                    height="76"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient
                            id="instagram-gradient"
                            x1="10"
                            y1="90"
                            x2="90"
                            y2="10"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#FEDA75" />
                            <stop offset="0.3" stopColor="#FA7E1E" />
                            <stop offset="0.55" stopColor="#D62976" />
                            <stop offset="0.8" stopColor="#962FBF" />
                            <stop offset="1" stopColor="#4F5BD5" />
                        </linearGradient>
                    </defs>

                    <rect
                        x="5"
                        y="5"
                        width="90"
                        height="90"
                        rx="25"
                        stroke="url(#instagram-gradient)"
                        strokeWidth="9"
                    />

                    <circle
                        cx="50"
                        cy="50"
                        r="20"
                        stroke="url(#instagram-gradient)"
                        strokeWidth="9"
                    />

                    <circle
                        cx="76"
                        cy="24"
                        r="6"
                        fill="#C135A5"
                    />
                </svg>
            </div>

            <div className="mt-10 text-center">
                <h1 className="text-[20px] font-semibold tracking-tight text-[#262626]">
                    Create an account
                </h1>

                <p className="mt-2 text-[14px] font-normal text-[#737e8c]">
                    Sign up to see photos and videos from your friends.
                </p>
            </div>

            <div className="mt-8 w-full max-w-[360px] flex flex-col gap-[12px]">

                <Input
                    placeholder="Email address"
                    name="email"
                    type="email"
                    onChange={handleUserInfo}
                    value={userInfo.email}
                    autoComplete="email"
                    className="h-[58px] rounded-[12px] border border-[#d1d5db]
                        bg-white/90 px-[16px] text-[16px] font-normal
                        text-[#262626] placeholder:text-[#737e8c]
                        shadow-none focus-visible:ring-1
                        focus-visible:ring-[#a8a8a8]"
                />

                <Input
                    placeholder="Username"
                    name="username"
                    onChange={handleUserInfo}
                    value={userInfo.username}
                    autoComplete="username"
                    className="h-[58px] rounded-[12px] border border-[#d1d5db]
                        bg-white/90 px-[16px] text-[16px] font-normal
                        text-[#262626] placeholder:text-[#737e8c]
                        shadow-none focus-visible:ring-1
                        focus-visible:ring-[#a8a8a8]"
                />

                <div className="relative w-full">
  <Input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    name="password"
    onChange={handleUserInfo}
    value={userInfo.password}
    autoComplete="new-password"
    className="h-[58px] w-full rounded-[12px] border border-[#d1d5db] bg-white/90 px-[16px] pr-[50px] text-[16px] font-normal text-[#262626] placeholder:text-[#737e8c] shadow-none focus-visible:ring-1 focus-visible:ring-[#a8a8a8]"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#262626]"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      // Eye with a slash
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 002.8 2.8" />
        <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.2" />
        <path d="M6.2 6.2C3.8 7.7 2.1 10 1.5 12c1 2.5 4.5 7 10.5 7 1 0 2-.2 2.9-.5" />
      </svg>
    ) : (
      // Normal eye
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>
</div>

                <Button
                    onClick={signup}
                    className="mt-[4px] h-[48px] w-full rounded-full
                        bg-[#2864d7] text-[16px] font-semibold
                        text-white shadow-none hover:bg-[#245bc2]
                        active:opacity-80"
                >
                    Create account
                </Button>
                <p className="mt-3 text-center text-[14px] text-[#262626]">
                 Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="font-semibold text-[#0095f6] hover:text-[#1877f2]"
                >
                    Log in
               </button>
                </p>
                <p className="mt-2 px-3 text-center text-[12px] leading-5 text-[#737e8c]">
                    By signing up, you agree to our Terms, Privacy Policy
                    and Cookies Policy.
                </p>

            </div>

            <div className="mt-auto flex items-center justify-center gap-[5px]
                pt-12 text-[#52606c]">

                <span className="text-[29px] font-medium leading-none">
                    ∞
                </span>

                <span className="text-[19px] font-semibold tracking-tight">
                    Meta
                </span>

            </div>

        </main>
    );
};

export default Page;
