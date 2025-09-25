import type { Meta, StoryObj } from "@storybook/react";
import { InputField } from "../components/InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  argTypes: { onChange: { action: "changed" } },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: "Name",
    placeholder: "Enter your name",
    helperText: "This will be public",
    variant: "outlined",
    size: "md",
  },
};

export const Error: Story = {
  args: {
    label: "Email",
    placeholder: "email@example.com",
    errorMessage: "Invalid email address",
    variant: "outlined",
    size: "md",
  },
};

export const WithClearAndLoading: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    clearable: true,
    loading: true,
    variant: "filled",
    size: "md",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    placeholder: "Type a password",
    passwordToggle: true,
    type: "password",
    variant: "outlined",
  },
};
