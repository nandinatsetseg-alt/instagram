
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/supabase";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const supabase = supabaseClient();

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });

    const handleUserInfo = (event) => {
        if (event.target.name === "email") {
            setUserInfo({ ...userInfo, email: event.target.value });
        } else if (event.target.name === "password") {
            setUserInfo({ ...userInfo, password: event.target.value });
        }
    };

    const login = async () => {
        const response = await supabase.auth.signInWithPassword({
            email: userInfo.email,
            password: userInfo.password,
        });

        console.log(response);

        if (!response.error) {
            router.push("/home");
        }
    };

    return (
        <main className="min-h-[100svh] w-full flex flex-col items-center overflow-hidden
            bg-gradient-to-br from-[#fffaf9] via-[#f1f5fc] to-[#f0faf5]
            px-5 pt-[clamp(65px,14svh,125px)]
            pb-[calc(18px+env(safe-area-inset-bottom))]
            font-sans">

            {/* Instagram Logo */}
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

            {/* Login Form */}
            <div className="w-full max-w-[360px] flex flex-col gap-[12px]
                mt-[clamp(90px,13svh,125px)]">

                <Input
                    placeholder="Username, email or mobile number"
                    name="email"
                    onChange={handleUserInfo}
                    value={userInfo.email}
                    autoComplete="username"
                    className="h-[58px] rounded-[12px] border border-[#d1d5db]
                        bg-white/90 px-[16px] text-[16px] font-normal
                        tracking-normal text-[#262626]
                        placeholder:text-[#737e8c]
                        shadow-none focus-visible:ring-1
                        focus-visible:ring-[#a8a8a8]"
                />

                <Input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleUserInfo}
                    value={userInfo.password}
                    autoComplete="current-password"
                    className="h-[58px] rounded-[12px] border border-[#d1d5db]
                        bg-white/90 px-[16px] text-[16px] font-normal
                        tracking-normal text-[#262626]
                        placeholder:text-[#737e8c]
                        shadow-none focus-visible:ring-1
                        focus-visible:ring-[#a8a8a8]"
                />

                {/* Login Button */}
                <Button
                    onClick={login}
                    className="mt-[2px] h-[48px] w-full rounded-full
                        bg-[#2864d7] text-[16px] font-semibold
                        tracking-normal text-white
                        shadow-none hover:bg-[#245bc2]
                        active:opacity-80"
                >
                    Log in
                </Button>

            </div>

            {/* Bottom Section */}
            <div className="mt-auto w-full max-w-[360px] flex flex-col
                items-center gap-7 pt-10">

                <Button
                    onClick={() => router.push("/sign-up")}
                    variant="outline"
                    className="h-[48px] w-full rounded-full
                        border-[1.5px] border-[#3475dc]
                        bg-transparent text-[16px] font-semibold
                        text-[#3475dc] shadow-none
                        hover:bg-blue-50 active:opacity-80"
                >
                    Create new account
                </Button>

                {/* Meta */}
                <div className="flex items-center justify-center gap-[5px]
                    text-[#52606c]">

                    <span className="text-[29px] font-medium leading-none">
                        ∞
                    </span>

                    <span className="text-[19px] font-semibold tracking-tight">
                        Meta
                    </span>

                </div>

            </div>

        </main>
    );
};

export default Page;
