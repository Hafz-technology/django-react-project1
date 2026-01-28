import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import api from "../api"
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../constants';
import { useState, useEffect } from 'react';



function ProtectedRoute({children}) {
    const [isauthorized, setIsauthorized] = useState(null);
      useEffect(() => {
        auth().catch(() => setIsauthorized(false))
                       },[] );

    const refreshToken = async () => {
        const storedToken = localStorage.getItem(REFRESH_TOKEN);
        try {
             const res = await api.post('/api/token/refresh/', {
                refresh: storedToken,
            });
            if (res.status  === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsauthorized(true);   
            } else {
                setIsauthorized(false);
            }

            
        } catch (error) {
            console.log(error);
            setIsauthorized(false);
        }   

    }
    
    
    const auth = async () => {
        const Token = localStorage.getItem(ACCESS_TOKEN);
        if (!Token) {
            setIsauthorized(false);
            return;
        }
        const decoded = jwtDecode(Token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
           setIsauthorized(true); 
        }

    }

  



    if (isauthorized === null) {
        return <div>Loading...</div>
    }
    return isauthorized ? children : <Navigate to="/login"/>;
}


export default ProtectedRoute;
