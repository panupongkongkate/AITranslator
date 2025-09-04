# AI Translator Backend

Backend API สำหรับ AI Translator ที่ใช้ Claude Code SDK

## ข้อกำหนดเบื้องต้น

- Python 3.10+
- Claude Code CLI ติดตั้งแล้ว (`npm install -g @anthropic-ai/claude-code`)

## การติดตั้ง

1. ติดตั้ง dependencies:
```bash
pip install -r requirements.txt
```

2. รันแอป:
```bash
python app.py
```

Backend จะทำงานที่ http://localhost:5000

## API Endpoints

- `POST /api/translate` - แปลข้อความ
- `GET /api/languages` - รายการภาษาที่รองรับ
- `GET /api/health` - ตรวจสอบสถานะ API

## การใช้งาน

ส่งข้อมูล JSON ไปยัง `/api/translate`:
```json
{
  "sourceText": "Hello world",
  "sourceLang": "English", 
  "targetLang": "Thai"
}
```

Response:
```json
{
  "translatedText": "สวัสดีโลก",
  "confidence": "high"
}
```

## หมายเหตุ

Backend นี้ใช้ Claude Code SDK ซึ่งไม่ต้องการ API key เพราะใช้ MCP (Model Context Protocol) ที่เชื่อมต่ออยู่แล้ว