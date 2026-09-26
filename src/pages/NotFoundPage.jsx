import { EmptyState, LinkButton } from "../components/UI";
export default function NotFoundPage() {
  return (
    <EmptyState
      title="404 · 페이지를 찾을 수 없어요"
      description="주소를 확인하거나 홈으로 돌아가주세요."
      action={<LinkButton to="/">홈으로 이동</LinkButton>}
    />
  );
}
