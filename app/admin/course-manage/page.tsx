"use client";

import React, { useEffect, useState } from "react";
import CourseService from "../services/CourseService";
import UserService from "../services/UserService";
import DataTable from "./components/DataTable";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await CourseService.getAllCourses();
        console.log('Fetched courses:', response.data);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchUsers();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Course Name',
        accessor: 'title',
      },
      {
        Header: 'Teacher',
        accessor: 'username',
      },
      {
        Header: 'Category',
        accessor: 'categoryName',
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value }) => `$${value}`,
      },
      
    ],
    []
  );

  return (
    <div className="p-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-gray-900 font-bold text-2xl mb-5">Courses Management</h2>
      <DataTable columns={columns} data={courses} />
    </div>
  </div>
  );
};

export default CoursesPage;
