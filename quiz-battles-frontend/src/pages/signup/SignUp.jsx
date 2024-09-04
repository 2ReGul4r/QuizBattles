import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [inputs, setInputs] = useState({
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
	});

  const { state, handleSignup } = useUser();

  const navigate = useNavigate();

  const clickLogin = () => {
    navigate("/login")
  }

  const handleSubmit = async (e) => {
		e.preventDefault();
		await handleSignup(inputs);
	};

  return (
    <div className="flex flex-col items-center">
      <div className="card bg-base-200 shadow-xl login-card-width">
        <div className="card-body">
          <h2 className="card-title self-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              autoComplete="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            className="input input-bordered w-full mb-4"
            />
            <input
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
              className="input input-bordered w-full mb-4"
            />
            <div className="card-actions items-center flex flex-col">
              <a className="link link-primary text-center mb-4" onClick={clickLogin}>Already have an account?</a>
              <button className="btn btn-primary w-full" type="submit" onClick={handleSubmit}>Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp