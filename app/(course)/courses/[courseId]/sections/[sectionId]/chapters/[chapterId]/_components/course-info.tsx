import { Star, Globe, Shield } from "lucide-react";

interface CourseInfoProps {
  courseRatings: number;
  students: number;
  averageRating: number
}


const CourseInfo = ({ courseRatings, students, averageRating }: CourseInfoProps) => {

  return (
    <div className="p-4">
      <div className="flex space-x-6 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{averageRating}</span>
          <Star className="text-yellow-500" />
          <span className="text-xs text-gray-500">{courseRatings} ratings</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{students}</span>
          <span className="text-xs text-gray-500">Students</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">1.5 hours</span>
          <span className="text-xs text-gray-500">Total</span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <Shield className="text-gray-500" />
          <span className="text-xs text-gray-700">Last updated May 2022</span>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="text-gray-500" />
          <span className="text-xs text-gray-700">English</span>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
