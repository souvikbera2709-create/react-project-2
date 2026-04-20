import { useState, useContext } from 'react';
import { StudyContext } from '../context/StudyContext';
import { aiService } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiMessageSquare, FiBookOpen, FiFileText, FiLoader } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AITools = () => {
  const { topics } = useContext(StudyContext);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [activeTool, setActiveTool] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const tools = [
    { id: 'summary', name: 'Topic Summary', icon: <FiFileText /> },
    { id: 'questions', name: 'Practice Q&A', icon: <FiMessageSquare /> },
    { id: 'flashcards', name: 'Flashcards', icon: <FiBookOpen /> }
  ];

  const handleGenerate = async () => {
    if (!selectedTopic) {
      toast.error('Please select a topic first.');
      return;
    }
    
    const topicTitle = topics.find(t => t.id === selectedTopic)?.title;
    
    setLoading(true);
    setResult(null);
    try {
      let output;
      if (activeTool === 'summary') {
        output = await aiService.generateSummary(topicTitle);
      } else if (activeTool === 'questions') {
        output = await aiService.generatePracticeQuestions(topicTitle);
      } else if (activeTool === 'flashcards') {
        output = await aiService.generateFlashcards(topicTitle);
      }
      setResult(output);
      toast.success('Generated successfully!');
    } catch (error) {
       toast.error('Failed to generate content. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col max-w-6xl mx-auto">
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl lg:text-4xl font-extrabold flex items-center justify-center sm:justify-start">
          <FiCpu className="mr-3 text-secondary drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" size={32} /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">AI Study Assistant</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg lg:text-xl">Supercharge your learning with advanced AI generation (GPT-4o simulated).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-[calc(100vh-200px)]">
        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="glass-panel p-6 bg-dark-800/80 border border-secondary/20 shadow-[0_0_30px_rgba(139,92,246,0.05)] relative overflow-hidden">
             <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
                <label className="block text-sm font-semibold text-gray-300 mb-3 ml-1 uppercase tracking-wider">Target Topic</label>
                <select className="w-full bg-dark-900 border-2 border-dark-700/80 rounded-xl px-4 py-3.5 text-gray-200 focus:outline-none focus:border-secondary transition-all shadow-inner" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                   <option value="">-- Select a Topic --</option>
                   {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
             </div>

             <div className="relative z-10 mt-8">
                <label className="block text-sm font-semibold text-gray-300 mb-3 ml-1 uppercase tracking-wider">Select Tool</label>
                <div className="space-y-3">
                   {tools.map(tool => (
                      <button 
                         key={tool.id} 
                         onClick={() => setActiveTool(tool.id)} 
                         className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 border-2 ${activeTool === tool.id ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_4px_20px_rgba(139,92,246,0.15)] font-medium scale-100' : 'bg-dark-900/50 border-transparent text-gray-400 hover:bg-dark-700 hover:text-gray-200 scale-[0.98]'}`}
                      >
                         <span className="text-xl mr-3">{tool.icon}</span> {tool.name}
                      </button>
                   ))}
                </div>
             </div>

             <button onClick={handleGenerate} disabled={loading} className={`relative z-10 w-full mt-8 flex items-center justify-center p-4 rounded-xl text-lg font-bold tracking-wider uppercase transition-all duration-300 overflow-hidden group ${loading ? 'bg-dark-600 cursor-not-allowed border-dark-500 text-gray-400' : 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-secondary/30 hover:shadow-secondary/50 border border-t-[rgba(255,255,255,0.2)]'}`}>
                {loading ? <FiLoader className="animate-spin" size={24} /> : (
                   <>
                      <FiCpu className="mr-3 group-hover:scale-110 transition-transform" /> Generate Content
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                   </>
                )}
             </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8">
          <div className="glass-panel h-full w-full p-6 md:p-8 bg-dark-900/50 border border-dark-700/50 flex flex-col relative overflow-hidden">
             
             {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm animate-pulse-fast">
                   <FiLoader className="animate-spin text-secondary mb-4 drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]" size={48} />
                   <div className="text-xl font-medium tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-pulse">ANALYZING CONTEXT...</div>
                </div>
             )}

             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 w-full relative z-10">
                <AnimatePresence mode="wait">
                   {!result && !loading && (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center text-gray-500 opacity-60">
                         <FiCpu size={64} className="mb-6 opacity-20" />
                         <p className="text-2xl font-light tracking-wide max-w-md">Select a topic and tool to generate personalized AI study materials.</p>
                      </motion.div>
                   )}

                   {result && !loading && (
                      <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                         <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark-700/50">
                            <h3 className="text-xl font-bold flex items-center text-gray-200">
                               <span className="w-2 h-6 bg-secondary rounded-full mr-3 shadow-[0_0_10px_rgba(139,92,246,0.6)]"></span> Generated Result
                            </h3>
                            <span className="text-xs px-3 py-1 bg-dark-800 rounded-full border border-dark-600 text-gray-400 font-mono tracking-wider items-center flex">
                               <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span> ONLINE
                            </span>
                         </div>
                         
                         {Array.isArray(result) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                               {result.map((card, idx) => (
                                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="group perspective-1000 h-64 w-full">
                                     <div className="relative w-full h-full transition-all duration-700 transform-style-3d group-hover:rotate-y-180 shadow-2xl">
                                        
                                        {/* Front */}
                                        <div className="absolute inset-0 backface-hidden bg-dark-800 border border-dark-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                           <span className="absolute top-4 left-4 text-xs font-bold text-gray-500 font-mono">Q{idx+1}</span>
                                           <FiMessageSquare className="text-primary/30 mb-4" size={32} />
                                           <h4 className="text-xl font-medium text-gray-100">{card.front}</h4>
                                           <div className="absolute bottom-4 right-4 text-xs text-secondary animate-pulse group-hover:opacity-0 transition-opacity">Hover to answer</div>
                                        </div>

                                        {/* Back */}
                                        <div className="absolute inset-0 backface-hidden bg-primary/10 border-2 border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center rotate-y-180">
                                           <span className="absolute top-4 right-4 text-xs font-bold text-primary font-mono bg-dark-900/50 px-2 py-1 rounded">A{idx+1}</span>
                                           <p className="text-lg text-white font-medium">{card.back}</p>
                                        </div>
                                     </div>
                                  </motion.div>
                               ))}
                            </div>
                         ) : (
                            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-gray-100 prose-headings:to-gray-400 prose-li:text-gray-300 pb-10">
                               {/* Simple markdown parsing for the mock text */}
                               {result.split('\n\n').map((paragraph, i) => {
                                  if(paragraph.startsWith('*Generated')) return <p key={i} className="text-sm italic text-gray-500 mt-8">{paragraph}</p>;
                                  if(paragraph.match(/^[0-9]\./)) {
                                     const list = paragraph.split('\n');
                                     return <ul key={i} className="space-y-4 my-6 bg-dark-800/30 p-6 rounded-2xl border border-dark-700/50">{list.map((item, j) => <li key={j} className="flex"><span className="text-secondary font-bold mr-3">{j+1}.</span> <span>{item.replace(/^[0-9]\. /, '')}</span></li>)}</ul>;
                                  }
                                  // Bold generic parse
                                  const parts = paragraph.split(/(\*\*.*?\*\*)/);
                                  return <p key={i} className="mb-4 text-lg">
                                     {parts.map((p, idx) => p.startsWith('**') ? <strong key={idx} className="text-white bg-dark-800 px-1 py-0.5 rounded">{p.replace(/\*\*/g, '')}</strong> : p)}
                                  </p>;
                               })}
                            </div>
                         )}
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
