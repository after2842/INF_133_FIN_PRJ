import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";


function ProtectedRoute({children}) {
    //for prod using actual authentication
    // const [isAuthorized, setIsAuthorized] = useState(null)

    // for testing setting the autheticated state to true
    const [isAuthorized, setIsAuthorized] = useState(true)


    //uncomment for actual authetnication, commented out for testing
    // useEffect(() => {
    //     auth().catch( () => setIsAuthorized(false))
    // }, [])

    // const refreshToken = async () =>{
    //     const refreshToken = localStorage.getItem(REFRESH_TOKEN)

    //     try{
    //         const res = await api.post("/api/token/refresh/", {refresh: refreshToken});
    //         if (res.status === 200) {
    //             localStorage.setItem(ACCESS_TOKEN, res.data.access)
    //             setIsAuthorized(true)
    //         } else{
    //             setIsAuthorized(false)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         setIsAuthorized(false)
    //     }
    // }

    // const auth = async () =>{
    //     const token = localStorage.getItem(ACCESS_TOKEN)
    //     if (!token) {
    //         setIsAuthorized(false)
    //         return
    //     }
    //     const decoded = jwtDecode(token)
    //     const tokenExperiation = decoded.exp
    //     const now = Date.now() / 1000

    //     if (tokenExperiation < now) {
    //         await refreshToken()
    //     } else {
    //         setIsAuthorized(true)
    //     }


    // }   

    if (isAuthorized === null){
        return <div>
            loading...
        </div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute;