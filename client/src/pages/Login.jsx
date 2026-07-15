import Navbar from "../components/Navbar";

function Login() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">

          <h1 className="text-3xl font-bold text-center mb-8">
            Login
          </h1>

          <form className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded-lg"
            />

            <button
              className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800"
            >
              Login
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default Login;