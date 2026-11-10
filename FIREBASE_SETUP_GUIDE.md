# คู่มือการตั้งค่า Firebase Realtime Database และการ Deploy ระบบแบบสอบถามความพึงพอใจ

คู่มือนี้จัดทำขึ้นสำหรับโปรเจกต์ **ระบบแบบสอบถามความพึงพอใจการอบรม พร้อมแดชบอร์ดเรียลไทม์ (Real-Time Satisfaction Survey & Dashboard)** ตามโจทย์ตัวอย่างที่ 5

---

## สรุปภาพรวมของระบบ (Overview)

1. **หน้าตอบแบบสอบถาม (`index.html`)**: ออกแบบสำหรับหน้าจอมือถือ (Mobile-first) ปุ่มกดใหญ่ สเกล 1-5 ดาว มีข้อเสนอแนะเพิ่มเติม พร้อมระบบป้องกันการตอบซ้ำจากเครื่องเดิม
2. **หน้า Dashboard (`dashboard.html`)**: ออกแบบสำหรับฉายขึ้นจอโปรเจกเตอร์หรือแสดงบนจอคอมพิวเตอร์ อัปเดตผลทันทีแบบ Real-time คำนวณค่าเฉลี่ยรายข้อและภาพรวม แปลผลตามเกณฑ์ Likert 5 ระดับ มี QR Code และปุ่มดาวน์โหลดรายงานเป็น CSV (Excel ภาษาไทย)
3. **Tech Stack**: HTML5 + Vanilla JavaScript + Tailwind CSS (CDN) + Chart.js + QRCode.js + Firebase Realtime Database SDK
4. **ค่าใช้จ่าย**: **ฟรี 100%** ภายใต้แพ็กเกจ Firebase Spark Plan (ไม่ต้องกรอกบัตรเครดิต)

---

## ขั้นตอนที่ 1: การสร้าง Firebase Project (ฟรี)

1. เข้าไปที่ [Firebase Console](https://console.firebase.google.com/) แล้วเข้าสู่ระบบด้วยบัญชี Google ของท่าน
2. คลิกปุ่ม **"Add project"** (หรือ "สร้างโปรเจกต์")
3. ตั้งชื่อโปรเจกต์ เช่น `training-survey-2026` แล้วคลิก **Continue**
4. ในส่วน Google Analytics สามารถเลือก **Disable (ปิดใช้งาน)** เพื่อความสะดวกรวดเร็ว หรือเปิดไว้ก็ได้ จากนั้นคลิก **"Create project"**
5. รอระบบสร้างโปรเจกต์ประมาณ 20 วินาที เมื่อเสร็จแล้วคลิก **Continue** เพื่อเข้าสู่หน้าแดชบอร์ดหลัก

---

## ขั้นตอนที่ 2: การสร้าง Realtime Database และตั้งค่า Rules

1. ที่เมนูด้านซ้าย ให้คลิกเลือก **Build > Realtime Database**
2. คลิกปุ่ม **"Create Database"**
3. เลือกตำแหน่งของฐานข้อมูล เช่น `Singapore (asia-southeast1)` หรือ `United States (us-central1)` แล้วคลิก **Next**
4. ในส่วน Security Rules ให้เลือก **Start in test mode** หรือคลิก **Enable**
5. เมื่อสร้างเสร็จแล้ว ให้คลิกที่แท็บ **Rules (กฎความปลอดภัย)** ด้านบน
6. แก้ไขกฎให้เปิดให้อ่านและบันทึกข้อมูลแบบ Public (เพื่อให้ผู้เข้าอบรมตอบได้โดยไม่ต้องล็อกอิน และให้แดชบอร์ดดึงข้อมูลขึ้นจอได้ทันที):

```json
{
  "rules": {
    "surveys": {
      ".read": true,
      ".write": true
    }
  }
}
```

7. คลิกปุ่ม **"Publish"** เพื่อบันทึกกฎ

---

## ขั้นตอนที่ 3: รับ Firebase Config ไปใส่ในโค้ด

1. คลิกที่ไอคอนรูปฟันเฟือง ⚙️ บริเวณมุมซ้ายบน เลือก **Project settings**
2. ในแท็บ **General** ให้เลื่อนลงมาด้านล่างสุดที่หัวข้อ **"Your apps"**
3. คลิกไอคอนเว็บ **`</>` (Web App)**
4. ตั้งชื่อ App เช่น `Survey Web` แล้วคลิก **Register app**
5. สังเกตโค้ดในส่วน `const firebaseConfig = { ... };` ตัวอย่างเช่น:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-EXAMPLE-KEY",
  authDomain: "training-survey-2026.firebaseapp.com",
  databaseURL: "https://training-survey-2026-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "training-survey-2026",
  storageBucket: "training-survey-2026.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

6. **คัดลอกบล็อก `firebaseConfig` นี้** ไปแทนที่ในโค้ดของทั้งสองไฟล์:
   - ไฟล์ `index.html` (หน้าแบบสอบถาม)
   - ไฟล์ `dashboard.html` (หน้าแดชบอร์ด)

---

## ขั้นตอนที่ 4: การทดสอบในเครื่องคอมพิวเตอร์ (Local Testing)

1. วางไฟล์ `index.html` และ `dashboard.html` ไว้ในโฟลเดอร์เดียวกัน
2. ดับเบิลคลิกเปิดไฟล์ `index.html` ในหน้าต่างเบราว์เซอร์ที่ 1
3. ดับเบิลคลิกเปิดไฟล์ `dashboard.html` ในหน้าต่างเบราว์เซอร์ที่ 2
4. ลองเลือกคะแนนใน `index.html` แล้วกด "ส่งแบบประเมินความพึงพอใจ"
5. สังเกตที่หน้าจอ `dashboard.html` ตัวเลขจำนวนผู้ตอบ, กราฟแท่ง, และคะแนนเฉลี่ยจะอัปเดตแบบ Real-time ทันที!

---

## ขั้นตอนที่ 5: วิธี Deploy ขึ้นอินเทอร์เน็ตฟรี (เลือกได้ตามสะดวก)

### ทางเลือกที่ 1: Deploy ผ่าน GitHub Pages (แนะนำ ง่ายที่สุด)
1. สร้าง Repository ใหม่บน [GitHub.com](https://github.com) (ตั้งชื่อ เช่น `survey-app`)
2. อัปโหลดไฟล์ `index.html` และ `dashboard.html` เข้าไปใน branch `main`
3. ไปที่แท็บ **Settings > Pages**
4. ที่ส่วน **Build and deployment** เลือก Source: `Deploy from a branch` และเลือก Branch: `main` / `/(root)` แล้วกด **Save**
5. ภายใน 1 นาที ท่านจะได้รับ URL ประจำเว็บ เช่น `https://username.github.io/survey-app/`
   - หน้าผู้เข้าอบรม: `https://username.github.io/survey-app/index.html`
   - หน้าแดชบอร์ด: `https://username.github.io/survey-app/dashboard.html`

---

### ทางเลือกที่ 2: Deploy ผ่าน Firebase Hosting (เร็วและเป็นทางการ)
1. ติดตั้ง Firebase CLI บนเครื่อง (ถ้ายังไม่มี):
   ```bash
   npm install -g firebase-tools
   ```
2. ล็อกอินเข้า Firebase:
   ```bash
   firebase login
   ```
3. เริ่มต้นโปรเจกต์ในโฟลเดอร์ที่เก็บไฟล์:
   ```bash
   firebase init hosting
   ```
   - เลือกโปรเจกต์ที่สร้างไว้ในข้อ 1
   - ระบุ Public directory เป็น `.` หรือโฟลเดอร์ที่เก็บไฟล์
   - ตั้งค่า Configure as a single-page app: ตอบ **No**
4. สั่ง Deploy ขึ้นระบบ:
   ```bash
   firebase deploy --only hosting
   ```
5. จะได้ URL พร้อม HTTPS เช่น `https://training-survey-2026.web.app`

---

### ทางเลือกที่ 3: ลากวางผ่าน Netlify Drop (ไม่ต้องใช้ Command Line)
1. เข้าไปที่ [app.netlify.com/drop](https://app.netlify.com/drop)
2. รวมไฟล์ `index.html` และ `dashboard.html` ไว้ในโฟลเดอร์เดียว
3. ลากโฟลเดอร์ไปวางในช่องรับไฟล์ของ Netlify
4. ภายใน 5 วินาที ท่านจะได้ลิงก์ออนไลน์พร้อมใช้งานทันที

---

## เกณฑ์การแปลผลคะแนนเฉลี่ยตามสเกล Likert (เกณฑ์ของ Best)

ระบบใช้สูตรการคำนวณความกว้างของอันตรภาคชั้น `(5 - 1) / 5 = 0.80`:

| ช่วงคะแนนเฉลี่ย | ระดับความพึงพอใจ | ความหมาย |
|---|---|---|
| **4.51 – 5.00** | **มากที่สุด** | ดีเยี่ยม มีคุณภาพโดดเด่นมาก |
| **3.51 – 4.50** | **มาก** | ดีมาก สอดคล้องตามเป้าหมาย |
| **2.51 – 3.50** | **ปานกลาง** | ปานกลาง มีบางจุดควรพัฒนา |
| **1.51 – 2.50** | **น้อย** | ควรปรับปรุง มีจุดบกพร่องที่ต้องแก้ไข |
| **1.00 – 1.50** | **น้อยที่สุด** | ต้องแก้ไขเร่งด่วน |

---

## คุณสมบัติพิเศษของไฟล์ CSV ที่ส่งออก
- ใส่รหัส **UTF-8 with BOM (`\uFEFF`)** ที่ต้นไฟล์ ทำให้เมื่อเปิดด้วย **Microsoft Excel บน Windows และ Mac ภาษาไทยจะไม่เป็นภาษาต่างดาว**
- สรุปผลทั้งภาพรวม รายข้อ และข้อมูลรายบุคคลครบถ้วน
