import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { ProgressProvider } from "../features/progress/ProgressContext";

describe("application navigation", () => {
  it("provides primary routes and current-route state", () => {
    render(
      <MemoryRouter initialEntries={["/tracks"]}>
        <ProgressProvider>
          <AppShell>
            <main>content</main>
          </AppShell>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Expeditions" })).toHaveClass("active");
    expect(screen.getAllByRole("link", { name: /NEXUS home/i })[0]).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /Signal Energy/i })).toBeInTheDocument();
  });
});
