"use client";
import toast from "react-hot-toast";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserService from '../../services/UserService';
import ClassroomService from '../../services/ClassroomService';

import { useRouter } from 'next/navigation';


const AddClassPage = () => {

  const router = useRouter();


  const [formData, setFormData] = useState({
    subjectName: '',
    teacherId: '',
    startTime: '',
    endTime: '',
  });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await UserService.getTeachers();
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changed field ${name} to ${value}`); 
    setFormData({ ...formData, [name]: value });
    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const selectedTeacher = teachers.find(teacher => teacher.name === formData.teacher);


      const dataToSubmit = {
        subjectName: formData.subjectName,
        teacherId: formData.teacherId,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      console.log(dataToSubmit)

      const response = await ClassroomService.addClassroom(dataToSubmit);
      toast.success("Class added succesfully!");
      router.push("/admin/class-manage"); 


      console.log('Form data submitted successfully:', response.data);
      // Optionally, reset the form or redirect the user
      setFormData({
        subjectName: '',
        teacherId: '',
        startTime: '',
        endTime: '',
      });

      

    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };
  return (
    <div className=" p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="w-full p-4 px-8 py-10">
            <h1 className="text-gray-900 font-bold text-2xl mb-5">Add Classroom</h1>
            <form id="classroomForm" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="subjectName" className="block text-gray-700">Subject Name</label>
                <input
                  type="text"
                  id="subjectName"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="teacher" className="block text-gray-700">Teacher</label>
                <select
                  id="teacherId"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                >
                  <option value="" disabled>Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-gray-700">Start Date & Time</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-gray-700">End Date & Time</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  Add Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClassPage;
