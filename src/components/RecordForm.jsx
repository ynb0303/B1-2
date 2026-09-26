import { useRef, useState } from "react";
import { categories, validateRecord } from "../lib/records";
import { Badge, Button, ErrorState, Field, LinkButton } from "./UI";
export default function RecordForm({
  initialValues,
  onSave,
  cancelTo = "/records",
}) {
  const [values, setValues] = useState(
    initialValues || {
      title: "",
      content: "",
      category: "React",
      completed: false,
    },
  );
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState("");
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  function change(event) {
    const { name, value, checked, type } = event.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const next = validateRecord(values);
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }
    submitting.current = true;
    setPending(true);
    setFailure("");
    try {
      await onSave({
        title: values.title.trim(),
        content: values.content.trim(),
        category: values.category,
        completed: values.completed,
      });
    } catch (error) {
      setFailure(error.message);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  return (
    <div className="form-layout">
      <form className="panel" onSubmit={submit} noValidate aria-busy={pending}>
        <fieldset disabled={pending}>
          <Field
            label="제목 *"
            name="title"
            placeholder="오늘 무엇을 배웠나요?"
            value={values.title}
            onChange={change}
            error={errors.title}
            maxLength={80}
            required
          />
          <div className="field">
            <label htmlFor="category">주제 *</label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={change}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <Field
            label="학습 내용 *"
            name="content"
            multiline
            rows={12}
            placeholder="배운 점, 어려웠던 점, 다음에 시도할 것을 자유롭게 기록하세요."
            value={values.content}
            onChange={change}
            error={errors.content}
            maxLength={5000}
            required
          />
          <p className="char-count">
            {values.content.length.toLocaleString()} / 5,000
          </p>
          <label className="checkbox">
            <input
              type="checkbox"
              name="completed"
              checked={values.completed}
              onChange={change}
            />
            학습을 완료했어요
          </label>
        </fieldset>
        {failure && <ErrorState message={failure} />}
        <div className="actions">
          <Button type="submit" disabled={pending}>
            {pending ? "저장 중…" : "기록 저장하기"}
          </Button>
          {!pending && (
            <LinkButton to={cancelTo} variant="secondary">
              취소
            </LinkButton>
          )}
        </div>
      </form>
      <aside className="panel preview">
        <p className="eyebrow">LIVE PREVIEW</p>
        <h2>이렇게 기록돼요</h2>
        <Badge>{values.category}</Badge>
        <h3>{values.title || "오늘의 배움 제목"}</h3>
        <p className="prose">
          {values.content || "입력한 내용이 여기에 실시간으로 표시됩니다."}
        </p>
        <small>{values.completed ? "✓ 학습 완료" : "○ 학습 중"}</small>
      </aside>
    </div>
  );
}
