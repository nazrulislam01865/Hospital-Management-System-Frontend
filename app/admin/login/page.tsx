export default function Login() {
    return (
        <>
        <main>
        <section>
            <header>
            <h1>Admin Login</h1>
            <p>Sign in to access the admin dashboard</p>
            </header>

            <form>
            <div>
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter admin email" />
            </div>

            <div>
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password" />
            </div>

            <div>
                <button type="submit">Login</button>
            </div>
            </form>
        </section>
        </main>
        </>
    );
}