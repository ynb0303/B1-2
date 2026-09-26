import { useCallback, useEffect, useState } from "react";
import { recordsApi } from "../lib/records";
export function useRecords(id) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [version, setVersion] = useState(0);
  const retry = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: "" });
    Promise.resolve()
      .then(() =>
        id === undefined ? recordsApi.list() : recordsApi.detail(id),
      )
      .then((data) => {
        if (active) setState({ data, loading: false, error: "" });
      })
      .catch((error) => {
        if (active)
          setState({ data: null, loading: false, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [id, version]);
  return { ...state, retry };
}
