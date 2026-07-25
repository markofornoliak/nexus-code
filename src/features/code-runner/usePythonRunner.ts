import { useCallback, useEffect, useState } from "react";
import type { CodeExecutionResult, ExecutionStatus } from "../../types";
import { pyodideService } from "../../services/pyodide/PyodideService";

export function usePythonRunner() {
  const [status, setStatus] = useState<ExecutionStatus>(pyodideService.getStatus());
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<CodeExecutionResult | null>(null);

  useEffect(
    () =>
      pyodideService.subscribe((nextStatus, message) => {
        setStatus(nextStatus);
        setStatusMessage(message ?? "");
      }),
    [],
  );

  const run = useCallback(async (code: string, stdin: string) => {
    setResult(null);
    const next = await pyodideService.run(code, stdin);
    setResult(next);
    return next;
  }, []);

  const resetExecution = useCallback(() => {
    setResult(null);
    pyodideService.reset();
  }, []);

  const clearResult = useCallback(() => setResult(null), []);

  return { status, statusMessage, result, run, resetExecution, clearResult };
}
