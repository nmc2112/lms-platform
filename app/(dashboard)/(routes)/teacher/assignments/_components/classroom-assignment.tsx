"use client"

import React, { useEffect, useState } from 'react';
import ClassroomService from "@/app/admin/services/ClassroomService";
import { QuesCategory } from '@prisma/client';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './ClassAssignment.module.css';  // Assuming CSS module setup

interface ClassAssignmentProps {
    userId: string;
    quesCategories: QuesCategory[]
}

interface Classroom {
    id: string;
    subjectName: string;
}

interface Category {
    id: string;
    name: string;
}

export function ClassAssignment({ userId, quesCategories }: ClassAssignmentProps) {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [selectedClassroomId, setSelectedClassroomId] = useState("");
    const [assignmentName, setAssignmentName] = useState("");
    const [duration, setDuration] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const classroomResponse = await ClassroomService.getClassroomByTeacherId(userId);
                setClassrooms(classroomResponse.data);
                setCategories(quesCategories);

                // Set default values if there are any classrooms or categories
                if (classroomResponse.data.length > 0) {
                    setSelectedClassroomId(classroomResponse.data[0].id.toString());
                }
                if (quesCategories.length > 0) {
                    setSelectedCategoryId(quesCategories[0].id.toString());
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [userId, quesCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignmentName || !duration || !numberOfQuestions) {
            toast.error("Please fill all fields correctly.");
            return;
        }

        try {
            const payload = {
                name: assignmentName,
                duration: parseInt(duration),
                numberOfQuestions: parseInt(numberOfQuestions),
                classroomId: parseInt(selectedClassroomId),
                quesCategoryId: selectedCategoryId,
            };

            const response = await axios.post(`/api/assignments`, payload);
            if (response.status === 201) {
                toast.success("Assignment created successfully!");
            }
        } catch (error) {
            console.error('Error creating assignment:', error);
            toast.error("Failed to create assignment.");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Set up assignment for your class</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Classroom
                    <select className={styles.select} value={selectedClassroomId} onChange={e => setSelectedClassroomId(e.target.value)}>
                        {classrooms.map((classroom) => (
                            <option key={classroom.id} value={classroom.id}>{classroom.subjectName}</option>
                        ))}
                    </select>
                </label>
                <label className={styles.label}>
                    Assignment Name
                    <input type="text" className={styles.input} placeholder="Assignment Name" value={assignmentName} onChange={e => setAssignmentName(e.target.value)} />
                </label>
                <label className={styles.label}>
                    Duration (minutes)
                    <input type="number" className={styles.input} placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} />
                </label>
                <label className={styles.label}>
                    Number of Questions
                    <input type="number" className={styles.input} placeholder="Number of Questions" value={numberOfQuestions} onChange={e => setNumberOfQuestions(e.target.value)} />
                </label>
                <label className={styles.label}>
                    Question Category
                    <select className={styles.select} value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit" className={styles.button}>Create Assignment</button>
            </form>
        </div>
    );
}
