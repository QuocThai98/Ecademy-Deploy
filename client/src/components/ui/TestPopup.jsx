import React from 'react';

const TestPopup = ({ showPopup, closePopup, handleChange, createTest, newTest }) => {
    return (
        showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-md w-[400px]">
                    <h2 className="text-lg font-bold mb-4">Create New Test</h2>
                    <input
                        type="text"
                        name="title"
                        value={newTest.title}
                        onChange={handleChange}
                        placeholder="Test Title"
                        className="mb-4 p-2 w-full border rounded"
                    />
                    <textarea
                        name="description"
                        value={newTest.description}
                        onChange={handleChange}
                        placeholder="Test Description"
                        className="mb-4 p-2 w-full border rounded"
                    />
                    <input
                        type="number"
                        name="duration"
                        value={newTest.duration}
                        onChange={handleChange}
                        placeholder="Duration (minutes)"
                        className="mb-4 p-2 w-full border rounded"
                    />
                    {/* You can add additional fields like student assignment here */}
                    <input
                    type="number"
                    name="totalQuestions"
                    value={newTest.totalQuestions}
                    onChange={handleChange}
                    placeholder="Total Questions"
                    className="mb-4 p-2 w-full border rounded"
                    />
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <input
                            type="number"
                            name="easy"
                            value={newTest.easy}
                            onChange={handleChange}
                            placeholder="Easy"
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            name="medium"
                            value={newTest.medium}
                            onChange={handleChange}
                            placeholder="Medium"
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            name="hard"
                            value={newTest.hard}
                            onChange={handleChange}
                            placeholder="Hard"
                            className="p-2 border rounded"
                        />
                    </div>
                    <button
                        onClick={createTest}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Create Test
                    </button>
                    <button
                        onClick={closePopup}
                        className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    );
};

export default TestPopup;
