import axios from "axios";

const USER_API_BASE_URL = "http://localhost:8080/classroom";
class UserService {

    getClassroom(){
        return axios.get(USER_API_BASE_URL + "/get-all");
    }

    addClassroom(dataToSubmit: any){
        return axios.post(USER_API_BASE_URL + "/save", dataToSubmit);
    }

    getClassroomById(id: number){
        return axios.get(USER_API_BASE_URL + "/detail/"+ id)
    }
    // /add-student-to-classroom
    addStudentToClassroom(dataToSubmit: any){
        return axios.post(USER_API_BASE_URL + "/add-student-to-classroom", dataToSubmit);
    }

    //downloadTemplate
    downloadTemplate(){
        return axios.get(USER_API_BASE_URL + "/downloadTemplate", {
            responseType: 'blob', // This is important for handling binary data
          });
    }
}

export default new UserService();