import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import RecordForm from "../src/components/RecordForm";
import { ToastProvider } from "../src/context/ToastContext";
import { recordsApi, validateRecord } from "../src/lib/records";
vi.mock("../src/lib/records", async (importOriginal) => ({
  ...(await importOriginal()),
  recordsApi: {
    list: vi.fn(),
    detail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));
const record = {
  id: "123",
  title: "React 상태 배우기",
  content: "useState와 이벤트를 배웠다.",
  category: "React",
  completed: false,
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
};
function app(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  );
}
describe("학습 기록 사용자 흐름", () => {
  it("공백과 길이를 검증한다", () => {
    expect(
      validateRecord({ title: " ", content: "", category: "React" }),
    ).toHaveProperty("title");
    expect(
      validateRecord({
        title: "a".repeat(81),
        content: "ok",
        category: "React",
      }),
    ).toHaveProperty("title");
  });
  it("빈 폼은 제출하지 않고 입력 오류를 보여준다", async () => {
    const save = vi.fn();
    render(
      <MemoryRouter>
        <RecordForm onSave={save} />
      </MemoryRouter>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "기록 저장하기" }),
    );
    expect(screen.getByText("제목을 입력해주세요.")).toBeVisible();
    expect(save).not.toHaveBeenCalled();
  });
  it("로딩 이후 목록을 보여주고 필터 및 검색을 적용한다", async () => {
    let resolve;
    recordsApi.list.mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      }),
    );
    app("/records");
    expect(screen.getByText("기록을 불러오고 있어요…")).toBeVisible();
    await waitFor(() => expect(recordsApi.list).toHaveBeenCalled());
    resolve([record]);
    expect(await screen.findByText(record.title)).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "CSS", exact: true }),
    );
    expect(screen.getByText("검색 결과가 없어요")).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "전체", exact: true }),
    );
    await userEvent.type(screen.getByRole("searchbox"), "없는 내용");
    expect(screen.getByText("검색 결과가 없어요")).toBeVisible();
  });
  it("조회 실패 후 재시도하고 빈 상태를 표시한다", async () => {
    recordsApi.list
      .mockRejectedValueOnce(new Error("네트워크 오류"))
      .mockResolvedValueOnce([]);
    app("/records");
    expect(await screen.findByText("네트워크 오류")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(await screen.findByText("아직 기록이 없어요")).toBeVisible();
  });
  it("저장 중 중복 제출을 막고 성공 시 상세와 알림을 표시한다", async () => {
    let resolve;
    recordsApi.create.mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      }),
    );
    recordsApi.detail.mockResolvedValue(record);
    app("/records/new");
    await userEvent.type(screen.getByLabelText("제목 *"), record.title);
    await userEvent.type(screen.getByLabelText("학습 내용 *"), record.content);
    expect(screen.getAllByText(record.title)).toHaveLength(1);
    await userEvent.click(
      screen.getByRole("button", { name: "기록 저장하기" }),
    );
    expect(screen.getByRole("button", { name: "저장 중…" })).toBeDisabled();
    resolve(record);
    expect(
      await screen.findByText("새로운 배움을 기록했습니다.", { exact: false }),
    ).toBeVisible();
    expect(
      await screen.findByRole("heading", { name: record.title }),
    ).toBeVisible();
  });
  it("저장 실패 시 입력을 유지하고 재시도할 수 있다", async () => {
    recordsApi.create.mockRejectedValueOnce(new Error("저장 실패"));
    app("/records/new");
    await userEvent.type(screen.getByLabelText("제목 *"), "제목");
    await userEvent.type(screen.getByLabelText("학습 내용 *"), "내용");
    await userEvent.click(
      screen.getByRole("button", { name: "기록 저장하기" }),
    );
    expect(await screen.findByText("저장 실패")).toBeVisible();
    expect(screen.getByLabelText("제목 *")).toHaveValue("제목");
    expect(screen.getByRole("button", { name: "기록 저장하기" })).toBeEnabled();
  });
  it("수정 폼에 기존 값이 있고 수정 API를 호출한다", async () => {
    recordsApi.detail.mockResolvedValue(record);
    recordsApi.update.mockResolvedValue({ ...record, title: "수정 제목" });
    app("/records/123/edit");
    const input = await screen.findByLabelText("제목 *");
    expect(input).toHaveValue(record.title);
    await userEvent.clear(input);
    await userEvent.type(input, "수정 제목");
    await userEvent.click(
      screen.getByRole("button", { name: "기록 저장하기" }),
    );
    await waitFor(() =>
      expect(recordsApi.update).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({ title: "수정 제목" }),
      ),
    );
  });
  it("삭제 취소 후 실패와 재시도, 성공 이동을 처리한다", async () => {
    recordsApi.detail.mockResolvedValue(record);
    recordsApi.remove
      .mockRejectedValueOnce(new Error("삭제 실패"))
      .mockResolvedValueOnce(undefined);
    recordsApi.list.mockResolvedValue([]);
    app("/records/123");
    await screen.findByText(record.title);
    await userEvent.click(screen.getByRole("button", { name: "삭제하기" }));
    await userEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(recordsApi.remove).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "삭제하기" }));
    await userEvent.click(screen.getByRole("button", { name: "삭제 확인" }));
    expect(await screen.findByText("삭제 실패")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "삭제 확인" }));
    expect(await screen.findByText("아직 기록이 없어요")).toBeVisible();
  });
  it("없는 기록과 잘못된 페이지를 안내한다", async () => {
    recordsApi.detail.mockResolvedValue(null);
    const view = app("/records/missing");
    expect(await screen.findByText("기록을 찾을 수 없어요")).toBeVisible();
    view.unmount();
    app("/wrong");
    expect(screen.getByText("404 · 페이지를 찾을 수 없어요")).toBeVisible();
  });
});
