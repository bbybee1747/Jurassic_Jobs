import React, { useState, ChangeEvent, FormEvent } from "react";
import { gql, useQuery, useMutation, ServerError } from "@apollo/client";
import { Navigate } from "react-router-dom";

const allUsers = gql`
  query GetAllUsers {
    allUsers {
      id
      fullName
      phoneNumber
      address
      employer
      netWorth
      email
      isAdmin
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser(
    $fullName: String!
    $phoneNumber: String!
    $address: String!
    $employer: String!
    $netWorth: Float!
    $email: String!
    $password: String!
  ) {
    createUser(
      input: {
        fullName: $fullName
        phoneNumber: $phoneNumber
        address: $address
        employer: $employer
        netWorth: $netWorth
        email: $email
        password: $password
      }
    ) {
      id
      fullName
      phoneNumber
      address
      employer
      netWorth
      email
      isAdmin
    }
  }
`;

const AdminPage: React.FC = () => {
  // Check if the current user is an admin.
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Fetch the list of users.
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery(allUsers, {
    onCompleted: (data) => console.log("Users fetched:", data),
    onError: (err) => console.error("Error fetching users:", err),
  });

  // Mutation for creating a new user.
  const [createUser] = useMutation(CREATE_USER);
  const [newUser, setNewUser] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    employer: "",
    netWorth: "",
    email: "",
    password: "",
  });
  const [creationError, setCreationError] = useState<string | null>(null);
  const [creationSuccess, setCreationSuccess] = useState<boolean>(false);

  const handleNewUserChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewUser((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "netWorth"
          ? value === ""
            ? ""
            : value // Parsing later
          : value,
    }));
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    if (newUser.netWorth === "" || isNaN(parseFloat(newUser.netWorth))) {
      console.error("Net Worth must be a valid number.");
      setCreationError("Net Worth must be a valid number.");
      return;
    }
    try {
      await createUser({
        variables: {
          fullName: newUser.fullName,
          phoneNumber: newUser.phoneNumber,
          address: newUser.address,
          employer: newUser.employer,
          netWorth: parseFloat(newUser.netWorth),
          email: newUser.email,
          password: newUser.password,
        },
      });
      // Reset form and set success message.
      setNewUser({
        fullName: "",
        phoneNumber: "",
        address: "",
        employer: "",
        netWorth: "",
        email: "",
        password: "",
      });
      setCreationError(null);
      setCreationSuccess(true);
      refetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      setCreationError("Error creating user. Please try again.");
      setCreationSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-10 font-sans text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">User Management</h2>
        <form onSubmit={handleAddUser} className="mt-4 space-y-4">
          <h3 className="text-2xl font-semibold">Add New User</h3>
          {creationError && <p className="text-red-500">{creationError}</p>}
          {creationSuccess && (
            <p className="text-green-500">User added successfully!</p>
          )}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={handleNewUserChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={newUser.phoneNumber}
            onChange={handleNewUserChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newUser.address}
            onChange={handleNewUserChange}
            required
          />
          <input
            type="text"
            name="employer"
            placeholder="Employer"
            value={newUser.employer}
            onChange={handleNewUserChange}
            required
          />
          <input
            type="number"
            name="netWorth"
            placeholder="Net Worth"
            value={newUser.netWorth}
            onChange={handleNewUserChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleNewUserChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleNewUserChange}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add User
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">All Users</h2>
        {usersLoading && <p>Loading users...</p>}
        {usersError && (
          <div>
            <p>Error fetching users: {usersError.message}</p>
            {(() => {
              const networkError = usersError.networkError as ServerError;
              console.error(
                "Detailed error response:",
                networkError?.result || usersError.message
              );
              return null;
            })()}
          </div>
        )}
        {usersData && usersData.allUsers && (
          <ul className="space-y-2">
            {usersData.allUsers.map((user: any) => (
              <li key={user.id} className="border p-4 rounded">
                <p>
                  <strong>Name:</strong> {user.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {user.address}
                </p>
                <p>
                  <strong>Employer:</strong> {user.employer}
                </p>
                <p>
                  <strong>Net Worth:</strong> {user.netWorth}
                </p>
                <p>
                  <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
