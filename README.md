# 배움노트 — React SPA 학습 기록장

React 컴포넌트·상태·이벤트·비동기 렌더링 학습 미션을 위한 웹 서비스입니다. 공부한 내용을 등록하고 주제별로 검색하며, 상세 조회·수정·삭제하고 학습 통계를 확인합니다. 핵심 데이터는 **Supabase 원격 PostgreSQL**에 저장합니다. 로컬 저장소나 가짜 데이터로 CRUD를 대체하지 않습니다.

- 소스 코드: https://github.com/ynb0303/B1-2
- 배포 URL: **아직 없음 — 아래 배포 절차 완료 후 실제 URL을 기입하세요.**
- 현재 상태: 구현 완료, 자동 테스트 9개 및 프로덕션 빌드 통과. 로컬 환경변수로 Supabase 연결 및 `records` 테이블 조회 확인 완료. 실제 등록·수정·삭제와 배포 환경 CRUD 검증은 아직 필요합니다. 배포 전에는 과제의 최종 제출 조건을 완료한 것이 아닙니다.
- 서비스 범위: 로그인 없는 **공개 공유 실습용 기록장**. 모든 방문자가 모든 기록을 조회·수정·삭제할 수 있습니다. 개인정보나 비공개 자료를 저장하지 마세요.

## 기술 스택

React 19, React Router 7, Vite 7, JavaScript, CSS, Supabase JS SDK 2, Context API, Vitest, React Testing Library. Node.js **22.12 이상** 권장(Node 24에서도 실행 가능). 정확한 설치 버전은 `package-lock.json`에 고정합니다.

## 처음 시작하기

### 1. 설치

```bash
git clone https://github.com/ynb0303/B1-2.git
cd B1-2
npm ci
cp .env.example .env
```

### 2. Supabase 프로젝트 만들기

1. https://supabase.com 에서 가입/로그인합니다.
2. 새 프로젝트(New project)를 만듭니다. 프로젝트 이름과 데이터베이스 비밀번호를 설정하고 생성이 끝날 때까지 기다립니다. 비밀번호는 이 React 앱에 입력하지 않습니다.
3. 해당 프로젝트의 **SQL Editor**를 열고 **New query**를 선택합니다.
4. 이 저장소의 [`supabase/schema.sql`](supabase/schema.sql) 전체를 붙여넣고 Run을 누릅니다.
5. Table Editor에서 `records` 테이블이 만들어졌는지 확인합니다.
6. 프로젝트의 Connect 또는 Settings / API 관련 메뉴에서 **Project URL**과 **publishable key**를 확인합니다. 기존 프로젝트의 공개 `anon` 키도 사용할 수 있습니다.
7. 로컬 `.env`에 아래 값을 입력합니다. 실제 값은 README나 소스에 적지 않습니다.

```dotenv
VITE_SUPABASE_URL=https://프로젝트ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=프로젝트의_공개_publishable_또는_anon_키
```

**`service_role`, secret 키, DB 비밀번호를 넣으면 안 됩니다.** Vite의 `VITE_` 변수는 브라우저 번들에 포함됩니다. 공개 클라이언트 키를 사용하고 데이터 접근은 DB 정책으로 제어합니다. 이번 SQL은 RLS를 켜되 과제용 공개 CRUD 정책을 설정합니다. 개인별 비공개 서비스가 필요하면 Supabase Auth 및 사용자 소유권 정책을 추가해야 합니다.

`.gitignore`는 `.env`, `.env.*`를 제외하며 빈 템플릿 `.env.example`만 포함합니다. 키를 커밋하거나 GitHub에 푸시하지 마세요.

### 3. 실행

```bash
npm run dev
```

터미널의 로컬 URL(기본 `http://localhost:5173`)을 엽니다. Codespaces에서는 Ports 탭에서 5173 포트를 브라우저로 엽니다. `.env`를 변경하면 개발 서버를 다시 시작합니다. 처음에는 빈 상태가 정상이며 ‘새 기록’에서 첫 데이터를 저장하세요. 설정이 없으면 오류 안내가 표시됩니다.

```bash
npm test          # 사용자 흐름 자동 테스트
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 로컬 확인
```

## 화면과 라우팅

| 경로                | 역할                                  |
| ------------------- | ------------------------------------- |
| `/`                 | 홈, 최근 기록, 학습 현황              |
| `/records`          | 원격 목록, 검색, 주제 필터            |
| `/records/new`      | 등록 폼, 유효성 검사, 실시간 미리보기 |
| `/records/:id`      | 파라미터 기반 상세 조회, 삭제 확인    |
| `/records/:id/edit` | 기존 데이터 조회와 수정               |
| `/stats`            | 원격 데이터 기반 학습 통계            |
| `/about`            | 서비스 안내                           |
| `*`                 | Not Found                             |

주요 화면에 공통 헤더·내비게이션·푸터가 적용됩니다. 상세/수정 페이지는 목록 및 상세의 링크로 접근합니다.

## 폴더 구조

```text
src/
  pages/          라우트 단위 화면
  components/     공통 UI, 레이아웃, 기록 카드/목록/폼
  hooks/          useRecords: 목록/상세 비동기 조회
  lib/            Supabase CRUD, 검증, 날짜 유틸
  context/        ToastContext: 전역 성공 알림
  App.jsx         라우팅
  main.jsx        앱 진입, Router/Context Provider
  styles.css      공통 스타일 및 반응형 레이아웃
supabase/schema.sql  테이블·제약조건·RLS·수정 시각 트리거
tests/               폼과 조회/등록/수정/삭제 사용자 흐름 테스트
```

## React 설계 설명

### 컴포넌트를 나눈 기준

페이지는 경로에 맞는 데이터 조회와 화면 연결을 담당합니다. UI 컴포넌트는 props를 받아 표현과 상호작용을 재사용합니다. `RecordForm`은 등록과 수정에 동일하게 사용하고 저장 동작은 `onSave`로 전달합니다.

재사용 컴포넌트는 8개 이상입니다: `Button(variant, disabled)`, `LinkButton(to)`, `Badge(children)`, `PageHeader(title, action)`, `Loading(message)`, `ErrorState(message, onRetry)`, `EmptyState(title, action)`, `Field(error, multiline)`, `StatCard(value)`, `AsyncContent(loading, error)`, `RecordCard(record)`, `RecordList(records)`, `RecordForm(initialValues, onSave)`.

### props와 state의 차이 및 위치

- **props**: 부모가 자식에게 전달하는 읽기 전용 입력입니다. 페이지 → 목록 → 카드로 기록을 전달합니다.
- **state**: 컴포넌트가 관리하며 변경 시 렌더링을 요청하는 값입니다.
- 폼 입력값·검증 오류·제출 상태는 `RecordForm` 내부에 둡니다. 입력은 `value/checked`와 `onChange`를 연결한 controlled input입니다.
- 검색어·필터는 `RecordsPage`에 둡니다. 검색 결과는 원본 데이터에서 `useMemo`로 계산하며 중복 state로 저장하지 않습니다.
- 원격 데이터·로딩·오류는 `useRecords`가 담당합니다. 각 화면에서 새로 조회하므로 저장/삭제 후 이동하면 최신 데이터를 요청합니다.
- 삭제 확인·삭제 요청 상태는 `DetailPage` 내부에서만 관리합니다.
- 화면 이동 뒤에도 보여야 하는 성공 알림만 Context로 올립니다. 모든 상태를 전역으로 옮기지 않습니다.

### useEffect와 비동기 흐름

`useRecords(id)`의 effect는 최초 마운트와 `id`, 재시도용 `version` 변경 시 실행됩니다. id가 없으면 목록을, 있으면 특정 기록을 조회합니다. 요청 시작 → loading, 성공 → data, 실패 → error로 갱신합니다. cleanup의 `active` 플래그는 페이지를 떠났거나 이전 요청이 늦게 도착했을 때 결과 반영을 막습니다(네트워크 요청 자체를 취소하는 것은 아닙니다). StrictMode 개발 환경에서는 effect가 추가 실행될 수 있습니다.

`AsyncContent`가 공통 로딩/오류를 선택하고 데이터가 없으면 `EmptyState`를 표시합니다. 읽기 요청은 ‘다시 시도’를 제공하고, 저장 실패는 입력을 유지하여 재제출할 수 있습니다. 삭제 실패는 상세 화면에 남아 다시 시도할 수 있습니다. Supabase가 오류 없이 0행을 삭제해도 성공으로 처리하지 않습니다.

### 이벤트 → 상태 → 렌더링 예시

1. 주제 버튼 클릭/검색 입력 → 필터 state 변경 → `useMemo` 결과 변경 → 카드 목록 또는 검색 빈 상태 렌더링.
2. 폼 입력 → values state 변경 → 입력 필드와 오른쪽 미리보기 동시 갱신.
3. 저장 클릭 → 검증 오류 또는 pending 변경 → 오류 문구/비활성화 버튼 → 원격 저장 성공 → 상세 이동 + 전역 알림.
4. 삭제 클릭 → 확인 UI 표시 → 확정 시 삭제 요청 → 목록 이동 및 재조회.

완료 알림은 Context, 검색 결과는 `useMemo`, 재시도 함수는 `useCallback`을 사용합니다. 로그인/보호 라우트는 구현 범위에 포함하지 않습니다.

## 데이터 모델

`records`: `id(uuid)`, `title(1~80자)`, `content(1~5000자)`, `category(React/JavaScript/CSS/기타)`, `completed(boolean)`, `created_at`, `updated_at`. 수정 시각은 DB 트리거가 갱신합니다. 클라이언트 검증 외에 DB에도 필수값·길이·카테고리 제약조건을 둡니다.

## 배포 — Vercel 기준

1. 로컬 테스트와 빌드를 실행하고 변경 파일을 본인 GitHub 저장소에 커밋/푸시합니다. `git status`에서 `.env`가 포함되지 않았는지 확인하세요.
2. https://vercel.com 에 로그인하고 Add New → Project에서 이 GitHub 저장소를 가져옵니다.
3. Framework Preset은 **Vite**, Build Command는 `npm run build`, Output Directory는 `dist`를 사용합니다.
4. Environment Variables에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 로컬과 동일하게 등록합니다. 사용하는 Production/Preview 환경에 적용합니다.
5. Deploy를 누르고 발급된 `https://...vercel.app` 주소를 엽니다.
6. 환경변수를 나중에 변경했다면 **Redeploy**합니다. Vite는 빌드 시 값을 포함합니다.
7. 아래 체크리스트를 배포 URL에서 수행한 뒤 README 상단에 실제 URL을 기록해 제출합니다.

`vercel.json`은 SPA 하위 경로 직접 접근/새로고침을 `index.html`로 연결합니다. Netlify를 사용하면 빌드 명령 `npm run build`, 배포 폴더 `dist`, 동일 환경변수를 설정합니다. `public/_redirects`가 SPA fallback을 제공합니다.

## 제출 전 수동 검증

- [ ] Supabase SQL 실행 및 환경변수 등록 완료
- [ ] 빈 목록에서 공통 빈 상태 표시
- [ ] 공백 제목/내용 제출 시 필드 오류 표시, 원격 저장되지 않음
- [ ] 기록 등록 중 입력/버튼 비활성화, 성공 후 상세 이동 및 알림
- [ ] 새로고침/다른 브라우저에서도 저장한 기록 조회 가능(원격 저장 확인)
- [ ] 검색·주제 필터와 실시간 미리보기 동작
- [ ] 상세 수정 후 새로고침해 변경 값 유지
- [ ] 삭제 취소 시 데이터 유지, 삭제 확인 시 목록 갱신
- [ ] 개발자 도구 Network Offline에서 조회/저장 실패 안내, Online 복구 후 재시도
- [ ] 없는 기록 및 잘못된 URL 안내
- [ ] 배포 URL에서 상세/수정 주소 직접 접근 및 새로고침
- [ ] 배포 환경에서 등록/조회/수정/삭제 전체 확인
- [ ] 실제 배포 URL + GitHub URL 제출

자동 테스트는 API 응답을 mock하여 UI 흐름을 검증합니다. 실제 Supabase 연결/권한이나 배포 환경을 검증하는 테스트가 아니므로 위 원격 확인을 생략할 수 없습니다.

## 문제 해결

- **연결 설정 필요**: `.env` 변수 이름과 값 확인 후 서버 재시작. 배포에서는 환경변수 등록 후 재배포.
- **테이블을 찾을 수 없음**: 연결한 프로젝트가 맞는지 확인하고 SQL 실행.
- **권한 오류 / 저장 실패**: `schema.sql`의 grant와 RLS 정책 적용 여부 확인.
- **네트워크 오류**: 인터넷 연결, Project URL 오타, Supabase 프로젝트 일시 중지 여부 확인.
- **다른 사람이 수정한 기록**: 이 앱은 공유 실습 공간입니다. 다중 사용자 충돌 제어는 제공하지 않습니다.

## 공식 참고 문서

- [Supabase 클라이언트 초기화](https://supabase.com/docs/reference/javascript/initializing)
- [Supabase API 키 구분](https://supabase.com/docs/guides/getting-started/api-keys)
- [Vite 정적 배포](https://vite.dev/guide/static-deploy)
- [Vercel의 Vite SPA 설정](https://vercel.com/docs/frameworks/frontend/vite)
