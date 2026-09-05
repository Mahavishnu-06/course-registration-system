import { useState } from "react";
import "./Register.css";
import API_URL from "./api";
function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        department: department,
                        year: Number(year),
                    }),
                }
            );

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText || "Registration failed"
                );
            }

            // Go to OTP verification page
            window.location.href = `/verify-otp?email=${encodeURIComponent(
                email
            )}`;

        } catch (error) {
            console.error("Registration error:", error);
            setError(
                error.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                {/* ==============================
                    BRAND
                ============================== */}

                <div className="register-brand">

                    <div className="register-logo">
                        CR
                    </div>

                    <div>
                        <h1>
                            Course Registration
                        </h1>

                        <p>
                            Student &amp; Academic Management System
                        </p>
                    </div>

                </div>


                {/* ==============================
                    HEADING
                ============================== */}

                <div className="register-heading">

                    <h2>
                        Create Your Account
                    </h2>

                    <p>
                        Register as a student to get started
                    </p>

                </div>


                {/* ==============================
                    ERROR
                ============================== */}

                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}


                {/* ==============================
                    FORM
                ============================== */}

                <form onSubmit={handleRegister}>

                    {/* Full Name */}

                    <div className="register-form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Email */}

                    <div className="register-form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Password */}

                    <div className="register-form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Department */}

                    <div className="register-form-group">

                        <label htmlFor="department">
                            Department
                        </label>

                        <input
                            id="department"
                            type="text"
                            placeholder="Example: CSE"
                            value={department}
                            onChange={(event) =>
                                setDepartment(event.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Year */}

                    <div className="register-form-group">

                        <label htmlFor="year">
                            Academic Year
                        </label>

                        <select
                            id="year"
                            value={year}
                            onChange={(event) =>
                                setYear(event.target.value)
                            }
                            required
                            disabled={loading}
                        >

                            <option value="">
                                Select your year
                            </option>

                            <option value="1">
                                1st Year
                            </option>

                            <option value="2">
                                2nd Year
                            </option>

                            <option value="3">
                                3rd Year
                            </option>

                            <option value="4">
                                4th Year
                            </option>

                        </select>

                    </div>


                    {/* Register Button */}

                    <button
                        type="submit"
                        className="register-submit-button"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="register-spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            "Create Account"
                        )}

                    </button>

                </form>


                {/* ==============================
                    LOGIN
                ============================== */}

                <div className="login-section">

                    <p>
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        className="login-button-link"
                        onClick={() =>
                            (window.location.href = "/")
                        }
                        disabled={loading}
                    >
                        Back to Login
                    </button>

                </div>


                {/* ==============================
                    FOOTER
                ============================== */}

                <div className="register-footer">

                    <p>
                        A verification OTP will be sent to your email
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;