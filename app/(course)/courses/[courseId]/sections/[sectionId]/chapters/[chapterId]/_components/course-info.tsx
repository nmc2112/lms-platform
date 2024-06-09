import { Star, Globe, Shield } from "lucide-react";

const CourseInfo = () => {
  return (
    <div className="p-4">
      <div className="flex space-x-6 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">4.4</span>
          <Star className="text-yellow-500" />
          <span className="text-xs text-gray-500">124 ratings</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">7,593</span>
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
