This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# MOC_Fondue

โปรเจค MOC_Fondue เป็นระบบแดชบอร์ดสำหรับจัดการข้อมูลจังหวัด หมวดหมู่ และข่าวสาร พัฒนาด้วย Next.js และ TypeScript

## 📋 ข้อกำหนดระบบ

- Node.js 18.0 หรือสูงกว่า
- npm, yarn, pnpm หรือ bun

## 🚀 วิธีการติดตั้งโปรเจค

### 1. Clone โปรเจค
```bash
git clone https://github.com/Suraratmungdee/MOC_Fondue.git
cd MOC_Fondue
```

### 2. ติดตั้ง Dependencies
```bash
npm install
# หรือ
yarn install
# หรือ
pnpm install
# หรือ
bun install
```

### 3. รันโปรเจคในโหมด Development
```bash
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
# หรือ
bun dev
```

### 4. เปิดในเบราว์เซอร์
เปิด [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์

## 📁 โครงสร้างโปรเจค

- `/src/app` - หน้าเว็บและ API routes
- `/src/components` - คอมโพเนนต์ที่ใช้ซ้ำได้
- `/src/lib` - ไลบรารีและ utilities
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions
- `/public` - ไฟล์ static

## 🛠️ เทคโนโลยีที่ใช้

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React

## 📄 License

This project is licensed under the MIT License.
