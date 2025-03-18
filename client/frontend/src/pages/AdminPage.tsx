import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Navigate } from "react-router-dom";

// --- GraphQL Queries & Mutations for Users ---
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      fullName
      email
      role
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser($fullName: String!, $email: String!, $role: String!) {
    addUser(input: { fullName: $fullName, email: $email, role: $role }) {
      id
      fullName
      email
      role
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $fullName: String
    $email: String
    $role: String
  ) {
    updateUser(
      id: $id
      input: { fullName: $fullName, email: $email, role: $role }
    ) {
      id
      fullName
      email
      role
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

// --- GraphQL Queries & Mutations for Dinosaurs ---
const GET_DINOSAURS = gql`
  query GetDinosaurs {
    dinosaurs {
      id
      name
      era
    }
  }
`;

const ADD_DINOSAUR = gql`
  mutation AddDinosaur($name: String!, $era: String!) {
    addDinosaur(input: { name: $name, era: $era }) {
      id
      name
      era
    }
  }
`;

const UPDATE_DINOSAUR = gql`
  mutation UpdateDinosaur($id: ID!, $name: String, $era: String) {
    updateDinosaur(id: $id, input: { name: $name, era: $era }) {
      id
      name
      era
    }
  }
`;

const DELETE_DINOSAUR = gql`
  mutation DeleteDinosaur($id: ID!) {
    deleteDinosaur(id: $id) {
      id
    }
  }
`;

const AdminPage: React.FC = () => {
  // Example admin check; replace with your actual authentication logic.
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser({
        variables: {
          fullName: newUserFullName,
          email: newUserEmail,
          role: newUserRole,
        },
      });
      setNewUserFullName("");
      setNewUserEmail("");
      setNewUserRole("");
      refetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Dinosaurs Management Section ---
  const {
    data: dinosaursData,
    loading: dinosaursLoading,
    error: dinosaursError,
    refetch: refetchDinosaurs,
  } = useQuery(GET_DINOSAURS);
  const [addDinosaur] = useMutation(ADD_DINOSAUR);
  const [updateDinosaur] = useMutation(UPDATE_DINOSAUR);
  const [deleteDinosaur] = useMutation(DELETE_DINOSAUR);

  const [newDinoName, setNewDinoName] = useState("");
  const [newDinoEra, setNewDinoEra] = useState("");

  const handleAddDinosaur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDinosaur({
        variables: {
          name: newDinoName,
          era: newDinoEra,
        },
      });
      setNewDinoName("");
      setNewDinoEra("");
      refetchDinosaurs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-10 font-sans text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">User Management</h2>
        {usersLoading ? (
          <p>Loading users...</p>
        ) : usersError ? (
          <p>Error loading users.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b border-gray-700">ID</th>
                  <th className="px-4 py-2 border-b border-gray-700">
                    Full Name
                  </th>
                  <th className="px-4 py-2 border-b border-gray-700">Email</th>
                  <th className="px-4 py-2 border-b border-gray-700">Role</th>
                  <th className="px-4 py-2 border-b border-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersData?.users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-4 py-2 border-b border-gray-700">
                      {user.id}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {user.fullName}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {user.role}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700 space-x-2">
                      <button
                        onClick={() => {
                          updateUser({
                            variables: {
                              id: user.id,
                              role: user.role === "admin" ? "user" : "admin",
                            },
                          }).then(() => refetchUsers());
                        }}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => {
                          deleteUser({ variables: { id: user.id } }).then(() =>
                            refetchUsers()
                          );
                        }}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form onSubmit={handleAddUser} className="mt-4 space-y-4">
          <h3 className="text-2xl font-semibold">Add New User</h3>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newUserFullName}
              onChange={(e) => setNewUserFullName(e.target.value)}
              className="p-3 bg-gray-800 border border-gray-700 rounded-lg flex-1"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="p-3 bg-gray-800 border border-gray-700 rounded-lg flex-1"
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="p-3 bg-gray-800 border border-gray-700 rounded-lg flex-1"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Add User
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Dinosaur Management</h2>
        {dinosaursLoading ? (
          <p>Loading dinosaurs...</p>
        ) : dinosaursError ? (
          <p>Error loading dinosaurs.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b border-gray-700">ID</th>
                  <th className="px-4 py-2 border-b border-gray-700">Name</th>
                  <th className="px-4 py-2 border-b border-gray-700">Era</th>
                  <th className="px-4 py-2 border-b border-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dinosaursData?.dinosaurs.map((dino: any) => (
                  <tr key={dino.id} className="hover:bg-gray-700">
                    <td className="px-4 py-2 border-b border-gray-700">
                      {dino.id}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {dino.name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {dino.era}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700 space-x-2">
                      <button
                        onClick={() => {
                          updateDinosaur({
                            variables: {
                              id: dino.id,
                              name: dino.name + " Updated",
                              era: dino.era,
                            },
                          }).then(() => refetchDinosaurs());
                        }}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          deleteDinosaur({ variables: { id: dino.id } }).then(
                            () => refetchDinosaurs()
                          );
                        }}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Add New Dinosaur Form */}
        <form onSubmit={handleAddDinosaur} className="mt-4 space-y-4">
          <h3 className="text-2xl font-semibold">Add New Dinosaur</h3>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <input
              type="text"
              placeholder="Name"
              value={newDinoName}
              onChange={(e) => setNewDinoName(e.target.value)}
              className="p-3 bg-gray-800 border border-gray-700 rounded-lg flex-1"
              required
            />
            <input
              type="text"
              placeholder="Era"
              value={newDinoEra}
              onChange={(e) => setNewDinoEra(e.target.value)}
              className="p-3 bg-gray-800 border border-gray-700 rounded-lg flex-1"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Add Dinosaur
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminPage;
