/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useRouter } from "next/navigation";
import * as client from "@/app/Account/client";
import Image from "next/image";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";

export default function ManageUsersPage() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }
    if (currentUser.role !== "ADMIN") {
      router.push("/Home");
      return;
    }
    fetchUsers();
  }, [currentUser, router]);

  const fetchUsers = async () => {
    try {
      setError("");
      const data = await client.findAllUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUserId(user._id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm({ username: "", email: "", role: "" });
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      await client.updateUser({
        _id: userId,
        ...editForm,
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`
      )
    )
      return;

    try {
      await client.deleteUser(userId);
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-white mb-4">Manage Users</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "#D76A05",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.username}
                        width={40}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        {user.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="align-middle">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm bg-purple-dark text-white border-0"
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm({ ...editForm, username: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-white">{user.username}</span>
                  )}
                </td>
                <td className="align-middle">
                  {editingUserId === user._id ? (
                    <input
                      type="email"
                      className="form-control form-control-sm bg-purple-dark text-white border-0"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-cream">{user.email}</span>
                  )}
                </td>
                <td className="align-middle">
                  {editingUserId === user._id ? (
                    <select
                      className="form-select form-select-sm bg-purple-dark text-white border-0"
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="PRO">PRO</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <span
                      className={
                        user.role === "ADMIN"
                          ? "text-orange"
                          : user.role === "PRO"
                          ? "text-warning"
                          : "text-cream"
                      }
                    >
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="align-middle">
                  {editingUserId === user._id ? (
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(user._id)}
                        className="btn btn-sm btn-success"
                      >
                        <FaSave size={14} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-sm btn-secondary"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-sm btn-outline-light"
                      >
                        <FaEdit size={14} />
                      </button>
                      {user._id !== currentUser?._id && (
                        <button
                          onClick={() => handleDelete(user._id, user.username)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-cream">
        <p>Total Users: {users.length}</p>
      </div>
    </div>
  );
}
