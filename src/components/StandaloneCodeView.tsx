import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Flame, Rocket, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

export const StandaloneCodeView: React.FC = () => {
  const [activeFileTab, setActiveFileTab] = useState<'survey' | 'dashboard'>('survey');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);

  // Standalone Code 1: index.html (หน้าแบบสอบถามสำหรับผู้เข้าอบรม)
  const surveyHtmlCode = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts Kanit -->
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <!-- Firebase App & Realtime Database SDK (v9 compat) -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Kanit', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen py-6 px-4">

  <div class="max-w-xl mx-auto">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
      <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-2">
        📱 แบบสอบถามผ่านมือถือ (1-5 คะแนน)
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold mb-2">แบบประเมินความพึงพอใจการอบรม</h1>
      <p class="text-indigo-100 text-sm">
        โปรดประเมินความพึงพอใจครบทั้ง 5 ข้อ เพื่อนำข้อมูลไปปรับปรุงและพัฒนาหลักสูตรต่อไป
      </p>
    </div>

    <!-- Thank you screen (Hidden by default) -->
    <div id="thankYouScreen" class="hidden bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
        ✓
      </div>
      <h2 class="text-2xl font-bold text-slate-800 mb-2">บันทึกคำตอบเรียบร้อยแล้ว!</h2>
      <p class="text-slate-600 text-sm mb-6">
        ขอขอบพระคุณสำหรับความคิดเห็นอันมีค่ายิ่ง ข้อมูลถูกส่งเข้าสู่ Dashboard เรียบร้อยแล้ว
      </p>
      <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 mb-6">
        🔒 ระบบได้ป้องกันการตอบซ้ำจากเครื่องนี้แล้ว
      </div>
      <button onclick="resetSubmission()" class="text-xs text-indigo-600 underline cursor-pointer">
        [ทดสอบ] ตอบใหม่อีกครั้ง
      </button>
    </div>

    <!-- Survey Form -->
    <form id="surveyForm" onsubmit="handleSubmit(event)" class="space-y-4">
      
      <!-- Question 1 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs" id="card-q1">
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ด้านเนื้อหา</span>
        <h3 class="font-bold text-slate-800 mt-2 mb-1">1. เนื้อหาหลักสูตรมีความสอดคล้อง ชัดเจน และนำไปใช้ได้จริง</h3>
        <p class="text-xs text-slate-500 mb-3">ตรงตามวัตถุประสงค์และตอบโจทย์การทำงาน</p>
        <div class="grid grid-cols-5 gap-1.5" id="group-q1"></div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs" id="card-q2">
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ด้านวิทยากร</span>
        <h3 class="font-bold text-slate-800 mt-2 mb-1">2. วิทยากรมีความรู้ความเชี่ยวชาญ และเทคนิคการถ่ายทอด</h3>
        <p class="text-xs text-slate-500 mb-3">อธิบายเข้าใจง่าย ถ่ายทอดสนุก และตอบข้อซักถามชัดเจน</p>
        <div class="grid grid-cols-5 gap-1.5" id="group-q2"></div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs" id="card-q3">
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ด้านสื่อ/กิจกรรม</span>
        <h3 class="font-bold text-slate-800 mt-2 mb-1">3. สื่อการสอน เอกสาร และกิจกรรม Workshop เหมาะสม</h3>
        <p class="text-xs text-slate-500 mb-3">ช่วยส่งเสริมให้เข้าใจและลงมือทำได้จริง</p>
        <div class="grid grid-cols-5 gap-1.5" id="group-q3"></div>
      </div>

      <!-- Question 4 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs" id="card-q4">
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ด้านการจัดการ</span>
        <h3 class="font-bold text-slate-800 mt-2 mb-1">4. ความเหมาะสมของระยะเวลา สถานที่ และอุปกรณ์/ระบบ</h3>
        <p class="text-xs text-slate-500 mb-3">ตรงต่อเวลา และทีมงานดูแลประสานงานราบรื่น</p>
        <div class="grid grid-cols-5 gap-1.5" id="group-q4"></div>
      </div>

      <!-- Question 5 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs" id="card-q5">
        <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ภาพรวมโครงการ</span>
        <h3 class="font-bold text-slate-800 mt-2 mb-1">5. ความพึงพอใจในภาพรวมและประโยชน์ที่ได้รับ</h3>
        <p class="text-xs text-slate-500 mb-3">คุ้มค่าต่อเวลาและช่วยพัฒนาทักษะการทำงาน</p>
        <div class="grid grid-cols-5 gap-1.5" id="group-q5"></div>
      </div>

      <!-- Optional Feedback -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 class="font-bold text-slate-800 mb-1">ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)</h3>
        <p class="text-xs text-slate-500 mb-2">สิ่งที่ประทับใจ หรือสิ่งที่อยากให้เพิ่มเติมในครั้งถัดไป</p>
        <textarea id="feedbackInput" rows="3" placeholder="พิมพ์ข้อเสนอแนะของท่าน..." 
          class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:outline-none"></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit" 
        class="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition">
        ส่งแบบประเมินความพึงพอใจ
      </button>
    </form>
  </div>

  <script>
    // ==========================================
    // 1. ตั้งค่า FIREBASE CONFIG (นำมาจาก Firebase Console)
    // ==========================================
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // เริ่มต้นเชื่อมต่อ Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // ตัวแปรเก็บคะแนน
    const selectedRatings = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
    const ratingLabels = [
      { score: 5, text: 'มากที่สุด', emoji: '🤩' },
      { score: 4, text: 'มาก', emoji: '😊' },
      { score: 3, text: 'ปานกลาง', emoji: '😐' },
      { score: 2, text: 'น้อย', emoji: '🙁' },
      { score: 1, text: 'น้อยที่สุด', emoji: '😞' },
    ];

    // สร้างปุ่มเลือกคะแนน 1-5 แบบไดนามิก
    ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(qKey => {
      const groupEl = document.getElementById('group-' + qKey);
      ratingLabels.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'py-3 px-1 rounded-xl border border-slate-200 text-center hover:border-indigo-500 transition btn-' + qKey;
        btn.id = qKey + '-score-' + opt.score;
        btn.innerHTML = '<span class="text-xl block">' + opt.emoji + '</span>' +
                        '<span class="font-bold text-sm block">' + opt.score + '</span>' +
                        '<span class="text-[10px] text-slate-500 block">' + opt.text + '</span>';
        btn.onclick = () => selectRating(qKey, opt.score);
        groupEl.appendChild(btn);
      });
    });

    function selectRating(qKey, score) {
      selectedRatings[qKey] = score;
      document.querySelectorAll('.btn-' + qKey).forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
        b.classList.add('border-slate-200');
      });
      const activeBtn = document.getElementById(qKey + '-score-' + score);
      activeBtn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
    }

    // ตรวจสอบการตอบซ้ำในเครื่องนี้
    if (localStorage.getItem('survey_submitted') === 'true') {
      document.getElementById('surveyForm').classList.add('hidden');
      document.getElementById('thankYouScreen').classList.remove('hidden');
    }

    function handleSubmit(e) {
      e.preventDefault();
      // ตรวจสอบว่าตอบครบ 5 ข้อหรือไม่
      const missing = Object.values(selectedRatings).some(v => v === 0);
      if (missing) {
        alert('กรุณาเลือกให้คะแนนความพึงพอใจให้ครบทั้ง 5 ข้อครับ');
        return;
      }

      const sum = selectedRatings.q1 + selectedRatings.q2 + selectedRatings.q3 + selectedRatings.q4 + selectedRatings.q5;
      const overallAvg = Number((sum / 5).toFixed(2));
      const feedback = document.getElementById('feedbackInput').value.trim();

      const newResponse = {
        timestamp: new Date().toISOString(),
        ratings: selectedRatings,
        overallAvg: overallAvg,
        feedback: feedback || '',
        device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
      };

      // บันทึกขึ้น Firebase Realtime Database (/surveys)
      database.ref('surveys').push(newResponse)
        .then(() => {
          localStorage.setItem('survey_submitted', 'true');
          confetti({ particleCount: 80, spread: 60 });
          document.getElementById('surveyForm').classList.add('hidden');
          document.getElementById('thankYouScreen').classList.remove('hidden');
        })
        .catch(err => {
          alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + err.message);
        });
    }

    function resetSubmission() {
      localStorage.removeItem('survey_submitted');
      location.reload();
    }
  </script>
</body>
</html>`;

  // Standalone Code 2: dashboard.html (หน้า Dashboard สดสำหรับขึ้นจอโปรเจกเตอร์)
  const dashboardHtmlCode = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Dashboard ผลประเมินความพึงพอใจการอบรม</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts Kanit -->
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- Chart.js CDN สำหรับกราฟแท่ง -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- QRCode.js CDN สำหรับสร้าง QR Code -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <!-- Firebase App & Realtime Database SDK (v9 compat) -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Kanit', sans-serif; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen py-8 px-4 sm:px-8">

  <div class="max-w-7xl mx-auto">
    <!-- Top Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
      <div>
        <div class="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Firebase Real-time Connected</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Live Dashboard ผลการประเมินการอบรม</h1>
        <p class="text-slate-400 text-sm mt-1">อัปเดตสถิติและผลคะแนนสดทันทีที่มีคนตอบแบบสอบถาม</p>
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="exportCSV()" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-md">
          📥 ดาวน์โหลด CSV (Excel)
        </button>
      </div>
    </div>

    <!-- 3 Big KPI Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Card 1: Score -->
      <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6">
        <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">คะแนนเฉลี่ยรวม</div>
        <div class="flex items-baseline space-x-2">
          <span id="statOverallAvg" class="text-5xl font-black text-indigo-400">0.00</span>
          <span class="text-slate-400 text-lg">/ 5.00</span>
        </div>
        <div class="mt-3">
          <span id="statOverallBadge" class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-900/80 text-indigo-300">
            รอข้อมูล
          </span>
        </div>
      </div>

      <!-- Card 2: Count -->
      <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6">
        <div class="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">จำนวนผู้ตอบแบบสอบถาม</div>
        <div class="flex items-baseline space-x-2">
          <span id="statTotalCount" class="text-5xl font-black text-emerald-400">0</span>
          <span class="text-slate-400 text-lg">ท่าน</span>
        </div>
        <div class="mt-3 text-xs text-slate-400">
          อัปเดตแบบเรียลไทม์
        </div>
      </div>

      <!-- Card 3: QR Code for Audience -->
      <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">สแกนตอบตอนนี้</div>
          <div class="text-base font-bold">สแกน QR Code ผ่านมือถือ</div>
          <div class="text-xs text-slate-400 mt-1">ใช้เวลาประเมินเพียง 1 นาที</div>
        </div>
        <div id="qrcode" class="bg-white p-2 rounded-xl shadow shrink-0"></div>
      </div>
    </div>

    <!-- Charts & Feedbacks Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Left: Chart.js Bar Chart (8 cols) -->
      <div class="lg:col-span-8 bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8">
        <h2 class="text-xl font-bold mb-4">คะแนนเฉลี่ยรายข้อ (สเกล 1-5)</h2>
        <div class="h-80 w-full">
          <canvas id="barChartCanvas"></canvas>
        </div>
        
        <!-- Likert Legend -->
        <div class="mt-6 pt-6 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div class="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300">
            <b>4.51 - 5.00</b><br/>มากที่สุด
          </div>
          <div class="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-300">
            <b>3.51 - 4.50</b><br/>มาก
          </div>
          <div class="p-2 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300">
            <b>2.51 - 3.50</b><br/>ปานกลาง
          </div>
          <div class="p-2 rounded-xl bg-orange-950/80 border border-orange-800 text-orange-300">
            <b>1.51 - 2.50</b><br/>น้อย
          </div>
          <div class="p-2 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300">
            <b>1.00 - 1.50</b><br/>น้อยที่สุด
          </div>
        </div>
      </div>

      <!-- Right: Real-Time Feedback Stream (4 cols) -->
      <div class="lg:col-span-4 bg-slate-800/80 border border-slate-700 rounded-3xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">ข้อเสนอแนะล่าสุด</h2>
          <span id="feedbackCount" class="text-xs bg-slate-700 px-2.5 py-0.5 rounded-full text-slate-300">0</span>
        </div>
        <div id="feedbackList" class="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
          <div class="text-center py-10 text-slate-500">รอข้อเสนอแนะจากผู้เข้าอบรม...</div>
        </div>
      </div>

    </div>
  </div>

  <script>
    // ==========================================
    // 1. ตั้งค่า FIREBASE CONFIG (นำมาจาก Firebase Console)
    // ==========================================
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // สร้าง QR Code ให้ชี้ไปที่ไฟล์ index.html
    const surveyUrl = window.location.href.replace('dashboard.html', 'index.html');
    new QRCode(document.getElementById("qrcode"), {
      text: surveyUrl,
      width: 80,
      height: 80,
      colorDark: "#000000",
      colorLight: "#ffffff"
    });

    // ตั้งค่า Chart.js
    const ctx = document.getElementById('barChartCanvas').getContext('2d');
    const barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          '1. เนื้อหาหลักสูตร',
          '2. วิทยากรผู้สอน',
          '3. สื่อและกิจกรรม',
          '4. การจัดการ/เวลา',
          '5. ภาพรวมประโยชน์'
        ],
        datasets: [{
          label: 'คะแนนเฉลี่ย (เต็ม 5)',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            'rgba(16, 185, 129, 0.85)',
            'rgba(6, 182, 212, 0.85)',
            'rgba(99, 102, 241, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(139, 92, 246, 0.85)'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: { color: '#94a3b8' },
            grid: { color: '#334155' }
          },
          x: {
            ticks: { color: '#cbd5e1' },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    let currentResponses = [];

    // เกณฑ์ Likert Scale ของ Best
    function interpretScore(score) {
      if (score >= 4.51) return { text: 'มากที่สุด (ดีเยี่ยม)', class: 'bg-emerald-900/80 text-emerald-300' };
      if (score >= 3.51) return { text: 'มาก (ดีมาก)', class: 'bg-cyan-900/80 text-cyan-300' };
      if (score >= 2.51) return { text: 'ปานกลาง', class: 'bg-amber-900/80 text-amber-300' };
      if (score >= 1.51) return { text: 'น้อย', class: 'bg-orange-900/80 text-orange-300' };
      return { text: 'น้อยที่สุด', class: 'bg-rose-900/80 text-rose-300' };
    }

    // ==========================================
    // 2. ฟังข้อมูลแบบเรียลไทม์จาก Firebase Realtime Database
    // ==========================================
    database.ref('surveys').on('value', snapshot => {
      const data = snapshot.val();
      if (!data) return;

      currentResponses = Object.values(data);
      const total = currentResponses.length;
      document.getElementById('statTotalCount').innerText = total;

      // รวมคะแนนรายข้อ
      let sumQ1 = 0, sumQ2 = 0, sumQ3 = 0, sumQ4 = 0, sumQ5 = 0;
      currentResponses.forEach(r => {
        sumQ1 += Number(r.ratings.q1 || 0);
        sumQ2 += Number(r.ratings.q2 || 0);
        sumQ3 += Number(r.ratings.q3 || 0);
        sumQ4 += Number(r.ratings.q4 || 0);
        sumQ5 += Number(r.ratings.q5 || 0);
      });

      const avgQ1 = Number((sumQ1 / total).toFixed(2));
      const avgQ2 = Number((sumQ2 / total).toFixed(2));
      const avgQ3 = Number((sumQ3 / total).toFixed(2));
      const avgQ4 = Number((sumQ4 / total).toFixed(2));
      const avgQ5 = Number((sumQ5 / total).toFixed(2));
      const overallAvg = Number(((avgQ1 + avgQ2 + avgQ3 + avgQ4 + avgQ5) / 5).toFixed(2));

      document.getElementById('statOverallAvg').innerText = overallAvg.toFixed(2);
      const badge = interpretScore(overallAvg);
      const badgeEl = document.getElementById('statOverallBadge');
      badgeEl.innerText = badge.text;
      badgeEl.className = 'px-3 py-1 rounded-full text-xs font-bold ' + badge.class;

      // อัปเดตกราฟแท่ง
      barChart.data.datasets[0].data = [avgQ1, avgQ2, avgQ3, avgQ4, avgQ5];
      barChart.update();

      // อัปเดตรายการข้อเสนอแนะล่าสุด
      const feedbackContainer = document.getElementById('feedbackList');
      feedbackContainer.innerHTML = '';
      const feedbacks = currentResponses.filter(r => r.feedback && r.feedback.trim()).reverse();
      document.getElementById('feedbackCount').innerText = feedbacks.length;

      if (feedbacks.length === 0) {
        feedbackContainer.innerHTML = '<div class="text-center py-8 text-slate-500">ยังไม่มีข้อเสนอแนะ</div>';
      } else {
        feedbacks.forEach(fb => {
          const item = document.createElement('div');
          item.className = 'p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl';
          item.innerHTML = '<div class="flex justify-between text-[11px] text-amber-400 font-bold mb-1">' +
                           '<span>⭐ ' + Number(fb.overallAvg).toFixed(2) + ' คะแนน</span>' +
                           '<span class="text-slate-400 font-normal">' + (fb.device || 'มือถือ') + '</span>' +
                           '</div>' +
                           '<p class="text-slate-300">"' + fb.feedback + '"</p>';
          feedbackContainer.appendChild(item);
        });
      }
    });

    // ==========================================
    // 3. ฟังก์ชันดาวน์โหลดเป็นไฟล์ CSV (UTF-8 BOM สำหรับ Excel ภาษาไทย)
    // ==========================================
    function exportCSV() {
      if (currentResponses.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
        return;
      }
      let csv = '\\uFEFFลำดับ,วัน-เวลา,ข้อ 1 เนื้อหา,ข้อ 2 วิทยากร,ข้อ 3 สื่อ/กิจกรรม,ข้อ 4 การจัดการ,ข้อ 5 ภาพรวม,คะแนนเฉลี่ย,ข้อเสนอแนะ\\r\\n';
      currentResponses.forEach((r, idx) => {
        const time = new Date(r.timestamp).toLocaleString('th-TH');
        const fb = (r.feedback || '').replace(/"/g, '""');
        csv += (idx + 1) + ',"' + time + '",' + r.ratings.q1 + ',' + r.ratings.q2 + ',' + r.ratings.q3 + ',' + r.ratings.q4 + ',' + r.ratings.q5 + ',' + r.overallAvg + ',"' + fb + '"\\r\\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'ผลประเมินความพึงพอใจ_' + new Date().toISOString().slice(0, 10) + '.csv';
      link.click();
    }
  </script>
</body>
</html>`;

  const copyToClipboard = (text: string, type: 'survey' | 'dashboard') => {
    navigator.clipboard.writeText(text);
    if (type === 'survey') {
      setCopiedSurvey(true);
      setTimeout(() => setCopiedSurvey(false), 2000);
    } else {
      setCopiedDashboard(true);
      setTimeout(() => setCopiedDashboard(false), 2000);
    }
  };

  const downloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro Box */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
          <FileCode className="w-3.5 h-3.5" />
          <span>โค้ดแยก 2 ไฟล์พร้อมใช้งาน (HTML + JS + Firebase Realtime Database)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          โค้ดแยก 2 ไฟล์ &amp; วิธีตั้งค่า Firebase และ Deploy ทีละขั้นตอน
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          ตามข้อกำหนด: โค้ดถูกเขียนแยกออกเป็น 2 ไฟล์สมบูรณ์ (1) <code>index.html</code> สำหรับผู้เข้าอบรมสแกนตอบ และ (2) <code>dashboard.html</code> สำหรับขึ้นจอโปรเจกเตอร์ พร้อมคู่มือตั้งค่า Firebase Realtime Database ฟรี 100%
        </p>
      </div>

      {/* Code Viewer Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden mb-12">
        {/* File Tabs Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveFileTab('survey')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeFileTab === 'survey'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              📄 ไฟล์ 1: index.html (หน้าแบบสอบถาม)
            </button>
            <button
              onClick={() => setActiveFileTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeFileTab === 'dashboard'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              📊 ไฟล์ 2: dashboard.html (หน้าแดชบอร์ดสด)
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {activeFileTab === 'survey' ? (
              <>
                <button
                  onClick={() => copyToClipboard(surveyHtmlCode, 'survey')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  {copiedSurvey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSurvey ? 'คัดลอกแล้ว!' : 'คัดลอก index.html'}</span>
                </button>
                <button
                  onClick={() => downloadFile('index.html', surveyHtmlCode)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด .html</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => copyToClipboard(dashboardHtmlCode, 'dashboard')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  {copiedDashboard ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDashboard ? 'คัดลอกแล้ว!' : 'คัดลอก dashboard.html'}</span>
                </button>
                <button
                  onClick={() => downloadFile('dashboard.html', dashboardHtmlCode)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด .html</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Code Content Area */}
        <div className="p-4 sm:p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto max-h-[500px]">
          <pre>
            <code>{activeFileTab === 'survey' ? surveyHtmlCode : dashboardHtmlCode}</code>
          </pre>
        </div>
      </div>

      {/* Step-by-Step Setup Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              วิธีตั้งค่า Firebase Realtime Database และขั้นตอน Deploy ทีละขั้น
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ใช้เวลาตั้งค่าประมาณ 3-5 นาที ฟรี 100% ไม่ต้องผูกบัตรเครดิต (Spark Plan)
            </p>
          </div>
        </div>

        {/* Step 1 */}
        <div className="space-y-8">
          <div className="border-l-4 border-indigo-600 pl-4 sm:pl-6 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-bold text-base sm:text-lg text-slate-800">สร้าง Firebase Project ใหม่</h3>
            </div>
            <p className="text-sm text-slate-600">
              1. ไปที่เว็บไซต์ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">Firebase Console</a> แล้วล็อกอินด้วย Google Account<br/>
              2. กดปุ่ม <b>"Add project"</b> หรือ <b>"สร้างโปรเจกต์"</b><br/>
              3. ตั้งชื่อโปรเจกต์ เช่น <code>workshop-survey-app</code> แล้วกด Continue<br/>
              4. ส่วน Google Analytics สามารถเลือกปิด (Disable) หรือเปิดไว้ก็ได้ แล้วกด <b>"Create project"</b>
            </p>
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-amber-500 pl-4 sm:pl-6 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold text-base sm:text-lg text-slate-800">เปิดใช้งาน Realtime Database &amp; ตั้งค่า Rules</h3>
            </div>
            <p className="text-sm text-slate-600">
              1. ในเมนูด้านซ้าย เลือก <b>Build &gt; Realtime Database</b><br/>
              2. กดปุ่ม <b>"Create Database"</b><br/>
              3. เลือกตำแหน่งเซิร์ฟเวอร์ (เช่น Singapore หรือ United States) แล้วกด Next<br/>
              4. ที่แท็บ <b>Rules (กฎความปลอดภัย)</b> ให้ตั้งค่าให้อ่านและเขียนได้โดยไม่ต้องล็อกอิน (Public Survey):
            </p>
            <div className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-xs max-w-md">
              <pre>{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}</pre>
            </div>
            <p className="text-xs text-slate-500">
              * กฎนี้อนุญาตให้ผู้เข้าอบรมส่งคำตอบและให้ Dashboard ดึงข้อมูลไปแสดงผลได้ทันทีโดยไม่ต้องล็อกอิน
            </p>
          </div>

          {/* Step 3 */}
          <div className="border-l-4 border-emerald-500 pl-4 sm:pl-6 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="font-bold text-base sm:text-lg text-slate-800">นำ Firebase Config มาวางในโค้ดทั้ง 2 ไฟล์</h3>
            </div>
            <p className="text-sm text-slate-600">
              1. ไปที่ <b>Project Settings (รูปฟันเฟืองมุมซ้ายบน) &gt; General</b><br/>
              2. เลื่อนลงมาที่หัวข้อ <i>"Your apps"</i> แล้วกดไอคอนเว็บ <b>&lt;/&gt; (Web App)</b><br/>
              3. ตั้งชื่อแอป เช่น <code>Survey Web</code> แล้วกด Register app<br/>
              4. คัดลอกบล็อก <code>const firebaseConfig = &#123; ... &#125;;</code> ที่ได้ มาแทนที่ในไฟล์ <code>index.html</code> และ <code>dashboard.html</code> ตรงส่วนหัวสคริปต์
            </p>
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-cyan-500 pl-4 sm:pl-6 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center">4</span>
              <h3 className="font-bold text-base sm:text-lg text-slate-800">ทดสอบรันแบบ Local ในเครื่อง</h3>
            </div>
            <p className="text-sm text-slate-600">
              - ดับเบิลคลิกเปิดไฟล์ <code>index.html</code> ในเบราว์เซอร์หนึ่ง<br/>
              - เปิดไฟล์ <code>dashboard.html</code> ในอีกแท็บหนึ่ง หรืออีกหน้าต่าง<br/>
              - เมื่อกดส่งคะแนนใน <code>index.html</code> จะเห็นตัวเลขและกราฟใน <code>dashboard.html</code> ขยับทันทีแบบเสี้ยววินาที!
            </p>
          </div>

          {/* Step 5 */}
          <div className="border-l-4 border-violet-600 pl-4 sm:pl-6 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">5</span>
              <h3 className="font-bold text-base sm:text-lg text-slate-800">วิธี Deploy ขึ้นอินเทอร์เน็ตฟรี (เลือกได้ตามสะดวก)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 text-sm block mb-1">ตัวเลือก A: GitHub Pages (ง่ายสุด)</span>
                <p className="text-slate-600">สร้าง repository บน GitHub แล้วอัปโหลด 2 ไฟล์นี้ขึ้นไป เปิดใช้งาน GitHub Pages ใน Settings จะได้ URL พร้อม HTTPS ฟรีทันที</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 text-sm block mb-1">ตัวเลือก B: Firebase Hosting</span>
                <p className="text-slate-600">ใช้คำสั่ง <code>firebase init hosting</code> แล้ววางไฟล์ไว้ในโฟลเดอร์ <code>public/</code> จากนั้นพิมพ์ <code>firebase deploy</code></p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 text-sm block mb-1">ตัวเลือก C: Vercel / Netlify Drop</span>
                <p className="text-slate-600">ลากโฟลเดอร์ที่มีไฟล์ <code>index.html</code> และ <code>dashboard.html</code> ไปวางในหน้าเว็บ Netlify Drop หรือ Vercel จะได้ลิงก์ใช้งานทันที</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
