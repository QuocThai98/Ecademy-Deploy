import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';

export default function StudentDashboard() {
    const [availableTests, setAvailableTests] = useState([]);
    const [testHistory, setTestHistory] = useState([]);
    const [performanceStats, setPerformanceStats] = useState({
        averageScore: 0,
        totalTests: 0,
        completedTests: 0,
        upcomingTests: 0
    });
    const { user } = useAuth();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Fetch available tests
                const testsRes = await axios.get(`${BACKEND_URL}/tests/student/${user._id}`);
                setAvailableTests(testsRes.data);
                console.log(testsRes.data);
                // Fetch test history
                const historyRes = await axios.get(`${BACKEND_URL}/test-results/student/${user._id}`);
                setTestHistory(historyRes.data);

                // Calculate performance stats
                const stats = {
                    averageScore: 0,
                    totalTests: testsRes.data.length,
                    completedTests: historyRes.data.length,
                    upcomingTests: testsRes.data.filter(test => !historyRes.data.some(h => h.testId === test._id)).length
                };

                if (historyRes.data.length > 0) {
                    stats.averageScore = historyRes.data.reduce((acc, curr) => acc + curr.score, 0) / historyRes.data.length;
                }

                setPerformanceStats(stats);
            } catch (err) {
                console.error("Failed to fetch student data:", err);
            }
        };

        fetchStudentData();
    }, [user._id, BACKEND_URL]);

    const startTest = (testId) => {
        window.location.href = `/student-dashboard/take-quiz/${testId}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Prepare data for performance chart
    const performanceData = testHistory.map(result => ({
        name: result.testTitle,
        score: result.score
    }));

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex-1 p-10 bg-background">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary">Student Dashboard</h1>
                    <p className="text-textSecondary">Welcome back, {user.username}!</p>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card p-4 rounded-lg shadow">
                        <h3 className="text-textSecondary">Average Score</h3>
                        <p className="text-2xl font-bold text-primary">{performanceStats.averageScore.toFixed(1)}%</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg shadow">
                        <h3 className="text-textSecondary">Total Tests</h3>
                        <p className="text-2xl font-bold text-primary">{performanceStats.totalTests}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg shadow">
                        <h3 className="text-textSecondary">Completed Tests</h3>
                        <p className="text-2xl font-bold text-primary">{performanceStats.completedTests}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg shadow">
                        <h3 className="text-textSecondary">Upcoming Tests</h3>
                        <p className="text-2xl font-bold text-primary">{performanceStats.upcomingTests}</p>
                    </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-card p-4 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="score" fill="#4F46E5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Available Tests */}
                <div className="bg-card p-4 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
                    <div className="space-y-4">
                        {availableTests.filter(test => !testHistory.some(h => h.testId === test._id)).map(test => (
                            <div key={test._id} className="flex justify-between items-center p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-semibold">{test.title}</h3>
                                    <p className="text-sm text-textSecondary">Duration: {test.duration} minutes</p>
                                </div>
                                <button
                                    onClick={() => startTest(test._id)}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                                >
                                    Start Test
                                </button>
                            </div>
                        ))}
                        {availableTests.filter(test => !testHistory.some(h => h.testId === test._id)).length === 0 && (
                            <p className="text-center text-textSecondary">No available tests at the moment.</p>
                        )}
                    </div>
                </div>

                {/* Test History */}
                <div className="bg-card p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Test History</h2>
                    <div className="space-y-4">
                        {testHistory.map(result => (
                            <div key={result._id} className="flex justify-between items-center p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-semibold">{result.testTitle}</h3>
                                    <p className="text-sm text-textSecondary">
                                        Completed on: {formatDate(result.completedAt)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-primary">{result.score}%</p>
                                    <p className="text-sm text-textSecondary">
                                        {result.correctAnswers}/{result.totalQuestions} correct
                                    </p>
                                </div>
                            </div>
                        ))}
                        {testHistory.length === 0 && (
                            <p className="text-center text-textSecondary">No test history available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}