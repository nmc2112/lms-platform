"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ClassroomService from '../services/ClassroomService';
import Modal from './components/Modal';

const ClassroomsList = () => {
  const [classrooms, setClassrooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await ClassroomService.getClassroom();
        setClassrooms(response.data);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };

    fetchClassrooms();
  }, []);

  const addClass = () => {
    router.push("/admin/class-manage/addClass"); 
  }
  

  const importData = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden md:max-w-7xl">
        <div className="md:flex">
          <div className="w-full p-4 px-8 py-10">
            <h1 className="text-gray-900 font-bold text-2xl mb-5">Classrooms List</h1>
            <div className="mb-4 flex justify-end">
                <button className="px-4 py-2 m-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={addClass}>
                Add Classroom
                </button>
                <button
                className="px-4 py-2 m-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                onClick={importData}
              >
                Import Data
              </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classrooms.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No classrooms available</td>
                  </tr>
                ) : (
                  classrooms.map((classroom) => (
                    <tr key={classroom.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.subjectName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.totalStudents}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><a className='text-blue-500 underline' href={classroom.meetingLink}>Link</a></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(classroom.startTime).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(classroom.endTime).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">Import Data</h2>
        <p>You can download the template Excel file for importing data.</p>
        <a href="/template.xlsx" className="text-blue-500 underline mt-2">Download Excel Template</a>
      </Modal>
    </div>
  );
};

export default ClassroomsList;
