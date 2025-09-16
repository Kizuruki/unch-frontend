import "./page.css";
import Link from "next/link";

export default function Login() {
  return (
    <main>
      <div className="login-container">
        <div className="login-box">
          <h1>UntitledCharts</h1>
          <p>Login function hasn't been implemented yet (sorry)<br></br>
          but let's pretend like the button actually does something</p>
          <form>
            
            {/* <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required /> */}
            <button type="submit" className="login-btn">Log In</button>
          </form>
          <p>
            Don't have an account? <span className="sucks">that sucks</span>
          </p>
        </div>
      </div>
    </main>
  );
}
