// src/stories/DataTable.stories.tsx
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import DataTable from "../components/DataTable";
import type { Column, DataTableProps } from "../components/DataTable";

interface Person {
  id: number;
  name: string;
  age: number;
  email: string;
}

const data: Person[] = [
  { id: 1, name: "Alice", age: 28, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 35, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 22, email: "charlie@example.com" },
];

// NOTE: Column is a generic type, import it with `import type` (no runtime import)
const columns: Column<Person>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
  { key: "email", title: "Email", dataIndex: "email" },
];

// Storybook can't accept `DataTable<Person>` as a value at runtime.
// We create a typed alias to satisfy Storybook typings.
const TypedDataTable = DataTable as unknown as React.FC<DataTableProps<Person>>;

const meta: Meta<typeof TypedDataTable> = {
  title: "Components/DataTable",
  component: TypedDataTable,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof TypedDataTable>;

export const Default: Story = {
  args: {
    data,
    columns,
    loading: false,
    selectable: false,
  } as DataTableProps<Person>,
};

export const Selectable: Story = {
  args: {
    data,
    columns,
    selectable: true,
    multiSelect: true,
    onRowSelect: (rows: Person[]) => console.log("selected", rows),
  } as DataTableProps<Person>,
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
  } as DataTableProps<Person>,
};
