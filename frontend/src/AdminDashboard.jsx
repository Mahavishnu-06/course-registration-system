import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import API_URL from "./api";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [courseStats, setCourseStats] = useState([]);
    const [popularCourse, setPopularCourse] = useState(null);
    const [recentStudents, setRecentStudents] = useState([]);
    const [recentRegistrations, setRecentRegistrations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");


    // ==============================
    // CHECK ADMIN
    // ==============================

    useEffect(() => {

        if (!token || role !== "ADMIN") {
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


            // ==========================================
            // REQUEST WITH 10 SECOND TIMEOUT
            // ==========================================

            const fetchWithTimeout = async (url) => {

                const controller = new AbortController();

                const timeout = setTimeout(() => {
                    controller.abort();
                }, 10000);

                try {

                    const response = await fetch(url, {
                        method: "GET",
                        headers,
                        signal: controller.signal,
                    });

                    return response;

                } finally {

                    clearTimeout(timeout);

                }
            };


            // ==========================================
            // FETCH ALL DASHBOARD APIs
            // ==========================================

            const results = await Promise.allSettled([

                fetchWithTimeout(
                    `${API_URL}/users/admin/dashboard`
                ),

                fetchWithTimeout(
                    `${API_URL}/users/admin/dashboard/courses`
                ),

                fetchWithTimeout(
                    `${API_URL}/users/admin/dashboard/most-popular-course`
                ),

                fetchWithTimeout(
                    `${API_URL}/users/admin/dashboard/recent-students`
                ),

                fetchWithTimeout(
                    `${API_URL}/users/admin/dashboard/recent-registrations`
                ),

            ]);


            const [
                dashboardResult,
                courseStatsResult,
                popularCourseResult,
                recentStudentsResult,
                recentRegistrationsResult,
            ] = results;


            // ==========================================
            // DASHBOARD STATISTICS
            // ==========================================

            if (
                dashboardResult.status === "fulfilled" &&
                dashboardResult.value.ok
            ) {

                const data =
                    await dashboardResult.value.json();

                setDashboard(data);

            } else {

                console.error(
                    "Dashboard statistics failed:",
                    dashboardResult
                );

                setDashboard({
                    totalStudents: 0,
                    totalCourses: 0,
                    totalRegistrations: 0,
                    verifiedStudents: 0,
                    unverifiedStudents: 0,
                });

            }


            // ==========================================
            // COURSE STATISTICS
            // ==========================================

            if (
                courseStatsResult.status === "fulfilled" &&
                courseStatsResult.value.ok
            ) {

                const data =
                    await courseStatsResult.value.json();

                setCourseStats(data);

            } else {

                console.error(
                    "Course statistics failed:",
                    courseStatsResult
                );

                setCourseStats([]);

            }


            // ==========================================
            // MOST POPULAR COURSE
            // ==========================================

            if (
                popularCourseResult.status === "fulfilled" &&
                popularCourseResult.value.ok
            ) {

                const data =
                    await popularCourseResult.value.json();

                setPopularCourse(data);

            } else {

                console.error(
                    "Popular course failed:",
                    popularCourseResult
                );

                setPopularCourse(null);

            }


            // ==========================================
            // RECENT STUDENTS
            // ==========================================

            if (
                recentStudentsResult.status === "fulfilled" &&
                recentStudentsResult.value.ok
            ) {

                const data =
                    await recentStudentsResult.value.json();

                setRecentStudents(data);

            } else {

                console.error(
                    "Recent students failed:",
                    recentStudentsResult
                );

                setRecentStudents([]);

            }


            // ==========================================
            // RECENT REGISTRATIONS
            // ==========================================

            if (
                recentRegistrationsResult.status === "fulfilled" &&
                recentRegistrationsResult.value.ok
            ) {

                const data =
                    await recentRegistrationsResult.value.json();

                setRecentRegistrations(data);

            } else {

                console.error(
                    "Recent registrations failed:",
                    recentRegistrationsResult
                );

                setRecentRegistrations([]);

            }


        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );

            if (error.name === "AbortError") {

                setError(
                    "Dashboard request timed out. Please check whether the backend is running."
                );

            } else {

                setError(
                    error.message ||
                    "Failed to load admin dashboard"
                );

            }

        } finally {

            // IMPORTANT:
            // Always stop the loading screen

            setLoading(false);

        }

    };


    // ==============================
    // REFRESH
    // ==============================

    const handleRefresh = async () => {

        if (refreshing) {
            return;
        }

        try {

            setRefreshing(true);

            await fetchDashboardData();

        } finally {

            setRefreshing(false);

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
    // NAVIGATION
    // ==============================

    const handleManageCourses = () => {

        window.location.href =
            "/admin-courses";

    };


    const handleManageStudents = () => {

        window.location.href =
            "/admin-students";

    };


    const handleCourseRegistrations = () => {

        window.location.href =
            "/admin-registrations";

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="admin-loading">

                <div className="admin-loading-spinner"></div>

                <h2>
                    Loading admin dashboard...
                </h2>

                <p>
                    Fetching the latest system information
                </p>

            </div>

        );

    }


    // ==============================
    // ERROR
    // ==============================

    if (error) {

        return (

            <div className="admin-error">

                <div className="admin-error-icon">
                    !
                </div>

                <h2>
                    Unable to load dashboard
                </h2>

                <p>
                    {error}
                </p>

                <div className="admin-error-actions">

                    <button
                        onClick={() => {
                            setError("");
                            setLoading(true);
                            fetchDashboardData();
                        }}
                    >
                        Try Again
                    </button>

                    <button
                        className="admin-error-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        );

    }


    // ==============================
    // ADMIN DASHBOARD
    // ==============================

    return (

        <div className="admin-dashboard">


            {/* ==============================
                HEADER
            ============================== */}

            <header className="admin-header">

                <div className="admin-brand">

                    <div className="admin-logo">
                        CR
                    </div>

                    <div>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Course Registration Management
                        </p>

                    </div>

                </div>


                <div className="admin-header-actions">

                    <button
                        className="manage-courses-button"
                        onClick={handleManageCourses}
                    >
                        <span>▦</span>
                        Manage Courses
                    </button>


                    <button
                        className="manage-students-button"
                        onClick={handleManageStudents}
                    >
                        <span>♙</span>
                        Manage Students
                    </button>


                    <button
                        className="manage-registrations-button"
                        onClick={handleCourseRegistrations}
                    >
                        <span>▤</span>
                        Registrations
                    </button>


                    <button
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ==============================
                CONTENT
            ============================== */}

            <main className="admin-content">


                {/* ==============================
                    WELCOME
                ============================== */}

                <section className="admin-welcome">

                    <div>

                        <span className="admin-eyebrow">
                            ADMINISTRATION PORTAL
                        </span>

                        <h2>
                            System Overview
                        </h2>

                        <p>
                            Monitor students, courses, registrations,
                            and overall course availability.
                        </p>

                    </div>


                    <button
                        className="dashboard-refresh-button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >

                        {refreshing ? (

                            <>
                                <span className="small-spinner"></span>
                                Refreshing...
                            </>

                        ) : (

                            <>
                                ↻ Refresh Data
                            </>

                        )}

                    </button>

                </section>


                {/* ==============================
                    STATISTICS
                ============================== */}

                <section className="admin-section">

                    <div className="section-title">

                        <div>

                            <span>
                                OVERVIEW
                            </span>

                            <h2>
                                Key Statistics
                            </h2>

                        </div>

                    </div>


                    <div className="stats-grid">


                        {/* Students */}

                        <div className="stat-card students-stat">

                            <div className="stat-icon">
                                ♙
                            </div>

                            <div>

                                <span className="stat-label">
                                    Total Students
                                </span>

                                <strong className="stat-value">
                                    {dashboard?.totalStudents ?? 0}
                                </strong>

                            </div>

                        </div>


                        {/* Courses */}

                        <div className="stat-card courses-stat">

                            <div className="stat-icon">
                                ▦
                            </div>

                            <div>

                                <span className="stat-label">
                                    Total Courses
                                </span>

                                <strong className="stat-value">
                                    {dashboard?.totalCourses ?? 0}
                                </strong>

                            </div>

                        </div>


                        {/* Registrations */}

                        <div className="stat-card registrations-stat">

                            <div className="stat-icon">
                                ✓
                            </div>

                            <div>

                                <span className="stat-label">
                                    Active Registrations
                                </span>

                                <strong className="stat-value">
                                    {dashboard?.totalRegistrations ?? 0}
                                </strong>

                            </div>

                        </div>


                        {/* Verified */}

                        <div className="stat-card verified-stat">

                            <div className="stat-icon">
                                ✓
                            </div>

                            <div>

                                <span className="stat-label">
                                    Verified Students
                                </span>

                                <strong className="stat-value">
                                    {dashboard?.verifiedStudents ?? 0}
                                </strong>

                            </div>

                        </div>


                        {/* Unverified */}

                        <div className="stat-card unverified-stat">

                            <div className="stat-icon">
                                !
                            </div>

                            <div>

                                <span className="stat-label">
                                    Unverified Students
                                </span>

                                <strong className="stat-value">
                                    {dashboard?.unverifiedStudents ?? 0}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ==============================
                    POPULAR COURSE
                ============================== */}

                <section className="admin-section">

                    <div className="section-title">

                        <div>

                            <span>
                                INSIGHT
                            </span>

                            <h2>
                                Most Popular Course
                            </h2>

                        </div>

                    </div>


                    {popularCourse ? (

                        <div className="popular-course-card">

                            <div className="popular-course-icon">
                                ★
                            </div>

                            <div className="popular-course-content">

                                <span>
                                    MOST REGISTERED COURSE
                                </span>

                                <h3>
                                    {popularCourse.courseName}
                                </h3>

                                <p>

                                    Currently has{" "}

                                    <strong>
                                        {popularCourse.registeredStudents ?? 0}
                                    </strong>{" "}

                                    registered student

                                    {(popularCourse.registeredStudents ?? 0) !== 1
                                        ? "s"
                                        : ""}

                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="empty-admin-message">
                            No course registration data available.
                        </div>

                    )}

                </section>


                {/* ==============================
                    COURSE STATISTICS
                ============================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <span>
                                COURSE MANAGEMENT
                            </span>

                            <h2>
                                Course Registration Statistics
                            </h2>

                            <p>
                                Monitor enrollment and available capacity
                            </p>

                        </div>

                    </div>


                    {courseStats.length === 0 ? (

                        <div className="empty-admin-message">
                            No course statistics available.
                        </div>

                    ) : (

                        <div className="table-container">

                            <table className="admin-table">

                                <thead>

                                <tr>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Registered
                                    </th>

                                    <th>
                                        Capacity
                                    </th>

                                    <th>
                                        Available Seats
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {courseStats.map(
                                    (course) => (

                                        <tr
                                            key={course.courseId}
                                        >

                                            <td>

                                                <div className="course-table-name">

                                                    <strong>
                                                        {course.courseName}
                                                    </strong>

                                                </div>

                                            </td>

                                            <td>
                                                {course.registeredStudents}
                                            </td>

                                            <td>
                                                {course.capacity}
                                            </td>

                                            <td>

                                                <strong>
                                                    {course.availableSeats}
                                                </strong>

                                            </td>

                                            <td>

                                                    <span
                                                        className={
                                                            course.status === "FULL"
                                                                ? "status-full"
                                                                : "status-available"
                                                        }
                                                    >

                                                        {course.status === "FULL"
                                                            ? "FULL"
                                                            : "AVAILABLE"}

                                                    </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* ==============================
                    RECENT STUDENTS
                ============================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <span>
                                RECENT ACTIVITY
                            </span>

                            <h2>
                                Recent Student Registrations
                            </h2>

                            <p>
                                Students who recently registered for courses
                            </p>

                        </div>

                    </div>


                    {recentStudents.length === 0 ? (

                        <div className="empty-admin-message">
                            No recent student registrations found.
                        </div>

                    ) : (

                        <div className="table-container">

                            <table className="admin-table">

                                <thead>

                                <tr>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Registered At
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {recentStudents.map(
                                    (student) => (

                                        <tr
                                            key={student.registrationId}
                                        >

                                            <td>

                                                <div className="student-table-name">

                                                    <div className="student-avatar">

                                                        {student.studentName
                                                            ? student.studentName
                                                                .charAt(0)
                                                                .toUpperCase()
                                                            : "S"}

                                                    </div>

                                                    <strong>
                                                        {student.studentName}
                                                    </strong>

                                                </div>

                                            </td>

                                            <td>
                                                {student.studentEmail}
                                            </td>

                                            <td>
                                                {student.courseName}
                                            </td>

                                            <td>

                                                {student.registeredAt
                                                    ? new Date(
                                                        student.registeredAt
                                                    ).toLocaleString()
                                                    : "N/A"}

                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* ==============================
                    RECENT REGISTRATIONS
                ============================== */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>

                            <span>
                                REGISTRATION ACTIVITY
                            </span>

                            <h2>
                                Recent Registrations
                            </h2>

                            <p>
                                Latest course registration activity
                            </p>

                        </div>

                    </div>


                    {recentRegistrations.length === 0 ? (

                        <div className="empty-admin-message">
                            No recent registrations found.
                        </div>

                    ) : (

                        <div className="table-container">

                            <table className="admin-table">

                                <thead>

                                <tr>

                                    <th>
                                        Registration ID
                                    </th>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Registered At
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {recentRegistrations.map(
                                    (registration) => (

                                        <tr
                                            key={registration.id}
                                        >

                                            <td>

                                                <strong>
                                                    #{registration.id}
                                                </strong>

                                            </td>

                                            <td>
                                                {registration.courseName}
                                            </td>

                                            <td>

                                                    <span
                                                        className={
                                                            registration.status ===
                                                            "DROPPED"
                                                                ? "status-dropped"
                                                                : "status-available"
                                                        }
                                                    >

                                                        {registration.status}

                                                    </span>

                                            </td>

                                            <td>

                                                {registration.registeredAt
                                                    ? new Date(
                                                        registration.registeredAt
                                                    ).toLocaleString()
                                                    : "N/A"}

                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


            </main>

        </div>

    );

}

export default AdminDashboard;