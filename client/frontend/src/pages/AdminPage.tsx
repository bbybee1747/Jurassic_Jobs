import React, { useState, ChangeEvent, FormEvent } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Navigate } from "react-router-dom";

const GET_USERS = gql`
  query GetUsers {
    users {
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

const ADD_USER = gql`
  mutation AddUser(
    $fullName: String!
    $phoneNumber: String!
    $address: String!
    $employer: String!
    $netWorth: Float!
    $email: String!
    $password: String!
    $isAdmin: Boolean!
  ) {
    addUser(
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
    $isAdmin: Boolean
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
      id
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
    $age: Float!
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
    $age: Float
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
    deleteDinosaur(id: $id) {
      id
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
  } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const [newUser, setNewUser] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    employer: "",
    netWorth: 0,
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
    netWorth: 0,
    email: "",
    isAdmin: false,
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
          ? parseFloat(value)
          : value,
    }));
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addUser({
        variables: {
          fullName: newUser.fullName,
          phoneNumber: newUser.phoneNumber,
          address: newUser.address,
          employer: newUser.employer,
          netWorth: newUser.netWorth,
          email: newUser.email,
          password: newUser.password,
          isAdmin: newUser.isAdmin,
        },
      });
      setNewUser({
        fullName: "",
        phoneNumber: "",
        address: "",
        employer: "",
        netWorth: 0,
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
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setEditingUserData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "netWorth"
          ? parseFloat(value)
          : value,
    }));
  };

  const submitUserUpdate = async (id: string) => {
    try {
      await updateUser({
        variables: {
          id,
          fullName: editingUserData.fullName,
          phoneNumber: editingUserData.phoneNumber,
          address: editingUserData.address,
          employer: editingUserData.employer,
          netWorth: editingUserData.netWorth,
          email: editingUserData.email,
          isAdmin: editingUserData.isAdmin,
        },
      });
      setEditingUserId(null);
      refetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

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
    age: 0,
    species: "",
    size: "",
    price: 0,
    imageUrl: "",
    description: "",
  });

  const [editingDinoId, setEditingDinoId] = useState<string | null>(null);
  const [editingDinoData, setEditingDinoData] = useState({
    age: 0,
    species: "",
    size: "",
    price: 0,
    imageUrl: "",
    description: "",
  });

  const handleNewDinoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setNewDino((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleAddDinosaur = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDinosaur({
        variables: {
          age: newDino.age,
          species: newDino.species,
          size: newDino.size,
          price: newDino.price,
          imageUrl: newDino.imageUrl,
          description: newDino.description,
        },
      });
      setNewDino({
        age: 0,
        species: "",
        size: "",
        price: 0,
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
    const { name, value, type } = e.target;
    setEditingDinoData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const submitDinoUpdate = async (id: string) => {
    try {
      await updateDinosaur({
        variables: {
          id,
          age: editingDinoData.age,
          species: editingDinoData.species,
          size: editingDinoData.size,
          price: editingDinoData.price,
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
                {usersData?.users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-2 py-2 border-b border-gray-700">
                      {user.id}
                    </td>
                    {editingUserId === user.id ? (
                      <>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="text"
                            name="fullName"
                            value={editingUserData.fullName}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="text"
                            name="phoneNumber"
                            value={editingUserData.phoneNumber}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="text"
                            name="address"
                            value={editingUserData.address}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="text"
                            name="employer"
                            value={editingUserData.employer}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="number"
                            name="netWorth"
                            value={editingUserData.netWorth}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="email"
                            name="email"
                            value={editingUserData.email}
                            onChange={handleEditUserChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700 text-center">
                          <input
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
                          {user.isAdmin ? "Yes" : "No"}
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
                                netWorth: user.netWorth,
                                email: user.email,
                                isAdmin: user.isAdmin,
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
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={newUser.phoneNumber}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newUser.address}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 mt-2">
            <input
              type="text"
              name="employer"
              placeholder="Employer"
              value={newUser.employer}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
            />
            <input
              type="number"
              name="netWorth"
              placeholder="Net Worth"
              value={newUser.netWorth}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleNewUserChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded flex-1"
              required
            />
            <div className="flex items-center space-x-2">
              <label htmlFor="isAdmin">Admin:</label>
              <input
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
                            type="number"
                            name="age"
                            value={editingDinoData.age}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="text"
                            name="species"
                            value={editingDinoData.species}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="text"
                            name="size"
                            value={editingDinoData.size}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="number"
                            name="price"
                            value={editingDinoData.price}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <input
                            type="text"
                            name="imageUrl"
                            value={editingDinoData.imageUrl}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b border-gray-700">
                          <textarea
                            name="description"
                            value={editingDinoData.description}
                            onChange={handleEditDinoChange}
                            className="p-1 bg-gray-800 border border-gray-700 rounded"
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
                                age: dino.age,
                                species: dino.species,
                                size: dino.size,
                                price: dino.price,
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
              type="number"
              name="age"
              placeholder="Age"
              value={newDino.age}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            <input
              type="text"
              name="species"
              placeholder="Species"
              value={newDino.species}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            <input
              type="text"
              name="size"
              placeholder="Size"
              value={newDino.size}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newDino.price}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL (optional)"
              value={newDino.imageUrl}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={newDino.description}
              onChange={handleNewDinoChange}
              className="p-2 bg-gray-800 border border-gray-700 rounded"
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
