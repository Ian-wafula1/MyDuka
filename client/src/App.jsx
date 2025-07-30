import {Outlet, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import { useEffect, useContext } from "react"
import { AppContext } from "./context/AppContext"
import axios from "axios"

function App() {

    const {setCurrentUser} = useContext(AppContext)
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
            axios.get('/api/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                console.log(res)
                let user = res.data.user_dict
                user = {
                    ...user,
                    account_type: res.data.account_type
                }
                setCurrentUser(user)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [token, setCurrentUser, navigate])

    return (
        <>
            <Navbar />
            <div className="container">
                <Outlet />
            </div>
        </>
    )
}

export default App
