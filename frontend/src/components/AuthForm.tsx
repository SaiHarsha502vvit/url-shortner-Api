import React, { useState } from 'react';

interface AuthFormProps {
  onAuth: (type: 'login' | 'register', data: { username: string; password: string; email?: string }) => void;
  loading: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth, loading, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onAuth('login', { username, password });
    } else {
      onAuth('register', { username, password, email });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring bg-black text-white placeholder-gray-400"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        {!isLogin && (
          <input required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring bg-white text-black placeholder-gray-400"
            type="email"
            placeholder="Email "
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        )}
        <input
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring bg-white text-black placeholder-gray-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold shadow-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
