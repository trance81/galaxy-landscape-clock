<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1nJBx0rGfFrTiSaC7lVNGKHqt0NZVMAgC

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

이 프로젝트는 GitHub Pages에 배포할 수 있습니다.

### 배포 전 준비사항

1. GitHub 저장소가 생성되어 있어야 합니다 (`galaxy-landscape-clock` 이름으로)
2. 프로젝트가 Git으로 초기화되어 있고 원격 저장소에 연결되어 있어야 합니다

### 배포 방법

1. **gh-pages 패키지 설치** (아직 설치하지 않았다면):
   ```bash
   npm install
   ```

2. **빌드 및 배포 실행**:
   ```bash
   npm run deploy
   ```

이 명령은 다음과 같이 동작합니다:
- `vite build`로 프로젝트를 빌드합니다
- `dist` 폴더의 내용을 `gh-pages` 브랜치에 배포합니다

3. **GitHub 저장소 설정**:
   - GitHub 저장소로 이동
   - **Settings** > **Pages** 메뉴로 이동
   - **Source**를 **Deploy from a branch**로 선택
   - **Branch**를 `gh-pages`로 선택하고 `/ (root)` 선택
   - **Save** 클릭

4. **배포 완료**:
   - 몇 분 후 다음 주소에서 접근 가능합니다:
   - `https://<YOUR_GITHUB_USERNAME>.github.io/galaxy-landscape-clock/`

### 참고사항

- 배포 후 변경사항을 반영하려면 `npm run deploy`를 다시 실행하세요
- GitHub Pages는 무료 플랜에서도 사용 가능합니다
