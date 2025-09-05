import React, { useState } from 'react';
import { ArrowRightLeft, Loader2, Languages, Copy, Check } from 'lucide-react';

const ClaudeTranslator = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confidence, setConfidence] = useState('');
  const [copied, setCopied] = useState(false);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
    'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish',
    'Turkish', 'Greek', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian'
  ];

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const translateText = async () => {
    if (!sourceText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setError('');
    setTranslatedText('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceText: sourceText,
          sourceLang: sourceLang,
          targetLang: targetLang
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setTranslatedText(result.translatedText);
        setConfidence(result.confidence);
      }
    } catch (err) {
      setError('Translation failed. Please check if the backend server is running.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      translateText();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Languages className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Claude AI Translator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Powered by Claude AI for accurate, context-aware translations
          </p>
        </div>

        {/* Main Translation Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Language Selection */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button
              onClick={swapLanguages}
              className="mt-7 p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              title="Swap languages"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Source Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter text to translate
              </label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your text here..."
                className="w-full h-48 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none bg-white/50"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Press Ctrl+Enter to translate
              </p>
            </div>

            {/* Translated Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Translation
                </label>
                {translatedText && (
                  <div className="flex items-center gap-2">
                    {confidence && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        confidence === 'high' ? 'bg-green-100 text-green-700' :
                        confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {confidence} confidence
                      </span>
                    )}
                    <button
                      onClick={copyToClipboard}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <textarea
                  value={translatedText}
                  readOnly
                  placeholder="Translation will appear here..."
                  className="w-full h-48 px-4 py-3 rounded-xl border border-gray-200 resize-none bg-gray-50/50"
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="text-gray-600">Translating...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Translate Button */}
          <div className="text-center">
            <button
              onClick={translateText}
              disabled={isLoading || !sourceText.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Translating...
                </div>
              ) : (
                'Translate'
              )}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Languages className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">24+ Languages</h3>
            <p className="text-gray-600 text-sm">Support for major world languages with high accuracy</p>
          </div>
          <div className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Smart Context</h3>
            <p className="text-gray-600 text-sm">AI-powered translations that understand context and nuance</p>
          </div>
          <div className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Quality Score</h3>
            <p className="text-gray-600 text-sm">Confidence ratings help you assess translation quality</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaudeTranslator;