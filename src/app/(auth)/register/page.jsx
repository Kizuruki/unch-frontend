import "./page.css"
import Link from "next/link"

export default function Register() {
    return <div>
        <div className="register-container">
            <div className="register-box">
            <h1>Register</h1>
            <form>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" name="confirm-password" required />
                <button type="submit" className="register-btn">Register</button>
            </form>
            <p>
                Already have an account? <a href="/login"><button className="login-btn">Log In</button></a>
            </p>
        </div>
        </div>
    </div>
};