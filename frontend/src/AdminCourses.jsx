import { useEffect, useState } from "react";
import "./AdminCourses.css";
import API_URL from "./api";

function AdminCourses() {

    const [courses, setCourses] = useState([]);

    const [courseName, setCourseName] = useState("");
    const [description, setDescription] = useState("");
    const [department, setDepartment] = useState("");
    const [credits, setCredits] = useState("");
    const [capacity, setCapacity] = useState("");

    const [editingCourseId, setEditingCourseId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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

            setLoading(true);
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

            setLoading(false);

        }

    };


    // ==========================================
    // CLEAR FORM
    // ==========================================

    const clearForm = () => {

        setCourseName("");
        setDescription("");
        setDepartment("");
        setCredits("");
        setCapacity("");

        setEditingCourseId(null);

    };


    // ==========================================
    // ADD / UPDATE COURSE
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setSaving(true);


        const courseData = {

            courseName: courseName,
            description: description,
            department: department,
            credits: Number(credits),
            capacity: Number(capacity),

        };


        try {

            let response;


            if (editingCourseId) {

                response = await fetch(
                    `${API_URL}/courses/${editingCourseId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },

                        body: JSON.stringify(courseData),
                    }
                );

            } else {

                response = await fetch(
                    `${API_URL}/courses`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },

                        body: JSON.stringify(courseData),
                    }
                );

            }


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to save course"
                );

            }


            if (editingCourseId) {

                setMessage(
                    "Course updated successfully!"
                );

            } else {

                setMessage(
                    "Course added successfully!"
                );

            }


            clearForm();

            await fetchCourses();


        } catch (error) {

            console.error(
                "Save course error:",
                error
            );

            setError(error.message);

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // EDIT COURSE
    // ==========================================

    const handleEdit = (course) => {

        setCourseName(course.courseName);
        setDescription(course.description);
        setDepartment(course.department);
        setCredits(course.credits);
        setCapacity(course.capacity);

        setEditingCourseId(course.id);

        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // ==========================================
    // DELETE COURSE
    // ==========================================

    const handleDelete = async (courseId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this course?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setMessage("");


            const response = await fetch(
                `${API_URL}/courses/${courseId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to delete course"
                );

            }


            setMessage(
                "Course deleted successfully!"
            );


            await fetchCourses();


        } catch (error) {

            console.error(
                "Delete course error:",
                error
            );

            setError(error.message);

        }

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
            <div className="admin-courses-loading">

                <h2>
                    Loading courses...
                </h2>

            </div>
        );

    }


    return (
        <div className="admin-courses-page">


            {/* ======================================
                HEADER
            ====================================== */}

            <header className="admin-courses-header">

                <div>

                    <h1>
                        Course Management
                    </h1>

                    <p>
                        Add, update and delete courses
                    </p>

                </div>


                <div className="admin-courses-header-actions">


                    <button
                        className="courses-dashboard-button"
                        onClick={() =>
                            (window.location.href =
                                "/admin-dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        className="courses-students-button"
                        onClick={() =>
                            (window.location.href =
                                "/admin-students")
                        }
                    >
                        Students
                    </button>


                    <button
                        className="courses-registrations-button"
                        onClick={() =>
                            (window.location.href =
                                "/admin-registrations")
                        }
                    >
                        Registrations
                    </button>


                    <button
                        className="courses-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <main className="admin-courses-content">


                {/* ======================================
                    MESSAGES
                ====================================== */}

                {error && (

                    <div className="course-error-message">
                        {error}
                    </div>

                )}


                {message && (

                    <div className="course-success-message">
                        {message}
                    </div>

                )}


                {/* ======================================
                    ADD / EDIT COURSE
                ====================================== */}

                <section className="course-form-section">

                    <h2>
                        {editingCourseId
                            ? "Edit Course"
                            : "Add New Course"}
                    </h2>


                    <form
                        className="course-form"
                        onSubmit={handleSubmit}
                    >


                        <div className="course-form-group">

                            <label htmlFor="course-name">
                                Course Name
                            </label>

                            <input
                                id="course-name"
                                type="text"
                                placeholder="Enter course name"
                                value={courseName}
                                onChange={(event) =>
                                    setCourseName(
                                        event.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="course-form-group">

                            <label htmlFor="course-description">
                                Description
                            </label>

                            <textarea
                                id="course-description"
                                placeholder="Enter course description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="course-form-row">


                            <div className="course-form-group">

                                <label htmlFor="course-department">
                                    Department
                                </label>

                                <input
                                    id="course-department"
                                    type="text"
                                    placeholder="Example: CSE"
                                    value={department}
                                    onChange={(event) =>
                                        setDepartment(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="course-form-group">

                                <label htmlFor="course-credits">
                                    Credits
                                </label>

                                <input
                                    id="course-credits"
                                    type="number"
                                    min="1"
                                    value={credits}
                                    onChange={(event) =>
                                        setCredits(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="course-form-group">

                                <label htmlFor="course-capacity">
                                    Capacity
                                </label>

                                <input
                                    id="course-capacity"
                                    type="number"
                                    min="1"
                                    value={capacity}
                                    onChange={(event) =>
                                        setCapacity(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="course-form-actions">

                            <button
                                type="submit"
                                className="save-course-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingCourseId
                                        ? "Update Course"
                                        : "Add Course"}
                            </button>


                            {editingCourseId && (

                                <button
                                    type="button"
                                    className="cancel-course-button"
                                    onClick={clearForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>

                </section>


                {/* ======================================
                    COURSE LIST
                ====================================== */}

                <section className="course-list-section">


                    <div className="course-list-heading">

                        <div>

                            <h2>
                                All Courses
                            </h2>

                            <span>
                                {courses.length} course
                                {courses.length !== 1
                                    ? "s"
                                    : ""}
                            </span>

                        </div>


                        <button
                            className="refresh-courses-button"
                            onClick={fetchCourses}
                        >
                            Refresh
                        </button>

                    </div>


                    {courses.length === 0 ? (

                        <div className="no-courses-message">

                            <h3>
                                No courses found
                            </h3>

                            <p>
                                Add a course using the form above.
                            </p>

                        </div>

                    ) : (

                        <div className="courses-table-container">

                            <table className="courses-table">

                                <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Course Name
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Credits
                                    </th>

                                    <th>
                                        Capacity
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {courses.map(
                                    (course) => (

                                        <tr
                                            key={course.id}
                                        >

                                            <td>
                                                {course.id}
                                            </td>

                                            <td>
                                                <strong>
                                                    {course.courseName}
                                                </strong>
                                            </td>

                                            <td>
                                                {course.department}
                                            </td>

                                            <td>
                                                {course.credits}
                                            </td>

                                            <td>
                                                {course.capacity}
                                            </td>

                                            <td>

                                                <div className="course-action-buttons">

                                                    <button
                                                        className="edit-course-button"
                                                        onClick={() =>
                                                            handleEdit(course)
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="delete-course-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                course.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

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


export default AdminCourses;