import { useMemo, useState } from "react";
import { useRecords } from "../hooks/useRecords";
import { categories } from "../lib/records";
import { AsyncContent, LinkButton, PageHeader } from "../components/UI";
import RecordList from "../components/RecordList";
export default function RecordsPage() {
  const state = useRecords();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const records = useMemo(
    () =>
      (state.data || []).filter(
        (r) =>
          (category === "전체" || r.category === category) &&
          `${r.title} ${r.content}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [state.data, search, category],
  );
  return (
    <>
      <PageHeader
        eyebrow="LEARNING ARCHIVE"
        title="나의 학습 기록"
        description="하나씩 쌓아가는 배움의 흔적을 만나보세요."
        action={<LinkButton to="/records/new">새 기록 ＋</LinkButton>}
      />
      <div className="toolbar">
        <div className="filters" aria-label="주제 필터">
          {["전체", ...categories].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "selected" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="search">
          검색
          <input
            type="search"
            placeholder="제목, 내용으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <AsyncContent {...state}>
        <p className="muted" role="status">
          총 {records.length}개의 기록
        </p>
        <RecordList
          records={records}
          filtered={!!search.trim() || category !== "전체"}
        />
      </AsyncContent>
    </>
  );
}
