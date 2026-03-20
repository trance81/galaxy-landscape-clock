# AI를 이용한 웹 시계 대시보드 만들기 - 완전 초보자용 프롬프트

이 프롬프트는 **코딩을 전혀 모르는 비전공자**도 AI에게 요청하여 완전한 웹 애플리케이션을 만들 수 있도록 작성되었습니다. 
프롬프트를 그대로 복사해서 AI에게 붙여넣기만 하면 됩니다.

---

## 📋 사용 방법

1. 아래 전체 프롬프트를 복사합니다
2. 원하는 AI (ChatGPT, Claude, Gemini 등)에게 붙여넣습니다
3. AI가 단계별로 파일을 생성해줍니다
4. 생성된 파일들을 하나의 폴더에 저장합니다
5. 터미널(명령 프롬프트)에서 `npm install` 후 `npm run dev` 실행

---

## 🎯 프롬프트 시작

```
나는 코딩을 전혀 모르는 비전공자입니다. 아래 요구사항에 따라 완전한 웹 애플리케이션을 만들어주세요.
모든 파일을 처음부터 끝까지 완전히 생성해주시고, 각 파일의 역할을 쉽게 설명해주세요.

# 프로젝트 개요

"Galaxy Landscape Clock"이라는 이름의 웹 애플리케이션을 만들어주세요.
이 앱은 모바일 가로 모드(랜드스케이프)에서 사용하는 시계 대시보드입니다.

## 주요 기능

1. **실시간 디지털 시계**
   - 화면 중앙에 큰 글씨로 현재 시간을 표시 (시:분:초)
   - 1초마다 자동으로 업데이트
   - 시계를 클릭하면 설정 창이 열림

2. **날씨 정보**
   - 현재 날씨: 온도, 날씨 상태(맑음/흐림/비 등), 습도, 미세먼지(PM10, PM2.5)
   - 예보: 내일과 모레의 날씨 예보
   - 사용자의 위치를 자동으로 감지하여 해당 지역 날씨 표시
   - 위치 감지 실패 시 서울 날씨를 기본으로 표시
   - 4시간마다 자동으로 날씨 정보 갱신
   - 새로고침 버튼으로 수동 갱신 가능

3. **달력 위젯**
   - 현재 월과 다음 달을 표시
   - 오늘 날짜를 강조 표시
   - 공휴일을 자동으로 빨간색으로 표시
   - 일요일은 빨간색, 토요일은 파란색으로 표시

4. **배터리 상태 표시**
   - 화면 좌측 상단에 배터리 레벨(%) 표시
   - 충전 중일 때는 충전 아이콘 표시
   - 배터리가 15% 이하일 때는 빨간색으로 경고

5. **레이아웃 설정**
   - 시계 영역 크기 조절 (1~10)
   - 시계 폰트 크기 조절 (3rem~20rem)
   - 날씨 영역 크기 조절 (1~10)
   - 달력 영역 너비 조절 (20%~60%)
   - 설정은 localStorage에 저장되어 다음 접속 시에도 유지됨
   - 모바일/태블릿/데스크탑 각각 다른 설정 가능

6. **반응형 디자인**
   - 모바일(768px 미만), 태블릿(768~1024px), 데스크탑(1024px 이상) 자동 감지
   - 각 디바이스에 맞는 레이아웃 자동 적용

7. **가로 모드 전용**
   - 세로 모드(포트레이트)일 때는 "가로 모드로 회전하세요" 메시지 표시
   - 가로 모드(랜드스케이프)에서만 정상 작동

## 기술 스택 및 요구사항

### 사용할 기술 (AI가 자동으로 설정해주면 됩니다)
- **React 19**: 웹 페이지를 만드는 프레임워크
- **TypeScript**: 코드의 오류를 미리 잡아주는 도구
- **Vite**: 빠르게 개발할 수 있게 해주는 도구
- **Tailwind CSS**: 디자인을 쉽게 할 수 있는 도구 (CDN 사용)
- **Lucide React**: 예쁜 아이콘을 사용할 수 있는 라이브러리

### 사용할 API (API 키 불필요, 무료 공개 API)
- **Open-Meteo API**: 날씨 정보 제공 (https://api.open-meteo.com)
- **Tallyfy API**: 공휴일 정보 제공 (https://tallyfy.com/national-holidays/api)

### 브라우저 API
- **Geolocation API**: 사용자 위치 감지
- **Battery API**: 배터리 상태 확인 (일부 브라우저만 지원)

## 프로젝트 파일 구조

다음과 같은 파일 구조로 만들어주세요:

```
galaxy-landscape-clock/
├── index.html                    # 웹 페이지의 기본 틀
├── index.tsx                     # React 앱을 시작하는 진입점
├── App.tsx                       # 메인 애플리케이션 컴포넌트
├── package.json                  # 프로젝트 설정 및 필요한 라이브러리 목록
├── tsconfig.json                 # TypeScript 설정
├── vite.config.ts                # Vite 빌드 도구 설정
├── types.ts                      # TypeScript 타입 정의
├── constants.tsx                 # 상수 정의 (날씨 아이콘, 기본값 등)
├── components/                   # 재사용 가능한 컴포넌트들
│   ├── CalendarWidget.tsx        # 달력 위젯
│   ├── ClockWidget.tsx           # 시계 위젯 (시계 + 배터리 + 새로고침 버튼)
│   ├── WeatherWidget.tsx         # 날씨 위젯 (현재 날씨 + 예보)
│   └── SettingsModal.tsx         # 설정 모달 창
├── utils/                        # 유틸리티 함수들
│   ├── device.ts                 # 디바이스 타입 감지 함수
│   ├── time.ts                   # 시간 포맷팅 함수
│   ├── weather.ts                # 날씨 코드 변환 함수
│   └── layoutSettings.ts         # 레이아웃 설정 저장/불러오기 함수
├── public/                       # 정적 파일들
│   ├── manifest.webmanifest      # PWA 설정 파일
│   └── icons/                    # 앱 아이콘들
│       ├── icon-192.png
│       └── icon-512.png
└── .github/workflows/            # GitHub 자동 배포 설정
    └── deploy.yml
```

## 상세 구현 요구사항

### 1. index.html
- Tailwind CSS를 CDN으로 불러오기
- Inter 폰트 사용
- 검은색 배경 (#000000)
- 가로 모드 전용 체크 (세로 모드일 때 안내 메시지 표시)
- AMOLED 번인 방지 애니메이션 CSS 포함
- React와 필요한 라이브러리를 import map으로 설정

### 2. App.tsx (메인 컴포넌트)
- 상태 관리:
  - 현재 시간 (1초마다 업데이트)
  - 날씨 정보 (현재 + 예보)
  - 배터리 상태
  - 레이아웃 설정
  - 로딩 상태
  - 설정 모달 표시 여부

- 기능:
  - 실시간 시계 업데이트 (useEffect 사용)
  - 배터리 상태 감지 (useEffect 사용)
  - 날씨 데이터 가져오기 (fetchWeather 함수)
  - 4시간마다 자동 날씨 갱신
  - 레이아웃 설정 저장/불러오기

- UI 구성:
  - 왼쪽: 시계 위젯 + 날씨 위젯 (세로 배치)
  - 오른쪽: 달력 위젯
  - 하단 중앙: 장식용 인디케이터 바
  - 설정 모달 (조건부 렌더링)

### 3. ClockWidget.tsx
- Props:
  - time: Date (현재 시간)
  - battery: { level: number, charging: boolean | null }
  - loading: boolean
  - clockFlex: number (시계 영역 크기)
  - clockFontSize: number (폰트 크기, rem 단위)
  - onSettingsClick: () => void (설정 모달 열기)
  - onRefreshClick: () => void (날씨 새로고침)

- UI:
  - 좌측 상단: 배터리 상태 표시 (레벨 %, 아이콘)
  - 우측 상단: 새로고침 버튼 (로딩 중일 때 스피너 애니메이션)
  - 중앙: 시계 표시 (시:분:초, 클릭 시 설정 모달 열림)
  - 번인 방지 애니메이션 적용

### 4. WeatherWidget.tsx
- Props:
  - weather: { temp, low, high, condition, humidity, location, pm10, pm25 }
  - forecast: { tomorrow: {...}, dayAfter: {...} }
  - loading: boolean
  - weatherFlex: number (날씨 영역 크기)

- UI:
  - 왼쪽 패널: 현재 날씨 (아이콘, 온도, 최저/최고, 습도, 미세먼지, 위치)
  - 오른쪽 패널: 예보 (내일, 모레 - 각각 아이콘, 날씨 상태, 온도)
  - 로딩 중일 때 반투명 처리

### 5. CalendarWidget.tsx
- 현재 월과 다음 달 표시
- 공휴일 API에서 데이터 가져오기 (Tallyfy API)
- 오늘 날짜 강조 표시 (회색 배경)
- 일요일/공휴일: 빨간색
- 토요일: 파란색
- 이전/다음 달 날짜: 어두운 회색

### 6. SettingsModal.tsx
- Props:
  - isOpen: boolean
  - onClose: () => void
  - layoutSettings: DeviceLayoutSettings
  - onSettingsChange: (settings) => void

- UI:
  - 모달 헤더 (제목, 닫기 버튼)
  - 현재 디바이스 타입 표시 (모바일/태블릿/데스크탑)
  - 4개의 슬라이더:
    - 시계 영역 크기 (1~10)
    - 시계 폰트 크기 (3~20rem, 0.5 단위)
    - 날씨 영역 크기 (1~10)
    - 달력 영역 너비 (20~60%)
  - 기본값으로 복원 버튼
  - 버전 정보 표시

### 7. utils/device.ts
- getDeviceType(): 'mobile' | 'tablet' | 'desktop'
  - 화면 너비 기준으로 디바이스 타입 판단
  - 768px 미만: mobile
  - 768px~1024px: tablet
  - 1024px 이상: desktop

### 8. utils/time.ts
- formatTime(date: Date): { h: string, m: string, s: string }
  - Date 객체를 시, 분, 초 문자열로 변환
  - 2자리 숫자로 포맷팅 (예: "05", "23")

### 9. utils/weather.ts
- mapWmoToCondition(code: number): string
  - WMO 날씨 코드를 문자열로 변환
  - 0: 'clear sky'
  - 1~3: 'partly cloudy'
  - 45~48: 'fog'
  - 51~55: 'drizzle'
  - 61~65: 'rain'
  - 71~77: 'snow'
  - 80~82: 'rain'
  - 95+: 'thunderstorm'

### 10. utils/layoutSettings.ts
- defaultLayoutSettings: 각 디바이스별 기본 설정값
- loadLayoutSettings(): localStorage에서 설정 불러오기
- saveLayoutSettings(settings): localStorage에 설정 저장

### 11. types.ts
- LayoutSettings 인터페이스
- DeviceLayoutSettings 타입
- DeviceType 타입
- BatteryStatus 인터페이스

### 12. constants.tsx
- INITIAL_WEATHER: 기본 날씨 데이터
- TOMORROW_WEATHER: 기본 내일 날씨
- DAY_AFTER_WEATHER: 기본 모레 날씨
- WEATHER_ICONS: 날씨 상태별 아이콘 매핑 (lucide-react 사용)
- MINI_WEATHER_ICONS: 작은 날씨 아이콘 매핑

### 13. package.json
- name: "galaxy-landscape-clock"
- scripts: dev, build, preview
- dependencies: react, react-dom, lucide-react
- devDependencies: vite, typescript, @vitejs/plugin-react, @types/node

### 14. vite.config.ts
- base: '/galaxy-landscape-clock/' (GitHub Pages 배포용)
- server: port 3000
- React 플러그인 설정
- 경로 별칭 설정 (@)

### 15. tsconfig.json
- target: ES2022
- module: ESNext
- jsx: react-jsx
- paths: @/* 설정

### 16. index.html 스타일
- AMOLED 번인 방지 애니메이션:
  - 시계: 30초 주기 미세 이동 + 15분 주기 큰 이동
  - 버튼: 60초 주기 미세 이동
  - translate3d 사용 (GPU 가속)
- 가로 모드 체크 및 안내 메시지
- 스크롤바 숨김
- 터치 제스처 방지

## 디자인 가이드라인

### 색상
- 배경: #000000 (순수 검은색)
- 카드 배경: #0d0d0d (거의 검은색)
- 텍스트: #cfcfcf (번인 방지를 위한 회색 톤, 순수 흰색 사용 지양)
- 테두리: rgba(255, 255, 255, 0.05) (5% 투명도 흰색)
- 일요일/공휴일: 빨간색
- 토요일: 파란색
- 배터리 15% 이하: 빨간색
- 충전 중: 초록색

### 레이아웃
- 전체: Flexbox 레이아웃
- 왼쪽: flex-1 (남은 공간 차지), 세로 배치
- 오른쪽: 고정 너비 (%)
- 패딩: 모바일 12px, 데스크탑 16px
- 간격: 모바일 12px, 데스크탑 16px
- 둥근 모서리: 32px (모바일), 40px (데스크탑)

### 폰트
- Inter 폰트 사용
- 시계: 굵은 글씨, 매우 큰 크기 (기본 14rem 데스크탑)
- 일반 텍스트: 작은 크기 (10px~13px)
- 숫자: tabular-nums (같은 너비)

## API 사용 방법

### 날씨 API (Open-Meteo)
```
GET https://api.open-meteo.com/v1/forecast?
  latitude={lat}&
  longitude={lon}&
  current=temperature_2m,relative_humidity_2m,weather_code&
  daily=weather_code,temperature_2m_max,temperature_2m_min&
  timezone={timezone}
```

### 대기질 API (Open-Meteo)
```
GET https://air-quality-api.open-meteo.com/v1/air-quality?
  latitude={lat}&
  longitude={lon}&
  current=pm10,pm2_5
```

### 공휴일 API (Tallyfy)
```
GET https://tallyfy.com/national-holidays/api/KR/{year}.json
```

## 에러 처리

- 위치 감지 실패: 서울 좌표 (37.5665, 126.9780) 사용
- API 호출 실패: 콘솔에 에러 출력, 기본값 유지
- localStorage 오류: 기본값 사용

## 성능 최적화

- useCallback으로 함수 메모이제이션
- useRef로 불필요한 재렌더링 방지
- 중복 API 호출 방지 (loadingRef 사용)
- GPU 가속 애니메이션 (translate3d, will-change)

## 중요 사항

1. **모든 파일을 완전히 생성해주세요** - 빈 파일이나 TODO 주석 없이 완성된 코드로
2. **초보자도 이해할 수 있도록 주석을 많이 달아주세요** - 각 함수와 중요한 코드 블록에 설명
3. **에러 처리를 포함해주세요** - try-catch, null 체크 등
4. **타입 안정성을 보장해주세요** - TypeScript 타입을 명확히 정의
5. **반응형 디자인을 완벽하게 구현해주세요** - 모바일, 태블릿, 데스크탑 모두 지원
6. **접근성을 고려해주세요** - 적절한 색상 대비, 클릭 가능한 영역 명확히

## 생성 순서 제안

1. package.json, tsconfig.json, vite.config.ts (프로젝트 설정)
2. types.ts, constants.tsx (타입 및 상수)
3. utils/ 폴더의 모든 파일 (유틸리티 함수)
4. components/ 폴더의 모든 파일 (컴포넌트)
5. App.tsx (메인 컴포넌트)
6. index.tsx, index.html (진입점)
7. public/ 폴더 파일들 (매니페스트, 아이콘)
8. github 배포 후 vercel.app으로 사이트 운영

각 파일을 생성할 때마다 그 파일의 역할과 주요 기능을 설명해주세요.

이제 위 요구사항에 따라 완전한 웹 애플리케이션을 만들어주세요.
```

---

## 📝 프롬프트 사용 팁

### 1. 단계별 생성 요청
AI가 한 번에 모든 파일을 생성하기 어려울 수 있습니다. 이 경우 다음과 같이 단계별로 요청하세요:

```
1단계: 먼저 package.json, tsconfig.json, vite.config.ts 파일만 생성해주세요.
```

```
2단계: 이제 types.ts와 constants.tsx 파일을 생성해주세요.
```

```
3단계: utils 폴더의 모든 파일을 생성해주세요.
```

### 2. 문제 발생 시
AI가 생성한 코드에 오류가 있으면:

```
[오류 메시지]가 발생합니다. [해당 파일]을 수정해주세요.
```

### 3. 추가 기능 요청
기본 기능 외에 추가하고 싶은 것이 있으면:

```
기본 기능에 [원하는 기능]을 추가해주세요.
```

---

## ✅ 생성 후 확인 사항

1. **모든 파일이 생성되었는지 확인**
   - 위의 파일 구조에 있는 모든 파일이 있는지 확인

2. **package.json 확인**
   - dependencies와 devDependencies가 모두 포함되어 있는지 확인

3. **실행 테스트**
   ```bash
   npm install
   npm run dev
   ```
   - 브라우저에서 `http://localhost:3000` 접속
   - 오류 없이 화면이 표시되는지 확인

4. **기능 테스트**
   - 시계가 1초마다 업데이트되는지
   - 날씨 정보가 표시되는지
   - 달력이 표시되는지
   - 설정 모달이 열리는지
   - 배터리 상태가 표시되는지 (지원 브라우저에서)

---

## 🎓 학습 포인트

이 프롬프트를 사용하면 다음을 배울 수 있습니다:

1. **React 기초**: 컴포넌트, 상태 관리, 이벤트 처리
2. **TypeScript 기초**: 타입 정의, 인터페이스
3. **API 연동**: 외부 API 호출 및 데이터 처리
4. **반응형 디자인**: 다양한 화면 크기 대응
5. **상태 관리**: useState, useEffect, useCallback
6. **파일 구조**: 프로젝트 조직화 방법

---

## 💡 추가 도움말

### AI에게 질문할 수 있는 것들

- "이 코드가 무엇을 하는지 설명해주세요"
- "이 부분을 수정하려면 어떻게 해야 하나요?"
- "새로운 기능을 추가하려면 어디를 수정해야 하나요?"
- "오류가 발생했는데 어떻게 해결하나요?"

### 유용한 명령어

```bash
# 프로젝트 폴더로 이동
cd galaxy-landscape-clock

# 필요한 라이브러리 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

이 프롬프트를 사용하면 코딩을 전혀 모르는 사람도 완전한 웹 애플리케이션을 만들 수 있습니다!
행운을 빕니다! 🚀
