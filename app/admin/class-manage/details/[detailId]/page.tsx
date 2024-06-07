"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from '../components/Modal';
import ClassroomService from '@/app/admin/services/ClassroomService';
import UserService from '@/app/admin/services/UserService';

const ClassroomDetail = ({
    params
  }: {
    params: { detailId: number; }
  }) => {
  const classroomId  = params;
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await ClassroomService.getClassroomById(classroomId.detailId);
        setClassroom(response.data);

        setAllStudents(response.data.listStudents)
      } catch (error) {
        console.error('Error fetching classroom:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await UserService.getStudents();
        setStudents(response.data)
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchClassroom();
    fetchStudents();
  }, [classroomId]);

  const addStudent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddStudent = async () => {
    try {

      const dataToSubmit = {
        studentId: selectedStudent,
        classroomId: classroomId.detailId
      };

      console.log(dataToSubmit)

      await ClassroomService.addStudentToClassroom(dataToSubmit);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding student to classroom:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden md:max-w-7xl">
        <div className="md:flex">
          <div className="w-full p-4 px-8 py-10">
            <h1 className="text-gray-900 font-bold text-2xl mb-5">Classroom Detail</h1>
            {classroom && (
              <>
                <p><strong>Subject Name:</strong> {classroom.subjectName}</p>
                <p><strong>Total Students:</strong> {classroom.totalStudents}</p>
                <p><strong>Meeting Link:</strong> <a href={classroom.meetingLink} className='text-blue-500 underline'>Link</a></p>
                <p><strong>Start Time:</strong> {new Date(classroom.startTime).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(classroom.endTime).toLocaleString()}</p>
                <button
                  className="px-4 py-2 m-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  onClick={addStudent}
                >
                  Add Student to Classroom
                </button>
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allStudents.length === 0 ? (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No students in this classroom</td>
                      </tr>
                    ) : (
                      allStudents.map((student) => (
                        <>
                        <tr key={student.id}> 
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                        </tr>
                        </>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold mb-4">Add Student to Classroom</h2>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="block w-full mt-2 p-2 border border-gray-300 rounded-md"
        >
          <option value="" disabled>Select student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
        <button
          className="px-4 py-2 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={handleAddStudent}
        >
          OK
        </button>
      </Modal>
    </div>
  );
};

export default ClassroomDetail;
