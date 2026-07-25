import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProgressProvider } from "../features/progress/ProgressContext";
import { App } from "./App";

describe("application routes", () => {
  it("renders the landing route through lazy route loading", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: /Recover the logic/i }),
    ).toBeInTheDocument();
  });

  it("renders the themed not-found route", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown-coordinate"]}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "Fragment not found." }),
    ).toBeInTheDocument();
  });
});
