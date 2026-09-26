import { useRecords } from "../hooks/useRecords";
import { categories } from "../lib/records";
import {
  AsyncContent,
  EmptyState,
  LinkButton,
  PageHeader,
  StatCard,
} from "../components/UI";
export default function StatsPage() {
  const state = useRecords();
  const records = state.data || [];
  const completed = records.filter((r) => r.completed).length;
  return (
    <>
      <PageHeader
        eyebrow="YOUR PROGRESS"
        title="배움을 돌아보다"
        description="기록 속에서 나의 성장을 발견하세요."
      />
      <AsyncContent {...state}>
        {records.length ? (
          <>
            <div className="stats-grid">
              <StatCard
                label="전체 기록"
                value={records.length}
                detail="나의 배움 저장소"
              />
              <StatCard
                label="완료한 학습"
                value={completed}
                detail="작은 성취의 합"
              />
              <StatCard
                label="학습 완료율"
                value={`${Math.round((completed / records.length) * 100)}%`}
                detail="내 속도대로 꾸준하게"
              />
            </div>
            <section className="panel">
              <h2>주제별 학습 기록</h2>
              {categories.map((category) => {
                const count = records.filter(
                  (r) => r.category === category,
                ).length;
                return (
                  <div className="progress-row" key={category}>
                    <span>{category}</span>
                    <progress
                      aria-label={`${category} 기록 수`}
                      max={records.length}
                      value={count}
                    />
                    <strong>{count}개</strong>
                  </div>
                );
              })}
            </section>
          </>
        ) : (
          <EmptyState
            title="성장의 시작을 기록해보세요"
            description="학습 기록을 남기면 통계를 확인할 수 있어요."
            action={<LinkButton to="/records/new">기록 남기기</LinkButton>}
          />
        )}
      </AsyncContent>
    </>
  );
}
