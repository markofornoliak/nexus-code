import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { ProgressProvider } from "../features/progress/ProgressContext";
import LessonPage from "./LessonPage";

vi.mock("../features/code-runner/CodeEditor", () => ({
  CodeEditor: () => <div aria-label="Mock Python code editor" />,
}));

vi.mock("../features/code-runner/usePythonRunner", () => ({
  usePythonRunner: () => ({
    status: "initializing",
    statusMessage: "",
    result: null,
    run: vi.fn(),
    resetExecution: vi.fn(),
    clearResult: vi.fn(),
  }),
}));

describe("lesson page", () => {
  it("renders the Python initialization state and required workspace", () => {
    render(
      <MemoryRouter initialEntries={["/learn/python/python-first-signal"]}>
        <ProgressProvider>
          <Routes>
            <Route path="/learn/:trackId/:lessonId" element={<LessonPage />} />
          </Routes>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "The First Signal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Loading Python/i })).toBeDisabled();
    expect(
      screen.getByText(/first load requires a network connection/i),
    ).toBeInTheDocument();
  });

  it("shows a clear locked state for an unavailable successor", () => {
    render(
      <MemoryRouter initialEntries={["/learn/python/python-variables"]}>
        <ProgressProvider>
          <Routes>
            <Route path="/learn/:trackId/:lessonId" element={<LessonPage />} />
          </Routes>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Signal Vessels" })).toBeInTheDocument();
    expect(screen.getByText(/preceding fragment/i)).toBeInTheDocument();
  });
});
