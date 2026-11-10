import React, { useState, useEffect } from 'react';
import { SURVEY_QUESTIONS, RATING_OPTIONS } from '../data/initialData';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, MessageSquare, AlertCircle, RefreshCw, Smartphone, Star } from 'lucide-react';

interface SurveyViewProps {
  onSuccessSubmit?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSuccessSubmit }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
  });
  const [feedback, setFeedback] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [lastSubmittedScore, setLastSubmittedScore] = useState<number | null>(null);

  useEffect(() => {
    // Check if client has already submitted
    if (storageService.hasAlreadySubmitted()) {
      setHasSubmitted(true);
    }
  }, []);

  const handleSelectScore = (questionKey: string, score: number) => {
    setRatings((prev) => ({
      ...prev,
      [questionKey]: score,
    }));
    setShowError(false);
  };

  const answeredCount = Object.values(ratings).filter((v) => v > 0).length;
  const progressPercent = Math.round((answeredCount / 5) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answeredCount < 5) {
      setShowError(true);
      // scroll to first unanswered
      const missingIndex = SURVEY_QUESTIONS.findIndex((q) => !ratings[`q${q.id}`]);
      if (missingIndex !== -1) {
        const el = document.getElementById(`question-card-${missingIndex + 1}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const newResp = storageService.addResponse(
      {
        q1: ratings.q1,
        q2: ratings.q2,
        q3: ratings.q3,
        q4: ratings.q4,
        q5: ratings.q5,
      },
      feedback
    );

    setLastSubmittedScore(newResp.overallAvg);
    setHasSubmitted(true);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    if (onSuccessSubmit) {
      onSuccessSubmit();
    }
  };

  const handleResetForTesting = () => {
    storageService.clearSubmittedFlag();
    setHasSubmitted(false);
    setRatings({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
    setFeedback('');
    setShowError(false);
    setLastSubmittedScore(null);
  };

  if (hasSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-inner ring-8 ring-emerald-50">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            บันทึกคำตอบเรียบร้อยแล้ว!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
            ขอขอบพระคุณที่สละเวลาให้ข้อมูลและข้อเสนอแนะ ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาหลักสูตรและการจัดอบรมให้ดียิ่งขึ้นในครั้งต่อไป
          </p>

          {lastSubmittedScore !== null && (
            <div className="bg-indigo-50/80 rounded-2xl p-4 mb-6 border border-indigo-100 inline-block w-full max-w-sm">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block mb-1">
                คะแนนเฉลี่ยที่คุณประเมิน
              </span>
              <div className="text-3xl font-extrabold text-indigo-600 flex items-center justify-center space-x-1">
                <Star className="w-6 h-6 fill-indigo-500 text-indigo-500 mr-1" />
                <span>{lastSubmittedScore.toFixed(2)}</span>
                <span className="text-base text-slate-500 font-normal">/ 5.00</span>
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 mb-8 space-y-1">
            <p className="font-medium text-slate-700">🔒 ข้อมูลของท่านถูกบันทึกอย่างปลอดภัยแบบไม่ระบุตัวตน</p>
            <p>ระบบได้ทำการป้องกันการตอบซ้ำจากเครื่องนี้ตามข้อกำหนด</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResetForTesting}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>ทดสอบส่งใหม่อีกครั้ง (โหมดทดสอบระบบ)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      {/* Mobile-first Header Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>แบบสอบถามผ่านมือถือ (ใช้เวลาไม่เกิน 1 นาที)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            แบบประเมินความพึงพอใจการอบรม
          </h1>
          <p className="text-indigo-100 text-sm leading-relaxed">
            โปรดเลือกให้คะแนนความพึงพอใจตามระดับ 1-5 (1 = น้อยที่สุด, 5 = มากที่สุด) เพื่อนำไปพัฒนาการจัดอบรมในครั้งถัดไป
          </p>

          {/* Progress Bar */}
          <div className="mt-5 pt-4 border-t border-indigo-400/30">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span>ความคืบหน้าการตอบ</span>
              <span>{answeredCount} / 5 ข้อ ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {showError && answeredCount < 5 && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-700 text-sm animate-bounce">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>กรุณาตอบแบบสอบถามให้ครบทั้ง 5 ข้อ ก่อนกดส่งข้อมูล (เหลืออีก {5 - answeredCount} ข้อ)</span>
        </div>
      )}

      {/* Form Questions */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {SURVEY_QUESTIONS.map((q) => {
          const key = `q${q.id}`;
          const currentScore = ratings[key];
          const isMissing = showError && !currentScore;

          return (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-xs ${
                isMissing
                  ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20'
                  : currentScore
                  ? 'border-indigo-200 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                  {q.category}
                </span>
                {currentScore > 0 && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                    <span>ให้ {currentScore} คะแนน</span>
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-1 leading-snug">
                {q.title}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {q.description}
              </p>

              {/* 1-5 Scale Buttons (Mobile friendly large tap targets) */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {RATING_OPTIONS.map((opt) => {
                  const isSelected = currentScore === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleSelectScore(key, opt.score)}
                      className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? `${opt.color} shadow-md scale-102 ring-2 ${opt.ringColor}`
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl mb-1 select-none">{opt.emoji}</span>
                      <span className="text-base sm:text-lg font-extrabold leading-none">{opt.score}</span>
                      <span className={`text-[10px] sm:text-xs font-medium mt-1 truncate max-w-full leading-tight ${
                        isSelected ? 'text-inherit font-semibold' : 'text-slate-500'
                      }`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Optional Feedback / Suggestions Textarea */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">
              ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุง (ไม่บังคับ)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            สิ่งที่ท่านประทับใจ หรือหัวข้อ/เทคนิคที่อยากให้จัดอบรมเพิ่มเติมในอนาคต
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="พิมพ์ความคิดเห็นหรือข้อเสนอแนะของท่านที่นี่..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none text-slate-700 placeholder-slate-400"
          ></textarea>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-5 h-5" />
            <span>ส่งแบบประเมิน ({answeredCount}/5 ข้อ)</span>
          </button>
          <p className="text-center text-xs text-slate-500 mt-3">
            การตอบแบบสอบถามนี้เป็นแบบไม่ระบุชื่อ และระบบจะนำข้อมูลไปคำนวณสถิติภาพรวม
          </p>
        </div>
      </form>
    </div>
  );
};
