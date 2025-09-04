# AI Translator Frontend

React frontend สำหรับ AI Translator

## การติดตั้ง

1. ติดตั้ง dependencies:
```bash
npm install
```

2. รันแอป:
```bash
npm start
```

Frontend จะทำงานที่ http://localhost:3000

## การกำหนดค่า

สร้างไฟล์ `.env` ในโฟลเดอร์ frontend (ถ้าต้องการเปลี่ยน API URL):
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Features

- รองรับ 24+ ภาษา
- UI ที่สวยงามและใช้งานง่าย
- แสดงระดับความมั่นใจในการแปล
- คัดลอกผลการแปลได้
- แป้นลัด Ctrl+Enter สำหรับแปล
- สลับภาษาต้นทางและปลายทางได้