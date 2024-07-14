import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const ASSIGNMENT_API_BASE_URL = "http://localhost:8080/assignment";
class AssignmentService {


    getAssignmentByStudentId(userId: any){
        const response = axios.get(ASSIGNMENT_API_BASE_URL + "/get-assignment-by-studentId", {
            headers: {
                'userId': userId
            }   
        });
        return response
    }

    getAllStudentsByAssignmentId(id: number){
        return axios.get(ASSIGNMENT_API_BASE_URL + "/get-students-by-assignmentId/"+ id)

    }

    getAssignmentByTeacherId(userId: any){
        const response = axios.get(ASSIGNMENT_API_BASE_URL + "/get-assignment-by-teacherId", {
            headers: {
                'userId': userId
            }   
        });
        return response
    }

    getQuestionsByAssignment(id: number){
        return axios.get(ASSIGNMENT_API_BASE_URL + "/get-assignment-by-id/"+ id)
    }

    getFinishedAssignment(userId:any, id: number){
        return axios.get(ASSIGNMENT_API_BASE_URL + "/get-finished-assignment/"+ id, {
            headers: {
                'userId': userId
            }   
        });
    }

    addAssignmentStudent(dataToSubmit: any){
        return axios.post(ASSIGNMENT_API_BASE_URL + "/save-assignment", dataToSubmit);
    }

    updateAssignmentStudent (userId:string, dataToSubmit: any)  {
        try {
          const response =  axios.post(ASSIGNMENT_API_BASE_URL + "/update-assignmentStudent", dataToSubmit, {
            headers: {
              userId: userId, // Include the userId in the headers
            },
          });
          return response;
        } catch (error) {
          console.error('Error updating assignment student:', error);
          throw error;
        }
    }
}

export default new AssignmentService();