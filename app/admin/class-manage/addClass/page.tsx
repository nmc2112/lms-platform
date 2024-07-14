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
    startDate: '',
    startTime: '',
    endTime: '',
    endDate: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('');

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
    setFormData({ ...formData, [name]: value });

    if (name === 'startDate') {
      const date = new Date(value);
      const day = date.toLocaleString('en-US', { weekday: 'long' });
      setDayOfWeek(day);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(formData.startDate);
      const startTime = formData.startTime.split(':');
      const endTime = formData.endTime.split(':');
      const endDate = new Date(formData.endDate);

      startDate.setHours(startTime[0], startTime[1], 0, 0);
      const startDateTime = startDate.toISOString();
      
      const endDateTime = new Date(startDate);
      endDateTime.setHours(endTime[0], endTime[1], 0, 0);
      
      const untilDate = new Date(endDate);
      untilDate.setHours(endTime[0], endTime[1], 0, 0);
      
      const dataToSubmit = {
        subjectName: formData.subjectName,
        teacherId: formData.teacherId,
        startTime: startDateTime,
        endTime: endDateTime.toISOString(),
        until: untilDate.toISOString()
      };

      console.log(dataToSubmit)

      const response = await ClassroomService.addClassroom(dataToSubmit);
      toast.success("Class added successfully!");
      router.push("/admin/class-manage"); 

      console.log('Form data submitted successfully:', response.data);
      setFormData({
        subjectName: '',
        teacherId: '',
        startDate: '',
        startTime: '',
        endTime: '',
        endDate: ''
      });

    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="w-full p-4 px-8 py-10">
            <h1 className="text-gray-900 font-bold text-2xl mb-5">Add Classroom <i>(Weekly Schedule)</i></h1>
            <form id="classroomForm" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="subjectName" className="block text-gray-700">Subject Name</label>
                <input
                  type="text"
                  id="subjectName"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="teacher" className="block text-gray-700">Teacher</label>
                <select
                  id="teacherId"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                >
                  <option value="" disabled>Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                />
                {dayOfWeek && (
                  <p className="text-red-500 text-sm mt-2">Your schedule will be on every {dayOfWeek}.</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-gray-700">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-gray-700">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block w-full rounded-md sm:text-sm"
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
