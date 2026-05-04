import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

type LoginPopUpProps = {
    url: string;
    setShowLogin: (show: boolean) => void;
    setToken: (token: string) => void;
};

export default function LoginPopUp({ url, setShowLogin, setToken }: LoginPopUpProps) {
    const [currentState, setCurrentState] = useState("Login");
    const [message, setMessage] = useState("");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        const endpoint = currentState === "Login" ? "/api/user/login" : "/api/user/register";
        const payload = currentState === "Login"
            ? { email: data.email, password: data.password }
            : data;

        try {
            const response = await axios.post(`${url}${endpoint}`, payload);

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setToken(response.data.token);
                setShowLogin(false);
            } else {
                setMessage(response.data.message || "Something went wrong");
            }
        } catch (error) {
            setMessage("Unable to connect to server");
        }
    };

    return (
        <div className="fixed inset-0 z-20 grid bg-black/60 px-4">
            <form onSubmit={onLogin} className="place-self-center w-full max-w-sm rounded-lg bg-white p-6 text-sm text-slate-700 shadow-xl">
                <div className="mb-5 flex items-center justify-between text-slate-950">
                    <h2 className="text-2xl font-bold">{currentState}</h2>
                    <button type="button" onClick={() => setShowLogin(false)} className="h-8 w-8 rounded-full text-xl leading-none hover:bg-slate-100 cursor-pointer">
                        x
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {currentState === "Sign Up" && (
                        <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Enter your name" required className="rounded border border-slate-300 p-3 outline-none focus:border-slate-950" />
                    )}
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Enter your email" required className="rounded border border-slate-300 p-3 outline-none focus:border-slate-950" />
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Enter your password" required className="rounded border border-slate-300 p-3 outline-none focus:border-slate-950" />
                </div>

                {currentState === "Sign Up" && (
                    <label className="mt-4 flex items-start gap-2 text-xs">
                        <input type="checkbox" required className="mt-1" />
                        <span>By continuing, I agree to the terms of use and privacy policy.</span>
                    </label>
                )}

                {message && <p className="mt-4 rounded bg-red-50 p-2 text-red-600">{message}</p>}

                <button type="submit" className="mt-5 w-full rounded bg-slate-950 p-3 font-bold text-white cursor-pointer">
                    {currentState === "Sign Up" ? "Create Account" : "Login"}
                </button>

                {currentState === "Login" ? (
                    <p className="mt-4 text-center">
                        Create a new account?{" "}
                        <button type="button" onClick={() => setCurrentState("Sign Up")} className="font-semibold text-slate-950 cursor-pointer">
                            Click Here
                        </button>
                    </p>
                ) : (
                    <p className="mt-4 text-center">
                        Already have an account?{" "}
                        <button type="button" onClick={() => setCurrentState("Login")} className="font-semibold text-slate-950 cursor-pointer">
                            Login Here
                        </button>
                    </p>
                )}
            </form>
        </div>
    );
}