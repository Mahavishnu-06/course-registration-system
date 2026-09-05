import { useEffect, useState } from "react";
import "./AdminRegistrations.css";
import API_URL from "./api";

function AdminRegistrations() {

    const [courses, setCourses] = useState([]);
    const [registrations, setRegistrations] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState("");

    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingRegistrations, setLoadingRegistrations] =
        useState(false);

    const [error, setError] = useState("");
    const [registrationError, setRegistrationError] =
        useState("");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");


    // ==========================================
    // CHECK ADMIN
    // ==========================================

    useEffect(() => {

        if (!token || role !== "ADMIN") {

            window.location.href = "/";
            return;

        }

        fetchCourses();

    }, []);


    // ==========================================
    // FETCH COURSES
    // ==========================================

    const fetchCourses = async () => {

        try {

            setLoadingCourses(true);
            setError("");

            const response = await fetch(
                `${API_URL}/courses`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                const responseText =
                    await response.text();

                throw new Error(
                    responseText ||
                    "Failed to load courses"
                );

            }


            const data =
                await response.json();

            setCourses(data);


        } catch (error) {

            console.error(
                "Fetch courses error:",
                error
            );

            setError(error.message);

        } finally {

            setLoadingCourses(false);

        }

    };


    // ==========================================
    // FETCH COURSE REGISTRATIONS
    // ==========================================

    const fetchRegistrations = async (courseId) => {

        if (!courseId) {

            setRegistrations([]);
            return;

        }


        try {

            setLoadingRegistrations(true);
            setRegistrationError("");

            const response = await fetch(
                `${API_URL}/registrations/course/${courseId}`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                const responseText =
                    await response.text();

                throw new Error(
                    responseText ||
                    "Failed to load course registrations"
                );

            }


            const data =
                await response.json();

            setRegistrations(data);


        } catch (error) {

            console.error(
                "Fetch registrations error:",
                error
            );

            setRegistrationError(
                error.message
            );

            setRegistrations([]);

        } finally {

            setLoadingRegistrations(false);

        }

    };


    // ==========================================
    // COURSE SELECTION
    // ==========================================

    const handleCourseChange = (event) => {

        const courseId =
            event.target.value;

        setSelectedCourseId(courseId);

        setRegistrationError("");

        fetchRegistrations(courseId);

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/";

    };


    // ==========================================
    // LOADING COURSES
    // ==========================================

    if (loadingCourses) {

        return (
            <div className="admin-registrations-loading">

                <h2>
                    Loading courses...
                </h2>

            </div>
        );

    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (
        <div className="admin-registrations-page">


            {/* ======================================
                HEADER
            ====================================== */}

            <header className="admin-registrations-header">

                <div>

                    <h1>
                        Course Registrations
                    </h1>

                    <p>
                        View students registered for each course
                    </p>

                </div>


                <div className="admin-registrations-header-actions">

                    <button
                        className="registrations-dashboard-button"
                        onClick={() =>
                            (window.location.href =
                                "/admin-dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        className="registrations-courses-button"
                        onClick={() =>
                            (window.location.href =
                                "/admin-courses")
                        }
                    >
                        Courses
                    </button>


                    <button
                        className="registrations-students-button"
                        onClick={() =>
                            (window.location.href =
                                "/admin-students")
                        }
                    >
                        Students
                    </button>


                    <button
                        className="registrations-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <main className="admin-registrations-content">


                {/* ======================================
                    ERROR
                ====================================== */}

                {error && (

                    <div className="registrations-error">
                        {error}
                    </div>

                )}


                {/* ======================================
                    COURSE SELECTION
                ====================================== */}

                <section className="course-selection-section">

                    <h2>
                        Select a Course
                    </h2>


                    <div className="course-selection-card">

                        <label htmlFor="course-select">
                            Course
                        </label>


                        <select
                            id="course-select"
                            value={selectedCourseId}
                            onChange={handleCourseChange}
                        >

                            <option value="">
                                Select a course
                            </option>


                            {courses.map((course) => (

                                <option
                                    key={course.id}
                                    value={course.id}
                                >
                                    {course.courseName}
                                </option>

                            ))}

                        </select>

                    </div>

                </section>


                {/* ======================================
                    REGISTRATION LIST
                ====================================== */}

                {selectedCourseId && (

                    <section className="registrations-list-section">


                        <div className="registrations-heading">

                            <div>

                                <h2>
                                    Registered Students
                                </h2>

                                <span>
                                    {registrations.length} registration
                                    {registrations.length !== 1
                                        ? "s"
                                        : ""}
                                </span>

                            </div>


                            <button
                                className="refresh-registrations-button"
                                onClick={() =>
                                    fetchRegistrations(
                                        selectedCourseId
                                    )
                                }
                            >
                                Refresh
                            </button>

                        </div>


                        {/* ==================================
                            LOADING
                        ================================== */}

                        {loadingRegistrations ? (

                            <div className="registrations-loading">

                                <h3>
                                    Loading registrations...
                                </h3>

                            </div>

                        ) : registrationError ? (

                            <div className="registration-error-message">

                                {registrationError}

                            </div>

                        ) : registrations.length === 0 ? (

                            <div className="no-registrations-message">

                                <h3>
                                    No students registered
                                </h3>

                                <p>
                                    No students have registered for
                                    this course yet.
                                </p>

                            </div>

                        ) : (

                            <div className="registrations-table-container">

                                <table className="registrations-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            Registration ID
                                        </th>

                                        <th>
                                            Student ID
                                        </th>

                                        <th>
                                            Course
                                        </th>

                                        <th>
                                            Registered At
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {registrations.map(
                                        (registration) => (

                                            <tr
                                                key={registration.id}
                                            >

                                                <td>
                                                    {registration.id}
                                                </td>

                                                <td>
                                                    {registration.userId}
                                                </td>

                                                <td>
                                                    {registration.courseName}
                                                </td>

                                                <td>

                                                    {registration.registeredAt
                                                        ? new Date(
                                                            registration.registeredAt
                                                        ).toLocaleString()
                                                        : "N/A"}

                                                </td>

                                                <td>

                                                        <span
                                                            className={
                                                                registration.status ===
                                                                "ACTIVE"
                                                                    ? "registration-active"
                                                                    : "registration-dropped"
                                                            }
                                                        >
                                                            {registration.status}
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

                )}

            </main>

        </div>
    );
}


export default AdminRegistrations;