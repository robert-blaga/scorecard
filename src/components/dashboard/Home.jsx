import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  BarChart2, Users, Clock, TrendingUp, UserCheck, Building2, 
  Briefcase, Award, Globe2, ChevronDown, ArrowUpRight, ArrowDownRight,
  Calendar, Mail, UserCog, Search, Bell, Filter, Play, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import scorecardsData from '../../data/index.json';

export default function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTitleTimeRange, setJobTitleTimeRange] = useState('week');
  const [scorecardTimeRange, setScorecardTimeRange] = useState('week');
  
  // New state for header functionality
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
    loadNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) throw error;
      
      // Debug log for user dates
      console.log('DEBUG - User Dates:', data?.map(user => ({
        id: user.id,
        registration_date: user.registration_date,
        survey_completions: user.survey_answers?.surveys 
          ? Object.entries(user.survey_answers.surveys).map(([id, survey]) => ({
              scorecard_id: id,
              completed_at: survey.completed_at,
              has_results: !!survey.overall_results?.interpretation
            }))
          : []
      })));
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        if (error) throw error;
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  // Load notifications from localStorage
  const loadNotifications = () => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
      setNotifications([]);
    }
  };

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      read: false,
      ...notification
    };

    const updatedNotifications = [newNotification, ...notifications].slice(0, 5);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Handle notification click
  const handleNotificationClick = (notificationId, link) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );

    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setShowNotifications(false);

    if (link) {
      navigate(link);
    }
  };

  // Handle user menu actions
  const handleUserAction = async (action) => {
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'help':
        window.open('/help-center', '_blank');
        break;
      case 'logout':
        try {
          await supabase.auth.signOut();
          navigate('/login');
        } catch (err) {
          console.error('Error signing out:', err);
        }
        break;
      default:
        break;
    }
    setShowUserMenu(false);
  };

  // Library Stats
  const libraryStats = useMemo(() => {
    const visibleScorecards = scorecardsData.scorecards.filter(
      scorecard => scorecard.scorecardInfo.visibility
    );

    const categorizedScorecards = visibleScorecards.reduce((acc, scorecard) => {
      const category = scorecard.scorecardInfo.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(scorecard);
      return acc;
    }, {});

    return {
      total: visibleScorecards.length,
      categories: Object.keys(categorizedScorecards).length,
      timeToComplete: "15-20",
      categorizedScorecards,
      visibleScorecards
    };
  }, []);

  // Add this helper function at the top level of the component
  const getScorecardTitle = (scorecardId) => {
    // Convert kebab-case to Title Case
    return scorecardId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Add this helper function
  const getDateFromTimeRange = (timeRange) => {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        return new Date(now.setDate(now.getDate() - 1));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case '3months':
        return new Date(now.setMonth(now.getMonth() - 3));
      case '6months':
        return new Date(now.setMonth(now.getMonth() - 6));
      case 'ytd':
        return new Date(now.getFullYear(), 0, 1);
      case 'ytd+1':
        return new Date(now.getFullYear() - 1, 0, 1);
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  };

  // Enhanced User Stats
  const userStats = useMemo(() => {
    // Debug log for stats calculation
    console.log('DEBUG - Stats calculation:', {
      usersInState: users.length,
      timeRange,
      searchQuery
    });

    if (!users.length) {
      console.log('No users found in state');
      return {
        total: 0,
        companies: 0,
        roles: 0,
        assessmentStates: { completed: 0, inProgress: 0, notStarted: 0 },
        completionRate: 0,
        growthRate: 0,
        currentPeriodUsers: 0,
        assessmentDistribution: {},
        jobTitlesByDay: {},
        scorecardsByDay: {},
        jobTitleSummary: [],
        scorecardSummary: [],
        last7Days: [],
        retentionRate: 0,
        retainedUsers: 0
      };
    }

    console.log('DEBUG - Initial users array:', {
      totalUsers: users.length,
      firstUserDate: users[0]?.registration_date,
      lastUserDate: users[users.length - 1]?.registration_date
    });

    // Filter users based on search query
    const filteredUsers = users.filter(user => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        (user.full_name?.toLowerCase().includes(searchLower)) ||
        (user.business_email?.toLowerCase().includes(searchLower)) ||
        (user.company_name?.toLowerCase().includes(searchLower)) ||
        (user.job_function?.toLowerCase().includes(searchLower)) ||
        (Object.keys(user.survey_answers?.surveys || {}).some(id => 
          getScorecardTitle(id).toLowerCase().includes(searchLower)
        ))
      );
    });

    console.log('DEBUG - After filtering:', {
      filteredTotal: filteredUsers.length,
      searchQuery: searchQuery || 'none'
    });

    const now = new Date();
    
    // Calculate last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Time range calculations
    const timeRangeMap = {
      'week': 7,
      'month': 30,
      'year': 365,
      'day': 1,
      '3months': 90,
      '6months': 180,
      'ytd': Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24)),
      'ytd+1': Math.floor((new Date() - new Date(new Date().getFullYear() - 1, 0, 1)) / (1000 * 60 * 60 * 24))
    };

    const daysToSubtract = timeRangeMap[timeRange] || 7;
    const compareDate = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
    
    // Calculate current period users
    const currentPeriodUsers = filteredUsers.filter(user => {
      const userDate = new Date(user.registration_date);
      return userDate > compareDate;
    }).length;
    
    const previousPeriodDate = new Date(compareDate.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
    
    const previousPeriodUsers = filteredUsers.filter(user => {
      const registrationDate = new Date(user.registration_date);
      return registrationDate > previousPeriodDate && registrationDate <= compareDate;
    }).length;

    // Get unique companies and roles
    const companies = new Set(filteredUsers.map(user => user.company_name).filter(Boolean));
    const roles = new Set(filteredUsers.map(user => user.job_function).filter(Boolean));

    console.log('DEBUG - Period calculations:', {
      timeRange,
      daysToSubtract,
      compareDate: compareDate.toISOString(),
      previousPeriodDate: previousPeriodDate.toISOString(),
      currentPeriodUsers,
      previousPeriodUsers,
      sampleUserDates: filteredUsers.slice(0, 3).map(u => u.registration_date)
    });

    const growthRate = previousPeriodUsers !== 0 
      ? ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 0;

    console.log('DEBUG - Final numbers:', {
      total: filteredUsers.length,
      currentPeriodUsers,
      previousPeriodUsers,
      growthRate
    });

    // Calculate job titles distribution by day
    const jobTitlesByDay = filteredUsers.reduce((acc, user) => {
      const registrationDate = new Date(user.registration_date);
      const dateStr = registrationDate.toISOString().split('T')[0];
      const jobTitle = user.job_function || 'Other';

      if (!acc[jobTitle]) {
        acc[jobTitle] = {};
        last7Days.forEach(day => acc[jobTitle][day] = 0);
      }

      if (last7Days.includes(dateStr)) {
        acc[jobTitle][dateStr]++;
      }

      return acc;
    }, {});

    // Calculate retention metrics
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

    // Helper function to get email domain
    const getEmailDomain = (email) => {
      if (!email) return null;
      const atIndex = email.indexOf('@');
      return atIndex >= 0 ? email.slice(atIndex + 1).toLowerCase() : null;
    };

    // Group users by email domain
    const usersByDomain = filteredUsers.reduce((acc, user) => {
      const domain = getEmailDomain(user.business_email);
      if (!domain) return acc;
      
      if (!acc[domain]) {
        acc[domain] = [];
      }
      acc[domain].push(user);
      return acc;
    }, {});

    // Get domains active in the last 30 days
    const recentDomains = Object.entries(usersByDomain).filter(([domain, users]) => {
      return users.some(user => {
        if (!user.survey_answers?.surveys) return false;
        const surveys = Object.values(user.survey_answers.surveys);
        return surveys.some(survey => 
          survey.completed_at && new Date(survey.completed_at) >= thirtyDaysAgo
        );
      });
    }).map(([domain]) => domain);

    // Get retained domains (active in both periods)
    const retainedDomains = recentDomains.filter(domain => {
      const domainUsers = usersByDomain[domain];
      
      // Get all surveys from all users in this domain
      const allSurveys = domainUsers.flatMap(user => 
        Object.values(user.survey_answers?.surveys || {})
      ).filter(survey => survey.completed_at);

      if (allSurveys.length < 2) return false;

      // Sort all surveys by completion date
      const sortedSurveys = allSurveys.sort((a, b) => 
        new Date(b.completed_at) - new Date(a.completed_at)
      );

      // Check if domain has activity in both periods
      const hasRecentActivity = sortedSurveys.some(survey => 
        new Date(survey.completed_at) >= thirtyDaysAgo
      );

      const hasPreviousActivity = sortedSurveys.some(survey => {
        const completionDate = new Date(survey.completed_at);
        return completionDate >= ninetyDaysAgo && completionDate < thirtyDaysAgo;
      });

      return hasRecentActivity && hasPreviousActivity;
    });

    console.log('Domain Retention Debug:', {
      totalDomains: Object.keys(usersByDomain).length,
      recentDomains: recentDomains.length,
      retainedDomains: retainedDomains.length,
      domains: Object.keys(usersByDomain),
      recentDomainsList: recentDomains,
      retainedDomainsList: retainedDomains
    });

    // Calculate retention rate based on domains
    const retentionRate = recentDomains.length > 0 
      ? (retainedDomains.length / recentDomains.length) * 100 
      : 0;

    // Update retained users count to show number of companies (domains) instead
    const retainedUsersCount = retainedDomains.length;

    // Calculate user assessment states using filtered users
    const userAssessmentStates = filteredUsers.reduce((acc, user) => {
      if (!user.survey_answers?.surveys) {
        acc.notStarted++;
      } else {
        const surveys = Object.values(user.survey_answers.surveys);
        const hasCompleted = surveys.some(survey => survey.overall_results?.interpretation);
        
        if (hasCompleted) {
          acc.completed++;
        } else if (surveys.length > 0) {
          acc.inProgress++;
        } else {
          acc.notStarted++;
        }
      }
      return acc;
    }, { completed: 0, inProgress: 0, notStarted: 0 });

    // Calculate completion rate metrics
    const completionRateStats = filteredUsers.reduce((acc, user) => {
      const now = new Date();
      const lastWeek = new Date(now.setDate(now.getDate() - 7));
      const twoWeeksAgo = new Date(now.setDate(now.getDate() - 7));

      if (user.survey_answers?.surveys) {
        const surveys = Object.values(user.survey_answers.surveys);
        const hasCompleted = surveys.some(survey => survey.overall_results?.interpretation);
        
        if (hasCompleted) {
          // Get the most recent completion date
          const completionDates = surveys
            .filter(survey => survey.overall_results?.interpretation)
            .map(survey => new Date(survey.completed_at));
          const mostRecentCompletion = new Date(Math.max(...completionDates));
          
          acc.totalCompleted++;
          
          // Check if completion was within last week
          if (mostRecentCompletion >= lastWeek) {
            acc.lastWeekCompleted++;
          }
          // Check if completion was in the week before last week
          else if (mostRecentCompletion >= twoWeeksAgo) {
            acc.previousWeekCompleted++;
          }
        }
      }
      return acc;
    }, { totalCompleted: 0, lastWeekCompleted: 0, previousWeekCompleted: 0 });

    const currentCompletionRate = (completionRateStats.lastWeekCompleted / filteredUsers.length) * 100;
    const previousCompletionRate = (completionRateStats.previousWeekCompleted / filteredUsers.length) * 100;
    const completionRateChange = currentCompletionRate - previousCompletionRate;

    // Calculate completion rate - now based on completed surveys vs total users
    const completionRate = filteredUsers.length > 0 ? 
      (userAssessmentStates.completed / filteredUsers.length) * 100 : 0;

    // Calculate assessment distribution with filtered users
    const assessmentDistribution = filteredUsers.reduce((acc, user) => {
      if (user.survey_answers?.surveys) {
        Object.entries(user.survey_answers.surveys).forEach(([scorecardId, survey]) => {
          const title = getScorecardTitle(scorecardId);
          if (!acc[title]) {
            acc[title] = 0;
          }
          acc[title]++;
        });
      }
      return acc;
    }, {});

    // Calculate job titles distribution by day with filtered users
    const jobTitlesByDayFiltered = filteredUsers.reduce((acc, user) => {
      const registrationDate = new Date(user.registration_date);
      const dateStr = registrationDate.toISOString().split('T')[0];
      const jobTitle = user.job_function || 'Other';

      if (!acc[jobTitle]) {
        acc[jobTitle] = {};
        last7Days.forEach(day => acc[jobTitle][day] = 0);
      }

      if (last7Days.includes(dateStr)) {
        acc[jobTitle][dateStr]++;
      }

      return acc;
    }, {});

    // Update job titles calculation with filtered users
    const jobTitleSummary = Object.entries(jobTitlesByDayFiltered)
      .map(([title, counts]) => ({
        title,
        total: Object.values(counts).reduce((acc, count) => acc + count, 0),
        percentage: ((Object.values(counts).reduce((acc, count) => acc + count, 0) / filteredUsers.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.total - a.total);

    // Calculate scorecard completion calculation with filtered users
    const scorecardCompletionStats = filteredUsers.reduce((acc, user) => {
      if (user.survey_answers?.surveys) {
        Object.entries(user.survey_answers.surveys).forEach(([scorecardId, survey]) => {
          const title = getScorecardTitle(scorecardId);
          
          if (!acc[title]) {
            acc[title] = {
              name: title,
              completions: 0,
              lastWeekCompletions: 0
            };
          }

          if (survey.overall_results?.interpretation) {
            acc[title].completions++;
            // Check if completion was within last week
            const completionDate = new Date(survey.completed_at);
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            if (completionDate >= lastWeek) {
              acc[title].lastWeekCompletions++;
            }
          }
        });
      }
      return acc;
    }, {});

    // Convert to array and sort by completions
    const scorecardSummary = Object.values(scorecardCompletionStats)
      .map(stat => ({
        type: stat.name,
        total: stat.completions,
        lastWeekTotal: stat.lastWeekCompletions,
        percentage: (stat.completions / filteredUsers.length * 100).toFixed(1),
        lastWeekPercentage: (stat.lastWeekCompletions / filteredUsers.length * 100).toFixed(1),
        change: ((stat.completions - stat.lastWeekCompletions) / (stat.lastWeekCompletions || 1) * 100).toFixed(1)
      }))
      .sort((a, b) => b.total - a.total);

    console.log('Final stats:', {
      total: filteredUsers.length,
      currentPeriodUsers,
      growthRate
    });

    return {
      total: filteredUsers.length,
      companies: companies.size,
      roles: roles.size,
      assessmentStates: userAssessmentStates,
      completionRate: currentCompletionRate,
      previousCompletionRate: previousCompletionRate,
      completionRateChange: completionRateChange,
      completedSurveys: completionRateStats.totalCompleted,
      growthRate,
      currentPeriodUsers,
      assessmentDistribution,
      jobTitlesByDay,
      scorecardsByDay: scorecardCompletionStats,
      jobTitleSummary,
      scorecardSummary,
      last7Days,
      scorecardCompletionStats,
      retentionRate,
      retainedUsers: retainedUsersCount,
      lastWeekCompleted: completionRateStats.lastWeekCompleted,
      previousWeekCompleted: completionRateStats.previousWeekCompleted
    };
  }, [users, timeRange, jobTitleTimeRange, scorecardTimeRange, searchQuery]);

  const safeNumber = (num) => {
    if (num === undefined || num === null) return '0.0';
    return Number(num).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 animate-pulse">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm border border-red-200">
          Error loading dashboard data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="ytd">Year to Date</option>
                <option value="ytd+1">Year to Date + Previous</option>
              </select>
            </div>

            <div className="flex items-center gap-6 ml-4">
              {/* Help Center */}
              <button 
                onClick={() => window.open('https://www.brainiup.com', '_blank')}
                className="text-gray-500 hover:text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Brainiup</span>
                </div>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  className="relative text-gray-500 hover:text-gray-600"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id, notification.link)}
                            className={`w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <div className="flex-1 text-left">
                              <p className="text-sm text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-sm text-gray-500 text-center">
                          <Bell className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                          <p>No notifications yet</p>
                          <p className="text-xs mt-1">We'll notify you when something important happens</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative flex items-center gap-3 border-l pl-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {currentUser?.full_name || 'Admin User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {currentUser?.role || 'Administrator'}
                  </span>
                </div>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <UserCog className="w-5 h-5" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => handleUserAction('profile')}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                      Your Profile
                    </button>
                    <button
                      onClick={() => handleUserAction('settings')}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => handleUserAction('help')}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                      Help & Support
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => handleUserAction('logout')}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor your business analytics and performance metrics
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Total Users</span>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                (userStats?.growthRate || 0) > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}>
                {(userStats?.growthRate || 0) > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {safeNumber(Math.abs(userStats?.growthRate || 0))}%
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">{(userStats?.total || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {userStats?.currentPeriodUsers || 0} new in period
                </p>
              </div>
              <div className="h-16 w-24 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Most Active Scorecard</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats?.scorecardSummary?.[0]?.type || 'No data'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {userStats?.scorecardSummary?.[0]?.total || 0} completions
                </p>
              </div>
              <div className="h-16 w-24 bg-amber-50 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ 
                    width: `${userStats?.scorecardSummary?.[0]?.percentage || 0}%` 
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">
                {userStats?.scorecardSummary?.[0]?.percentage || 0}% completion rate
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Completion Rate</span>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                (userStats?.completionRateChange || 0) >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}>
                {(userStats?.completionRateChange || 0) >= 0 ? 
                  <ArrowUpRight className="w-3 h-3" /> : 
                  <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(safeNumber(userStats?.completionRateChange))}%
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">{safeNumber(userStats?.completionRate)}%</p>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">
                    {userStats?.lastWeekCompleted || 0} users completed this week
                  </p>
                  <p className="text-xs text-gray-400">
                    Last week: {safeNumber(userStats?.previousCompletionRate)}%
                  </p>
                </div>
              </div>
              <div className="h-16 w-24 bg-green-50 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Retention Rate</span>
              <span className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
                Multiple surveys
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">{safeNumber(userStats?.retentionRate)}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {userStats?.retainedUsers || 0} returning users
                </p>
              </div>
              <div className="h-16 w-24 bg-amber-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-gray-900">Job Title Distribution</h3>
            </div>
            <div className="space-y-4">
              {userStats?.jobTitleSummary?.map(({ title, total, percentage }) => (
                <div key={title} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{title}</span>
                    <span className="text-sm text-gray-500">{total} users ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!userStats?.jobTitleSummary?.length) && (
                <div className="text-sm text-gray-500 text-center py-4">
                  No job title data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-gray-900">Scorecard Completion</h3>
            </div>
            <div className="space-y-6">
              {userStats?.scorecardSummary?.map(({ type, total, percentage, lastWeekPercentage, change }) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-indigo-600">{total} completions</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${
                        parseFloat(change) >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                      }`}>
                        {parseFloat(change) >= 0 ? 
                          <ArrowUpRight className="w-3 h-3" /> : 
                          <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(parseFloat(change))}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-indigo-500 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      vs last week ({lastWeekPercentage}%)
                    </span>
                    <span className="text-gray-500">
                      Current: {percentage}% of users completed
                    </span>
                  </div>
                </div>
              ))}
              {(!userStats?.scorecardSummary?.length) && (
                <div className="text-sm text-gray-500 text-center py-4">
                  No scorecard completion data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Company Statistics Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Company Statistics</h2>
              <p className="text-sm text-gray-500">Overview of companies using the platform</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Companies</p>
                  <p className="text-2xl font-semibold text-gray-900">{userStats.companies}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Completions</p>
                  {(() => {
                    const totalCompletions = users.reduce((total, user) => {
                      if (!user.survey_answers?.surveys) return total;
                      const completedSurveys = Object.values(user.survey_answers.surveys)
                        .filter(survey => survey.overall_results?.interpretation);
                      return total + completedSurveys.length;
                    }, 0);

                    return (
                      <>
                        <p className="text-2xl font-semibold text-gray-900">
                          {totalCompletions.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(totalCompletions / Math.max(users.length, 1)).toFixed(1)} per user
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-50 rounded-lg">
                  <UserCheck className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Most Active Company</p>
                  {(() => {
                    const domainStats = users.reduce((acc, user) => {
                      if (!user.business_email) return acc;
                      const domain = user.business_email.split('@')[1];
                      if (!domain) return acc;

                      if (!acc[domain]) {
                        acc[domain] = {
                          completions: 0,
                          name: domain
                        };
                      }

                      if (user.survey_answers?.surveys) {
                        const completedSurveys = Object.values(user.survey_answers.surveys)
                          .filter(survey => survey.overall_results?.interpretation);
                        acc[domain].completions += completedSurveys.length;
                      }

                      return acc;
                    }, {});

                    const mostActive = Object.values(domainStats)
                      .sort((a, b) => b.completions - a.completions)[0];

                    return mostActive ? (
                      <>
                        <p className="text-lg font-semibold text-gray-900 truncate max-w-[180px]" title={mostActive.name}>
                          {mostActive.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {mostActive.completions} completions
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">No data</p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Domain Completions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Email Domain Activity</h2>
              <p className="text-sm text-gray-500">Scorecard completions by business email domains</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6">
              <div className="space-y-6">
                {Object.entries(users.reduce((acc, user) => {
                  if (!user.business_email) return acc;
                  const domain = user.business_email.split('@')[1];
                  if (!domain) return acc;

                  if (!acc[domain]) {
                    acc[domain] = {
                      totalUsers: 0,
                      completedScorecards: 0,
                      uniqueUsers: new Set()
                    };
                  }

                  acc[domain].totalUsers++;
                  acc[domain].uniqueUsers.add(user.id);

                  if (user.survey_answers?.surveys) {
                    const completedSurveys = Object.values(user.survey_answers.surveys)
                      .filter(survey => survey.overall_results?.interpretation);
                    acc[domain].completedScorecards += completedSurveys.length;
                  }

                  return acc;
                }, {}))
                .sort((a, b) => b[1].completedScorecards - a[1].completedScorecards)
                .slice(0, 5)
                .map(([domain, stats]) => (
                  <div key={domain} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{domain}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {stats.uniqueUsers.size} users
                        </span>
                        <span className="text-sm font-medium text-indigo-600">
                          {stats.completedScorecards} completions
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-indigo-500 h-2.5 rounded-full"
                        style={{ 
                          width: `${(stats.completedScorecards / (stats.uniqueUsers.size * 3) * 100).toFixed(1)}%` 
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Avg. {(stats.completedScorecards / stats.uniqueUsers.size).toFixed(1)} scorecards per user</span>
                      <span>{((stats.completedScorecards / (stats.uniqueUsers.size * 3)) * 100).toFixed(1)}% completion rate</span>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No email domain data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Library Overview Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Library Overview</h2>
              <p className="text-sm text-gray-500">Quick access to available assessments</p>
            </div>
            <Link
              to="/library"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all assessments →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-semibold text-gray-900">{libraryStats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-semibold text-gray-900">{libraryStats.categories}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Time to Complete</p>
                  <p className="text-2xl font-semibold text-gray-900">{libraryStats.timeToComplete} min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {Object.entries(libraryStats.categorizedScorecards).map(([category, scorecards]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {category}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({scorecards.length})
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {scorecards.map((scorecard) => (
                      <li key={scorecard.id}>
                        <Link
                          to={`/instructions/${scorecard.id}`}
                          className="text-sm text-gray-900 hover:text-blue-600 transition-colors duration-200"
                        >
                          {scorecard.scorecardInfo.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scorecard
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users
                  .filter(user => {
                    if (!searchQuery) return true;
                    const searchLower = searchQuery.toLowerCase();
                    return (
                      (user.full_name?.toLowerCase().includes(searchLower)) ||
                      (user.business_email?.toLowerCase().includes(searchLower)) ||
                      (user.company_name?.toLowerCase().includes(searchLower)) ||
                      (user.job_function?.toLowerCase().includes(searchLower)) ||
                      (Object.keys(user.survey_answers?.surveys || {}).some(id => 
                        getScorecardTitle(id).toLowerCase().includes(searchLower)
                      ))
                    );
                  })
                  .slice(0, 5)
                  .map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{user.business_email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.company_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.job_function || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        if (!user.survey_answers?.surveys) {
                          return (
                            <span className="text-sm text-gray-500">No scorecard</span>
                          );
                        }

                        const surveys = Object.entries(user.survey_answers.surveys);
                        if (surveys.length === 0) {
                          return (
                            <span className="text-sm text-gray-500">No scorecard</span>
                          );
                        }

                        // Get the most recent survey
                        const sortedSurveys = surveys.sort((a, b) => {
                          const dateA = new Date(a[1].completed_at);
                          const dateB = new Date(b[1].completed_at);
                          return dateB - dateA;
                        });

                        const [scorecardId, survey] = sortedSurveys[0];
                        const scorecardName = getScorecardTitle(scorecardId);
                        const hasCompleted = survey.overall_results?.interpretation;
                        
                        return (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            hasCompleted ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {scorecardName}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.registration_date 
                        ? new Date(user.registration_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'N/A'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 