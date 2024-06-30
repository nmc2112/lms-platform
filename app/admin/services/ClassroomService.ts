import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const CLASSROOM_API_BASE_URL = "http://localhost:8080/classroom";
class ClassroomService {

    getClassroom(){
        const response = axios.get(CLASSROOM_API_BASE_URL + "/get-all");
        return response
    }

    getClassroomByTeacherId(userId: string){
        const response = axios.get(CLASSROOM_API_BASE_URL + "/get-all-by-teacherId", {
            headers: {
                'userId': userId
            }   
        });
        return response
    }

    addClassroom(dataToSubmit: any){
        return axios.post(CLASSROOM_API_BASE_URL + "/save", dataToSubmit);
    }

    getClassroomById(id: number){
        return axios.get(CLASSROOM_API_BASE_URL + "/detail/"+ id)
    }
    // /add-student-to-classroom
    addStudentToClassroom(dataToSubmit: any){
        return axios.post(CLASSROOM_API_BASE_URL + "/add-student-to-classroom", dataToSubmit);
    }

    //downloadTemplate
    downloadTemplate(){
        return axios.get(CLASSROOM_API_BASE_URL + "/downloadTemplate", {
            responseType: 'blob', // This is important for handling binary data
          });
    }
}

export default new ClassroomService();