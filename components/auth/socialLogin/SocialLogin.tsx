"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import google from "@/public/assets/images/google.svg";
import TranslateHook from "@/translate/TranslateHook";

const SocialLogin = () => {
    const translate = TranslateHook();

    // Function to extract token from the URL and store it in cookies
    // const handleToken = () => {
    //     // Check if the URL contains a token in the query string
    //     const queryString = window.location.search;
    //     if (queryString) {
    //         const params = new URLSearchParams(queryString);
    //         const token = params.get("token");

    //         if (token) {
    //             // Store the token securely in cookies
    //             Cookies.set("access_token", token, { expires: 7, secure: true });
    //             Cookies.set("is_verified", "true", { expires: 7, secure: true });

    //             window.location.href = "https://www.sorooj.org"

    //             return true; // Indicate token was processed
    //         }
    //     }
    //     return false; // Indicate no token was found
    // };

    // useEffect(() => {
    //     // Call the token handling function
    //     handleToken();
    // }, []);




    // // Handle social login redirection
    // const handleLogin = (provider: string) => {
    //     const baseUrl = "https://dashboard.sorooj.org/client-api/v1/auth";
    //     const redirectUrl = `${baseUrl}/${provider}/redirect`;

    //     // Redirect the user to the provider's login page
    //     window.location.href = redirectUrl;
    // };

    return (
        <div className="text-center">
            <p className="text-gray-300">
                ــــــــــــــــــــــــــــــ
                <span className="mainColor mx-2">
                     {translate?.pages.login.or} 
                </span>
                ــــــــــــــــــــــــــــــ
            </p>

            <div className="socialLogin w-[95%]  md:w-[90%] mx-auto my-6 grid grid-cols-1 md:grid-cols-1 gap-1  relative z-30">

                {/* Google Login Button */}
                <div
                    className="bg-white flex p-2.5 rounded-[5px] [box-shadow:1px_1px_6px_#ddd] justify-center cursor-pointer"
                    // onClick={() => handleLogin("google")}
                >
                    <div className="flex items-center justify-center text-[13px] font-semibold w-fit mainColor">
                        <Image src={google} className="me-2" width={30} height={30} alt="Google icon" />
                        {translate?.pages.login.withGoogle} 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialLogin;