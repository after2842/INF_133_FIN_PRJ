import { GithubIcon } from "lucide-react";
import { render } from "react-dom";
import React from "react";
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";



export default function Form({route, method}) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register"


    const handleSubmit =  async (e) => {
        setLoading(true);
        e.preventDefault(true);

        try{ 
            const res = await api.post(route, {username, password})
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            }else{
                navigate("/login")
            }
        }
        catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }

    };
  return <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        <h1>{name}</h1>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-slate-600">Sign in to continue to your account</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input id="email" type="text" onChange={(e) => setPassword(e.target.value)} value={username} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Enter your username" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="Enter your password" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember" type="checkbox" className="h-4 w-4 border-slate-200 rounded" />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                Remember me
              </label>
            </div>
            <a className="text-sm text-slate-600 hover:text-slate-800">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors" data-prototypeId="3">
            {name}
          </button>
        </form>


        <p className="mt-8 text-center text-sm text-slate-600">
          Dont have an account?
          <a className="font-medium text-slate-900 hover:text-slate-700">
            Sign up
          </a>
        </p>
    </form>
}