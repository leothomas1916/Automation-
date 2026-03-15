import React, { useState } from 'react';
import { GeneratedContent, WeeklyPost } from '../types.ts';
import { 
  Check, Image as ImageIcon, Loader2, Calendar, ShieldCheck, Send, Globe, Zap, Table as TableIcon, Layout, FileSpreadsheet, Download, FileText, CalendarRange, Clock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateImage } from '../services/geminiService.ts';

interface PostResultProps {
  content: GeneratedContent;
}

const sendToZapier = async (webhookUrl: string, payload: any) => {
  if (!webhookUrl) throw new Error("Zapier Webhook URL missing");
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Zapier response was not ok. Verify your Catch Hook.");
  return response;
};

const WeeklyPostCard: React.FC<{ post: WeeklyPost, index: number, location?: string }> = ({ post, index, location }) => {
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const webhookUrl = localStorage.getItem('zapier_webhook_url') || '';

  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    try {
      const imageUrl = await generateImage(post.imagePrompt);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handlePushToZapier = async () => {
    if (!webhookUrl) {
      alert("Please configure Zapier Webhook URL first.");
      return;
    }
    setSyncStatus('syncing');
    try {
      await sendToZapier(webhookUrl, {
        source: 'irepair2k-ai-hub',
        automation_platform: 'zapier',
        ...post,
        location,
        imageUrl: generatedImageUrl
      });
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 transition-all hover:shadow-md group">
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white shadow-lg">
             <span className="text-[9px] font-black uppercase leading-none mb-1 opacity-60">Day</span>
             <span className="text-xl font-black leading-none">{index + 1}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">{post.day}</h3>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                post.gmbApiType === 'OFFER' ? 'bg-emerald-100 text-emerald-700' : 
                post.gmbApiType === 'EVENT' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {post.gmbApiType}
              </span>
            </div>
            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
               <Calendar className="w-3 h-3 mr-1" />
               {post.date}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePushToZapier}
            disabled={syncStatus === 'syncing' || !webhookUrl}
            className={`
              flex items-center px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm
              ${syncStatus === 'synced' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 
                syncStatus === 'error' ? 'bg-red-100 text-red-700' :
                'bg-slate-900 text-white hover:bg-black disabled:bg-gray-100 disabled:text-gray-400'}
            `}
          >
            {syncStatus === 'syncing' ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-2" />}
            {syncStatus === 'synced' ? 'Sent to Zap' : 'Push to Zapier'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="md:col-span-3 p-8 prose prose-sm max-w-none text-gray-700">
           {post.gmbApiType === 'OFFER' && (
             <div className="flex items-center space-x-3 mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="bg-orange-600 p-2 rounded-xl">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-orange-700">Conversion Trigger (GMB Offer)</p>
                   <p className="text-xs font-bold text-orange-900">{post.offerValue} - Code: {post.promoCode}</p>
                </div>
             </div>
           )}
           <div className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-2">GMB Ready Content</div>
           <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        <div className="md:col-span-2 p-8 bg-slate-50 border-l border-gray-100 flex flex-col justify-between">
          <div className="space-y-4">
            {!generatedImageUrl && !isGeneratingImg && (
              <button
                 onClick={handleGenerateImage}
                 className="w-full py-8 bg-white border-2 border-dashed border-slate-200 text-slate-500 hover:border-orange-400 hover:text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all flex flex-col items-center justify-center shadow-sm"
              >
                 <ImageIcon className="w-8 h-8 mb-3 opacity-40" />
                 Create Ad Visual
              </button>
            )}
            {isGeneratingImg && (
              <div className="py-12 bg-white rounded-3xl flex flex-col items-center justify-center border border-orange-100 shadow-inner">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-[10px] font-black uppercase text-orange-800 tracking-widest">Rendering via Gemini...</span>
              </div>
            )}
            {generatedImageUrl && (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img src={generatedImageUrl} className="w-full h-auto" alt="AI Generated" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase text-orange-600">
                   GMB 1K Visual
                </div>
              </div>
            )}
          </div>
          <div className="bg-white/60 p-5 rounded-2xl border border-gray-200 mt-6 backdrop-blur">
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
               <Clock className="w-3 h-3 mr-1 text-slate-500" /> Image Prompt
             </div>
             <p className="text-[10px] text-slate-500 italic leading-relaxed">{post.imagePrompt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PostResult: React.FC<PostResultProps> = ({ content }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards');
  const [bulkStatus, setBulkStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [isGeneratingSingleImg, setIsGeneratingSingleImg] = useState(false);
  const [singleImageUrl, setSingleImageUrl] = useState<string | null>(null);
  const webhookUrl = localStorage.getItem('zapier_webhook_url') || '';

  const handleGenerateSingleImage = async () => {
    if (!content.imagePrompt) return;
    setIsGeneratingSingleImg(true);
    try {
      const imageUrl = await generateImage(content.imagePrompt);
      setSingleImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      alert("Image generation failed. Please try again.");
    } finally {
      setIsGeneratingSingleImg(false);
    }
  };

  const handleBulkSync = async () => {
    if (!webhookUrl) return;
    setBulkStatus('syncing');
    try {
      await sendToZapier(webhookUrl, {
        source: 'irepair2k-ai-hub',
        automation_platform: 'zapier',
        batch_type: 'bulk_campaign',
        location: content.location,
        posts: content.weeklyPosts
      });
      setBulkStatus('synced');
    } catch (err) {
      alert("Zapier Sync failed. Verify your Webhook URL and Zap status.");
      setBulkStatus('idle');
    }
  };

  const handleDownloadCSV = () => {
    if (!content.weeklyPosts) return;
    const headers = ["Date", "GMB_Type", "Topic", "Content", "Promo_Code", "Image_Prompt"];
    const rows = content.weeklyPosts.map(p => [
      p.date, p.gmbApiType, p.topic, `"${p.content.replace(/"/g, '""')}"`, p.promoCode, `"${p.imagePrompt.replace(/"/g, '""')}"`
    ]);
    const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileName = `gmb-zapier-campaign-${(content.location || 'irepair2k').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (content.weeklyPosts && content.weeklyPosts.length > 0) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
           <div className="flex items-center space-x-4">
              <div className="p-4 bg-[#ff4f00] rounded-2xl shadow-lg shadow-orange-100">
                <CalendarRange className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Zapier Campaign Hub</h2>
                <div className="flex items-center space-x-3 mt-1">
                   <div className="flex items-center text-[10px] text-orange-600 font-black uppercase tracking-widest">
                      <Globe className="w-3.5 h-3.5 mr-1" />
                      {content.location}
                   </div>
                   <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                   <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      {content.weeklyPosts.length} Automation Ready
                   </div>
                </div>
              </div>
           </div>
           
           <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setViewMode('cards')}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${viewMode === 'cards' ? 'bg-white shadow-md text-slate-900' : 'text-gray-400'}`}
                >
                   <Layout className="w-4 h-4 mr-2" />
                   List View
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${viewMode === 'calendar' ? 'bg-white shadow-md text-slate-900' : 'text-gray-400'}`}
                >
                   <CalendarRange className="w-4 h-4 mr-2" />
                   Schedule
                </button>
             </div>

             <div className="flex items-center space-x-3">
               <button 
                 onClick={handleDownloadCSV}
                 className="flex items-center px-6 py-3.5 bg-white border border-gray-200 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 active:scale-95 transition-all"
               >
                 <Download className="w-4 h-4 mr-2" />
                 Backup CSV
               </button>

               <button 
                 onClick={handleBulkSync}
                 disabled={bulkStatus === 'syncing' || !webhookUrl}
                 className={`flex items-center px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl ${
                   bulkStatus === 'synced' ? 'bg-green-600 text-white' :
                   bulkStatus === 'syncing' ? 'bg-slate-100 text-gray-400' :
                   'bg-[#ff4f00] text-white hover:bg-[#e64600] active:scale-95'
                 }`}
               >
                 {bulkStatus === 'syncing' ? (
                   <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Transferring...</>
                 ) : bulkStatus === 'synced' ? (
                   <><Check className="w-4 h-4 mr-2" /> Campaign Synced</>
                 ) : (
                   <><Zap className="w-4 h-4 mr-2" /> Trigger Zapier Flow</>
                 )}
               </button>
             </div>
           </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 gap-6">
            {content.weeklyPosts.map((post, idx) => (
              <WeeklyPostCard key={idx} post={post} index={idx} location={content.location} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
             <div className="grid grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mb-4">{day}</div>
                ))}
                {content.weeklyPosts.map((post, idx) => (
                  <div key={idx} className="aspect-square border border-slate-100 rounded-2xl p-3 flex flex-col justify-between hover:bg-orange-50 transition-all group cursor-pointer">
                     <div className="flex justify-between items-start">
                        <span className="text-lg font-black text-slate-300 group-hover:text-orange-200 transition-colors">{idx + 1}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          post.gmbApiType === 'OFFER' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}></div>
                     </div>
                     <div className="text-[8px] font-black uppercase tracking-tight text-slate-600 line-clamp-2 leading-tight">
                        {post.topic}
                     </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                   <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Offers</span>
                </div>
                <div className="flex items-center space-x-2">
                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Updates</span>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
       <div className="p-8 border-b border-gray-100 prose prose-slate max-w-none">
          <ReactMarkdown>{content.textContent}</ReactMarkdown>
          
          {content.imagePrompt && !content.weeklyPosts && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2 text-orange-600" />
                    Visual Strategy
                  </h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200">
                    <p className="text-[11px] text-slate-500 italic leading-relaxed">{content.imagePrompt}</p>
                  </div>
                  {!singleImageUrl && !isGeneratingSingleImg && (
                    <button
                      onClick={handleGenerateSingleImage}
                      className="mt-4 w-full py-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Post Image
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  {isGeneratingSingleImg && (
                    <div className="aspect-video bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                      <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-3" />
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rendering Visual...</span>
                    </div>
                  )}
                  {singleImageUrl && (
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                      <img src={singleImageUrl} className="w-full h-auto" alt="AI Generated" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase text-orange-600">
                        GMB 1K Visual
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {content.schemaMarkup && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-orange-600" />
                  JSON-LD Schema Markup
                </h3>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(content.schemaMarkup || '');
                    alert("Schema copied to clipboard!");
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700"
                >
                  Copy JSON-LD
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-[10px] font-mono overflow-x-auto border border-slate-800 shadow-inner">
                {content.schemaMarkup}
              </pre>
            </div>
          )}
       </div>
       <div className="p-6 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
             <ShieldCheck className="w-5 h-5 text-orange-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Zapier-Ready Payload</span>
          </div>
          <button 
             onClick={handleDownloadCSV}
             className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-lg"
          >
             Export Backup CSV
          </button>
       </div>
    </div>
  );
};