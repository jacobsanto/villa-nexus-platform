
import { Building2 } from "lucide-react";

const LoginPageHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl mb-4">
        <Building2 className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Arivio</h1>
      <p className="text-gray-600">Property Management Platform</p>
    </div>
  );
};

export default LoginPageHeader;
