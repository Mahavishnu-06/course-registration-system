import { useEffect, useState } from "react";
import "./AdminStudents.css";
import API_URL from "./api";

function AdminStudents() {

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [error, setError] = useState("");
    const [detailsError, setDetailsError] = useState("");

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

        fetchStudents();

    }, []);


    // ==========================================
    // FETCH ALL STUDENTS
    // ==========================================

    const fetchStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/users/students`,
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
                    "Failed to load students"
                );

            }


            const data =
                await response.json();

            setStudents(data);


        } catch (error) {

            console.error(
                "Fetch students error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // VIEW STUDENT DETAILS
    // ==========================================

    const handleViewDetails = async (studentId) => {

        try {

            setDetailsLoading(true);
            setDetailsError("");
            setSelectedStudent(null);


            const response = await fetch(
                `${API_URL}/users/students/${studentId}`,
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
                    "Failed to load student details"
                );

            }


            const data =
                await response.json();

            setSelectedStudent(data);


        } catch (error) {

            console.error(
                "Student details error:",
                error
            );

            setDetailsError(error.message);

        } finally {

            setDetailsLoading(false);

        }

    };


    // ==========================================
    // CLOSE DETAILS
    // ==========================================

    const handleCloseDetails = () => {

        setSelectedStudent(null);
        setDetailsError("");

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
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-students-loading">

                <h2>
                    Loading students...
                </h2>

            </div>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="admin-students-page">


            {/* ======================================
                HEADER
            ====================================== */}

            <header className="admin-students-header">

                <div>

                    <h1>
                        Student Management
                    </h1>

                    <p>
                        View and manage registered students
                    </p>

                </div>


                <div className="admin-students-header-actions">

                    <button
                        className="students-dashboard-button"
                        onClick={() =>
                            (window.location.href =
                                "/admin-dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        className="students-courses-button"
                        onClick={() =>
                            (window.location.href =
                                "/admin-courses")
                        }
                    >
                        Courses
                    </button>


                    <button
                        className="students-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <main className="admin-students-content">


                {/* ====================================
                    ERROR
                ==================================== */}

                {error && (

                    <div className="students-error-message">
                        {error}
                    </div>

                )}


                {/* ====================================
                    STUDENT LIST
                ==================================== */}

                <section className="students-list-section">


                    <div className="students-list-heading">

                        <div>

                            <h2>
                                All Students
                            </h2>

                            <span>
                                {students.length} student
                                {students.length !== 1
                                    ? "s"
                                    : ""}
                            </span>

                        </div>


                        <button
                            className="refresh-students-button"
                            onClick={fetchStudents}
                        >
                            Refresh
                        </button>

                    </div>


                    {students.length === 0 ? (

                        <div className="no-students-message">

                            <h3>
                                No students found
                            </h3>

                            <p>
                                There are no registered students
                                in the system.
                            </p>

                        </div>

                    ) : (

                        <div className="students-table-container">

                            <table className="students-table">

                                <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Year
                                    </th>

                                    <th>
                                        Verification
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {students.map(
                                    (student) => (

                                        <tr
                                            key={student.id}
                                        >

                                            <td>
                                                {student.id}
                                            </td>

                                            <td>
                                                <strong>
                                                    {student.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {student.email}
                                            </td>

                                            <td>
                                                {student.department}
                                            </td>

                                            <td>
                                                {student.year}
                                            </td>

                                            <td>

                                                    <span
                                                        className={
                                                            student.emailVerified
                                                                ? "student-verified"
                                                                : "student-unverified"
                                                        }
                                                    >

                                                        {student.emailVerified
                                                            ? "VERIFIED"
                                                            : "NOT VERIFIED"}

                                                    </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="view-student-button"
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            student.id
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </button>

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


            {/* ======================================
                STUDENT DETAILS MODAL
            ====================================== */}

            {(detailsLoading ||
                selectedStudent ||
                detailsError) && (

                <div className="student-modal-overlay">


                    <div className="student-modal">


                        {detailsLoading && (

                            <div className="student-details-loading">

                                <h2>
                                    Loading student details...
                                </h2>

                            </div>

                        )}


                        {!detailsLoading &&
                            detailsError && (

                                <div className="student-details-error">

                                    <h2>
                                        Unable to load details
                                    </h2>

                                    <p>
                                        {detailsError}
                                    </p>

                                    <button
                                        onClick={handleCloseDetails}
                                    >
                                        Close
                                    </button>

                                </div>

                            )}


                        {!detailsLoading &&
                            !detailsError &&
                            selectedStudent && (

                                <>

                                    <div className="student-modal-header">

                                        <div>

                                            <h2>
                                                Student Details
                                            </h2>

                                            <p>
                                                Student ID:{" "}
                                                {selectedStudent.id}
                                            </p>

                                        </div>


                                        <button
                                            className="close-modal-button"
                                            onClick={handleCloseDetails}
                                        >
                                            ×
                                        </button>

                                    </div>


                                    <div className="student-details-grid">


                                        <div className="student-detail-item">

                                            <span>
                                                Name
                                            </span>

                                            <strong>
                                                {selectedStudent.name}
                                            </strong>

                                        </div>


                                        <div className="student-detail-item">

                                            <span>
                                                Email
                                            </span>

                                            <strong>
                                                {selectedStudent.email}
                                            </strong>

                                        </div>


                                        <div className="student-detail-item">

                                            <span>
                                                Department
                                            </span>

                                            <strong>
                                                {selectedStudent.department}
                                            </strong>

                                        </div>


                                        <div className="student-detail-item">

                                            <span>
                                                Year
                                            </span>

                                            <strong>
                                                {selectedStudent.year}
                                            </strong>

                                        </div>


                                        <div className="student-detail-item">

                                            <span>
                                                Role
                                            </span>

                                            <strong>
                                                {selectedStudent.role}
                                            </strong>

                                        </div>


                                        <div className="student-detail-item">

                                            <span>
                                                Email Verification
                                            </span>

                                            <strong>

                                                {selectedStudent.emailVerified
                                                    ? "Verified"
                                                    : "Not Verified"}

                                            </strong>

                                        </div>


                                    </div>


                                    <div className="student-modal-footer">

                                        <button
                                            className="close-details-button"
                                            onClick={handleCloseDetails}
                                        >
                                            Close
                                        </button>

                                    </div>

                                </>

                            )}


                    </div>

                </div>

            )}

        </div>
    );
}


export default AdminStudents;