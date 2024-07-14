"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import ClassroomService from '@/app/admin/services/ClassroomService';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';

const ClassroomDetail = ({ params }) => {
  const classroomId = params;
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await ClassroomService.getClassroomById(classroomId.detailId);
        setClassroom(response.data);
        setAllStudents(response.data.listStudents);
      } catch (error) {
        console.error('Error fetching classroom:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await ClassroomService.listAllStudentsToAdd(classroomId.detailId);
        setStudents(response.data);
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

  const exportStudentList = async () => {
    try {
      const response = await ClassroomService.exportStudentListByClass(classroomId.detailId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student-list.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddStudent = async () => {
    try {
      const dataToSubmit = {
        studentId: selectedStudent,
        classroomId: classroomId.detailId,
      };

      const response = await ClassroomService.addStudentToClassroom(dataToSubmit);
      toast.success("Student added successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error('Error adding student to classroom:', error);
    }
  };

  const handleDeleteStudent = (studentId) => {
    setStudentToDelete(studentId);
    setShowConfirmModal(true);
  };

  const confirmDeleteStudent = async () => {
    try {
      await ClassroomService.deleteStudentFromClassroom(studentToDelete, classroomId.detailId);
      toast.success("Student removed successfully");
      setAllStudents(allStudents.filter(student => student.id !== studentToDelete));
      setShowConfirmModal(false);
      setStudentToDelete(null);
    } catch (error) {
      toast.error("Error removing student");
      console.error('Error removing student from classroom:', error);
    }
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setStudentToDelete(null);
  };

  return (
    <div className="p-6">
      <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="">
          <div className="w-full p-4 px-8 py-10">
            <h1 className="text-gray-900 font-bold text-2xl mb-5">Class Detail</h1>
            {classroom && (
              <>
                <p><strong>Subject Name:</strong> {classroom.subjectName}</p>
                <p><strong>Meeting Link:</strong> <a href={classroom.meetingLink} className='text-blue-500 underline'>Link</a></p>
                <button
                  className="px-4 py-2 m-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  onClick={addStudent}
                >
                  Add Student to Classroom
                </button>
                <button
                  className="px-4 py-2 m-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  onClick={exportStudentList}
                >
                  Export Student List
                </button>
                <div className="overflow-x-auto">
                  <table className="min-w-full w-full mt-4">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {allStudents.length === 0 ? (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="4">No students in this classroom</td>
                        </tr>
                      ) : (
                        allStudents.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteStudent(student.id)}
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
      <ConfirmationModal
        show={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={confirmDeleteStudent}
        message="Are you sure you want to delete this student from the classroom?"
      />
    </div>
  );
};

export default ClassroomDetail;
