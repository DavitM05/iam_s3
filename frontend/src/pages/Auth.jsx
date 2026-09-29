import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../store.jsx";

function AuthForm({ mode }) {
  const reg = mode === "register";
  const { setAuth } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr("");
    try {
      const d = await api(reg ? "/auth/register" : "/auth/login", { method: "POST", body: reg ? f : { email: f.email, password: f.password } });
      setAuth({ token: d.access_token, user: d.user });
      nav("/");
    } catch (e) { setErr(e.message); }
  };

  return (
    <form className="panel form" onSubmit={submit}>
      <h1>{reg ? "Create account" : "Log in"}</h1>
      {reg && <label>Name<input required value={f.name} onChange={on("name")} /></label>}
      <label>Email<input type="email" required value={f.email} onChange={on("email")} /></label>
      <label>Password<input type="password" required minLength={6} value={f.password} onChange={on("password")} /></label>
      {err && <p className="error">{err}</p>}
      <button className="big">{reg ? "Create account" : "Log in"}</button>
      <p className="muted">{reg ? <>Have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link>. Demo admin: admin@shop.com / admin123</>}</p>
    </form>
  );
}
export const Login = () => <AuthForm mode="login" />;
export const Register = () => <AuthForm mode="register" />;
