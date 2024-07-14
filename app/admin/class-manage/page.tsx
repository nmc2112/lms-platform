"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClassroomService from '../services/ClassroomService';
import Modal from './components/Modal';
import { toast } from 'react-hot-toast';

const ClassroomsList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
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
  };

  const importData = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const viewDetails = (id) => {
    router.push(`/admin/class-manage/details/${id}`);
  };

  const getExcelFile = async () => {
    try {
      const response = await ClassroomService.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'classroom-template.xlsm');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    try {
      const response = await ClassroomService.importData(file);
      if (response.data.success) {
        toast.success('Upload successful');
        console.log('Upload successful', response.data);
        setShowModal(false);
      } else {
        response.data.error.forEach((error) => {
          toast.error(error);
        });
        console.error('Upload failed', response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Upload failed';
      toast.error(errorMessage);
      console.error('Upload failed', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const getDayOfWeek = (dateString) => {
    const options = { weekday: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden" style={{maxWidth: "105rem"}}>
        <div className="p-6">
          <h2 className="text-gray-900 font-bold text-2xl mb-5">Classes Management</h2>
          <div className="mb-6 flex justify-between items-center">
            <div className="mb-6 flex justify-between items-center space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" onClick={addClass}>
              Add Class
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              onClick={importData}
            >
              Import Data
            </button>
          </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day of Week</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classrooms.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No classrooms available</td>
                  </tr>
                ) : (
                  classrooms.map((classroom) => (
                    <tr key={classroom.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.subjectName}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.totalStudents}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.teacherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 underline"><a href={classroom.meetingLink}>Link</a></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(classroom.startTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(classroom.until)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(classroom.startTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(classroom.endTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getDayOfWeek(classroom.startTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="px-2 py-1 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                          onClick={() => viewDetails(classroom.id)}
                        >
                          View Details
                        </button>
                      </td>
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
        <p>Download the class template Excel file for importing data.</p>
        <button className="text-blue-500 underline mt-2" onClick={getExcelFile}>Download Class Template</button>
        <input type="file" onChange={onFileChange} className="mt-2" />
        <button onClick={onFileUpload} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">
          Upload File
        </button>
      </Modal>
    </div>
  );
};

export default ClassroomsList;
