import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your documents, books, and organize your content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/books"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold">📚</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Books
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Manage your books
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/tags"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold">🏷️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tags
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Organize with tags
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/entities"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold">📄</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Entities
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Manage content
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
