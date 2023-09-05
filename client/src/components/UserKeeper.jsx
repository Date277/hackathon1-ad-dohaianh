import React, { useState, useEffect } from "react";
import axios from "axios";

function UserKeeper() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [modalTitle, setModalTitle] = useState("Create new student");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createUser = async () => {
    if (!name || !description) {
      setFormError("Both name and description are required.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/users", {
        name,
        description,
      });
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const updateUser = async (userId) => {
    if (!name || !description) {
      setFormError("Both name and description are required.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/users/${userId}`, {
        name,
        description,
      });
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const editUser = (user) => {
    setName(user.name);
    setDescription(user.description);
    setEditingUserId(user.id);
    setModalTitle("Update student");
    setFormError("");
  };

  const openCreateModal = () => {
    resetForm();
    setModalTitle("Create new student");
    setFormError("");
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingUserId(null);
    setFormError("");
  };

  const sortByIdAscending = () => {
    const sortedUsers = [...users].sort((a, b) => a.id - b.id);
    setUsers(sortedUsers);
  };

  const sortByIdDescending = () => {
    const sortedUsers = [...users].sort((a, b) => b.id - a.id);
    setUsers(sortedUsers);
  };

  return (
    <div>
      <div className="container mt-3" style={{ width: "680px" }}>
        <button
          className="btn btn-success my-3"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={openCreateModal}
        >
          Create
        </button>
        <button className="btn btn-primary mx-2" onClick={sortByIdAscending}>
          ID tăng dần
        </button>
        <button className="btn btn-primary" onClick={sortByIdDescending}>
          ID giảm dần
        </button>
        <h2 className="w-100 text-center">Student list</h2>
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col" style={{ width: "200px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>{user.name}</td>
                <td>{user.description}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => editUser(user)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {modalTitle}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetForm}
              />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">
                    Description:
                  </label>
                  <textarea
                    className="form-control"
                    id="message-text"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                {formError && (
                  <div className="alert alert-danger">{formError}</div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={resetForm}
              >
                Close
              </button>
              {editingUserId === null ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={createUser}
                >
                  Create
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => updateUser(editingUserId)}
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserKeeper;
