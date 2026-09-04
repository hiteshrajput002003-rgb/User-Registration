import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";

function Dashboard({ userReport, onDelete }) {
  return (
    <div className="app">
      <Navbar />

      <main className="dashboard">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">USER MANAGEMENT</span>
            <h1>User Registration Dashboard</h1>
            <p>Manage your registered users, view their information, and keep your records organized.</p>
          </div>

          <div className="user-count-card">
            <span className="count-label">Total Users</span>
            <strong>{userReport.length}</strong>
          </div>
        </section>

        {/* User Table Component */}
        <section className="dashboard-content">
          <UserTable userReport={userReport} onDelete={onDelete} />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;