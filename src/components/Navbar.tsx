import React from 'react';
import { ActiveTab } from '../types/survey';
import { ClipboardCheck, LayoutDashboard, Code, QrCode, Download, RotateCcw, PlusCircle, Monitor } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  responseCount: number;
  onOpenQr: () => void;
  onExportCsv: () => void;
  onResetData: () => void;
  onAddSample: () => void;
  isProjectorMode: boolean;
  setIsProjectorMode: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  responseCount,
  onOpenQr,
  onExportCsv,
  onResetData,
  onAddSample,
  isProjectorMode,
  setIsProjectorMode,
}) => {
  return (
    <header className={`sticky top-0 z-40 transition-colors border-b ${
      isProjectorMode 
        ? 'bg-slate-900 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-800 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight">
                  ระบบประเมินความพึงพอใจการอบรม
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                  เรียลไทม์
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Training Satisfaction Survey &amp; Live Projector Dashboard
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('survey')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'survey'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isProjectorMode
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>หน้าแบบสอบถาม</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isProjectorMode
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard สด</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-800 text-indigo-100'
                  : 'bg-emerald-500 text-white'
              }`}>
                {responseCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isProjectorMode
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Code className="w-4 h-4" />
              <span className="hidden md:inline">โค้ดแยก 2 ไฟล์ &amp; Deploy</span>
              <span className="md:hidden">โค้ด &amp; คู่มือ</span>
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenQr}
              title="แสดง QR Code ขึ้นจอสำหรับผู้เข้าอบรมสแกน"
              className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition"
            >
              <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">QR Code จอใหญ่</span>
            </button>

            <button
              onClick={onExportCsv}
              title="ดาวน์โหลดข้อมูลเป็นไฟล์ CSV (Excel ภาษาไทย)"
              className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {activeTab === 'dashboard' && (
              <button
                onClick={() => setIsProjectorMode((prev) => !prev)}
                title={isProjectorMode ? 'สลับกลับโหมดปกติ' : 'โหมดฉายโปรเจกเตอร์ (จอสีเข้ม คมชัด)'}
                className={`p-2 rounded-lg border text-sm transition ${
                  isProjectorMode
                    ? 'border-indigo-400 bg-indigo-950 text-indigo-300'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            )}

            {/* Quick Demo Utilities Dropdown / Menu */}
            <div className="relative group">
              <button
                title="ตัวช่วยทดสอบระบบ (เพิ่มข้อมูลจำลอง / รีเซ็ต)"
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm"
              >
                <PlusCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </button>
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block hover:block z-50">
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 py-1">
                  การจัดการข้อมูลเดโม
                </div>
                <button
                  onClick={onAddSample}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <PlusCircle className="w-4 h-4 text-indigo-600" />
                  <span>สุ่มเพิ่มผู้ตอบ 3 ท่าน</span>
                </button>
                <button
                  onClick={onResetData}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>รีเซ็ตข้อมูลเริ่มต้น (10 ตัวอย่าง)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
