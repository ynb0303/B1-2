import { LinkButton, PageHeader } from "../components/UI";
export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="ABOUT LEARNING NOTE"
        title="기록으로 이어지는 배움"
        description="하루의 작은 발견을 오래 기억하는 방법."
      />
      <section className="panel about">
        <h2>배우고, 기록하고, 돌아보세요.</h2>
        <p>
          배움노트는 React, JavaScript, CSS 등 공부한 내용을 정리하는 학습
          기록장입니다. 제목과 내용을 작성하고, 주제를 선택하고, 학습 완료
          여부를 남겨보세요.
        </p>
        <ol>
          <li>
            <strong>기록하기</strong> — 오늘 배운 내용을 내 언어로 정리해요.
          </li>
          <li>
            <strong>찾아보기</strong> — 주제와 검색어로 필요한 기록을 찾아요.
          </li>
          <li>
            <strong>돌아보기</strong> — 쌓인 기록과 완료율로 학습 흐름을
            확인해요.
          </li>
        </ol>
        <h2>공유 실습 공간</h2>
        <p>
          이 버전은 로그인 없이 함께 사용하는 과제용 기록장입니다. 모든 방문자가
          기록을 조회·수정·삭제할 수 있으므로 공개 가능한 학습 내용만
          작성해주세요.
        </p>
        <LinkButton to="/records">학습 기록 둘러보기 →</LinkButton>
      </section>
    </>
  );
}
