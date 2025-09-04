# AI Translator

AI Translator ที่ใช้ Claude AI สำหรับการแปลภาษาที่แม่นยำและเข้าใจบริบท แบ่งเป็น Frontend (React) และ Backend (Python)

## โครงสร้างโปรเจค

```
AITranslator/
├── backend/          # Python Flask API
│   ├── app.py       # Main Flask application  
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   │   └── ClaudeTranslator.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── README.md
└── README.md        # ไฟล์นี้
```

## การติดตั้งและรัน

### Backend (Python Flask)

1. เข้าไปในโฟลเดอร์ backend:
```bash
cd backend
```

2. ติดตั้ง dependencies:
```bash
pip install -r requirements.txt
```

3. สร้างไฟล์ `.env` และใส่ Claude API key:
```bash
cp .env.example .env
# แก้ไขไฟล์ .env และใส่ ANTHROPIC_API_KEY=your_actual_key_here
```

4. รัน backend:
```bash
python app.py
```
Backend จะทำงานที่ http://localhost:5000

### Frontend (React)

1. เปิด terminal ใหม่และเข้าไปในโฟลเดอร์ frontend:
```bash
cd frontend
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. รัน frontend:
```bash
npm start
```
Frontend จะทำงานที่ http://localhost:3000

## Features

- **24+ ภาษา**: รองรับภาษาหลักทั่วโลก
- **Smart Context**: การแปลที่เข้าใจบริบทด้วย AI
- **Quality Score**: แสดงระดับความมั่นใจในการแปล
- **Copy to Clipboard**: คัดลอกผลการแปลได้
- **Keyboard Shortcuts**: กด Ctrl+Enter เพื่อแปล
- **Language Swap**: สลับภาษาต้นทางและปลายทางได้

## API Endpoints

- `POST /api/translate` - แปลข้อความ
- `GET /api/languages` - รายการภาษาที่รองรับ  
- `GET /api/health` - ตรวจสอบสถานะ API

## การใช้งาน

1. รัน Backend และ Frontend ตามขั้นตอนด้านบน
2. เปิดเบราว์เซอร์ไปที่ http://localhost:3000
3. เลือกภาษาต้นทางและปลายทาง
4. พิมพ์ข้อความที่ต้องการแปล
5. กดปุ่ม "Translate" หรือ Ctrl+Enter

## เทคโนโลยีที่ใช้

### Backend
- Python 3.x
- Flask (Web framework)
- Flask-CORS (CORS support)
- Anthropic Claude SDK
- python-dotenv (Environment variables)

### Frontend  
- React 18
- Axios (HTTP client)
- Lucide React (Icons)
- Tailwind CSS (Styling)