import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest"; // 👈 added vi here
import { InputField } from "../components/InputField";

describe("InputField", () => {
  it("renders label and helper", () => {
    render(<InputField label="Name" helperText="helper" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("helper")).toBeInTheDocument();
  });

  it("calls onChange", () => {
    const handle = vi.fn(); // 👈 now works
    render(<InputField onChange={handle} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(handle).toHaveBeenCalled();
  });
});
