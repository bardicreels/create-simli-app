'use client';
import React, { useCallback, useEffect, useState } from 'react';
import AvatarInteraction from './AvatarInteraction';
import { Avatar } from './types';

// Update the Avatar interface to include an image URL
interface Avatar {
  name: string;
  simli_faceid: string;
  elevenlabs_voiceid: string;
  initialPrompt: string;
  imageUrl: string;
}

// Updated JSON structure for avatar data with image URLs
const avatar = {
    name: "Einstein",
    simli_faceid: "d3376e76-8830-4b86-84d0-86f25332c92e",
    elevenlabs_voiceid: "kFsnovBBn69vNsybyS3T",
    initialPrompt: "You are Einstein. Start with a short greeting.",
    imageUrl: "/characters/einstein.jpg"
}

const Demo: React.FC = () => {
  const [error, setError] = useState('');
  const [chatgptText, setChatgptText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  const handleChatGPTTextChange = useCallback((newText: string) => {
    console.log('Updating chatgptText:', newText);
    setChatgptText(newText);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Error accessing microphone. Please check your permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    setAudioStream(null);
  }, [audioStream]);

  useEffect(() => {
    setSelectedAvatar(avatar)
  }
  , [selectedAvatar]);
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col items-center font-mono text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Create Simli App</h1>
      {false ? (
          <button 
          onClick={() => setSelectedAvatar(avatar)} 
          className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          ← Start interaction
        </button>
      ) : (
        <div className="w-full max-w-2xl flex flex-col items-center gap-6">
          <div className="bg-gray-800 p-6 rounded-xl w-full">
            <h2 className="text-2xl font-bold mb-4"></h2>
            <AvatarInteraction
              simli_faceid={avatar.simli_faceid}
              elevenlabs_voiceid={avatar.elevenlabs_voiceid}
              initialPrompt={avatar.initialPrompt}
              chatgptText={chatgptText}
              onChatGPTTextChange={handleChatGPTTextChange}
              audioStream={audioStream}
            />
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
            >
              {isRecording ? 'Recording...' : 'Push to Speak'}
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-6 text-red-500 bg-red-100 border border-red-400 rounded p-3">{error}</p>}
    </div>
  );
};

export default Demo;