import { Link } from "react-router-dom";
import { Badge, EmptyState, LinkButton } from "./UI";
import { formatDate } from "../lib/records";
export function RecordCard({ record }) {
  return (
    <Link to={`/records/${record.id}`} className="record-card">
      <div className="card-meta">
        <Badge>{record.category}</Badge>
        <time>{formatDate(record.created_at)}</time>
      </div>
      <h2>{record.title}</h2>
      <p>{record.content}</p>
      <span className="card-bottom">
        {record.completed ? "✓ 학습 완료" : "○ 학습 중"}
        <span>기록 읽기 ↗</span>
      </span>
    </Link>
  );
}
export default function RecordList({ records, filtered = false }) {
  if (!records.length)
    return (
      <EmptyState
        title={filtered ? "검색 결과가 없어요" : undefined}
        description={filtered ? "검색어나 주제 필터를 바꿔보세요." : undefined}
        action={
          !filtered && <LinkButton to="/records/new">첫 기록 남기기</LinkButton>
        }
      />
    );
  return (
    <div className="record-grid">
      {records.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}
