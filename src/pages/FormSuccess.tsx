import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function FormSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Success!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your response has been submitted successfully.
          </p>
          <div className="mt-8">
            <Link to="/" className="text-green-600 hover:text-green-500 font-medium">
              Create your own form with Formify
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
