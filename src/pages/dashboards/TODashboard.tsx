import React, { useState, useEffect } from 'react';
import { FiHome, FiAlertCircle, FiBell, FiMapPin, FiCheckSquare, FiUser, FiLogOut } from 'react-icons/fi';

interface Issue {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected' | 'Open' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
  deviceId?: string;
  complaintType?: string;
  location?: string;
  attachment?: string | null;
  assignedTo?: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  issueId?: number;
}

const TODashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'tasks'>('overview');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newIssueStatus, setNewIssueStatus] = useState<Issue['status'] | null>(null);

  useEffect(() => {
    // Mock data, replace with real API calls if needed
    const mockIssues: Issue[] = [
      {
        id: 1,
        title: 'Network Connectivity Issue',
        description: 'Unable to connect to the office network',
        status: 'Open',
        priority: 'High',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deviceId: 'DEV-001',
        complaintType: 'Network',
        location: 'Floor 1, Room 101',
        assignedTo: 'TO-001'
      },
      {
        id: 2,
        title: 'Printer Not Working',
        description: 'Printer in the marketing department is not responding',
        status: 'In Progress',
        priority: 'Medium',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        deviceId: 'PRN-001',
        complaintType: 'Hardware',
        location: 'Marketing Department',
        assignedTo: 'TO-001'
      }
    ];

    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Replace Network Switch',
        description: 'Replace the faulty network switch in the server room',
        status: 'Pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'High',
        issueId: 1
      },
      {
        id: 2,
        title: 'Update Printer Drivers',
        description: 'Update printer drivers on all marketing department computers',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'Medium',
        issueId: 2
      }
    ];

    setIssues(mockIssues);
    setTasks(mockTasks);
  }, []);

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setNewIssueStatus(issue.status);
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleUpdateIssueStatus = () => {
    if (!selectedIssue || !newIssueStatus) return;
    setIssues(issues.map(issue =>
      issue.id === selectedIssue.id
        ? { ...issue, status: newIssueStatus, updatedAt: new Date().toISOString() }
        : issue
    ));
    setSelectedIssue({ ...selectedIssue, status: newIssueStatus, updatedAt: new Date().toISOString() });
    setShowModal(false);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleUpdateTaskStatus = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    setShowModal(false);
  };

  const handleLogout = () => {
    window.location.reload();
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      Completed: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Open: 'bg-purple-100 text-purple-800',
      Resolved: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const pendingIssues = issues.filter(issue =>
    ['Pending', 'In Progress', 'Open'].includes(issue.status)
  );
  const pendingTasks = tasks.filter(task => task.status !== 'Completed');

  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
      <FiUser className="w-5 h-5" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r shadow fixed left-0 top-0 bottom-0 flex flex-col">
        <div className="flex items-center space-x-2 px-4 py-4 border-b">
          <FiMapPin className="text-purple-700" size={24} />
          <span className="text-2xl font-bold text-purple-700">Issue Tracker</span>
        </div>
        <nav className="flex flex-col space-y-3 px-2 py-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center px-4 py-2 rounded-md transition-all text-left w-full ${
              activeTab === 'overview'
                ? 'bg-purple-100 text-purple-700 font-semibold'
                : 'hover:bg-purple-200 text-gray-700'
            }`}
          >
            <FiHome className="mr-2" size={20} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center px-4 py-2 rounded-md transition-all text-left w-full ${
              activeTab === 'issues'
                ? 'bg-purple-100 text-purple-700 font-semibold'
                : 'hover:bg-purple-200 text-gray-700'
            }`}
          >
            <FiAlertCircle className="mr-2" size={20} /> Issues
            {pendingIssues.length > 0 && (
              <span className="ml-auto bg-red-400 text-red-900 text-xs px-2 py-1 rounded-full">
                {pendingIssues.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center px-4 py-2 rounded-md transition-all text-left w-full ${
              activeTab === 'tasks'
                ? 'bg-purple-100 text-purple-700 font-semibold'
                : 'hover:bg-purple-200 text-gray-700'
            }`}
          >
            <FiCheckSquare className="mr-2" size={20} /> Tasks
            {pendingTasks.length > 0 && (
              <span className="ml-auto bg-blue-400 text-blue-900 text-xs px-2 py-1 rounded-full">
                {pendingTasks.length}
              </span>
            )}
          </button>
        </nav>
        <div className="mt-auto px-4 py-4 border-t flex justify-between items-center">
          <span className="text-gray-500 text-sm">Technical Officer</span>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-gray-500 hover:text-red-600"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-56 pt-20 px-6 overflow-auto">
        {/* Top Navbar */}
        <div className="fixed top-4 left-56 right-4 bg-white shadow z-10 py-3 px-6 rounded-xl flex justify-between items-center">
          <h1 className="text-xl font-bold text-purple-700 capitalize">
            {activeTab === 'overview' ? 'Issues Overview' : `Issue Tracker - ${activeTab}`}
          </h1>
          <div className="flex items-center space-x-4">
            <FiBell className="text-gray-700 cursor-pointer" size={18} />
            <UserAvatar />
            <span className="text-gray-700 text-sm">Technical Officer</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="mt-16">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Total Issues</h3>
                  <p className="text-3xl font-bold text-purple-700">{issues.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Pending Issues</h3>
                  <p className="text-3xl font-bold text-yellow-600">{pendingIssues.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Pending Tasks</h3>
                  <p className="text-3xl font-bold text-green-600">{pendingTasks.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-purple-700">Recent Issues</h2>
                    <button
                      onClick={() => setActiveTab('issues')}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {issues.slice(0, 5).map(issue => (
                      <div
                        key={issue.id}
                        className="p-4 border rounded-lg hover:shadow-md cursor-pointer"
                        onClick={() => handleViewIssue(issue)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900">{issue.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(issue.status)}`}>
                            {issue.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>#{issue.id}</span>
                          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-purple-700">Upcoming Tasks</h2>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {tasks.slice(0, 5).map(task => (
                      <div
                        key={task.id}
                        className="p-4 border rounded-lg hover:shadow-md cursor-pointer"
                        onClick={() => handleViewTask(task)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
                              {task.status}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-purple-700">All Issues</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {issues.map(issue => (
                        <tr key={issue.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{issue.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                            <div className="text-sm text-gray-500">{issue.description.substring(0, 50)}...</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(issue.status)}`}>
                              {issue.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(issue.priority)}`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewIssue(issue)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-purple-700">All Tasks</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map(task => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{task.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            <div className="text-sm text-gray-500">{task.description.substring(0, 50)}...</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewTask(task)}
                              className="text-purple-600 hover:text-purple-900 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
                                handleUpdateTaskStatus(task.id, newStatus);
                              }}
                              className={`${
                                task.status === 'Completed' ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white'
                              } px-3 py-1 rounded hover:opacity-90`}
                            >
                              {task.status === 'Completed' ? 'Mark Incomplete' : 'Complete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal for viewing/editing issues and tasks */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {selectedIssue ? (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-700">Issue Details</h3>
                      <p className="text-sm text-gray-500">ID: #{selectedIssue.id}</p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{selectedIssue.title}</h4>
                      <p className="mt-2 text-gray-600">{selectedIssue.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Status with dropdown for update */}
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          id="status"
                          value={newIssueStatus || ''}
                          onChange={(e) => setNewIssueStatus(e.target.value as Issue['status'])}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Open">Open</option>
                        </select>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(selectedIssue.priority)}`}>
                            {selectedIssue.priority}
                          </span>
                        </p>
                      </div>

                      {selectedIssue.deviceId && (
                        <div>
                          <p className="text-sm text-gray-500">Device ID</p>
                          <p className="font-medium">{selectedIssue.deviceId}</p>
                        </div>
                      )}
                      {selectedIssue.location && (
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{selectedIssue.location}</p>
                        </div>
                      )}
                      {selectedIssue.complaintType && (
                        <div>
                          <p className="text-sm text-gray-500">Complaint Type</p>
                          <p className="font-medium">{selectedIssue.complaintType}</p>
                        </div>
                      )}
                      {selectedIssue.assignedTo && (
                        <div>
                          <p className="text-sm text-gray-500">Assigned To</p>
                          <p className="font-medium">{selectedIssue.assignedTo}</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Created</p>
                          <p className="text-sm font-medium">
                            {new Date(selectedIssue.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="text-sm font-medium">
                            {new Date(selectedIssue.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateIssueStatus()}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ) : selectedTask ? (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-700">Task Details</h3>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{selectedTask.title}</h4>
                      <p className="text-gray-600 mt-1">{selectedTask.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedTask.status)}`}>
                            {selectedTask.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(selectedTask.priority)}`}>
                            {selectedTask.priority}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-medium">
                          {new Date(selectedTask.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedTask.issueId && (
                        <div>
                          <p className="text-sm text-gray-500">Related Issue</p>
                          <p className="font-medium">#{selectedTask.issueId}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Close
                      </button>
                      {selectedTask.status !== 'Completed' && (
                        <button
                          onClick={() => {
                            handleUpdateTaskStatus(selectedTask.id, 'Completed');
                            setShowModal(false);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TODashboard;
