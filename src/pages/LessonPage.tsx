import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Lightbulb,
  LockKeyhole,
  Play,
  RotateCcw,
  Signal,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CodeEditor } from "../features/code-runner/CodeEditor";
import { usePythonRunner } from "../features/code-runner/usePythonRunner";
import { useProgress } from "../features/progress/ProgressContext";
import { isLessonUnlocked } from "../features/progress/progressSelectors";
import { getAdjacentLessons, getLesson } from "../content/registry";
import type { Task, ValidationResult } from "../types";
import { validateTask } from "../lib/validation";
import { LessonProgress } from "../components/lessons/LessonProgress";
import { LessonSectionRenderer } from "../components/lessons/LessonSectionRenderer";
import { TaskResult } from "../components/lessons/TaskResult";
import { StatusChip } from "../components/common/StatusChip";
import NotFoundPage from "./NotFoundPage";

export default function LessonPage() {
  const { trackId = "", lessonId = "" } = useParams();
  const entry = getLesson(trackId, lessonId);
  const { state, dispatch } = useProgress();
  const runner = usePythonRunner();
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const lessonForTasks = entry?.lesson;
  const clearExecutionResult = runner.clearResult;

  const taskOptions = useMemo(() => {
    if (!lessonForTasks) return [];
    return [
      ...lessonForTasks.tasks.map((task) => ({ task, bonus: false })),
      { task: lessonForTasks.bonusTask, bonus: true },
    ];
  }, [lessonForTasks]);

  const selected = taskOptions.find((option) => option.task.id === selectedTaskId);

  useEffect(() => {
    const first = taskOptions[0];
    if (!first) return;
    setSelectedTaskId(first.task.id);
    setCode(first.task.starterCode);
    setStdin(first.task.defaultInput ?? "");
    setValidation(null);
    clearExecutionResult();
  }, [lessonId, taskOptions, clearExecutionResult]);

  if (!entry) {
    return (
      <NotFoundPage embedded message="The requested learning fragment is unavailable." />
    );
  }

  const { track, world, lesson } = entry;
  const lessonProgress = state.progress.lessons[lesson.id];
  const adjacent = getAdjacentLessons(track, lesson.id);
  const unlocked =
    lesson.status === "preview" || isLessonUnlocked(track, lesson.id, state.progress);
  const allStandardComplete = lesson.tasks.every((task) =>
    lessonProgress?.completedTaskIds.includes(task.id),
  );
  const isPreview = lesson.status === "preview" || track.status !== "available";

  if (!unlocked) {
    return (
      <main id="main-content" className="locked-lesson page-shell">
        <LockKeyhole aria-hidden="true" />
        <p className="eyebrow">Neural path sealed</p>
        <h1>{lesson.title}</h1>
        <p>Restore the preceding fragment before entering this chamber.</p>
        <Link className="button button-primary" to={`/tracks/${track.id}`}>
          <ArrowLeft aria-hidden="true" /> Return to expedition map
        </Link>
      </main>
    );
  }

  const chooseTask = (task: Task) => {
    setSelectedTaskId(task.id);
    setCode(task.starterCode);
    setStdin(task.defaultInput ?? "");
    setValidation(null);
    runner.clearResult();
  };

  const runCode = async () => {
    if (!selected || isPreview) return;
    setValidation(null);
    const execution = await runner.run(code, stdin);
    if (execution.status !== "success") return;
    const result = validateTask(selected.task, execution.stdout, code);
    setValidation(result);
    if (result.success) {
      dispatch({
        type: "record-task",
        lesson,
        taskId: selected.task.id,
        label: `${lesson.title}: ${selected.task.title}`,
        bonus: selected.bonus,
      });
    }
  };

  const resetTask = () => {
    if (!selected) return;
    setCode(selected.task.starterCode);
    setStdin(selected.task.defaultInput ?? "");
    setValidation(null);
    runner.clearResult();
  };

  return (
    <main id="main-content" className="lesson-page">
      <div className="lesson-topbar page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/tracks">Expeditions</Link>
          <ChevronRight aria-hidden="true" />
          <Link to={`/tracks/${track.id}`}>{track.language}</Link>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{lesson.title}</span>
        </nav>
        <div className="lesson-top-metrics">
          <span>
            <Clock3 aria-hidden="true" /> {lesson.durationMinutes} min
          </span>
          <span>
            <Signal aria-hidden="true" /> +{lesson.xpReward}
          </span>
          <StatusChip
            tone={
              lessonProgress?.isCompleted ? "success" : isPreview ? "warning" : "active"
            }
          >
            {lessonProgress?.isCompleted
              ? "Restored"
              : isPreview
                ? "Preview"
                : "Active fragment"}
          </StatusChip>
        </div>
      </div>

      <header className="lesson-header page-shell">
        <div>
          <p className="eyebrow">
            {world.title} / Fragment {String(lesson.order).padStart(2, "0")}
          </p>
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
        </div>
        <div className="lesson-coordinate" aria-hidden="true">
          <span>SECTOR</span>
          <strong>
            {String(world.order).padStart(2, "0")}:{String(lesson.order).padStart(2, "0")}
          </strong>
          <small>{track.icon} / NX</small>
        </div>
      </header>

      <div className="lesson-layout page-shell">
        <article className="theory-column">
          <section className="objectives-panel">
            <span className="instrument-label">Recovery objectives</span>
            <h2>After this fragment, you can:</h2>
            <ul>
              {lesson.objectives.map((objective) => (
                <li key={objective}>
                  <Check aria-hidden="true" /> {objective}
                </li>
              ))}
            </ul>
            {lesson.prerequisites.length > 0 && (
              <p>
                Prerequisite signal: <strong>{lesson.prerequisites.join(", ")}</strong>
              </p>
            )}
          </section>

          {lesson.sections.map((section) => {
            const key =
              section.type === "theory"
                ? section.block.id
                : section.type === "example"
                  ? section.example.id
                  : section.id;
            return <LessonSectionRenderer key={key} section={section} />;
          })}

          <aside className="common-mistakes">
            <div>
              <span className="instrument-label">Fault signatures</span>
              <h2>Common mistakes</h2>
            </div>
            <ul>
              {lesson.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </aside>

          {!isPreview && <LessonProgress lesson={lesson} progress={lessonProgress} />}
        </article>

        <aside className="workspace-column" aria-label="Practice workspace">
          {isPreview ? (
            <section className="preview-workspace">
              <LockKeyhole aria-hidden="true" />
              <span className="eyebrow">Execution core sealed</span>
              <h2>Preview fragment</h2>
              <p>
                This theory specimen is available to read. Tasks, Signal Energy, and
                execution activate with the complete {track.language} expedition.
              </p>
              <Link className="button button-secondary" to={`/tracks/${track.id}`}>
                Return to roadmap
              </Link>
            </section>
          ) : (
            <div className="workspace-sticky">
              <section className="task-selector-panel">
                <div className="workspace-heading">
                  <div>
                    <span className="instrument-label">Practice console</span>
                    <h2>Stabilize a transmission</h2>
                  </div>
                  <Code2 aria-hidden="true" />
                </div>
                <div className="task-tabs" role="tablist" aria-label="Lesson tasks">
                  {taskOptions.map((option, index) => {
                    const complete = option.bonus
                      ? lessonProgress?.completedBonusTaskIds.includes(option.task.id)
                      : lessonProgress?.completedTaskIds.includes(option.task.id);
                    return (
                      <button
                        key={option.task.id}
                        type="button"
                        role="tab"
                        aria-selected={selectedTaskId === option.task.id}
                        className={`${selectedTaskId === option.task.id ? "is-selected" : ""}${complete ? " is-complete" : ""}${option.bonus ? " is-bonus" : ""}`}
                        onClick={() => chooseTask(option.task)}
                      >
                        {option.bonus ? (
                          <Sparkles aria-hidden="true" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                        {complete && (
                          <Check className="tab-check" aria-label="completed" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {selected && (
                  <div className={`task-brief${selected.bonus ? " is-bonus" : ""}`}>
                    <div>
                      <span>
                        {selected.bonus
                          ? "Hidden channel / +40 signal"
                          : "Standard task / +25 signal"}
                      </span>
                      <h3>{selected.task.title}</h3>
                    </div>
                    <p>{selected.task.description}</p>
                    <dl>
                      <dt>Expected behavior</dt>
                      <dd>{selected.task.expectedBehavior}</dd>
                    </dl>
                    <details open={state.preferences.hintsExpanded}>
                      <summary>
                        <Lightbulb aria-hidden="true" /> Recovery hints
                      </summary>
                      <ul>
                        {selected.task.hints.map((hint) => (
                          <li key={hint}>{hint}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </section>

              <section className="editor-panel">
                <div className="editor-toolbar">
                  <div>
                    <span className="editor-light" aria-hidden="true" />
                    fragment.py
                  </div>
                  <span>{state.preferences.editorFontSize}px / UTF-8</span>
                </div>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  fontSize={state.preferences.editorFontSize}
                />
                <div className="editor-actions">
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => void runCode()}
                    disabled={
                      runner.status === "initializing" || runner.status === "running"
                    }
                  >
                    <Play aria-hidden="true" />
                    {runner.status === "initializing"
                      ? "Loading Python…"
                      : runner.status === "running"
                        ? "Running…"
                        : "Run & validate"}
                  </button>
                  <button
                    className="button button-ghost"
                    type="button"
                    onClick={resetTask}
                  >
                    <RotateCcw aria-hidden="true" /> Reset
                  </button>
                </div>
                {runner.status === "initializing" && (
                  <p className="runtime-message" role="status">
                    <span className="loading-dot" aria-hidden="true" />
                    Recovering the Python core. The first load requires a network
                    connection.
                  </p>
                )}
                {runner.statusMessage && runner.status === "error" && !runner.result && (
                  <p className="runtime-error" role="alert">
                    {runner.statusMessage}
                  </p>
                )}
              </section>

              <section className="input-console-panel">
                <div className="stdin-panel">
                  <label htmlFor="standard-input">Standard input queue</label>
                  <p>One input() call consumes one line.</p>
                  <textarea
                    id="standard-input"
                    value={stdin}
                    rows={3}
                    spellCheck={false}
                    onChange={(event) => setStdin(event.target.value)}
                    placeholder="Optional input lines…"
                  />
                </div>
                <div className="console-panel">
                  <div>
                    <TerminalSquare aria-hidden="true" />
                    <span>Program output</span>
                  </div>
                  <pre aria-label="Program output">
                    {runner.result
                      ? `${runner.result.stdout}${runner.result.stderr}`
                      : "— awaiting execution —"}
                  </pre>
                </div>
              </section>

              <TaskResult execution={runner.result} validation={validation} />

              {selected?.bonus && validation?.success && (
                <aside className="discovery-message">
                  <Sparkles aria-hidden="true" />
                  <div>
                    <span>Hidden channel recovered</span>
                    <p>{lesson.bonusTask.discoveryText}</p>
                  </div>
                </aside>
              )}

              <section
                className={`completion-control${allStandardComplete ? " is-ready" : ""}`}
              >
                <div>
                  <span className="instrument-label">Fragment completion</span>
                  <h3>
                    {lessonProgress?.isCompleted
                      ? "Neural pathway restored"
                      : allStandardComplete
                        ? "All required transmissions are stable"
                        : "Complete every standard task"}
                  </h3>
                </div>
                <button
                  className="button button-primary"
                  type="button"
                  disabled={!allStandardComplete || lessonProgress?.isCompleted}
                  onClick={() => dispatch({ type: "complete-lesson", lesson })}
                >
                  {lessonProgress?.isCompleted ? (
                    <>
                      <Check aria-hidden="true" /> Restored
                    </>
                  ) : (
                    <>
                      Restore fragment <Signal aria-hidden="true" />
                    </>
                  )}
                </button>
              </section>
            </div>
          )}
        </aside>
      </div>

      <nav className="lesson-navigation page-shell" aria-label="Lesson navigation">
        {adjacent.previous ? (
          <Link to={`/learn/${track.id}/${adjacent.previous.id}`}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>Previous fragment</small>
              <strong>{adjacent.previous.title}</strong>
            </span>
          </Link>
        ) : (
          <Link to={`/tracks/${track.id}`}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>Return to</small>
              <strong>Expedition map</strong>
            </span>
          </Link>
        )}
        {adjacent.next &&
          (lessonProgress?.isCompleted || adjacent.next.status === "preview" ? (
            <Link className="next-link" to={`/learn/${track.id}/${adjacent.next.id}`}>
              <span>
                <small>Next fragment</small>
                <strong>{adjacent.next.title}</strong>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <span className="next-link is-disabled" aria-label="Next fragment locked">
              <span>
                <small>Next fragment</small>
                <strong>{adjacent.next.title}</strong>
              </span>
              <LockKeyhole aria-hidden="true" />
            </span>
          ))}
      </nav>
    </main>
  );
}
