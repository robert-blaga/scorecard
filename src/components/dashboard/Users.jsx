import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper function to convert kebab-case to Title Case
  const getScorecardTitle = (scorecardId) => {
    return scorecardId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          company_name,
          business_email,
          job_function,
          survey_answers
        `)
        .order('full_name');

      if (error) throw error;

      const processedUsers = data.map(user => {
        const surveyData = user.survey_answers?.surveys?.['discover-work'];
        const surveyCompleted = !!surveyData?.completed_at;
        const needLevel = surveyData?.overall_results?.interpretation?.disc_need?.needLevel || 'Not Available';
        const completionPercentage = surveyData?.overall_results?.interpretation?.disc_need?.percentage || '0';
        
        // Get the most recent survey if it exists
        let scorecardName = 'Not Started';
        if (user.survey_answers?.surveys) {
          const surveys = Object.entries(user.survey_answers.surveys);
          if (surveys.length > 0) {
            const [scorecardId] = surveys[0];
            scorecardName = getScorecardTitle(scorecardId);
          }
        }

        return {
          ...user,
          surveyCompleted,
          needLevel,
          completionPercentage: parseFloat(completionPercentage),
          scorecardName
        };
      });

      setUsers(processedUsers);
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 xl:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative size-12">
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6 xl:p-8">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[2000px] mx-auto">
      <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">Users</h1>
      
      {users.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">No users found in the database</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      ) : (
        <div className="@container">
          <div className="relative overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-3 font-medium text-gray-900">Full Name</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Company</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Business Email</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Job Function</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Scorecard</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Need Level</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr 
                    key={user.id}
                    className="group transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{user.company_name || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-500">{user.business_email || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-500">{user.job_function || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {user.scorecardName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`
                        inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors
                        ${user.needLevel === 'Very High Need' ? 'bg-red-50 text-red-700 group-hover:bg-red-100' :
                          user.needLevel === 'High Need' ? 'bg-orange-50 text-orange-700 group-hover:bg-orange-100' :
                          user.needLevel === 'Moderate Need' ? 'bg-yellow-50 text-yellow-700 group-hover:bg-yellow-100' :
                          user.needLevel === 'Low Need' ? 'bg-green-50 text-green-700 group-hover:bg-green-100' :
                          user.needLevel === 'Very Low Need' ? 'bg-blue-50 text-blue-700 group-hover:bg-blue-100' :
                          'bg-gray-50 text-gray-700 group-hover:bg-gray-100'}
                      `}>
                        {user.needLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100 ring-1 ring-inset ring-gray-950/5">
                          <div 
                            className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${user.completionPercentage}%` }}
                          />
                        </div>
                        <span className="min-w-[45px] text-sm text-gray-700">
                          {user.completionPercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 