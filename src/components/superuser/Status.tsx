import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiLayers, FiMoreVertical, FiThumbsUp, FiClock, FiAlertCircle, FiCheck, FiX, FiInfo, FiExternalLink } from 'react-icons/fi';
import { CiCircleList, CiWallet, CiClock1 } from 'react-icons/ci';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Issue {
  id: number;
  deviceId: string;
  complaintType: string;
  description: string;
  priorityLevel: string;
  location: string;
  status: string;
  submittedAt: string;
  attachment: string | null;
  underWarranty: boolean;
  approvals: Array<{
    id: number;
    approvalLevel: string;
    status: string;
    approvedAt: string;
    approver: {
      username: string;
    };
  }>;
}

const Status = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [overviewStats, setOverviewStats] = useState({
    totalIssues: 0,
    dcApprovedIssues: 0,
    superUserApprovedIssues: 0,
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/issues', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.data || !response.data.issues) {
        console.error('Invalid response format:', response.data);
        return;
      }

      const allIssues = response.data.issues;
      setIssues(allIssues);
      
      // Update overview stats
      setOverviewStats({
        totalIssues: allIssues.length,
        dcApprovedIssues: allIssues.filter((issue: Issue) => issue.status === 'DC Approved').length,
        superUserApprovedIssues: allIssues.filter((issue: Issue) => issue.status === 'Super User Approved').length,
      });
    } catch (error: any) {
      console.error('Error fetching issues:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setShowViewModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedIssue || !newStatus) return;
    
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/issues/${selectedIssue.id}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update the issue in the local state
      const updatedIssues = issues.map(issue => 
        issue.id === selectedIssue.id 
          ? { ...issue, status: newStatus } 
          : issue
      );
      
      setIssues(updatedIssues);
      setSelectedIssue({ ...selectedIssue, status: newStatus });
      toast.success('Status updated successfully');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusOptions = (currentStatus: string) => {
    const statusFlow = [
      'Pending',
      'DC Approved',
      'Super User Approved',
      'Super Admin Approved',
      'Resolved',
      'Rejected'
    ];
    
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1) return statusFlow;
    
    return statusFlow.slice(currentIndex);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'DC Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Super User Approved':
        return 'bg-green-100 text-green-800';
      case 'Super Admin Approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="p-4">
  {/* Overview Stats */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-md">
        <FiLayers size={24} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700">Total Issues</h3>
        <p className="text-xl font-bold text-blue-600">{overviewStats.totalIssues}</p>
      </div>
    </div>

    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className="bg-yellow-100 text-yellow-600 p-2 rounded-md">
        <FiCheckCircle size={24} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700">DC Approved</h3>
        <p className="text-xl font-bold text-yellow-600">{overviewStats.dcApprovedIssues}</p>
      </div>
    </div>

    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className="bg-green-100 text-green-600 p-2 rounded-md">
        <FiThumbsUp size={24} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700">Super User Approved</h3>
        <p className="text-xl font-bold text-green-600">{overviewStats.superUserApprovedIssues}</p>
      </div>
    </div>
  </div>
</div>

      {/* Issues Table */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">All Issues</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-normal">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-normal">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-normal">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-normal">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-normal">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-normal">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-normal">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {issue.deviceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {issue.complaintType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {issue.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(issue.priorityLevel)}`}>
                      {issue.priorityLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {issue.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(issue.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleViewIssue(issue)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Issue Modal */}
      {showViewModal && selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 w-4/5 max-w-4xl">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Issue Details</h3>
                  <p className="text-sm text-gray-500">ID: {selectedIssue.id}</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Device ID</h4>
                      <p className="text-gray-900">{selectedIssue.deviceId}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Complaint Type</h4>
                      <p className="text-gray-900">{selectedIssue.complaintType}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Priority</h4>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedIssue.priorityLevel)}`}>
                        {selectedIssue.priorityLevel}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                      <p className="text-gray-900">{selectedIssue.location}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Warranty Status</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedIssue.underWarranty 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedIssue.underWarranty ? 'Under Warranty' : 'Out of Warranty'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Current Status</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIssue.status)}`}>
                          {selectedIssue.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          <FiClock className="inline mr-1" />
                          {new Date(selectedIssue.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Update Status</h4>
                      <div className="flex space-x-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          disabled={isUpdating}
                        >
                          {getStatusOptions(selectedIssue.status).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleStatusUpdate}
                          disabled={isUpdating || newStatus === selectedIssue.status}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            isUpdating || newStatus === selectedIssue.status
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700">{selectedIssue.description}</p>
                      </div>
                    </div>
                    
                    {selectedIssue.attachment && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Attachment</h4>
                        <a
                          href={selectedIssue.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <FiExternalLink className="mr-1" /> View Attachment
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Approval History */}
                {selectedIssue.approvals && selectedIssue.approvals.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Approval History</h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <ul className="space-y-3">
                        {selectedIssue.approvals.map((approval) => (
                          <li key={approval.id} className="flex items-start">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              approval.status === 'Approved' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {approval.status === 'Approved' ? <FiCheck /> : <FiX />}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium">
                                {approval.approvalLevel} - {approval.status}
                              </p>
                              <p className="text-xs text-gray-500">
                                By {approval.approver.username} • {new Date(approval.approvedAt).toLocaleString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status; 