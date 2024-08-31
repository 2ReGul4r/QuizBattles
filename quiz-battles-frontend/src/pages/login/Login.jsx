import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [inputs, setInputs] = useState({
		userIdentifier: "",
		password: "",
	});

  const { state, handleLogin } = useUser();
  const navigate = useNavigate();

  const clickSignUp = () => {
    navigate("/signup");
  }

  const handleSubmit= async (e) => {
    e.preventDefault();
		await handleLogin(inputs);
  }

  const clickForgot = () => {
    //TODO: Implement Forgot password!
  }

  return (
    <div className="flex flex-col items-center">
      <div className="card bg-base-200 shadow-xl login-card-width">
        <div className="card-body">
          <h2 className="card-title self-center mb-4">Login</h2>
          <form>
            <input
              type="text"
              placeholder="Email/Username"
              autoComplete="username"
              value={inputs.userIdentifier}
              onChange={(e) => setInputs({ ...inputs, userIdentifier: e.target.value })}
              className="input input-bordered w-full mb-4"
            />
            <input 
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              className="input input-bordered w-full mb-4"
            />
          </form>
          <div className="card-actions items-center flex flex-col">
            {/*<a className="btn-link btn-wide cursor-pointer text-center" onClick={clickForgot}>Forgot Password?</a>*/}
            <a className="btn-link w-full cursor-pointer text-center mb-4" onClick={clickSignUp}>Don't have an account yet?</a>
            <button className="btn btn-primary w-full" onClick={handleSubmit}>Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login