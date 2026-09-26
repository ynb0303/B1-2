import { useRecords } from "../hooks/useRecords";
import { AsyncContent, LinkButton, StatCard } from "../components/UI";
import RecordList from "../components/RecordList";
export default function HomePage() {
  const state = useRecords();
  const records = state.data || [];
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">A LITTLE LEARNING, EVERY DAY</p>
          <h1>
            오늘의 작은 배움,
            <br />
            내일의 나를 만들어요.
          </h1>
          <p>
            흩어지는 배움을 한곳에 모으고
            <br />
            나만의 성장 과정을 차곡차곡 기록하세요.
          </p>
          <LinkButton to="/records/new">새로운 배움 기록하기 ＋</LinkButton>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="paper">
            <span>MY LEARNING NOTE</span>
            <strong>
              배움은
              <br />
              계속된다.
            </strong>
            <i>✦</i>
            <div className="paper-line" />
            <div className="paper-line short" />
          </div>
          <span className="art-label">하루 한 줄, 성장의 시작</span>
        </div>
      </section>
      <AsyncContent {...state}>
        <div className="stats-grid">
          <StatCard
            label="쌓인 배움"
            value={records.length}
            detail="지금까지 남긴 기록"
          />
          <StatCard
            label="완료한 학습"
            value={records.filter((r) => r.completed).length}
            detail="차곡차곡 쌓이는 성취"
          />
          <StatCard
            label="배우는 중"
            value={records.filter((r) => !r.completed).length}
            detail="다음 배움을 향해"
          />
        </div>
        <div className="section-heading">
          <h2>최근의 배움</h2>
          <LinkButton to="/records" variant="text">
            전체 기록 보기 →
          </LinkButton>
        </div>
        <RecordList records={records.slice(0, 3)} />
      </AsyncContent>
    </>
  );
}
