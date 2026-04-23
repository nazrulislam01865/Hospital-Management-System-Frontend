export default function AdminsPage() {
    return (
        <>
        <main>
        <section>
            <header>
            <h1>Admins</h1>
            <p>Create, view, update and delete admin accounts</p>
            </header>

            <section>
            <header>
                <h2>Create Admin</h2>
            </header>

            <form>
                <div>
                <label>Name</label>
                <input type="text" name="name" placeholder="Enter full name" />
                </div>

                <div>
                <label>Username</label>
                <input type="text" name="uname" placeholder="Enter username" />
                </div>

                <div>
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter email" />
                </div>

                <div>
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password" />
                </div>

                <div>
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" />
                </div>

                <div>
                <label>Social Media Link</label>
                <input type="url" name="socialMediaLinks" placeholder="https://example.com" />
                </div>

                <div>
                <button type="submit">Create Admin</button>
                </div>
            </form>
            </section>

            <section>
            <header>
                <h2>Admin List</h2>
            </header>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Unique ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Date of Birth</th>
                    <th>Social Media</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td >No admin records found</td>
                </tr>
                </tbody>
            </table>
            </section>

            <section>
            <header>
                <h2>Update Admin</h2>
            </header>

            <form>
                <div>
                <label>Admin ID</label>
                <input type="number" name="id" placeholder="Enter admin ID" />
                </div>

                <div>
                <label>Name</label>
                <input type="text" name="name" />
                </div>

                <div>
                <label>Username</label>
                <input type="text" name="uname" />
                </div>

                <div>
                <label>Email</label>
                <input type="email" name="email" />
                </div>

                <div>
                <label>Password</label>
                <input type="password" name="password" />
                </div>

                <div>
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" />
                </div>

                <div>
                <label>Social Media Link</label>
                <input type="url" name="socialMediaLinks" />
                </div>

                <div>
                <button type="submit">Update Admin</button>
                <button type="button">Delete Admin</button>
                </div>
            </form>
            </section>
        </section>
        </main>
        </>
    );
}