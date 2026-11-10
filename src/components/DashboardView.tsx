import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SurveyResponse } from '../types/survey';
import { SURVEY_QUESTIONS, interpretScore, LIKERT_LEVELS } from '../data/initialData';
import { 
  Users, 
  Award, 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  QrCode, 
  Download, 
  Search, 
  Maximize2, 
  Copy, 
  Check, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import QRCode from 'qrcode';

interface DashboardViewProps {
  responses: SurveyResponse[];
  onOpenQr: () => void;
  onExportCsv: () => void;
  onAddSample: () => void;
  isProjectorMode: boolean;
  onSwitchToSurvey: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  responses,
  onOpenQr,
  onExportCsv,
  onAddSample,
  isProjectorMode,
  onSwitchToSurvey,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'high' | 'general'>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute live URL for survey
  const surveyUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const u = new URL(window.location.href);
    u.searchParams.set('tab', 'survey');
    return u.toString();
  }, []);

  // Generate QR Code data URL
  useEffect(() => {
    if (!surveyUrl) return;
    QRCode.toDataURL(surveyUrl, {
      width: 200,
      margin: 1.5,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code error', err));
  }, [surveyUrl]);

  // Real-time calculations
  const stats = useMemo(() => {
    const totalCount = responses.length;
    if (totalCount === 0) {
      return {
        totalCount: 0,
        overallAvg: 0,
        overallLevel: interpretScore(0),
        questionStats: SURVEY_QUESTIONS.map((q) => ({
          ...q,
          avg: 0,
          percentage: 0,
          level: interpretScore(0),
          counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        })),
        highestQuestion: null,
        lowestQuestion: null,
      };
    }

    const questionStats = SURVEY_QUESTIONS.map((q) => {
      const key = `q${q.id}` as 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
      const sum = responses.reduce((acc, r) => acc + (r.ratings[key] || 0), 0);
      const avg = Number((sum / totalCount).toFixed(2));
      const percentage = Number(((avg / 5) * 100).toFixed(1));
      const level = interpretScore(avg);

      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      responses.forEach((r) => {
        const val = r.ratings[key];
        if (val >= 1 && val <= 5) {
          counts[val as 1 | 2 | 3 | 4 | 5]++;
        }
      });

      return {
        ...q,
        avg,
        percentage,
        level,
        counts,
      };
    });

    const sumAllAvgs = questionStats.reduce((acc, q) => acc + q.avg, 0);
    const overallAvg = Number((sumAllAvgs / 5).toFixed(2));
    const overallLevel = interpretScore(overallAvg);

    // Find highest and lowest
    const sorted = [...questionStats].sort((a, b) => b.avg - a.avg);
    const highestQuestion = sorted[0];
    const lowestQuestion = sorted[sorted.length - 1];

    return {
      totalCount,
      overallAvg,
      overallLevel,
      questionStats,
      highestQuestion,
      lowestQuestion,
    };
  }, [responses]);

  // Feedbacks list
  const filteredFeedbacks = useMemo(() => {
    return responses
      .filter((r) => Boolean(r.feedback && r.feedback.trim()))
      .filter((r) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          r.feedback?.toLowerCase().includes(term) ||
          r.device?.toLowerCase().includes(term)
        );
      })
      .filter((r) => {
        if (feedbackFilter === 'high') return r.overallAvg >= 4.5;
        if (feedbackFilter === 'general') return r.overallAvg < 4.5;
        return true;
      });
  }, [responses, searchTerm, feedbackFilter]);

  const handleCopyLink = () => {
    if (!surveyUrl) return;
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 4.51) return 'bg-emerald-500';
    if (score >= 3.51) return 'bg-cyan-500';
    if (score >= 2.51) return 'bg-amber-400';
    if (score >= 1.51) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  const timeAgo = (isoString: string) => {
    try {
      const diff = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'เมื่อสักครู่';
      if (mins < 60) return `${mins} นาทีที่แล้ว`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
      return new Date(isoString).toLocaleDateString('th-TH');
    } catch {
      return '';
    }
  };

  return (
    <div className={`transition-colors duration-200 pb-16 ${isProjectorMode ? 'bg-slate-950 text-slate-100 min-h-screen' : 'text-slate-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Projector Header Bar */}
        <div className={`p-6 sm:p-8 rounded-3xl mb-8 border transition-all ${
          isProjectorMode
            ? 'bg-slate-900/90 border-slate-800 shadow-2xl ring-1 ring-slate-800'
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Live Real-Time Dashboard
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  isProjectorMode ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                }`}>
                  โหมดฉายจอโปรเจกเตอร์
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                ผลประเมินความพึงพอใจการอบรมสด
              </h1>
              <p className={`text-sm sm:text-base mt-1 ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                คำนวณสถิติและประมวลผลทันทีที่มีผู้ส่งคำตอบตามเกณฑ์สเกล Likert 5 ระดับ
              </p>
            </div>

            {/* Quick Actions for Presenter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onOpenQr}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>เปิด QR Code เต็มจอ</span>
              </button>

              <button
                onClick={onExportCsv}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>ส่งออก CSV</span>
              </button>

              <button
                onClick={onAddSample}
                title="ทดสอบจำลองผู้ตอบแบบสอบถามเพิ่ม 3 คน เพื่อดูการขยับของกราฟสด"
                className={`px-3 py-2.5 rounded-xl border font-medium text-sm flex items-center space-x-1.5 transition cursor-pointer ${
                  isProjectorMode
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="hidden sm:inline">สุ่มตอบเดโม (+3)</span>
              </button>
            </div>
          </div>

          {/* Top Key Performance Indicators (Big Screen View) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            
            {/* KPI 1: Overall Satisfaction */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isProjectorMode 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-gradient-to-br from-indigo-50/70 to-white border-indigo-100 shadow-xs'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className={isProjectorMode ? 'text-indigo-300' : 'text-indigo-700'}>
                  คะแนนเฉลี่ยภาพรวม
                </span>
                <Award className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                  {stats.overallAvg.toFixed(2)}
                </span>
                <span className={`text-base font-semibold ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  / 5.00
                </span>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${stats.overallLevel.badgeBg}`}>
                  {stats.overallLevel.label}
                </span>
                <span className={`text-xs ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  ({((stats.overallAvg / 5) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* KPI 2: Total Respondents */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isProjectorMode 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className={isProjectorMode ? 'text-emerald-300' : 'text-emerald-700'}>
                  จำนวนผู้ตอบทั้งหมด
                </span>
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  {stats.totalCount}
                </span>
                <span className={`text-base font-semibold ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  ท่าน
                </span>
              </div>
              <div className="mt-3 flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ระบบกำลังเปิดรับคำตอบ</span>
              </div>
            </div>

            {/* KPI 3: Highest Scoring Dimension */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isProjectorMode 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className={isProjectorMode ? 'text-amber-300' : 'text-amber-700'}>
                  จุดเด่นที่ได้คะแนนสูงสุด
                </span>
                <Flame className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-xl font-bold truncate text-slate-800 dark:text-white">
                {stats.highestQuestion ? stats.highestQuestion.category.split(' ')[0] : '-'}
              </div>
              <p className={`text-xs mt-1 truncate ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {stats.highestQuestion?.title.slice(3) || 'รอข้อมูล'}
              </p>
              <div className="mt-3 text-sm font-extrabold text-amber-600 dark:text-amber-400">
                ⭐ {stats.highestQuestion ? stats.highestQuestion.avg.toFixed(2) : '0.00'} / 5.00
              </div>
            </div>

            {/* KPI 4: Feedback Comments Count */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isProjectorMode 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className={isProjectorMode ? 'text-violet-300' : 'text-violet-700'}>
                  ข้อเสนอแนะที่ได้รับ
                </span>
                <MessageSquare className="w-5 h-5 text-violet-500" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-violet-600 dark:text-violet-400">
                  {responses.filter((r) => r.feedback && r.feedback.trim()).length}
                </span>
                <span className={`text-base font-semibold ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  ข้อความ
                </span>
              </div>
              <div className={`mt-3 text-xs ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                ความคิดเห็นเชิงสร้างสรรค์
              </div>
            </div>

          </div>
        </div>

        {/* Main Content Grid: Left = Bar Chart, Right = QR Scan & Live Feedbacks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Question Bar Charts (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
              isProjectorMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-indigo-500" />
                    <span>คะแนนเฉลี่ยรายข้อ (Likert 1-5)</span>
                  </h2>
                  <p className={`text-xs sm:text-sm mt-0.5 ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    คลิกที่แต่ละข้อเพื่อดูการกระจายตัวของจำนวนผู้ตอบในแต่ละระดับคะแนน
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>มากที่สุด (4.51-5.00)</span>
                  </span>
                  <span className="flex items-center space-x-1 text-cyan-600 dark:text-cyan-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                    <span>มาก (3.51-4.50)</span>
                  </span>
                </div>
              </div>

              {/* Bar items list */}
              <div className="space-y-6">
                {stats.questionStats.map((q) => {
                  const isExpanded = expandedQuestion === q.id;
                  const barPercent = Math.min(100, Math.max(0, (q.avg / 5) * 100));

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isProjectorMode
                          ? 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {/* Question Title & Score */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                        <div className="flex-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100/70 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 mr-2">
                            ข้อที่ {q.id}
                          </span>
                          <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                            {q.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 shrink-0">
                          <div className="text-right">
                            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                              {q.avg.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">/ 5.00</span>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${q.level.badgeBg}`}>
                            {q.level.label.split(' ')[0]}
                          </span>
                          <button
                            onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                            title="ดูการแจกแจงจำนวนคนตอบ 1-5"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Main Animated Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden p-0.5 mb-1.5 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${getScoreColorClass(q.avg)}`}
                          style={{ width: `${barPercent}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                        <span>คิดเป็น {q.percentage}% ของคะแนนเต็ม</span>
                        <button
                          onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                          className="hover:underline text-indigo-600 dark:text-indigo-400 font-medium"
                        >
                          {isExpanded ? 'ซ่อนกราฟแจกแจง' : 'ดูการกระจายตัว (1-5 คะแนน)'}
                        </button>
                      </div>

                      {/* Expanded Breakdown per rating (1-5) */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            การแจกแจงคะแนนจากผู้ตอบ {stats.totalCount} ท่าน
                          </h4>
                          <div className="grid grid-cols-5 gap-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                              const count = q.counts[star as 1 | 2 | 3 | 4 | 5] || 0;
                              const pct = stats.totalCount > 0 ? ((count / stats.totalCount) * 100).toFixed(0) : 0;
                              return (
                                <div
                                  key={star}
                                  className={`p-2.5 rounded-xl text-center border ${
                                    isProjectorMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                                  }`}
                                >
                                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                                    {star} คะแนน
                                  </div>
                                  <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                                    {count} <span className="text-xs font-normal text-slate-400">คน</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    ({pct}%)
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Likert Interpretation Criteria Footnote */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  เกณฑ์การแปลผลคะแนนเฉลี่ย (Likert Scale 5 ระดับ)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {LIKERT_LEVELS.map((lvl) => (
                    <div
                      key={lvl.label}
                      className={`p-2 rounded-xl border text-center ${lvl.badgeBg}`}
                    >
                      <div className="font-bold">{lvl.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {lvl.min.toFixed(2)} - {lvl.max.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: QR Code Box & Live Suggestions Feed (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Projector QR Code Mini Card */}
            <div className={`p-6 rounded-3xl border text-center transition-all ${
              isProjectorMode 
                ? 'bg-slate-900 border-slate-800 shadow-xl' 
                : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
                <QrCode className="w-3.5 h-3.5" />
                <span>สแกนตอบแบบสอบถาม</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                สแกนผ่านโทรศัพท์มือถือ
              </h3>
              <p className={`text-xs mb-4 ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                ฉายขึ้นจอหรือเปิดให้ผู้เข้าร่วมงานสแกนตอบได้ทันที
              </p>

              {/* QR Image */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center relative group">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code สำหรับตอบแบบสอบถาม" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-xs text-slate-400 animate-pulse">กำลังสร้าง QR Code...</div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={onOpenQr}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>ขยาย QR Code ขึ้นจอโปรเจกเตอร์</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                      copiedLink
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-700'
                        : isProjectorMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
                  </button>

                  <button
                    onClick={onSwitchToSurvey}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                      isProjectorMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
                    <span>เปิดหน้าตอบ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Feedback Feed Card */}
            <div className={`p-6 rounded-3xl border transition-all ${
              isProjectorMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-violet-500" />
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
                    ข้อเสนอแนะล่าสุด ({filteredFeedbacks.length})
                  </h3>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
              </div>

              {/* Search & Filter */}
              <div className="space-y-2 mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาข้อความหรืออุปกรณ์..."
                    className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border outline-none transition ${
                      isProjectorMode
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                    }`}
                  />
                </div>

                <div className="flex gap-1 text-[11px]">
                  <button
                    onClick={() => setFeedbackFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      feedbackFilter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : isProjectorMode
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  <button
                    onClick={() => setFeedbackFilter('high')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      feedbackFilter === 'high'
                        ? 'bg-indigo-600 text-white'
                        : isProjectorMode
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    คะแนนสูง (4.5+)
                  </button>
                  <button
                    onClick={() => setFeedbackFilter('general')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      feedbackFilter === 'general'
                        ? 'bg-indigo-600 text-white'
                        : isProjectorMode
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ข้อเสนอแนะทั่วไป
                  </button>
                </div>
              </div>

              {/* Feed Stream */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filteredFeedbacks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2 opacity-50" />
                    ยังไม่มีข้อเสนอแนะที่ตรงกับเงื่อนไขการค้นหา
                  </div>
                ) : (
                  filteredFeedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className={`p-3.5 rounded-2xl border text-xs transition animate-fade-in ${
                        isProjectorMode
                          ? 'bg-slate-800/80 border-slate-700/80'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-1 font-bold text-amber-500">
                          <span>⭐ {fb.overallAvg.toFixed(2)}</span>
                          <span className={`text-[10px] font-normal ${isProjectorMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            • {fb.device || 'มือถือ'}
                          </span>
                        </div>
                        <span className={`text-[10px] ${isProjectorMode ? 'text-slate-400' : 'text-slate-400'}`}>
                          {timeAgo(fb.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                        "{fb.feedback}"
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
