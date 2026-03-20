# 신규 프로젝트 템플릿 가이드

이 문서는 `galaxy-landscape-clock` 프로젝트를 기반으로 신규 React + TypeScript + Vite 프로젝트를 생성할 때 참고할 수 있는 템플릿 가이드입니다.

## 🎯 이 템플릿의 목적

이 템플릿은 **GitHub Pages에 배포되는 간단한 웹 애플리케이션**을 만드는 데 최적화되어 있습니다:

- **GitHub Actions**를 통한 자동 배포 (gh-pages 패키지 불필요)
- **1-2페이지** 정도의 단순한 구조
- **공개 API만 사용** (API 키 없이 동작)
- GitHub Pages 무료 호스팅 활용

## 📋 빠른 시작 체크리스트

### 1. 프로젝트 초기화
```bash
# Vite로 React + TypeScript 프로젝트 생성
npm create vite@latest my-new-project -- --template react-ts

cd my-new-project
npm install
```

### 2. 핵심 의존성 설치
```bash
# 필수 라이브러리
npm install react@^19.2.3 react-dom@^19.2.3
npm install lucide-react@^0.562.0

# 개발 의존성
npm install -D @vitejs/plugin-react@^5.0.0
npm install -D typescript@~5.8.2
npm install -D @types/node@^22.14.0
npm install -D vite@^6.2.0
```

---

**참고**: 이 템플릿은 `gh-pages` 패키지를 사용하지 않습니다. GitHub Actions를 통해 자동으로 배포됩니다.

## 📁 프로젝트 구조 템플릿

### 권장 폴더 구조 (1-2페이지 프로젝트)

간단한 웹 애플리케이션을 위한 최소 구조:
```
my-new-project/
├── App.tsx                  # 메인 앱 컴포넌트 (1페이지 또는 라우팅)
├── index.tsx                # React 진입점
├── types.ts                 # TypeScript 타입 정의
├── constants.tsx            # 상수 정의 (필요시)
├── components/              # 재사용 컴포넌트 (선택사항)
│   └── Widget.tsx
├── public/
│   ├── manifest.webmanifest # PWA 매니페스트 (선택사항)
│   └── icons/               # 아이콘 (선택사항)
├── index.html               # HTML 템플릿
├── vite.config.ts           # Vite 설정
├── tsconfig.json            # TypeScript 설정
├── package.json
└── .github/workflows/       # GitHub Actions (자동 배포)
    └── deploy.yml
```

**참고**: 
- 1페이지 앱: `App.tsx` 하나로 구성
- 2페이지 앱: 간단한 상태로 페이지 전환 (React Router 없이도 가능)

---

## ⚙️ 핵심 설정 파일

### `vite.config.ts` 템플릿
```typescript
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages 배포 시 base URL 설정 (저장소 이름)
  base: process.env.NODE_ENV === 'production' ? '/my-new-project/' : '/',
  
  server: {
    port: 3000,
    host: '0.0.0.0', // 네트워크 접근 허용
  },
  
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'), // @ 별칭으로 프로젝트 루트 참조
    }
  }
});
```

### `tsconfig.json` 템플릿
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "types": ["node"],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### `package.json` 스크립트
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**참고**: `gh-pages` 패키지와 `deploy` 스크립트는 필요 없습니다. GitHub Actions가 자동으로 배포합니다.

---

## 🎨 Tailwind CSS 설정

### 방법 1: CDN 사용 (간단)
`index.html`의 `<head>`에 추가:
```html
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 방법 2: PostCSS 플러그인 (권장 - 프로덕션)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 📱 PWA 설정

### `public/manifest.webmanifest`
```json
{
  "name": "My New Project",
  "short_name": "Project",
  "start_url": "/my-new-project/",
  "scope": "/my-new-project/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    { "src": "/my-new-project/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/my-new-project/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### `index.html`에 추가
```html
<link rel="manifest" href="/my-new-project/manifest.webmanifest" />
<meta name="theme-color" content="#000000" />
```

---

## 🔄 상태 관리 패턴

### useState - 기본 상태
```typescript
const [time, setTime] = useState(new Date());
const [loading, setLoading] = useState(false);
```

### useRef - UI 업데이트 없이 값 저장
```typescript
const loadingRef = useRef(false); // 중복 API 호출 방지
const dataRef = useRef<DataType | null>(null); // 이전 데이터 저장
```

### useEffect - 생명주기 관리
```typescript
// 컴포넌트 마운트 시 실행
useEffect(() => {
  const timer = setInterval(() => setTime(new Date()), 1000);
  return () => clearInterval(timer); // 정리 함수
}, []); // 빈 배열 = 한 번만 실행

// 의존성 변경 시 실행
useEffect(() => {
  fetchData();
}, [dependency]); // dependency 변경 시마다 실행
```

### useCallback - 함수 메모이제이션
```typescript
const fetchData = useCallback(async () => {
  // API 호출 로직
}, []); // 의존성 배열
```

---

## 💾 localStorage 설정 저장 패턴

```typescript
// 설정 로드
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
};

// 설정 저장
const saveSettings = (settings: SettingsType) => {
  try {
    localStorage.setItem('settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

// 사용
const [settings, setSettings] = useState(loadSettings);

// 설정 변경 시 저장
setSettings((prev) => {
  const updated = { ...prev, newValue };
  saveSettings(updated);
  return updated;
});
```

---

## 📐 반응형 디자인 패턴

### 디바이스 타입 감지
```typescript
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// 사용
const currentLayout = layoutSettings[getDeviceType()];
```

### Tailwind 반응형 클래스
```tsx
<div className="p-3 md:p-4 lg:p-6">
  <span className="text-sm md:text-base lg:text-lg">반응형 텍스트</span>
</div>
```

---

## 🌐 공개 API 연동 패턴

**⚠️ 중요**: 이 템플릿은 **API 키가 없는 공개 API**만 사용합니다. GitHub Pages는 정적 사이트이므로 환경 변수로 API 키를 관리할 수 없습니다.

### 공개 API 예시
- Open-Meteo API (날씨 정보)
- Tallyfy API (공휴일 정보)
- JSONPlaceholder (테스트용)
- GitHub API (공개 데이터)

### Promise.all - 병렬 API 호출
```typescript
// API 키 없이 사용 가능한 공개 API만 사용
const [weatherRes, holidayRes] = await Promise.all([
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780`),
  fetch(`https://tallyfy.com/national-holidays/api/KR/2024.json`)
]);

const weather = await weatherRes.json();
const holidays = await holidayRes.json();
```

### 에러 처리 및 폴백
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  // 폴백 값 반환 (빈 배열, 기본값 등)
  return defaultValue;
}
```

### API 키가 필요한 경우
API 키가 필요한 서비스를 사용해야 한다면:
1. **백엔드 서버 구축** (별도 프로젝트 필요)
2. **Vercel/Netlify Functions** 활용 (서버리스 함수)
3. **공개 API로 대체** 가능한지 검토

---

## 🚀 GitHub Actions를 통한 자동 배포

이 템플릿은 **GitHub Actions**를 사용하여 GitHub Pages에 자동으로 배포됩니다. `gh-pages` 패키지는 필요 없습니다.

### `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### GitHub Pages 설정 (최초 1회만)

1. **GitHub 저장소 생성**
   - GitHub에서 새 저장소 생성

2. **프로젝트 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO-NAME>.git
   git push -u origin main
   ```

3. **GitHub Pages 활성화**
   - 저장소 **Settings** > **Pages** 메뉴
   - **Source**를 **"GitHub Actions"**로 선택
   - 저장하면 `.github/workflows/deploy.yml`이 자동 실행됨

4. **자동 배포 확인**
   - `main` 브랜치에 푸시할 때마다 자동 배포
   - 배포 완료 후 `https://<USERNAME>.github.io/<REPO-NAME>/`에서 확인

---

## 📝 타입 정의 패턴

### `types.ts`
```typescript
// 인터페이스 정의
export interface DataType {
  id: number;
  name: string;
  value: number;
}

// Enum 정의
export enum Status {
  Loading = 'loading',
  Success = 'success',
  Error = 'error'
}

// 타입 유니온
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
```

---

## 🎯 베스트 프랙티스

### 1. 컴포넌트 분리
- 재사용 가능한 UI는 `components/` 폴더로 분리
- 하나의 컴포넌트는 하나의 책임만 담당

### 2. 상수 관리
- 하드코딩된 값은 `constants.tsx`로 분리
- 매직 넘버 제거

### 3. 타입 안정성
- 모든 데이터에 타입 정의
- `any` 타입 최소화

### 4. 에러 처리
- API 호출 시 try-catch 사용
- 폴백 값 제공

### 5. 성능 최적화
- 불필요한 재렌더링 방지 (`useCallback`, `useMemo`)
- 이미지 최적화
- 코드 스플리팅 고려

---

## 🔧 유용한 유틸리티

### 시간 포맷팅
```typescript
const formatTime = (date: Date) => {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return { h, m, s };
};
```

### localStorage 헬퍼
```typescript
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }
};
```

---

## 📚 참고 자료

- [Vite 공식 문서](https://vitejs.dev/)
- [React 19 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

## ⚠️ 주의사항

1. **base URL**: `vite.config.ts`와 `manifest.webmanifest`의 경로를 **저장소 이름**에 맞게 수정
   - 예: 저장소가 `my-app`이면 `base: '/my-app/'`

2. **API 키 사용 불가**: GitHub Pages는 정적 사이트이므로 API 키가 필요한 서비스 사용 불가
   - **공개 API만 사용** (Open-Meteo, Tallyfy 등)
   - API 키가 필요하면 별도 백엔드 서버 필요

3. **CORS**: 브라우저에서 직접 호출하는 API는 CORS 정책을 준수해야 함

4. **브라우저 호환성**: 사용하는 브라우저 API의 지원 여부 확인 (Geolocation, Battery API 등)

---

## 🎉 시작하기

1. **프로젝트 초기화** - 위의 체크리스트 따라 프로젝트 생성
2. **설정 파일 준비** - `vite.config.ts`, `tsconfig.json`, `.github/workflows/deploy.yml` 복사 및 수정
   - `vite.config.ts`의 `base` 경로를 저장소 이름으로 수정
3. **간단한 앱 작성** - `App.tsx`에서 1-2페이지 구조로 시작
4. **공개 API 연동** - API 키 없이 사용 가능한 공개 API만 사용
5. **GitHub에 푸시** - `main` 브랜치에 푸시하면 자동 배포 시작
6. **배포 확인** - GitHub Actions 탭에서 배포 상태 확인

## 📝 템플릿 특징 요약

✅ **GitHub Actions** 자동 배포 (gh-pages 불필요)  
✅ **1-2페이지** 단순 구조  
✅ **공개 API만** 사용 (API 키 없음)  
✅ **GitHub Pages** 무료 호스팅  

Happy Coding! 🚀
