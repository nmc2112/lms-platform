import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const COURSE_API_BASE_URL = "http://localhost:8080/course";
class CourseService {

    getAllCourses(){
        const response = axios.get(COURSE_API_BASE_URL + "/get-all-courses");
        return response
    }

    getCoursesByTeacherId(userId: string){
        const response = axios.get(COURSE_API_BASE_URL + "/get-all-courses-by-teacherId", {
            headers: {
                'userId': userId
            }   
        });
        return response
    }

}

export default new CourseService();