import { useEffect, useState } from "react";
import "./StudentDashboard.css";
import API_URL from "./api";

function StudentDashboard() {
    const [profile, setProfile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");

    const [showEditProfile, setShowEditProfile] = useState(false);

    const [editName, setEditName] = useState("");
    const [editDepartment, setEditDepartment] = useState("");
    const [editYear, setEditYear] = useState("");

    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeNav, setActiveNav] = useState("profile-section");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // ==============================
    // CHECK STUDENT
    // ==============================

    useEffect(() => {
        if (!token || role !== "STUDENT") {
            window.location.href = "/";
            return;
        }

        fetchDashboardData();
    }, []);

    // ==============================
    // FETCH DASHBOARD DATA
    // ==============================

    const fetchDashboardData = async () => {
        try {
            setError("");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [
                profileResponse,
                coursesResponse,
                myCoursesResponse,
            ] = await Promise.all([
                fetch(`${API_URL}/users/profile`, {
                    headers,
                }),

                fetch(`${API_URL}/courses`, {
                    headers,
                }),

                fetch(`${API_URL}/registrations/my-courses`, {
                    headers,
                }),
            ]);

            if (!profileResponse.ok) {
                throw new Error("Failed to load profile");
            }

            if (!coursesResponse.ok) {
                throw new Error("Failed to load courses");
            }

            if (!myCoursesResponse.ok) {
                throw new Error(
                    "Failed to load registered courses"
                );
            }

            const profileData =
                await profileResponse.json();

            const coursesData =
                await coursesResponse.json();

            const myCoursesData =
                await myCoursesResponse.json();

            setProfile(profileData);
            setCourses(coursesData);
            setMyCourses(myCoursesData);

        } catch (error) {
            console.error(
                "Student dashboard error:",
                error
            );

            setError(
                error.message ||
                "Failed to load dashboard"
            );

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // EDIT PROFILE
    // ==============================

    const handleEditProfile = () => {
        setEditName(profile.name);
        setEditDepartment(profile.department);
        setEditYear(profile.year);

        setActionMessage("");
        setShowEditProfile(true);
    };

    // ==============================
    // UPDATE PROFILE
    // ==============================

    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        setUpdatingProfile(true);
        setActionMessage("");

        try {
            const response = await fetch(
                `${API_URL}/users/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        name: editName,
                        department: editDepartment,
                        year: Number(editYear),
                    }),
                }
            );

            const responseText =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText ||
                    "Failed to update profile"
                );
            }

            let updatedProfile;

            try {
                updatedProfile =
                    JSON.parse(responseText);
            } catch {
                updatedProfile = null;
            }

            if (updatedProfile) {
                setProfile(updatedProfile);
            } else {
                await fetchDashboardData();
            }

            setShowEditProfile(false);

            setActionMessage(
                "Profile updated successfully!"
            );

        } catch (error) {
            console.error(
                "Update profile error:",
                error
            );

            setActionMessage(
                error.message ||
                "Failed to update profile"
            );

        } finally {
            setUpdatingProfile(false);
        }
    };

    // ==============================
    // REGISTER COURSE
    // ==============================

    const handleRegisterCourse = async (courseId) => {
        if (actionLoading) {
            return;
        }

        try {
            setActionMessage("");
            setActionLoading(true);

            const response = await fetch(
                `${API_URL}/registrations/${courseId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const message =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    message ||
                    "Failed to register course"
                );
            }

            setActionMessage(
                "Course registered successfully!"
            );

            await fetchDashboardData();

        } catch (error) {
            console.error(
                "Register course error:",
                error
            );

            setActionMessage(
                error.message ||
                "Failed to register course"
            );

        } finally {
            setActionLoading(false);
        }
    };

    // ==============================
    // DROP COURSE
    // ==============================

    const handleDropCourse = async (registrationId) => {
        const confirmDrop =
            window.confirm(
                "Are you sure you want to drop this course?"
            );

        if (!confirmDrop) {
            return;
        }

        try {
            setActionMessage("");
            setActionLoading(true);

            const response = await fetch(
                `${API_URL}/registrations/${registrationId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const message =
                await response.text();

            if (!response.ok) {
                throw new Error(
                    message ||
                    "Failed to drop course"
                );
            }

            setActionMessage(
                "Course dropped successfully!"
            );

            await fetchDashboardData();

        } catch (error) {
            console.error(
                "Drop course error:",
                error
            );

            setActionMessage(
                error.message ||
                "Failed to drop course"
            );

        } finally {
            setActionLoading(false);
        }
    };

    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/";
    };

    // ==============================
    // SCROLL TO SECTION
    // ==============================

    const scrollToSection = (sectionId) => {
        setActiveNav(sectionId);

        const section =
            document.getElementById(sectionId);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>

                <h2>
                    Loading your dashboard...
                </h2>

                <p>
                    Please wait a moment
                </p>
            </div>
        );
    }

    // ==============================
    // ERROR
    // ==============================

    if (error) {
        return (
            <div className="dashboard-error">
                <div className="error-icon">
                    !
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button onClick={handleLogout}>
                    Back to Login
                </button>
            </div>
        );
    }

    // ==============================
    // DASHBOARD
    // ==============================

    return (
        <div className="student-dashboard">

            {/* ==============================
                HEADER
            ============================== */}

            <header className="dashboard-header">

                <div className="dashboard-brand">

                    <div className="dashboard-logo">
                        CR
                    </div>

                    <div>
                        <h1>
                            Student Dashboard
                        </h1>

                        {profile && (
                            <p>
                                Welcome back,{" "}
                                <strong>
                                    {profile.name}
                                </strong>
                            </p>
                        )}
                    </div>

                </div>

                <nav className="student-navigation">

                    <button
                        className={
                            activeNav === "profile-section"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            scrollToSection(
                                "profile-section"
                            )
                        }
                    >
                        Profile
                    </button>

                    <button
                        className={
                            activeNav ===
                            "available-courses-section"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            scrollToSection(
                                "available-courses-section"
                            )
                        }
                    >
                        Available Courses
                    </button>

                    <button
                        className={
                            activeNav ===
                            "registered-courses-section"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            scrollToSection(
                                "registered-courses-section"
                            )
                        }
                    >
                        My Courses

                        {myCourses.length > 0 && (
                            <span className="nav-badge">
                                {myCourses.length}
                            </span>
                        )}
                    </button>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </nav>

            </header>

            {/* ==============================
                MAIN CONTENT
            ============================== */}

            <main className="dashboard-content">

                {/* ==============================
                    WELCOME BANNER
                ============================== */}

                <section className="welcome-banner">

                    <div>
                        <span className="welcome-label">
                            STUDENT PORTAL
                        </span>

                        <h2>
                            Manage your courses with ease
                        </h2>

                        <p>
                            View available courses, manage your
                            registrations, and keep your profile
                            information up to date.
                        </p>
                    </div>

                    <div className="welcome-stat">
                        <strong>
                            {myCourses.length}
                        </strong>

                        <span>
                            Active Courses
                        </span>
                    </div>

                </section>

                {/* ==============================
                    ACTION MESSAGE
                ============================== */}

                {actionMessage && (
                    <div
                        className={
                            actionMessage.toLowerCase().includes(
                                "success"
                            )
                                ? "action-message success-message"
                                : "action-message error-message"
                        }
                    >
                        <span>
                            {actionMessage.toLowerCase().includes(
                                "success"
                            )
                                ? "✓"
                                : "!"}
                        </span>

                        {actionMessage}
                    </div>
                )}

                {/* ==============================
                    QUICK STATS
                ============================== */}

                <section className="dashboard-stats">

                    <div className="stat-card">

                        <div className="stat-icon">
                            👤
                        </div>

                        <div>
                            <span>
                                Department
                            </span>

                            <strong>
                                {profile?.department || "N/A"}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            🎓
                        </div>

                        <div>
                            <span>
                                Academic Year
                            </span>

                            <strong>
                                Year {profile?.year || "N/A"}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            📚
                        </div>

                        <div>
                            <span>
                                Available Courses
                            </span>

                            <strong>
                                {courses.length}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            ✓
                        </div>

                        <div>
                            <span>
                                My Registrations
                            </span>

                            <strong>
                                {myCourses.length}
                            </strong>
                        </div>

                    </div>

                </section>

                {/* ==============================
                    PROFILE
                ============================== */}

                {profile && (
                    <section
                        id="profile-section"
                        className="dashboard-section"
                    >

                        <div className="section-heading">

                            <div>

                                <span className="section-label">
                                    ACCOUNT
                                </span>

                                <h2>
                                    My Profile
                                </h2>

                                <p>
                                    Your personal and academic information
                                </p>

                            </div>

                            <button
                                className="edit-profile-button"
                                onClick={handleEditProfile}
                            >
                                Edit Profile
                            </button>

                        </div>

                        <div className="profile-card">

                            <div className="profile-avatar">
                                {profile.name
                                    ? profile.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "S"}
                            </div>

                            <div className="profile-details">

                                <div className="profile-item">

                                    <span>
                                        Full Name
                                    </span>

                                    <strong>
                                        {profile.name}
                                    </strong>

                                </div>

                                <div className="profile-item">

                                    <span>
                                        Email Address
                                    </span>

                                    <strong>
                                        {profile.email}
                                    </strong>

                                </div>

                                <div className="profile-item">

                                    <span>
                                        Department
                                    </span>

                                    <strong>
                                        {profile.department}
                                    </strong>

                                </div>

                                <div className="profile-item">

                                    <span>
                                        Academic Year
                                    </span>

                                    <strong>
                                        Year {profile.year}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </section>
                )}

                {/* ==============================
                    EDIT PROFILE
                ============================== */}

                {showEditProfile && (
                    <section className="dashboard-section">

                        <div className="edit-profile-card">

                            <div className="edit-profile-heading">

                                <div>

                                    <span className="section-label">
                                        ACCOUNT SETTINGS
                                    </span>

                                    <h2>
                                        Edit Profile
                                    </h2>

                                </div>

                                <button
                                    type="button"
                                    className="close-edit-button"
                                    onClick={() =>
                                        setShowEditProfile(false)
                                    }
                                    disabled={updatingProfile}
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                onSubmit={handleUpdateProfile}
                            >

                                <div className="edit-form-grid">

                                    <div className="edit-form-group">

                                        <label htmlFor="edit-name">
                                            Full Name
                                        </label>

                                        <input
                                            id="edit-name"
                                            type="text"
                                            value={editName}
                                            onChange={(event) =>
                                                setEditName(
                                                    event.target.value
                                                )
                                            }
                                            required
                                            disabled={updatingProfile}
                                        />

                                    </div>

                                    <div className="edit-form-group">

                                        <label htmlFor="edit-email">
                                            Email Address
                                        </label>

                                        <input
                                            id="edit-email"
                                            type="email"
                                            value={profile.email}
                                            disabled
                                        />

                                        <small>
                                            Email cannot be changed.
                                        </small>

                                    </div>

                                    <div className="edit-form-group">

                                        <label htmlFor="edit-department">
                                            Department
                                        </label>

                                        <input
                                            id="edit-department"
                                            type="text"
                                            value={editDepartment}
                                            onChange={(event) =>
                                                setEditDepartment(
                                                    event.target.value
                                                )
                                            }
                                            required
                                            disabled={updatingProfile}
                                        />

                                    </div>

                                    <div className="edit-form-group">

                                        <label htmlFor="edit-year">
                                            Academic Year
                                        </label>

                                        <select
                                            id="edit-year"
                                            value={editYear}
                                            onChange={(event) =>
                                                setEditYear(
                                                    event.target.value
                                                )
                                            }
                                            required
                                            disabled={updatingProfile}
                                        >

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

                                </div>

                                <div className="edit-profile-actions">

                                    <button
                                        type="submit"
                                        className="save-profile-button"
                                        disabled={updatingProfile}
                                    >

                                        {updatingProfile ? (
                                            <>
                                                <span className="button-spinner"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}

                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-profile-button"
                                        onClick={() =>
                                            setShowEditProfile(false)
                                        }
                                        disabled={updatingProfile}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </section>
                )}

                {/* ==============================
                    AVAILABLE COURSES
                ============================== */}

                <section
                    id="available-courses-section"
                    className="dashboard-section"
                >

                    <div className="section-heading">

                        <div>

                            <span className="section-label">
                                COURSE CATALOG
                            </span>

                            <h2>
                                Available Courses
                            </h2>

                            <p>
                                Browse and register for courses
                            </p>

                        </div>

                        <span className="course-count">
                            {courses.length}{" "}
                            {courses.length === 1
                                ? "Course"
                                : "Courses"}
                        </span>

                    </div>

                    {courses.length === 0 ? (

                        <div className="empty-message">

                            <div className="empty-icon">
                                📚
                            </div>

                            <h3>
                                No courses available
                            </h3>

                            <p>
                                There are currently no courses
                                available for registration.
                            </p>

                        </div>

                    ) : (

                        <div className="course-grid">

                            {courses.map((course) => (

                                <div
                                    className="course-card"
                                    key={course.id}
                                >

                                    <div className="course-card-top">

                                        <div className="course-code">
                                            COURSE
                                        </div>

                                        <span className="course-credits">
                                            {course.credits} Credits
                                        </span>

                                    </div>

                                    <div className="course-card-header">

                                        <h3>
                                            {course.courseName}
                                        </h3>

                                    </div>

                                    <p className="course-description">
                                        {course.description}
                                    </p>

                                    <div className="course-details">

                                        <div className="course-detail">

                                            <span className="detail-label">
                                                Department
                                            </span>

                                            <strong>
                                                {course.department}
                                            </strong>

                                        </div>

                                        <div className="course-detail">

                                            <span className="detail-label">
                                                Capacity
                                            </span>

                                            <strong>
                                                {course.capacity} Seats
                                            </strong>

                                        </div>

                                    </div>

                                    <button
                                        className="register-button"
                                        onClick={() =>
                                            handleRegisterCourse(
                                                course.id
                                            )
                                        }
                                        disabled={actionLoading}
                                    >

                                        {actionLoading ? (
                                            <>
                                                <span className="button-spinner"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            "Register Course"
                                        )}

                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

                {/* ==============================
                    MY COURSES
                ============================== */}

                <section
                    id="registered-courses-section"
                    className="dashboard-section"
                >

                    <div className="section-heading">

                        <div>

                            <span className="section-label">
                                ENROLLMENT
                            </span>

                            <h2>
                                My Registered Courses
                            </h2>

                            <p>
                                Courses you are currently enrolled in
                            </p>

                        </div>

                        <span className="course-count registered-count">
                            {myCourses.length}{" "}
                            {myCourses.length === 1
                                ? "Course"
                                : "Courses"}
                        </span>

                    </div>

                    {myCourses.length === 0 ? (

                        <div className="empty-message">

                            <div className="empty-icon">
                                ✓
                            </div>

                            <h3>
                                No registered courses
                            </h3>

                            <p>
                                You haven't registered for any
                                courses yet. Browse the available
                                courses above to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="course-grid">

                            {myCourses.map(
                                (registration) => (

                                    <div
                                        className="course-card registered"
                                        key={registration.id}
                                    >

                                        <div className="course-card-top">

                                            <div className="course-code registered-code">
                                                ENROLLED
                                            </div>

                                            <span className="registration-status">
                                                ACTIVE
                                            </span>

                                        </div>

                                        <div className="course-card-header">

                                            <h3>
                                                {registration.courseName}
                                            </h3>

                                        </div>

                                        <div className="registration-info">

                                            <div className="registration-row">

                                                <span>
                                                    Registration ID
                                                </span>

                                                <strong>
                                                    #{registration.id}
                                                </strong>

                                            </div>

                                            <div className="registration-row">

                                                <span>
                                                    Registered On
                                                </span>

                                                <strong>
                                                    {registration.registeredAt
                                                        ? new Date(
                                                            registration.registeredAt
                                                        ).toLocaleString()
                                                        : "N/A"}
                                                </strong>

                                            </div>

                                        </div>

                                        <button
                                            className="drop-button"
                                            onClick={() =>
                                                handleDropCourse(
                                                    registration.id
                                                )
                                            }
                                            disabled={actionLoading}
                                        >

                                            {actionLoading ? (
                                                <>
                                                    <span className="button-spinner"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                "Drop Course"
                                            )}

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default StudentDashboard;