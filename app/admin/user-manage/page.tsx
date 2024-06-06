"use client";

import React from "react";
import { useEffect, useState } from "react";
import UserService from "../services/UserService";
import DataTable from "./components/DataTable";



const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUsers();
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
        Header: 'Clerk ID',
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
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersPage;
