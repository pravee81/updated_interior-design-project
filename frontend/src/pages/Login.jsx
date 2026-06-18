
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState('client');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [place, setPlace] = useState('');
  const [proof, setProof] = useState('');

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPlace('');
    setProof('');
    setRole('client');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const api = 'http://localhost:4000';

    try {
      if (isLoginMode) {
        const res = await fetch(api + '/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, password }),
        });

        const j = await res.json();
        if (res.ok) {
          localStorage.setItem('token', j.token);
          if (j.user?.role) localStorage.setItem('role', j.user.role);
           alert(
          'Logged in Successfully as ' +
          (
            j.user?.role === 'client'
              ? 'Interior Designer'
              : j.user?.role === 'admin'
              ? 'Admin'
              : 'User'
          ) +
          '!'
        );

          const r = j.user?.role;
          if (r === 'admin') nav('/admin');
          else if (r === 'client') nav('/client');
          else if (r === 'user') nav('/user');
          else nav('/');
        } else {
          alert(j.message || 'Auth failed');
        }
      } else {
        const data = { name, email, password, role };
        if (role === 'client') {
          data.place = place;
          data.proof = proof;
        }

        const r = await fetch(api + '/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const j = await r.json();

        if (r.ok) {
          localStorage.setItem('token', j.token);
          if (j.user?.role) localStorage.setItem('role', j.user.role);
          alert(
          'Registered Successfully as ' +
          (
            j.user?.role === 'client'
              ? 'Interior Designer'
              : j.user?.role === 'admin'
              ? 'Admin'
              : 'User'
          ) +
          '!'
        );

          const rr = j.user?.role || role;
          if (rr === 'admin') nav('/admin');
          else if (rr === 'client') nav('/client');
          else if (rr === 'user') nav('/user');
          else nav('/');
        } else {
          alert(j.message || 'Registration failed');
        }
      }
    } catch (e) {
      alert('Server error');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-200 px-4"
      style={{
        backgroundImage: `url('https://st.hzcdn.com/simgs/pictures/living-rooms/dkor-interiors-interior-design-at-the-beach-club-miami-beach-fl-dkor-interiors-inc-interior-designers-miami-fl-img~a87144eb006a0eda_14-9670-1-d8309e4.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isLoginMode ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email only for register */}
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role selection for register */}
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="client">Interior Designer</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Extra fields only for client */}
              {role === 'client' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter your place"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proof Number</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter proof number"
                      value={proof}
                      onChange={(e) => setProof(e.target.value)}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-coral text-white py-2 rounded hover:bg-coral-dark transition"
          >
            {isLoginMode ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Switch between modes */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {isLoginMode ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsLoginMode(false);
                  resetFields();
                }}
                className="text-coral hover:underline font-medium"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already a user?{' '}
              <button
                onClick={() => {
                  setIsLoginMode(true);
                  resetFields();
                }}
                className="text-coral hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
