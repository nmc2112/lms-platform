import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const QUESTION_API_BASE_URL = "http://localhost:8080/question";
class QuestionService {


    //downloadTemplate
    downloadTemplate(userId: string){

        return axios.get(QUESTION_API_BASE_URL + "/downloadTemplate", {

            headers: {
                'userId': userId
            }   ,
            responseType: 'blob', // This is important for handling binary data
          });
    }

    importData(file: any, userId: string) {
        const formData = new FormData();
        formData.append("file", file);  // 'file' is the name expected on the backend
        
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'userId': userId  // Passing userId in headers if required
          }
        };
      
        return axios.post(`${QUESTION_API_BASE_URL}/import`, formData, config);
      }
}

export default new QuestionService();