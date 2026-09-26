import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecords } from "../hooks/useRecords";
import { recordsApi, formatDate } from "../lib/records";
import { useToast } from "../context/ToastContext";
import {
  AsyncContent,
  Badge,
  Button,
  EmptyState,
  ErrorState,
  LinkButton,
} from "../components/UI";
export default function DetailPage() {
  const { id } = useParams();
  const state = useRecords(id);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const notify = useToast();
  const record = state.data;
  async function remove() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await recordsApi.remove(id);
      notify("기록을 삭제했습니다.");
      navigate("/records");
    } catch (e) {
      setError(e.message);
      setPending(false);
    }
  }
  return (
    <>
      <LinkButton to="/records" variant="text">
        ← 목록으로
      </LinkButton>
      <AsyncContent {...state}>
        {record ? (
          <article className="panel detail">
            <div className="card-meta">
              <Badge>{record.category}</Badge>
              <span>{record.completed ? "✓ 학습 완료" : "○ 학습 중"}</span>
            </div>
            <h1>{record.title}</h1>
            <p className="muted">
              작성 {formatDate(record.created_at)} · 수정{" "}
              {formatDate(record.updated_at)}
            </p>
            <hr />
            <div className="prose">{record.content}</div>
            <div className="actions">
              {!pending && (
                <LinkButton to={`/records/${id}/edit`} variant="secondary">
                  수정하기
                </LinkButton>
              )}
              <Button
                variant="danger"
                disabled={pending}
                onClick={() => setConfirming(true)}
              >
                삭제하기
              </Button>
            </div>
            {confirming && (
              <section className="delete-confirm" aria-label="삭제 확인">
                <h2>이 기록을 삭제할까요?</h2>
                <p>삭제한 기록은 복구할 수 없습니다.</p>
                <div className="actions">
                  <Button variant="danger" onClick={remove} disabled={pending}>
                    {pending ? "삭제 중…" : "삭제 확인"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setConfirming(false)}
                    disabled={pending}
                  >
                    취소
                  </Button>
                </div>
              </section>
            )}
            {error && <ErrorState message={error} />}
          </article>
        ) : (
          <EmptyState
            title="기록을 찾을 수 없어요"
            description="삭제되었거나 존재하지 않는 기록입니다."
            action={<LinkButton to="/records">목록으로 이동</LinkButton>}
          />
        )}
      </AsyncContent>
    </>
  );
}
