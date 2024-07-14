"use client";

import React, { useEffect, useState } from "react";
import UserService from "../services/UserService";
import DataTable from "./components/DataTable";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getStudents();
        console.log('Fetched users:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'ID',
        accessor: 'userClerkId',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
    ],
    []
  );

  return (
    <div className="p-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-gray-900 font-bold text-2xl mb-5">Student Management</h2>
      <DataTable columns={columns} data={users} />
    </div>
  </div>
  );
};

export default UsersPage;
