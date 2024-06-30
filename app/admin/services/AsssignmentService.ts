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

    getQuestionsByAssignment(id: number){
        return axios.get(ASSIGNMENT_API_BASE_URL + "/get-assignment-by-id/"+ id)
    }

}

export default new AssignmentService();