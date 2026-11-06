import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Facebook, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-page" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Dynamic Background Decorative Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    background: 'var(--primary)',
                    filter: 'blur(120px)',
                    opacity: 0.2,
                    borderRadius: '50%',
                    zIndex: 0
                }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -60, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-10%',
                    width: '400px',
                    height: '400px',
                    background: 'var(--accent)',
                    filter: 'blur(120px)',
                    opacity: 0.15,
                    borderRadius: '50%',
                    zIndex: 0
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="auth-card"
                style={{ zIndex: 1 }}
            >
                <div className="auth-card-header">
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '800', fontSize: '32px', display: 'block', marginBottom: '10px' }}>
                        ස්නේහ
                    </Link>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--bg-darker)' }}>Welcome Back</h2>
                    <p style={{ color: '#6B7280', marginTop: '5px' }}>Login to access your safe space</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ marginBottom: '25px' }}
                    >
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#9CA3AF' }} />
                            <input
                                type="email"
                                className="input"
                                style={{ paddingLeft: '45px' }}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ marginBottom: '15px' }}
                    >
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#9CA3AF' }} />
                            <input
                                type="password"
                                className="input"
                                style={{ paddingLeft: '45px' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </motion.div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '25px' }}>
                        <a href="#" style={{ color: 'var(--primary)', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>Forgot password?</a>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '16px' }}
                    >
                        Sign In
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                            const mockUser = {
                                id: 'demo-user',
                                name: 'Guest User',
                                email: 'guest@example.com',
                                token: 'demo-token'
                            };
                            localStorage.setItem('token', mockUser.token);
                            localStorage.setItem('user', JSON.stringify(mockUser));
                            navigate('/dashboard');
                        }}
                        className="btn"
                        style={{
                            width: '100%',
                            padding: '16px',
                            marginTop: '10px',
                            background: 'rgba(100, 80, 255, 0.1)',
                            color: 'var(--primary)',
                            border: '1px dashed var(--primary)'
                        }}
                    >
                        Guest Access (Demo)
                    </motion.button>
                </form>

                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                    <p style={{ fontSize: '14px', color: '#9CA3AF', position: 'relative' }}>
                        <span style={{ background: '#FFF', padding: '0 10px', position: 'relative', zIndex: 1 }}>Or continue with</span>
                        <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#E5E7EB', zIndex: 0 }}></span>
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <motion.button
                        whileHover={{ y: -2 }}
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'white', cursor: 'pointer' }}
                    >
                        <Facebook size={20} color="#1877F2" />
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>Facebook</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ y: -2 }}
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'white', cursor: 'pointer' }}
                    >
                        <div style={{ fontWeight: '900', color: '#4285F4', fontSize: '18px' }}>G</div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>Google</span>
                    </motion.button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '35px', color: '#6B7280', fontSize: '14px' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Create one</Link>
                </p>
            </motion.div>
        </div>
    );
}

