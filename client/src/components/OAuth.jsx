import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            })
            const data = await res.json();
            dispatch(signInSuccess(data))
            navigate("/");
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <FcGoogle /> Continue with google
        </button>
    );
}
