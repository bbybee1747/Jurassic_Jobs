import React, { useState, ChangeEvent, FormEvent } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Navigate } from "react-router-dom";
import axios from "axios";

const GET_USERS = gql`
  query GetUsers {
    allUsers {
      id
      fullName
      phoneNumber
      address
      employer
      netWorth
      email
      isAdmin
      purchases {
        dinosaurId
        species
      }
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser(
    $fullName: String!
    $phoneNumber: String!
    $address: String!
    $employer: String!
    $netWorth: Float!
    $email: String!
    $password: String!
    $isAdmin: String!
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
        isAdmin: $isAdmin
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

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $fullName: String
    $phoneNumber: String
    $address: String
    $employer: String
    $netWorth: Float
    $email: String
    $isAdmin: String
  ) {
    updateUser(
      id: $id
      input: {
        fullName: $fullName
        phoneNumber: $phoneNumber
        address: $address
        employer: $employer
        netWorth: $netWorth
        email: $email
        isAdmin: $isAdmin
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

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      message
    }
  }
`;

const GET_DINOSAURS = gql`
  query GetDinosaurs {
    dinosaurs {
      id
      age
      species
      size
      price
      imageUrl
      description
    }
  }
`;

const ADD_DINOSAUR = gql`
  mutation AddDinosaur(
    $age: Int
    $species: String!
    $size: String!
    $price: Float!
    $imageUrl: String
    $description: String
  ) {
    addDinosaur(
      input: {
        age: $age
        species: $species
        size: $size
        price: $price
        imageUrl: $imageUrl
        description: $description
      }
    ) {
      id
      age
      species
      size
      price
      imageUrl
      description
    }
  }
`;

const UPDATE_DINOSAUR = gql`
  mutation UpdateDinosaur(
    $id: ID!
    $age: Int
    $species: String
    $size: String
    $price: Float
    $imageUrl: String
    $description: String
  ) {
    updateDinosaur(
      id: $id
      input: {
        age: $age
        species: $species
        size: $size
        price: $price
        imageUrl: $imageUrl
        description: $description
      }
    ) {
      id
      age
      species
      size
      price
      imageUrl
      description
    }
  }
`;

const DELETE_DINOSAUR = gql`
  mutation DeleteDinosaur($id: ID!) {
    deleteDinosaur(id: $id)
  }
`;

const AdminPage: React.FC = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User Management
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const [newUser, setNewUser] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    employer: "",
    netWorth: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserData, setEditingUserData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    employer: "",
    netWorth: "",
    email: "",
    isAdmin: false,
  });

  const handleNewUserChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    const netWorth = parseFloat(newUser.netWorth);
    if (newUser.netWorth === "" || isNaN(netWorth)) {
      console.error("Net Worth must be a valid number.");
      return;
    }
    try {
      await addUser({
        variables: {
          fullName: newUser.fullName,
          phoneNumber: newUser.phoneNumber,
          address: newUser.address,
          employer: newUser.employer,
          netWorth: netWorth,
          email: newUser.email,
          password: newUser.password,
          isAdmin: newUser.isAdmin ? "true" : "false",
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
        isAdmin: false,
      });
      refetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditUserChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setEditingUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitUserUpdate = async (id: string) => {
    const netWorth = parseFloat(editingUserData.netWorth);
    if (editingUserData.netWorth === "" || isNaN(netWorth)) {
      console.error("Net Worth must be a valid number.");
      return;
    }
    try {
      await updateUser({
        variables: {
          id,
          fullName: editingUserData.fullName,
          phoneNumber: editingUserData.phoneNumber,
          address: editingUserData.address,
          employer: editingUserData.employer,
          netWorth: netWorth,
          email: editingUserData.email,
          isAdmin: editingUserData.isAdmin ? "true" : "false",
        },
      });
      setEditingUserId(null);
      refetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Dinosaur Management
  const {
    data: dinosaursData,
    loading: dinosaursLoading,
    error: dinosaursError,
    refetch: refetchDinosaurs,
  } = useQuery(GET_DINOSAURS);
  const [addDinosaur] = useMutation(ADD_DINOSAUR);
  const [updateDinosaur] = useMutation(UPDATE_DINOSAUR);
  const [deleteDinosaur] = useMutation(DELETE_DINOSAUR);

  const [newDino, setNewDino] = useState({
    age: "",
    species: "",
    size: "",
    price: "",
    imageUrl: "",
    description: "",
  });

  const [editingDinoId, setEditingDinoId] = useState<string | null>(null);
  const [editingDinoData, setEditingDinoData] = useState({
    age: "",
    species: "",
    size: "",
    price: "",
    imageUrl: "",
    description: "",
  });

  const handleNewDinoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewDino((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDinosaur = async (e: FormEvent) => {
    e.preventDefault();
    const age = parseInt(newDino.age);
    const price = parseFloat(newDino.price);
    if (
      newDino.age === "" ||
      isNaN(age) ||
      newDino.price === "" ||
      isNaN(price)
    ) {
      console.error("Age and Price must be valid numbers.");
      return;
    }
    try {
      await addDinosaur({
        variables: {
          age: age,
          species: newDino.species,
          size: newDino.size,
          price: price,
          imageUrl: newDino.imageUrl,
          description: newDino.description,
        },
      });
      setNewDino({
        age: "",
        species: "",
        size: "",
        price: "",
        imageUrl: "",
        description: "",
      });
      refetchDinosaurs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditDinoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingDinoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // NEW: Handle image file upload for dinosaur editing
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Create form data for file upload
    const formData = new FormData();
    formData.append("file", file);
    try {
      // Adjust the endpoint URL as needed
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Assume the backend returns { url: "uploaded-image-url" }
      const imageUrl = response.data.url;
      setEditingDinoData((prev) => ({ ...prev, imageUrl }));
    } catch (err) {
      console.error("File upload error", err);
    }
  };

  const submitDinoUpdate = async (id: string) => {
    const age = parseInt(editingDinoData.age);
    const price = parseFloat(editingDinoData.price);
    if (
      editingDinoData.age === "" ||
      isNaN(age) ||
      editingDinoData.price === "" ||
      isNaN(price)
    ) {
      console.error("Age and Price must be valid numbers.");
      return;
    }
    try {
      await updateDinosaur({
        variables: {
          id,
          age: age,
          species: editingDinoData.species,
          size: editingDinoData.size,
          price: price,
          imageUrl: editingDinoData.imageUrl,
          description: editingDinoData.description,
        },
      });
      setEditingDinoId(null);
      refetchDinosaurs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-10 font-sans text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* User Management Section */}
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
                  <th className="px-2 py-2 border-b border-gray-700">ID</th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Full Name
                  </th>
                  <th className="px-2 py-2 border-b border-gray-700">Phone</th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Address
                  </th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Employer
                  </th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Net Worth
                  </th>
                  <th className="px-2 py-2 border-b border-gray-700">Email</th>
                  <th className="px-2 py-2 border-b border-gray-700">Admin</th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersData?.allUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-2 py-2 border-b border-gray-700">
                      {user.id}
                    </td>
                    {editingUserId === user.id ? (
                      <>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editUser_fullName"
                            type="text"
                            name="fullName"
                            value={editingUserData.fullName}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="name"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editUser_phoneNumber"
                            type="text"
                            name="phoneNumber"
                            value={editingUserData.phoneNumber}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="tel"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editUser_address"
                            type="text"
                            name="address"
                            value={editingUserData.address}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="street-address"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editUser_employer"
                            type="text"
                            name="employer"
                            value={editingUserData.employer}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="organization"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editUser_netWorth"
                            type="number"
                            name="netWorth"
                            value={editingUserData.netWorth}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="off"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editUser_email"
                            type="email"
                            name="email"
                            value={editingUserData.email}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="email"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700 text-center">
                          <input
                            id="editUser_isAdmin"
                            type="checkbox"
                            name="isAdmin"
                            checked={editingUserData.isAdmin}
                            onChange={handleEditUserChange}
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700 space-x-2">
                          <button
                            onClick={() => submitUserUpdate(user.id)}
                            className="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {user.fullName}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {user.phoneNumber}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {user.address}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {user.employer}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {user.netWorth}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {user.email}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {user.isAdmin === "true" ? "Yes" : "No"}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700 space-x-2">
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setEditingUserData({
                                fullName: user.fullName,
                                phoneNumber: user.phoneNumber,
                                address: user.address,
                                employer: user.employer,
                                netWorth: String(user.netWorth),
                                email: user.email,
                                isAdmin: user.isAdmin === "true",
                              });
                            }}
                            className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              deleteUser({ variables: { id: user.id } }).then(
                                () => refetchUsers()
                              );
                            }}
                            className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
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
              id="newUser_fullName"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
              autoComplete="name"
            />
            <input
              id="newUser_phoneNumber"
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={newUser.phoneNumber}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
              autoComplete="tel"
            />
            <input
              id="newUser_address"
              type="text"
              name="address"
              placeholder="Address"
              value={newUser.address}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
              autoComplete="street-address"
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 mt-2">
            <input
              id="newUser_employer"
              type="text"
              name="employer"
              placeholder="Employer"
              value={newUser.employer}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
              autoComplete="organization"
            />
            <input
              id="newUser_netWorth"
              type="number"
              name="netWorth"
              placeholder="Net Worth"
              value={newUser.netWorth}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
              autoComplete="off"
            />
            <input
              id="newUser_email"
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
              autoComplete="email"
            />
            <input
              id="newUser_password"
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
              autoComplete="new-password"
            />
            <div className="flex items-center space-x-2">
              <label htmlFor="newUser_isAdmin">Admin:</label>
              <input
                id="newUser_isAdmin"
                type="checkbox"
                name="isAdmin"
                checked={newUser.isAdmin}
                onChange={handleNewUserChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Add User
          </button>
        </form>
      </section>

      {/* New Purchases Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">User Purchases</h2>
        {usersLoading ? (
          <p>Loading purchases...</p>
        ) : usersError ? (
          <p>Error loading purchases.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="px-2 py-2 border-b border-gray-700">User</th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Dinosaur ID
                  </th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Species
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersData?.allUsers.map((user: any) =>
                  user.purchases && user.purchases.length > 0 ? (
                    user.purchases.map((purchase: any, index: number) => (
                      <tr
                        key={`${user.id}-${index}`}
                        className="hover:bg-gray-700"
                      >
                        <td className="px-2 py-2 border-b border-gray-700">
                          {user.fullName}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {purchase.dinosaurId}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {purchase.species}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={user.id} className="hover:bg-gray-700">
                      <td className="px-2 py-2 border-b border-gray-700">
                        {user.fullName}
                      </td>
                      <td
                        className="px-2 py-2 border-b border-gray-700"
                        colSpan={2}
                      >
                        No Purchases
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Dinosaur Management Section */}
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
                  <th className="px-2 py-2 border-b border-gray-700">ID</th>
                  <th className="px-2 py-2 border-b border-gray-700">Age</th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Species
                  </th>
                  <th className="px-2 py-2 border-b border-gray-700">Size</th>
                  <th className="px-2 py-2 border-b border-gray-700">Price</th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Image URL
                  </th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Description
                  </th>
                  <th className="px-2 py-2 border-b border-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dinosaursData?.dinosaurs.map((dino: any) => (
                  <tr key={dino.id} className="hover:bg-gray-700">
                    <td className="px-2 py-2 border-b border-gray-700">
                      {dino.id}
                    </td>
                    {editingDinoId === dino.id ? (
                      <>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editDino_age"
                            type="number"
                            name="age"
                            value={editingDinoData.age}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="off"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editDino_species"
                            type="text"
                            name="species"
                            value={editingDinoData.species}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="off"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editDino_size"
                            type="text"
                            name="size"
                            value={editingDinoData.size}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="off"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editDino_price"
                            type="number"
                            name="price"
                            value={editingDinoData.price}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="off"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            id="editDino_imageUrl"
                            type="text"
                            name="imageUrl"
                            value={editingDinoData.imageUrl}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="off"
                            placeholder="Image URL"
                          />
                          {/* File input for uploading an image */}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <textarea
                            id="editDino_description"
                            name="description"
                            value={editingDinoData.description}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                            autoComplete="off"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700 space-x-2">
                          <button
                            onClick={() => submitDinoUpdate(dino.id)}
                            className="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDinoId(null)}
                            className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {dino.age}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {dino.species}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {dino.size}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {dino.price}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {dino.imageUrl || "-"}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          {dino.description || "-"}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700 space-x-2">
                          <button
                            onClick={() => {
                              setEditingDinoId(dino.id);
                              setEditingDinoData({
                                age: String(dino.age),
                                species: dino.species,
                                size: dino.size,
                                price: String(dino.price),
                                imageUrl: dino.imageUrl || "",
                                description: dino.description || "",
                              });
                            }}
                            className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              deleteDinosaur({
                                variables: { id: dino.id },
                              }).then(() => refetchDinosaurs());
                            }}
                            className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form onSubmit={handleAddDinosaur} className="mt-4 space-y-4">
          <h3 className="text-2xl font-semibold">Add New Dinosaur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              id="newDino_age"
              type="number"
              name="age"
              placeholder="Age"
              value={newDino.age}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              required
              autoComplete="off"
            />
            <input
              id="newDino_species"
              type="text"
              name="species"
              placeholder="Species"
              value={newDino.species}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              required
              autoComplete="off"
            />
            <input
              id="newDino_size"
              type="text"
              name="size"
              placeholder="Size"
              value={newDino.size}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              required
              autoComplete="off"
            />
            <input
              id="newDino_price"
              type="number"
              name="price"
              placeholder="Price"
              value={newDino.price}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              required
              autoComplete="off"
            />
            <input
              id="newDino_imageUrl"
              type="text"
              name="imageUrl"
              placeholder="Image URL (optional)"
              value={newDino.imageUrl}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              autoComplete="off"
            />
            <textarea
              id="newDino_description"
              name="description"
              placeholder="Description (optional)"
              value={newDino.description}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Add Dinosaur
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminPage;
