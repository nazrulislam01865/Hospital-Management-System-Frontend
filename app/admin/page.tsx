"use client"
import Header from "@/components/header"

export default function AdminPage() {
    return (
        <>
            <Header props={{page:"Admin Dashboard"}}/>
            <main>
        <section>
            

            <section>
            <article>
                <h2>Total Admins</h2>
                <p>0</p>
            </article>

            <article>
                <h2>Total Patients</h2>
                <p>0</p>
            </article>

            <article>
                <h2>Total Appointments</h2>
                <p>0</p>
            </article>

            <article>
                <h2>Unpaid Appointments</h2>
                <p>0</p>
            </article>

            <article>
                <h2>Total Bills</h2>
                <p>0</p>
            </article>

            <article>
                <h2>Total Rooms</h2>
                <p>0</p>
            </article>
            </section>

            <section>
            <header>
                <h2>Quick Actions</h2>
            </header>

            <ul>
                <li><a href="/admin/admins">Manage Admins</a></li>
                <li><a href="/admin/patients">Manage Patients</a></li>
                <li><a href="/admin/appointments">Manage Appointments</a></li>
                <li><a href="/admin/bills">Manage Bills</a></li>
                <li><a href="/admin/rooms">Manage Rooms</a></li>
                <li><a href="/admin/billing-report">View Billing Report</a></li>
            </ul>
            </section>

            <section>
            <header>
                <h2>Recent Appointments</h2>
            </header>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Appointment Date</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>No data available</td>
                </tr>
                </tbody>
            </table>
            </section>
        </section>
        </main>
        </>
    );
}