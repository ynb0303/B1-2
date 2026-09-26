import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
let client;
function db() {
  if (!url || !key)
    throw new Error(
      "Supabase 연결 설정이 필요합니다. README에 따라 환경변수를 설정해주세요.",
    );
  client ??= createClient(url, key);
  return client;
}
async function unwrap(query) {
  const { data, error } = await query;
  if (error)
    throw new Error(
      `요청에 실패했습니다. 연결과 테이블 권한을 확인해주세요. (${error.message})`,
    );
  return data;
}
export const recordsApi = {
  list: () =>
    unwrap(
      db()
        .from("records")
        .select("*")
        .order("created_at", { ascending: false }),
    ),
  detail: (id) =>
    unwrap(db().from("records").select("*").eq("id", id).maybeSingle()),
  create: (values) =>
    unwrap(db().from("records").insert(values).select().single()),
  update: (id, values) =>
    unwrap(db().from("records").update(values).eq("id", id).select().single()),
  remove: async (id) => {
    const rows = await unwrap(
      db().from("records").delete().eq("id", id).select("id"),
    );
    if (!rows.length)
      throw new Error("삭제할 기록이 없거나 삭제 권한이 없습니다.");
  },
};
export const categories = ["React", "JavaScript", "CSS", "기타"];
export function validateRecord(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "제목을 입력해주세요.";
  else if (values.title.trim().length > 80)
    errors.title = "제목은 80자 이내로 입력해주세요.";
  if (!values.content.trim()) errors.content = "학습 내용을 입력해주세요.";
  else if (values.content.trim().length > 5000)
    errors.content = "내용은 5,000자 이내로 입력해주세요.";
  if (!categories.includes(values.category))
    errors.category = "주제를 선택해주세요.";
  return errors;
}
export function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
