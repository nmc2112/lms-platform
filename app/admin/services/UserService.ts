import axios from "axios";

const USER_API_BASE_URL = "http://localhost:8080/user";
class UserService {

    getUsers(){
        return axios.get(USER_API_BASE_URL + "/get-all-users");
    }

    getTeachers(){
        return axios.get(USER_API_BASE_URL + "/get-all-teachers");
    }

}

export default new UserService();