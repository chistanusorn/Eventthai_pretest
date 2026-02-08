'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, Plus, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { User, UserResponse } from '@/types';

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Edit Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' });
    const [updating, setUpdating] = useState(false);

    // Add Modal State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({ first_name: '', last_name: '', email: '', avatar: '' });
    const [adding, setAdding] = useState(false);

    // Search State (Client side filtering for demonstration)
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async (pageNum: number) => {
        setLoading(true);
        try {
            const response = await api.get<UserResponse>(`/users?page=${pageNum}`);
            setUsers(response.data.data);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Check auth
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }
        fetchUsers(page);
    }, [page, fetchUsers, router]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
            toast.success('User deleted successfully (mock)');
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const openEditModal = (user: User) => {
        setCurrentUser(user);
        setEditForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        });
        setIsEditOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setUpdating(true);
        try {
            await api.put(`/users/${currentUser.id}`, editForm);

            // Update local state
            setUsers(users.map(u =>
                u.id === currentUser.id
                    ? { ...u, ...editForm }
                    : u
            ));

            setIsEditOpen(false);
            toast.success('User updated successfully (mock)');
        } catch (error) {
            toast.error('Failed to update user');
        } finally {
            setUpdating(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);

        try {
            // POST to Reqres (simulated)
            const response = await api.post('/users', addForm);

            // Create a mock new user to add to the list locally (since Reqres doesn't persist it)
            const newUser: User = {
                id: response.data.id ? Number(response.data.id) : Math.floor(Math.random() * 1000) + 100, // Handle string/number ID
                email: addForm.email,
                first_name: addForm.first_name,
                last_name: addForm.last_name,
                avatar: addForm.avatar || 'https://reqres.in/img/faces/1-image.jpg' // Use provided avatar or default
            };

            setUsers([newUser, ...users]);
            setIsAddOpen(false);
            setAddForm({ first_name: '', last_name: '', email: '', avatar: '' }); // Reset form
            toast.success('User added successfully (mock)');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add user');
        } finally {
            setAdding(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Delete Modal State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Trash/Restore State
    const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
    const [isTrashOpen, setIsTrashOpen] = useState(false);

    const handleDeleteClick = (id: number) => {
        setUserToDelete(id);
        setIsDeleteOpen(true);
    };

    const handleRestore = (id: number) => {
        const userToRestore = deletedUsers.find(u => u.id === id);
        if (userToRestore) {
            setUsers([...users, userToRestore]);
            setDeletedUsers(deletedUsers.filter(u => u.id !== id));
            toast.success('User restored successfully');
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setDeleting(true);
        try {
            await api.delete(`/users/${userToDelete}`);

            // Move to "Trash" instead of just vanishing
            const userToRemove = users.find(u => u.id === userToDelete);
            if (userToRemove) {
                setDeletedUsers([...deletedUsers, userToRemove]);
            }

            setUsers(users.filter(user => user.id !== userToDelete));
            toast.success('User moved to trash (mock)');
            setIsDeleteOpen(false);
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setDeleting(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        User Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your team members and permissions.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setIsTrashOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors shadow-sm"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Trash ({deletedUsers.length})
                        </button>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add User
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="clean-card group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="p-6 flex items-start space-x-4">
                                <div className="relative flex-shrink-0">
                                    <Image
                                        src={user.avatar}
                                        alt={`${user.first_name} ${user.last_name}`}
                                        width={64}
                                        height={64}
                                        className="rounded-full object-cover border border-gray-100 bg-gray-50"
                                    />
                                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                        {user.first_name} {user.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">{user.email}</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-3 flex justify-end gap-2 border-t border-gray-100 dark:border-slate-700">
                                <button
                                    onClick={() => openEditModal(user)}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(user.id)}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !searchTerm && (
                <div className="flex justify-center items-center space-x-4 mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            )}

            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in-up">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden border dark:border-slate-800">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit User</h3>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.first_name}
                                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                        className="block w-full px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.last_name}
                                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 transition-all"
                                />
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center shadow-sm"
                                >
                                    {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-fade-in-up">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={addForm.first_name}
                                        onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={addForm.last_name}
                                        onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 transition-all"
                                    placeholder="john.doe@example.com"
                                />
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center shadow-sm"
                                >
                                    {adding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteOpen && (
                <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in-up">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center border dark:border-slate-800">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3 justify-center">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center shadow-sm"
                            >
                                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trash Bin Modal */}
            {isTrashOpen && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-fade-in-up">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Trash2 className="w-5 h-5 text-gray-500" />
                                Recycle Bin
                            </h3>
                            <button
                                onClick={() => setIsTrashOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {deletedUsers.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Trash2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>Trash is empty.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {deletedUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.first_name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full grayscale opacity-70"
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm">{user.first_name} {user.last_name}</h4>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRestore(user.id)}
                                                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                Restore
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
