import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const CLASSROOM_API_BASE_URL = "http://localhost:8080/classroom";
class ClassroomService {

    getClassroom(){
        const response = axios.get(CLASSROOM_API_BASE_URL + "/get-all");
        return response
    }

    listAllStudentsToAdd(classroomId: number){
        const response = axios.get(CLASSROOM_API_BASE_URL + "/" + classroomId + "/get-students-to-add");
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

    getClassroomByStudentId(userId: string){
        const response = axios.get(CLASSROOM_API_BASE_URL + "/get-all-by-studentId", {
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

    exportStudentListByClass(id: number){
        return axios.get(CLASSROOM_API_BASE_URL + "/exportStudentListByClass/"+ id, {
            responseType: 'blob', // This is important for handling binary data
          });
    }

    // /add-student-to-classroom
    addStudentToClassroom(dataToSubmit: any){
        return axios.post(CLASSROOM_API_BASE_URL + "/add-student-to-classroom", dataToSubmit);
    }

    deleteStudentFromClassroom = (studentId: any, classroomId: any) => {
        return axios.post(`${CLASSROOM_API_BASE_URL}/delete-student`, {
          studentId,
          classroomId,
        });
      };

    //downloadTemplate
    downloadTemplate(){
        return axios.get(CLASSROOM_API_BASE_URL + "/downloadTemplate", {
            responseType: 'blob', // This is important for handling binary data
          });
    }


    importData(file: any) {
        const formData = new FormData();
        formData.append("file", file);  // 'file' is the name expected on the backend
      
        return axios.post(`${CLASSROOM_API_BASE_URL}/import`, formData);
      }
}

export default new ClassroomService();