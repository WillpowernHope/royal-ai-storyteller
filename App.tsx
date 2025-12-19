
import React, { useState } from 'react';
import { StoryInput, GeneratedStory, SETTINGS, THEMES, TONES } from './types';
import { generateStory } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState<StoryInput>({
    protagonist: '',
    setting: SETTINGS[0],
    theme: THEMES[0],
    tone: TONES[0]
  });
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const handleGenerate = async () => {
    if (!input.protagonist.trim()) return;
    
    setLoading(true);
    setLoadingStep('Whispering to the ancient scrolls...');
    
    try {
      const result = await generateStory(input);
      setStory(result);
    } catch (err) {
      console.error(err);
      alert("The magic flickered... please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStory(null);
    setInput({
      protagonist: '',
      setting: SETTINGS[0],
      theme: THEMES[0],
      tone: TONES[0]
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center">
      <header className="text-center mb-12">
        <h1 className="royal-header text-7xl md:text-8xl text-yellow-200 drop-shadow-[0_5px_15px_rgba(253,224,71,0.3)] mb-2">
          Royal Storyteller
        </h1>
        <p className="ornate-font tracking-[0.3em] uppercase text-pink-300 text-sm">
          Where AI Magic Weaves Eternal Tales
        </p>
      </header>

      <main className="w-full max-w-4xl relative">
        {!story && !loading && (
          <div className="storybook-border glass rounded-lg p-8 md:p-12 fade-slide-up">
            <div className="corner-decor top-left"></div>
            <div className="corner-decor top-right"></div>
            <div className="corner-decor bottom-left"></div>
            <div className="corner-decor bottom-right"></div>

            <h2 className="ornate-font text-2xl text-yellow-100 mb-8 text-center">Craft Your Legend</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-pink-200 text-sm uppercase tracking-widest mb-2">Protagonist Name</label>
                <input 
                  type="text" 
                  value={input.protagonist}
                  onChange={(e) => setInput({...input, protagonist: e.target.value})}
                  placeholder="e.g. Princess Elara"
                  className="w-full bg-purple-900/50 border-2 border-yellow-500/30 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none transition-all placeholder:text-purple-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-pink-200 text-sm uppercase tracking-widest mb-2">Setting</label>
                  <select 
                    value={input.setting}
                    onChange={(e) => setInput({...input, setting: e.target.value})}
                    className="w-full bg-purple-900/50 border-2 border-yellow-500/30 rounded-xl px-4 py-3 text-white appearance-none"
                  >
                    {SETTINGS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-pink-200 text-sm uppercase tracking-widest mb-2">Theme</label>
                  <select 
                    value={input.theme}
                    onChange={(e) => setInput({...input, theme: e.target.value})}
                    className="w-full bg-purple-900/50 border-2 border-yellow-500/30 rounded-xl px-4 py-3 text-white appearance-none"
                  >
                    {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-pink-200 text-sm uppercase tracking-widest mb-2">Tone</label>
                  <select 
                    value={input.tone}
                    onChange={(e) => setInput({...input, tone: e.target.value})}
                    className="w-full bg-purple-900/50 border-2 border-yellow-500/30 rounded-xl px-4 py-3 text-white appearance-none"
                  >
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!input.protagonist}
                className={`w-full py-5 rounded-2xl ornate-font text-xl transition-all transform active:scale-95 shadow-2xl ${
                  input.protagonist 
                  ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-purple-900 hover:shadow-yellow-500/20' 
                  : 'bg-purple-800 text-purple-400 cursor-not-allowed'
                }`}
              >
                Summon the Story ✨
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 fade-slide-up">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl animate-pulse">📖</div>
            </div>
            <p className="ornate-font text-2xl text-yellow-200 tracking-wider animate-pulse">
              {loadingStep}
            </p>
          </div>
        )}

        {story && (
          <div className="fade-slide-up">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Cover Art */}
              <div className="w-full lg:w-1/3 flex flex-col items-center">
                <div className="storybook-border w-full rounded-lg overflow-hidden shadow-2xl group">
                  <img src={story.coverUrl} alt="Story Cover" className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                </div>
                <button 
                  onClick={reset}
                  className="mt-8 px-8 py-3 bg-pink-600/30 border border-pink-400/50 hover:bg-pink-600/50 text-pink-100 rounded-full ornate-font text-sm tracking-widest transition-all"
                >
                  Write Another Legend
                </button>
              </div>

              {/* Story Content */}
              <div className="w-full lg:w-2/3 bg-white/95 text-indigo-950 rounded-lg p-10 md:p-16 storybook-border shadow-2xl relative">
                <div className="corner-decor top-left border-indigo-900/20"></div>
                <div className="corner-decor top-right border-indigo-900/20"></div>
                <div className="corner-decor bottom-left border-indigo-900/20"></div>
                <div className="corner-decor bottom-right border-indigo-900/20"></div>
                
                <h3 className="royal-header text-5xl md:text-6xl text-pink-700 mb-8 text-center">{story.title}</h3>
                
                <div className="prose prose-lg max-w-none text-xl leading-relaxed first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-pink-600 first-letter:font-serif italic text-justify">
                  {story.content.split('\n').map((para, i) => (
                    <p key={i} className="mb-6">{para}</p>
                  ))}
                </div>

                <div className="mt-12 text-center text-indigo-400 ornate-font text-sm tracking-[0.5em] border-t border-indigo-100 pt-8">
                  THE END
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 text-pink-200/40 text-xs font-semibold tracking-[0.2em] uppercase">
        Enchanted by Gemini AI & The Royal Scribe
      </footer>
    </div>
  );
};

export default App;
