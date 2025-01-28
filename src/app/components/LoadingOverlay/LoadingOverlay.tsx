import { useState, useEffect } from 'react';

export const LoadingOverlay = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    'Finding pubs and landmarks...',
    'Calculating walking distances...',
    'Generating the optimal route...',
    'Adding interesting stops along the way...',
    'Finalizing your adventure...',
  ];

  useEffect(() => {
    const intervalTime = 20000 / messages.length; // Divide 20 seconds by number of messages

    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="loader w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        <p className="text-white text-sm font-medium animate-fade-in">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};
