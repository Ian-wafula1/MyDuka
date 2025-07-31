import Sidebar from "../components/Sidebar"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Contact() {

    const navigate = useNavigate()

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login')
		}
	}, [navigate])

    return (
        <>
            <Sidebar />
            <div className="contact-container">
                <h1>Contact</h1>
            </div>
        </>
    )
}