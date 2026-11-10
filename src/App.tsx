/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, SurveyResponse } from './types/survey';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { StandaloneCodeView } from './components/StandaloneCodeView';
import { QrModal } from './components/QrModal';
import { CheckCircle2, Sparkles, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check URL query param on mount (e.g. ?tab=survey or ?tab=dashboard)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as ActiveTab;
      if (tabParam === 'survey' || tabParam === 'dashboard' || tabParam === 'guide') {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Sync tab change with URL without page reload
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Subscribe to real-time updates from storageService
  useEffect(() => {
    // Initial fetch
    const current = storageService.getResponses();
    setResponses(current);

    // Live subscription
    const unsubscribe = storageService.subscribe((latest) => {
      setResponses([...latest]);
      // Show gentle toast when latest changes
      if (latest.length > 0) {
        const newest = latest[0];
        setToastMessage(`🎉 มีผู้ตอบใหม่เข้ามา: ${newest.overallAvg.toFixed(2)} คะแนน (${newest.device || 'มือถือ'})`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleExportCsv = () => {
    storageService.exportToCSV(responses);
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลเป็นค่าเริ่มต้น (10 ตัวอย่าง) หรือไม่?')) {
      storageService.resetToDefault();
      setToastMessage('รีเซ็ตข้อมูลเรียบร้อยแล้ว');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleAddSample = () => {
    storageService.addSampleResponses(3);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isProjectorMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Real-time Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-indigo-900 text-white shadow-2xl border border-indigo-700 animate-slide-up text-sm font-medium">
          <Bell className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        responseCount={responses.length}
        onOpenQr={() => setIsQrOpen(true)}
        onExportCsv={handleExportCsv}
        onResetData={handleResetData}
        onAddSample={handleAddSample}
        isProjectorMode={isProjectorMode}
        setIsProjectorMode={setIsProjectorMode}
      />

      {/* Tab Contents */}
      <main className="flex-1">
        {activeTab === 'survey' && (
          <SurveyView
            onSuccessSubmit={() => {
              // Optionally after submit allow checking dashboard
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            responses={responses}
            onOpenQr={() => setIsQrOpen(true)}
            onExportCsv={handleExportCsv}
            onAddSample={handleAddSample}
            isProjectorMode={isProjectorMode}
            onSwitchToSurvey={() => handleTabChange('survey')}
          />
        )}

        {activeTab === 'guide' && (
          <StandaloneCodeView />
        )}
      </main>

      {/* Presentation Fullscreen QR Modal */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        responseCount={responses.length}
      />

      {/* Footer */}
      <footer className={`py-6 border-t text-center text-xs transition-colors ${
        isProjectorMode
          ? 'bg-slate-900/60 border-slate-800 text-slate-500'
          : 'bg-white border-slate-200 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ระบบแบบสอบถามความพึงพอใจการอบรม พร้อมแดชบอร์ดเรียลไทม์ (Realtime Likert Survey)
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleTabChange('survey')}
              className="hover:text-indigo-600 transition"
            >
              หน้าแบบสอบถาม
            </button>
            <span>•</span>
            <button
              onClick={() => handleTabChange('dashboard')}
              className="hover:text-indigo-600 transition"
            >
              แดชบอร์ด
            </button>
            <span>•</span>
            <button
              onClick={() => handleTabChange('guide')}
              className="hover:text-indigo-600 transition"
            >
              โค้ดแยก 2 ไฟล์ &amp; วิธีตั้งค่า Firebase
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
