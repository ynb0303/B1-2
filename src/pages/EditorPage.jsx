import { useNavigate, useParams } from "react-router-dom";
import RecordForm from "../components/RecordForm";
import {
  AsyncContent,
  EmptyState,
  LinkButton,
  PageHeader,
} from "../components/UI";
import { useRecords } from "../hooks/useRecords";
import { recordsApi } from "../lib/records";
import { useToast } from "../context/ToastContext";
export function NewRecordPage() {
  const navigate = useNavigate();
  const notify = useToast();
  async function save(values) {
    const record = await recordsApi.create(values);
    notify("새로운 배움을 기록했습니다.");
    navigate(`/records/${record.id}`);
  }
  return (
    <>
      <PageHeader
        eyebrow="NEW LEARNING"
        title="오늘의 배움 남기기"
        description="완벽한 글이 아니어도 괜찮아요. 나의 언어로 정리해보세요."
      />
      <RecordForm onSave={save} />
    </>
  );
}
export function EditRecordPage() {
  const { id } = useParams();
  const state = useRecords(id);
  const navigate = useNavigate();
  const notify = useToast();
  async function save(values) {
    await recordsApi.update(id, values);
    notify("기록을 수정했습니다.");
    navigate(`/records/${id}`);
  }
  return (
    <>
      <PageHeader
        eyebrow="EDIT LEARNING"
        title="배움 다듬기"
        description="새롭게 알게 된 내용을 더해보세요."
      />
      <AsyncContent {...state}>
        {state.data ? (
          <RecordForm
            key={state.data.id}
            initialValues={state.data}
            onSave={save}
            cancelTo={`/records/${id}`}
          />
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
