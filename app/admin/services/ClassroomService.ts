import axios from "axios";

const USER_API_BASE_URL = "http://localhost:8080/classroom";
class UserService {

    getClassroom(){
        return axios.get(USER_API_BASE_URL + "/get-all");
    }

    addClassroom(dataToSubmit: any){
        return axios.post(USER_API_BASE_URL + "/save", dataToSubmit);
    }

}

export default new UserService();