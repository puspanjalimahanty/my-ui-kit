
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest"; // 👈 added vi here
import { DataTable } from "../components/DataTable";

describe("DataTable", () => {
  it("renders empty state", () => {
    render(<DataTable data={[]} columns={[]} />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it("selects rows", () => {
    const data = [{ a: 1 }, { a: 2 }];
    const columns = [{ key: "a", title: "A", dataIndex: "a" as const }];
    const onRowSelect = vi.fn(); // 👈 now works
    render(
      <DataTable
        data={data}
        columns={columns}
        selectable
        onRowSelect={onRowSelect}
      />
    );
    // select first row checkbox
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // 0 is header select-all, so 1 is first row
    expect(onRowSelect).toHaveBeenCalled();
  });
});
