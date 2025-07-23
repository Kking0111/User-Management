import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ name: '', email: '' });
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://34.224.22.82:3000/api/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Name and Email are required');
      return;
    }
    setError(null);
    try {
      await axios.post('http://34.224.22.82:3000/api/users', form);
      setForm({ name: '', email: '' });
      fetchUsers();
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setForm({ name: user.name, email: user.email });
    setError(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Name and Email are required');
      return;
    }
    setError(null);
    try {
      await axios.put(`http://34.224.22.82:3000/api/users/${editingUserId}`, form);
      setEditingUserId(null);
      setForm({ name: '', email: '' });
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setForm({ name: '', email: '' });
    setError(null);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setError(null);
    try {
      await axios.delete(`http://34.224.22.82:3000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={editingUserId ? handleUpdateUser : handleAddUser}
        className="mb-6 flex flex-col md:flex-row md:space-x-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          className="border border-gray-300 rounded px-3 py-2 mb-3 md:mb-0 flex-1"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
          className="border border-gray-300 rounded px-3 py-2 mb-3 md:mb-0 flex-1"
        />
        <input
          type="number"
          name="Mobile no."
          placeholder="Mobile number"
          value={form.mobile}
          onChange={handleInputChange}
          className="border border-gray-300 rounded px-3 py-2 mb-3 md:mb-0 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingUserId ? 'Update User' : 'Add User'}
        </button>
        {editingUserId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Mobile no.</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.mobile}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserManagement;
