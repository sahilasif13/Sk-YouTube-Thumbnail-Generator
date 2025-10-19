
import React, { useState, useCallback } from 'react';
import { generateThumbnailPrompt, generateThumbnailImage } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isPromptLoading, setIsPromptLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePrompt = useCallback(async () => {
    if (!videoTitle.trim()) {
      setError('Please enter a video title.');
      return;
    }
    setError(null);
    setImageUrl('');
    setGeneratedPrompt('');
    setIsPromptLoading(true);
    try {
      const prompt = await generateThumbnailPrompt(videoTitle, keywords);
      setGeneratedPrompt(prompt);
    } catch (e) {
      console.error(e);
      setError('Failed to generate prompt. Please try again.');
    } finally {
      setIsPromptLoading(false);
    }
  }, [videoTitle, keywords]);

  const handleGenerateImage = useCallback(async () => {
    if (!generatedPrompt.trim()) {
      setError('Please generate a prompt first.');
      return;
    }
    setError(null);
    setImageUrl('');
    setIsImageLoading(true);
    try {
      const b64Image = await generateThumbnailImage(generatedPrompt);
      setImageUrl(`data:image/jpeg;base64,${b64Image}`);
    } catch (e) {
      console.error(e);
      setError('Failed to generate thumbnail. Please try again.');
    } finally {
      setIsImageLoading(false);
    }
  }, [generatedPrompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI YouTube Thumbnail Strategist
          </h1>
          <p className="mt-2 text-lg text-gray-400">Generate professional, click-worthy thumbnails in seconds.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs & Controls */}
          <div className="flex flex-col space-y-6 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
            <div>
              <label htmlFor="video-title" className="block text-sm font-medium text-gray-300 mb-2">Step 1: Video Title</label>
              <input
                id="video-title"
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter Your YouTube Video Title Here..."
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              />
            </div>
            
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-300 mb-2">Step 2: Keywords & Style</label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., Motivational, Tech Review, Vlog, Gaming..."
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              />
            </div>

            <button
              onClick={handleGeneratePrompt}
              disabled={isPromptLoading || isImageLoading}
              className="w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isPromptLoading ? <LoadingSpinner /> : 'Generate Thumbnail Prompt'}
            </button>
            
            {generatedPrompt && (
              <div className="animate-fade-in">
                <label htmlFor="generated-prompt" className="block text-sm font-medium text-gray-300 mb-2">Generated Prompt (Editable)</label>
                <textarea
                  id="generated-prompt"
                  value={generatedPrompt}
                  onChange={(e) => setGeneratedPrompt(e.target.value)}
                  rows={12}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>
            )}
            
            {generatedPrompt && (
                <button
                    onClick={handleGenerateImage}
                    disabled={isImageLoading || isPromptLoading}
                    className="w-full flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    {isImageLoading ? <LoadingSpinner /> : 'Generate My Thumbnail'}
                </button>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col space-y-4 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 items-center justify-center min-h-[400px]">
             <h2 className="text-2xl font-bold text-gray-300 mb-4">Generated Thumbnail</h2>
             <div className="w-full aspect-video bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden">
                {isImageLoading ? (
                    <div className="flex flex-col items-center">
                        <LoadingSpinner />
                        <p className="mt-2 text-gray-400">Generating your masterpiece...</p>
                    </div>
                ) : imageUrl ? (
                    <img src={imageUrl} alt="Generated YouTube Thumbnail" className="w-full h-full object-cover"/>
                ) : (
                    <p className="text-gray-500">Your thumbnail will appear here</p>
                )}
             </div>
             {imageUrl && !isImageLoading && (
                <button
                    onClick={handleGenerateImage}
                    className="w-full mt-4 flex justify-center items-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    Generate Another Variation
                </button>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
