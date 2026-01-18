<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Galaxy Landscape Clock

모바일 가로 모드 전용 랜드스케이프 시계 대시보드입니다. 실시간 시계, 날씨 정보, 달력을 한 화면에 표시합니다.

## 주요 기능

- ⏰ **실시간 디지털 시계**: 큰 글씨로 현재 시간 표시
- 🌤️ **날씨 정보**: 현재 날씨, 예보, 미세먼지 정보 (Open-Meteo API)
- 📅 **달력 위젯**: 현재 월 및 다음 달 표시, 공휴일 자동 표시
- 🔋 **배터리 상태**: 현재 배터리 레벨 및 충전 상태 표시
- 🎨 **AMOLED 번인 방지**: 픽셀 시프트 애니메이션 및 색상 조정
- ⚙️ **레이아웃 커스터마이징**: 모바일/태블릿/데스크탑별 크기 조절
- 📱 **반응형 디자인**: 다양한 화면 크기 지원

## 기술 스택

- **React 19** + **TypeScript**
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘
- **Open-Meteo API** - 날씨 데이터
- **Tallyfy API** - 공휴일 정보

## 로컬 실행

**필수 요구사항:** Node.js 20 이상

1. **의존성 설치**:
   ```bash
   npm install
   ```

2. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

3. 브라우저에서 `http://localhost:3000` 접속

## GitHub Pages 배포

이 프로젝트는 **GitHub Actions**를 사용하여 자동으로 GitHub Pages에 배포됩니다.

### 초기 설정 (최초 1회)

1. **GitHub 저장소 생성**:
   - GitHub에서 `galaxy-landscape-clock` 이름으로 저장소 생성

2. **프로젝트를 GitHub에 푸시**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/galaxy-landscape-clock.git
   git push -u origin main
   ```

3. **GitHub Pages 설정**:
   - GitHub 저장소에서 **Settings** > **Pages** 메뉴로 이동
   - **Source**를 **GitHub Actions**로 선택
   - 저장소에 `.github/workflows/deploy.yml` 워크플로우가 자동 배포를 담당합니다

### 자동 배포

- **자동 배포**: `main` 브랜치에 코드를 푸시하면 자동으로 빌드 및 배포됩니다
- **수동 배포**: GitHub Actions 탭에서 `Deploy to GitHub Pages` 워크플로우를 수동으로 실행할 수도 있습니다

### 배포 확인

배포가 완료되면 (보통 2-3분 소요) 다음 주소에서 접근 가능합니다:
```
https://<YOUR_GITHUB_USERNAME>.github.io/galaxy-landscape-clock/
```

### 참고사항

- 배포 워크플로우는 `.github/workflows/deploy.yml`에 정의되어 있습니다
- 빌드는 Node.js 20 환경에서 자동으로 실행됩니다
- GitHub Pages는 무료 플랜에서도 사용 가능합니다
