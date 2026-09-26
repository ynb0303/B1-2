import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        본문 바로가기
      </a>
      <header className="header">
        <NavLink to="/" className="brand">
          <span>배</span> 배움노트
        </NavLink>
        <nav aria-label="주요 메뉴">
          <NavLink to="/" end>
            홈
          </NavLink>
          <NavLink to="/records">학습 기록</NavLink>
          <NavLink to="/stats">돌아보기</NavLink>
          <NavLink to="/about">서비스 안내</NavLink>
        </nav>
      </header>
      <main id="main" className="container">
        <Outlet />
      </main>
      <footer className="footer">
        배움노트 <span>작은 배움이 모여, 나의 성장이 됩니다.</span>
      </footer>
    </>
  );
}
