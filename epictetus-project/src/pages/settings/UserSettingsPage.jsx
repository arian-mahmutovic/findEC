import "./UserSettingsPage.css";

export default function UserSettingsPage() {

    return (

        <main className="settings-page">


            {/* HEADER */}

            <section className="settings-header">

                <h1>
                    Account Settings
                </h1>

                <p>
                    Manage your profile, preferences, and competition recommendations.
                </p>

            </section>



            {/* MAIN SETTINGS */}

            <section className="settings-container">



                {/* PROFILE */}

                <div className="settings-card">

                    <h2>
                        Profile Information
                    </h2>


                    <div className="profile-preview">

                        <div className="profile-avatar">
                            AM
                        </div>


                        <div>

                            <h3>
                                Alex Morgan
                            </h3>

                            <p>
                                High School Student
                            </p>

                        </div>

                    </div>



                    <label>
                        Full Name
                    </label>

                    <input
                        value="Alex Morgan"
                        readOnly
                    />



                    <label>
                        School
                    </label>

                    <input
                        value="Atlantic Coast High School"
                        readOnly
                    />



                    <label>
                        Grade Level
                    </label>

                    <select defaultValue="10">

                        <option value="9">
                            9th Grade
                        </option>

                        <option value="10">
                            10th Grade
                        </option>

                        <option value="11">
                            11th Grade
                        </option>

                        <option value="12">
                            12th Grade
                        </option>

                    </select>


                </div>




                {/* INTERESTS */}

                <div className="settings-card">


                    <h2>
                        Competition Interests
                    </h2>


                    <p className="settings-description">
                        These preferences help personalize your recommendations.
                    </p>



                    <div className="interest-grid">


                        <button className="interest-active">
                            Finance
                        </button>

                        <button className="interest-active">
                            Entrepreneurship
                        </button>

                        <button>
                            STEM
                        </button>

                        <button>
                            Writing
                        </button>

                        <button>
                            Research
                        </button>

                        <button>
                            Mathematics
                        </button>


                    </div>


                </div>





                {/* GOALS */}

                <div className="settings-card">


                    <h2>
                        Goals
                    </h2>


                    <div className="checkbox-list">


                        <label>

                            <input
                                type="checkbox"
                                checked
                                readOnly
                            />

                            Find competitions

                        </label>



                        <label>

                            <input
                                type="checkbox"
                                checked
                                readOnly
                            />

                            Build a stronger college portfolio

                        </label>



                        <label>

                            <input
                                type="checkbox"
                            />

                            Find teammates

                        </label>



                        <label>

                            <input
                                type="checkbox"
                            />

                            Learn new skills

                        </label>


                    </div>


                </div>





                {/* NOTIFICATIONS */}

                <div className="settings-card">


                    <h2>
                        Notifications
                    </h2>


                    <div className="toggle-row">

                        <span>
                            New competition recommendations
                        </span>

                        <button className="toggle active">
                            ON
                        </button>

                    </div>



                    <div className="toggle-row">

                        <span>
                            Upcoming deadlines
                        </span>

                        <button className="toggle active">
                            ON
                        </button>

                    </div>



                    <div className="toggle-row">

                        <span>
                            Community updates
                        </span>

                        <button className="toggle">
                            OFF
                        </button>

                    </div>


                </div>






                {/* PRIVACY */}

                <div className="settings-card">


                    <h2>
                        Privacy
                    </h2>


                    <div className="toggle-row">

                        <span>
                            Show profile to other students
                        </span>

                        <button className="toggle active">
                            ON
                        </button>

                    </div>



                    <div className="toggle-row">

                        <span>
                            Allow teammate requests
                        </span>

                        <button className="toggle active">
                            ON
                        </button>

                    </div>


                </div>






                {/* ACCOUNT */}

                <div className="settings-card danger-zone">


                    <h2>
                        Account Actions
                    </h2>


                    <button className="save-button">
                        Save Changes
                    </button>


                    <button className="logout-button">
                        Log Out
                    </button>


                    <button className="delete-button">
                        Delete Account
                    </button>


                </div>



            </section>


        </main>

    );

}