import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="text-gray-300">Check your email for a password reset link.</p>
              <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium">Back to login →</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" required placeholder="you@university.edu"
                value={email} onChange={e => setEmail(e.target.value)} />
              <Button type="submit" size="lg" loading={loading} className="w-full">Send Reset Link</Button>
              <p className="text-center text-sm">
                <Link to="/login" className="text-sky-400 hover:text-sky-300">← Back to login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
