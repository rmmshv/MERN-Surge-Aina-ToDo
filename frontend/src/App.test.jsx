import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

// Mock axios to avoid real API calls
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn((url, { text }) => Promise.resolve({ data: { _id: "1", text, completed: false } })),
}));

test("renders Surge Aina To Do App title", () => {
  render(<App />);
  expect(screen.getByText(/Surge Aina To Do App/i)).toBeInTheDocument();
});

test("adds a new todo", async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/What needs to be done/i);
  fireEvent.change(input, { target: { value: "Test Todo" } });
  fireEvent.click(screen.getByText(/Add Task/i));
  // wait for the new todo to appear
  expect(await screen.findByText("Test Todo")).toBeInTheDocument();
});