import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

import "./AdminLogin.css";


export default function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        navigate("/admin");

    }

    return (

        <div className="admin-login-page">

            <form
                className="admin-login-card"
                onSubmit={handleSubmit}
            >

                <h1>Admin Login</h1>

                <label>Email</label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                />

                <label>Password</label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />

                {error && (
                    <p className="admin-login-error">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </button>

            </form>

        </div>

    );

}
