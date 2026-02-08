'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            // reqres.in expects email and password
            const response = await api.post('/register', {
                email: formData.email,
                password: formData.password,
            });

            if (response.data.token) {
                toast.success('Registration successful! Please login.');
                router.push('/login');
            }
        } catch (error: any) {
            console.error('Registration Error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
            const status = error.response?.status;
            toast.error(status ? `${status}: ${errorMessage}` : errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fillTestCredentials = () => {
        setFormData({
            email: 'eve.holt@reqres.in',
            password: 'SafeTestPass123!',
            confirmPassword: 'SafeTestPass123!',
        });
        toast.success('Test credentials filled successfully!');
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <div className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="bg-gradient-to-r from-indigo-500/80 to-purple-600/80 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-starry opacity-30 animate-twinkle"></div>
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-md -rotate-3 relative z-10">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white relative z-10 drop-shadow-md">Create Account</h2>
                    <p className="text-indigo-100 mt-2 font-medium relative z-10">Join us to manage yours users</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-indigo-900 ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-indigo-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 dark:bg-slate-950/50 border border-indigo-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-indigo-900 dark:text-white placeholder-indigo-300 dark:placeholder-indigo-800"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-indigo-900 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-indigo-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 dark:bg-slate-950/50 border border-indigo-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-indigo-900 dark:text-white placeholder-indigo-300 dark:placeholder-indigo-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-indigo-900 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-indigo-400" />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-white/50 dark:bg-slate-950/50 border border-indigo-100 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-indigo-900 dark:text-white placeholder-indigo-300 dark:placeholder-indigo-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={fillTestCredentials}
                            className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline w-full text-right font-medium"
                        >
                            Use Test Credentials (eve.holt@reqres.in)
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-indigo-800 dark:text-indigo-300">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
