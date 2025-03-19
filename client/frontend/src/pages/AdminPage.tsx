import React, { useState, ChangeEvent, FormEvent } from "react";
import { gql, useQuery, useMutation, ServerError } from "@apollo/client";
import { Navigate } from "react-router-dom";

const GET_USERS = gql`
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
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery(GET_USERS, {
    onCompleted: (data) => console.log(data),
    onError: (err) => console.error(err),
  });

  if (usersError) {
    const networkError = usersError.networkError as ServerError;
    console.error(
      "Detailed error response",
      networkError?.result || usersError.message
    );
    return <div>Error: {usersError.message}</div>;
  }

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
            : parseFloat(value)
          : value,
    }));
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    if (newUser.netWorth === "" || isNaN(parseFloat(newUser.netWorth))) {
      console.error("Net Worth must be a valid number.");
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
      setNewUser({
        fullName: "",
        phoneNumber: "",
        address: "",
        employer: "",
        netWorth: "",
        email: "",
        password: "",
      });
      refetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-10 font-sans text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">User Management</h2>
        <form onSubmit={handleAddUser} className="mt-4 space-y-4">
          <h3 className="text-2xl font-semibold">Add New User</h3>
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
          <button type="submit">Add User</button>
        </form>
      </section>
    </div>
  );
};

export default AdminPage;
