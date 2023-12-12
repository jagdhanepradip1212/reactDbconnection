import React, { useEffect, useState } from 'react';
const ShowData = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) {
          throw new Error('Error fetching registered users');
        }
        const userData = await response.json();
        setUsers(userData);
        console.log(userData);
      } catch (error) {
        console.error('Error fetching registered users:', error);
      }
    };

    fetchRegisteredUsers();
  }, []);

  const handleEdit = async (userId) => {
    // Find the user to be edited based on their ID
    const userToEdit = users.find((user) => user._id === userId);

    if (!userToEdit) {
      // Handle error or display a message if the user is not found
      return;
    }

    // Prompt the user for updated data (you can use a modal or a form for this)
    const updatedName = prompt('Enter updated name:', userToEdit.name);
    const updatedEmail = prompt('Enter updated email:', userToEdit.email);

    // If the user cancels the prompt, do nothing
    if (updatedName === null || updatedEmail === null) {
      return;
    }

    // Prepare the updated data object
    const updatedData = {
      name: updatedName,
      email: updatedEmail,
    };

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Error updating user data');
      }

      // Update the user's data in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...updatedData } : user
        )
      );

      console.log('User data updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error deleting user');
      }
  
      // Remove the deleted user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle error (e.g., show error message)
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>Registered Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                ✏️{/* Edit icon */}
                <button onClick={() => handleEdit(user._id)}>Edit</button>
                🗑️{/* Delete icon */}
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowData;
