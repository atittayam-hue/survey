import { Question, LikertLevel, SurveyResponse } from '../types/survey';

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: 1,
    title: '1. เนื้อหาหลักสูตรมีความสอดคล้อง ชัดเจน และนำไปประยุกต์ใช้ได้จริง',
    category: 'ด้านเนื้อหาหลักสูตร (Content)',
    description: 'เนื้อหามีความทันสมัย กระชับ เข้าใจง่าย และตรงกับวัตถุประสงค์ของการอบรม',
  },
  {
    id: 2,
    title: '2. วิทยากรมีความรู้ความเชี่ยวชาญ และเทคนิคการถ่ายทอดที่น่าสนใจ',
    category: 'ด้านวิทยากรผู้บรรยาย (Instructor)',
    description: 'วิทยากรสามารถอธิบายเรื่องยากให้เข้าใจง่าย มีความเป็นกันเอง และตอบข้อซักถามได้ชัดเจน',
  },
  {
    id: 3,
    title: '3. สื่อการสอน เอกสารประกอบ และกิจกรรม Workshop มีคุณภาพเหมาะสม',
    category: 'ด้านสื่อและกิจกรรม (Materials & Workshop)',
    description: 'สไลด์ เอกสาร ตัวอย่างโค้ด หรือแบบฝึกหัดช่วยส่งเสริมการเรียนรู้ได้อย่างมีประสิทธิภาพ',
  },
  {
    id: 4,
    title: '4. การบริหารเวลา ความพร้อมของระบบ/สถานที่ และการประสานงาน',
    category: 'ด้านการบริหารจัดการ (Organization & Facilities)',
    description: 'กำหนดการมีความตรงต่อเวลา ระบบออนไลน์/ห้องอบรม อุปกรณ์ และทีมงานดูแลได้เป็นอย่างดี',
  },
  {
    id: 5,
    title: '5. ความพึงพอใจในภาพรวมและประโยชน์ที่ท่านได้รับจากการอบรมครั้งนี้',
    category: 'ภาพรวมและประโยชน์ (Overall Value)',
    description: 'การอบรมครั้งนี้คุ้มค่า คุ้มเวลา และช่วยพัฒนาทักษะการทำงานของท่านได้อย่างมีนัยสำคัญ',
  },
];

export const RATING_OPTIONS = [
  { score: 5, label: 'มากที่สุด', emoji: '🤩', color: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600', ringColor: 'ring-emerald-400' },
  { score: 4, label: 'มาก', emoji: '😊', color: 'bg-teal-500 hover:bg-teal-600 text-white border-teal-600', ringColor: 'ring-teal-400' },
  { score: 3, label: 'ปานกลาง', emoji: '😐', color: 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-amber-500', ringColor: 'ring-amber-300' },
  { score: 2, label: 'น้อย', emoji: '🙁', color: 'bg-orange-400 hover:bg-orange-500 text-white border-orange-500', ringColor: 'ring-orange-300' },
  { score: 1, label: 'น้อยที่สุด', emoji: '😞', color: 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600', ringColor: 'ring-rose-400' },
];

// เกณฑ์การแปลผลตามแบบสเกล Likert (เกณฑ์ของ Best)
export const LIKERT_LEVELS: LikertLevel[] = [
  {
    min: 4.51,
    max: 5.00,
    label: 'มากที่สุด (ดีเยี่ยม)',
    labelEn: 'Highest (Excellent)',
    color: '#10b981', // emerald-500
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-500',
  },
  {
    min: 3.51,
    max: 4.50,
    label: 'มาก (ดีมาก)',
    labelEn: 'High (Very Good)',
    color: '#06b6d4', // cyan-500
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-300',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-500',
  },
  {
    min: 2.51,
    max: 3.50,
    label: 'ปานกลาง',
    labelEn: 'Moderate (Fair)',
    color: '#f59e0b', // amber-500
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-500',
  },
  {
    min: 1.51,
    max: 2.50,
    label: 'น้อย (ควรปรับปรุง)',
    labelEn: 'Low (Needs Improvement)',
    color: '#f97316', // orange-500
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-300',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-500',
  },
  {
    min: 1.00,
    max: 1.50,
    label: 'น้อยที่สุด (ต้องแก้ไขเร่งด่วน)',
    labelEn: 'Lowest (Urgent Attention)',
    color: '#ef4444', // rose-500
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-300',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-500',
  },
];

export function interpretScore(score: number): LikertLevel {
  if (score >= 4.51) return LIKERT_LEVELS[0];
  if (score >= 3.51) return LIKERT_LEVELS[1];
  if (score >= 2.51) return LIKERT_LEVELS[2];
  if (score >= 1.51) return LIKERT_LEVELS[3];
  return LIKERT_LEVELS[4];
}

// Initial realistic responses representing an engaging workshop
export const INITIAL_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp-1',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    ratings: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
    overallAvg: 4.8,
    feedback: 'วิทยากรสอนสนุกและมีตัวอย่างการประยุกต์ใช้จริงที่เห็นภาพชัดเจนมากครับ อยากให้มีคอร์สขั้นสูงต่อยอดอีก!',
    device: 'Mobile (iOS)',
  },
  {
    id: 'resp-2',
    timestamp: new Date(Date.now() - 3600000 * 2.1).toISOString(),
    ratings: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    overallAvg: 4.8,
    feedback: 'สไลด์กระชับ สวยงาม และเอกสารประกอบการทำ Workshop ละเอียด มีประโยชน์ต่อการทำงานจริงมาก',
    device: 'Mobile (Android)',
  },
  {
    id: 'resp-3',
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    ratings: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
    overallAvg: 4.2,
    feedback: 'บรรยากาศดี มีส่วนร่วมตลอดเวลา ตอบข้อซักถามละเอียดมากครับ',
    device: 'Tablet (iPad)',
  },
  {
    id: 'resp-4',
    timestamp: new Date(Date.now() - 3600000 * 1.4).toISOString(),
    ratings: { q1: 5, q2: 4, q3: 5, q4: 4, q5: 5 },
    overallAvg: 4.6,
    feedback: 'เนื้อหาแน่นและอัปเดต เหมาะกับการนำไปใช้พัฒนางานในองค์กรทันที ขอบคุณผู้จัดมากค่ะ',
    device: 'Mobile (iOS)',
  },
  {
    id: 'resp-5',
    timestamp: new Date(Date.now() - 3600000 * 1.1).toISOString(),
    ratings: { q1: 4, q2: 4, q3: 3, q4: 3, q5: 4 },
    overallAvg: 3.6,
    feedback: 'อยากให้เพิ่มเวลาในช่วงทำ Workshop ปฏิบัติจริงอีกนิด ช่วงท้ายแอบเร่งไปเล็กน้อยครับ',
    device: 'Laptop (Chrome)',
  },
  {
    id: 'resp-6',
    timestamp: new Date(Date.now() - 3600000 * 0.9).toISOString(),
    ratings: { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 },
    overallAvg: 5.0,
    feedback: 'ยอดเยี่ยมไร้ที่ติทั้งเนื้อหา วิทยากร และการดูแลประสานงานของทีมงาน ประทับใจมากค่ะ',
    device: 'Mobile (Android)',
  },
  {
    id: 'resp-7',
    timestamp: new Date(Date.now() - 3600000 * 0.7).toISOString(),
    ratings: { q1: 4, q2: 5, q3: 4, q4: 5, q5: 5 },
    overallAvg: 4.6,
    feedback: 'ระบบเสียงคมชัด ห้องจัดอบรมกว้างขวาง อาหารว่างอร่อย วิทยากรเป็นกันเองดีมาก',
    device: 'Mobile (iOS)',
  },
  {
    id: 'resp-8',
    timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    ratings: { q1: 5, q2: 5, q3: 4, q4: 4, q5: 5 },
    overallAvg: 4.6,
    feedback: '',
    device: 'Mobile (Android)',
  },
  {
    id: 'resp-9',
    timestamp: new Date(Date.now() - 3600000 * 0.3).toISOString(),
    ratings: { q1: 5, q2: 4, q3: 5, q4: 5, q5: 5 },
    overallAvg: 4.8,
    feedback: 'ชอบที่มีตัวอย่าง use case จริงให้ทดลองทำตาม ทำให้เข้าใจหลักการได้รวดเร็ว',
    device: 'Mobile (iOS)',
  },
  {
    id: 'resp-10',
    timestamp: new Date(Date.now() - 3600000 * 0.1).toISOString(),
    ratings: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
    overallAvg: 4.8,
    feedback: 'หวังว่าจะจัดโครงการดีๆ แบบนี้อีกเรื่อยๆ นะคะ ยินดีเข้าร่วมทุกคอร์สเลยค่ะ',
    device: 'Mobile (iOS)',
  },
];
