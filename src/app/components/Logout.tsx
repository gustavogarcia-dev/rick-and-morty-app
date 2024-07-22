'use client'
import { useRouter } from "next/navigation";

const Logout: React.FC = () => {
    const router = useRouter();
  
    const handleLogout = () => {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      router.push('auth/login');
    };
  
    return (
        <button
        className="w-full p-4 text-white hover:text-gray-300 rounded-lg mt-auto flex items-center justify-center"
        onClick={handleLogout}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"viewBox="0 0 24 24"strokeWidth={1.5}stroke="currentColor" className="w-6 h-6 mr-2">
          <path strokeLinecap="round"strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
        </svg>
        Logout
      </button>
      
    );
  };
  
  export default Logout;
