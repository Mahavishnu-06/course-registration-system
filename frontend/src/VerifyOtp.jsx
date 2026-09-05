import { useState } from "react";
import "./VerifyOtp.css";
import API_URL from "./api";
function VerifyOtp() {
    const params = new URLSearchParams(window.location.search);

    const emailFromUrl = params.get("email") || "";

    const [email, setEmail] = useState(emailFromUrl);
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // ==============================
    // VERIFY OTP
    // ==============================

    const handleVerifyOtp = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/users/verify-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email,
                        otp: otp,
                    }),
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText || "OTP verification failed"
                );

            }

            setMessage(
                responseText ||
                "Email verified successfully!"
            );

            setTimeout(() => {
                window.location.href = "/";
            }, 1500);

        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            setError(
                error.message ||
                "OTP verification failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==============================
    // RESEND OTP
    // ==============================

    const handleResendOtp = async () => {

        setMessage("");
        setError("");
        setResending(true);

        try {

            const response = await fetch(
                `${API_URL}/users/resend-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email,
                    }),
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText || "Failed to resend OTP"
                );

            }

            setMessage(
                responseText ||
                "New OTP has been sent to your email."
            );

            // Clear old OTP after requesting a new one
            setOtp("");

        } catch (error) {

            console.error(
                "Resend OTP error:",
                error
            );

            setError(
                error.message ||
                "Failed to resend OTP. Please try again."
            );

        } finally {

            setResending(false);

        }
    };


    return (
        <div className="otp-page">

            <div className="otp-card">

                {/* ==============================
                    BRAND
                ============================== */}

                <div className="otp-brand">

                    <div className="otp-logo">
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

                <div className="otp-heading">

                    <div className="otp-icon">
                        ✉
                    </div>

                    <h2>
                        Verify Your Email
                    </h2>

                    <p>
                        Enter the 6-digit OTP sent to your email address
                    </p>

                </div>


                {/* ==============================
                    SUCCESS MESSAGE
                ============================== */}

                {message && (
                    <div className="otp-success">
                        <span className="message-icon">✓</span>
                        <span>{message}</span>
                    </div>
                )}


                {/* ==============================
                    ERROR MESSAGE
                ============================== */}

                {error && (
                    <div className="otp-error">
                        <span className="message-icon">!</span>
                        <span>{error}</span>
                    </div>
                )}


                {/* ==============================
                    FORM
                ============================== */}

                <form onSubmit={handleVerifyOtp}>

                    {/* Email */}

                    <div className="otp-form-group">

                        <label htmlFor="otp-email">
                            Email Address
                        </label>

                        <input
                            id="otp-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email address"
                            required
                            disabled={loading || resending}
                        />

                    </div>


                    {/* OTP */}

                    <div className="otp-form-group">

                        <label htmlFor="otp">
                            Verification Code
                        </label>

                        <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(event) =>
                                setOtp(
                                    event.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                )
                            }
                            required
                            disabled={loading || resending}
                        />

                        <p className="otp-hint">
                            The OTP is valid for 10 minutes.
                        </p>

                    </div>


                    {/* Verify */}

                    <button
                        type="submit"
                        className="verify-button"
                        disabled={loading || resending}
                    >

                        {loading ? (
                            <>
                                <span className="otp-spinner"></span>
                                Verifying...
                            </>
                        ) : (
                            "Verify Email"
                        )}

                    </button>

                </form>


                {/* ==============================
                    RESEND OTP
                ============================== */}

                <div className="resend-section">

                    <p>
                        Didn't receive the OTP?
                    </p>

                    <button
                        type="button"
                        className="resend-button"
                        onClick={handleResendOtp}
                        disabled={
                            resending ||
                            loading
                        }
                    >

                        {resending ? (
                            <>
                                <span className="resend-spinner"></span>
                                Sending...
                            </>
                        ) : (
                            "Resend OTP"
                        )}

                    </button>

                </div>


                {/* ==============================
                    BACK TO LOGIN
                ============================== */}

                <div className="back-login">

                    <p>
                        Already verified?
                    </p>

                    <button
                        type="button"
                        className="back-login-button"
                        onClick={() =>
                            (window.location.href = "/")
                        }
                        disabled={loading || resending}
                    >
                        Back to Login
                    </button>

                </div>


                {/* ==============================
                    FOOTER
                ============================== */}

                <div className="otp-footer">

                    <p>
                        Your email helps keep your account secure.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default VerifyOtp;