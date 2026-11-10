import React, { useEffect, useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Smartphone, Sparkles, ExternalLink } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  responseCount: number;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, responseCount }) => {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const surveyUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const u = new URL(window.location.href);
    u.searchParams.set('tab', 'survey');
    return u.toString();
  }, []);

  useEffect(() => {
    if (!surveyUrl || !isOpen) return;
    QRCode.toDataURL(surveyUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [surveyUrl, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!surveyUrl) return;
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>โหมดฉายจอโปรเจกเตอร์สำหรับผู้เข้าร่วม</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          สแกน QR Code เพื่อทำแบบสอบถาม
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          โปรดเปิดกล้องสมาร์ตโฟนสแกนรหัส QR ด้านล่าง ใช้เวลาประเมินเพียง 1 นาที
        </p>

        {/* Big Crisp QR Code */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 mx-auto bg-white p-3 rounded-3xl shadow-lg border-2 border-indigo-100 flex items-center justify-center mb-6">
          {qrUrl ? (
            <img src={qrUrl} alt="QR Code สำหรับตอบแบบสอบถาม" className="w-full h-full object-contain rounded-xl" />
          ) : (
            <div className="text-slate-400 text-sm animate-pulse">กำลังประมวลผล QR Code...</div>
          )}
        </div>

        {/* Live Respondent Counter Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>ขณะนี้มีผู้ตอบแล้ว {responseCount} ท่าน</span>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-3 text-left mb-6 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-extrabold text-indigo-600 block text-sm">1. เปิดกล้อง</span>
            <span className="text-slate-500">ใช้มือถือเปิดแอปกล้องหรือ Line</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-extrabold text-indigo-600 block text-sm">2. สแกน QR</span>
            <span className="text-slate-500">จ่อกล้องเพื่อเปิดลิงก์แบบสอบถาม</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-extrabold text-indigo-600 block text-sm">3. ให้คะแนน</span>
            <span className="text-slate-500">เลือก 1-5 คะแนนครบ 5 ข้อ แล้วกดส่ง</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:border-indigo-500 text-slate-700 text-sm font-medium flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกลิงก์สำเร็จ!' : 'คัดลอก URL แบบสอบถาม'}</span>
          </button>

          <a
            href={surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
          >
            <span>เปิดหน้าตอบในแท็บใหม่</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
