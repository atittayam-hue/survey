import { SurveyResponse } from '../types/survey';
import { INITIAL_RESPONSES, SURVEY_QUESTIONS, interpretScore } from '../data/initialData';

const STORAGE_KEY = 'workshop_survey_responses_v1';
const SUBMITTED_FLAG_KEY = 'workshop_survey_has_submitted';
const FIREBASE_CONFIG_KEY = 'workshop_survey_firebase_config';

export interface FirebaseConfig {
  databaseURL: string;
  apiKey?: string;
  projectId?: string;
}

class StorageService {
  private channel: BroadcastChannel | null = null;
  private listeners: Array<(responses: SurveyResponse[]) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('survey_live_sync');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_RESPONSE_SAVED') {
            const latest = this.getResponses();
            this.notifyListeners(latest);
          } else if (event.data && event.data.type === 'DATA_RESET') {
            const latest = this.getResponses();
            this.notifyListeners(latest);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported or restricted', err);
      }

      // Also listen to storage events across windows
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          const latest = this.getResponses();
          this.notifyListeners(latest);
        }
      });
    }
  }

  public subscribe(callback: (responses: SurveyResponse[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners(responses: SurveyResponse[]) {
    this.listeners.forEach((cb) => cb(responses));
  }

  public getResponses(): SurveyResponse[] {
    if (typeof window === 'undefined') return INITIAL_RESPONSES;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Initialize with default responses if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESPONSES));
        return INITIAL_RESPONSES;
      }
      return JSON.parse(raw) as SurveyResponse[];
    } catch (e) {
      console.error('Failed to parse survey responses', e);
      return INITIAL_RESPONSES;
    }
  }

  public addResponse(ratings: { q1: number; q2: number; q3: number; q4: number; q5: number }, feedback?: string): SurveyResponse {
    const list = this.getResponses();
    const sum = ratings.q1 + ratings.q2 + ratings.q3 + ratings.q4 + ratings.q5;
    const avg = Number((sum / 5).toFixed(2));

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop/Tablet';

    const newResponse: SurveyResponse = {
      id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      ratings,
      overallAvg: avg,
      feedback: feedback?.trim() || undefined,
      device: deviceType,
    };

    const updated = [newResponse, ...list];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(SUBMITTED_FLAG_KEY, 'true');
    } catch (err) {
      console.error('LocalStorage write error', err);
    }

    // Try optional sync to Firebase Realtime Database if configured
    this.syncToFirebaseREST(newResponse);

    // Notify other tabs
    if (this.channel) {
      this.channel.postMessage({ type: 'NEW_RESPONSE_SAVED', payload: newResponse });
    }
    this.notifyListeners(updated);

    return newResponse;
  }

  public hasAlreadySubmitted(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SUBMITTED_FLAG_KEY) === 'true';
  }

  public clearSubmittedFlag(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SUBMITTED_FLAG_KEY);
  }

  public resetToDefault(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESPONSES));
    if (this.channel) {
      this.channel.postMessage({ type: 'DATA_RESET' });
    }
    this.notifyListeners(INITIAL_RESPONSES);
  }

  public addSampleResponses(count = 3): void {
    const sampleFeedbacks = [
      'เข้าใจหัวข้อที่นำเสนอได้ชัดเจนขึ้นมาก ชอบช่วง Q&A ท้ายคาบครับ',
      'วิทยากรพลังบวกดีมาก ตัวอย่าง workshop เข้าใจง่าย',
      'อยากให้ขยายเวลาช่วงบ่ายอีกสัก 30 นาที สำหรับทำแบบฝึกหัดจริง',
      'ระบบการอบรมราบรื่นดี การบรรยายไม่น่าเบื่อ ได้ไอเดียใหม่เยอะเลยครับ',
      'ดีเยี่ยมมากค่ะ เอกสารครบถ้วน นำกลับไปใช้ในทีมได้ทันที',
      'วิทยากรตอบคำถามได้ตรงจุด ให้คำแนะนำการแก้ปัญหาได้ตรงประเด็นมาก',
    ];

    const current = this.getResponses();
    const additions: SurveyResponse[] = [];

    for (let i = 0; i < count; i++) {
      // Generate realistic scores with lean towards 4-5
      const randomScore = () => {
        const r = Math.random();
        if (r > 0.4) return 5;
        if (r > 0.15) return 4;
        if (r > 0.05) return 3;
        return 4;
      };

      const q1 = randomScore();
      const q2 = randomScore();
      const q3 = randomScore();
      const q4 = randomScore();
      const q5 = randomScore();
      const avg = Number(((q1 + q2 + q3 + q4 + q5) / 5).toFixed(2));

      const fb = Math.random() > 0.3 ? sampleFeedbacks[Math.floor(Math.random() * sampleFeedbacks.length)] : undefined;

      additions.push({
        id: 'resp-' + (Date.now() - i * 1000) + '-' + Math.random().toString(36).substring(2, 5),
        timestamp: new Date(Date.now() - i * 45000).toISOString(),
        ratings: { q1, q2, q3, q4, q5 },
        overallAvg: avg,
        feedback: fb,
        device: Math.random() > 0.5 ? 'Mobile (Smartphone)' : 'Laptop (Browser)',
      });
    }

    const updated = [...additions, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (this.channel) {
      this.channel.postMessage({ type: 'NEW_RESPONSE_SAVED' });
    }
    this.notifyListeners(updated);
  }

  // Firebase Realtime Database Config
  public getFirebaseConfig(): FirebaseConfig | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  public setFirebaseConfig(cfg: FirebaseConfig | null): void {
    if (typeof window === 'undefined') return;
    if (cfg) {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(cfg));
    } else {
      localStorage.removeItem(FIREBASE_CONFIG_KEY);
    }
  }

  private async syncToFirebaseREST(response: SurveyResponse) {
    const config = this.getFirebaseConfig();
    if (!config?.databaseURL) return;

    try {
      let url = config.databaseURL.trim().replace(/\/$/, '');
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      const endpoint = `${url}/surveys.json`;
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });
    } catch (err) {
      console.warn('Firebase REST sync warning (offline or invalid credentials):', err);
    }
  }

  // Export CSV with UTF-8 BOM for perfect Thai Excel rendering
  public exportToCSV(responses: SurveyResponse[]): void {
    if (!responses || responses.length === 0) {
      alert('ยังไม่มีข้อมูลสำหรับส่งออก CSV');
      return;
    }

    // Calculate aggregated stats
    const totalCount = responses.length;
    const avgQ1 = (responses.reduce((s, r) => s + r.ratings.q1, 0) / totalCount);
    const avgQ2 = (responses.reduce((s, r) => s + r.ratings.q2, 0) / totalCount);
    const avgQ3 = (responses.reduce((s, r) => s + r.ratings.q3, 0) / totalCount);
    const avgQ4 = (responses.reduce((s, r) => s + r.ratings.q4, 0) / totalCount);
    const avgQ5 = (responses.reduce((s, r) => s + r.ratings.q5, 0) / totalCount);
    const totalAvg = (avgQ1 + avgQ2 + avgQ3 + avgQ4 + avgQ5) / 5;

    const escapeCSV = (val: string | number | undefined) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const lines: string[] = [];

    // Title Block
    lines.push('รายงานสรุปผลการประเมินความพึงพอใจการอบรม');
    lines.push(`วันที่ส่งออกข้อมูล,${escapeCSV(new Date().toLocaleString('th-TH'))}`);
    lines.push(`จำนวนผู้ตอบแบบสอบถามทั้งหมด,${totalCount} ท่าน`);
    lines.push(`คะแนนเฉลี่ยรวม (Likert 5 ระดับ),${totalAvg.toFixed(2)} / 5.00`);
    lines.push(`การแปลผลภาพรวม,${escapeCSV(interpretScore(totalAvg).label)}`);
    lines.push('');

    // Summary per question
    lines.push('ลำดับ,หัวข้อการประเมิน,คะแนนเฉลี่ย (เต็ม 5.00),ร้อยละ (%),การแปลผล');
    const avgs = [avgQ1, avgQ2, avgQ3, avgQ4, avgQ5];
    SURVEY_QUESTIONS.forEach((q, idx) => {
      const qAvg = avgs[idx];
      const percent = (qAvg / 5) * 100;
      const interp = interpretScore(qAvg).label;
      lines.push(`${idx + 1},${escapeCSV(q.title)},${qAvg.toFixed(2)},${percent.toFixed(1)}%,${escapeCSV(interp)}`);
    });
    lines.push(`รวมทุกด้าน,เฉลี่ยภาพรวมทั้งโครงการ,${totalAvg.toFixed(2)},${((totalAvg / 5) * 100).toFixed(1)}%,${escapeCSV(interpretScore(totalAvg).label)}`);
    lines.push('');

    // Raw Responses
    lines.push('--- ข้อมูลคำตอบรายบุคคล (Raw Data) ---');
    lines.push('ลำดับ,วัน-เวลาที่ตอบ,ข้อ 1 เนื้อหา,ข้อ 2 วิทยากร,ข้อ 3 สื่อ/กิจกรรม,ข้อ 4 บริหารจัดการ,ข้อ 5 ภาพรวม,คะแนนเฉลี่ย,อุปกรณ์,ข้อเสนอแนะเพิ่มเติม');

    responses.forEach((r, idx) => {
      const formattedDate = new Date(r.timestamp).toLocaleString('th-TH');
      lines.push([
        idx + 1,
        escapeCSV(formattedDate),
        r.ratings.q1,
        r.ratings.q2,
        r.ratings.q3,
        r.ratings.q4,
        r.ratings.q5,
        r.overallAvg.toFixed(2),
        escapeCSV(r.device || 'N/A'),
        escapeCSV(r.feedback || '-'),
      ].join(','));
    });

    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `รายงานแบบสอบถามความพึงพอใจ_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();
