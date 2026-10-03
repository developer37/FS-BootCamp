import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import Button from "./components/Button.jsx";
import AddTodo from "./components/AddTodo.jsx";
import TodoList from "./components/TodoList.jsx";
import TodoItem from "./components/TodoItem.jsx";

describe("Todo App component tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Button renders the correct label and triggers the click handler", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button label="Submit" className="primary-btn" onClick={onClick} />);

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toHaveClass("primary-btn");

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("AddTodo renders the form and validation message", () => {
    render(
      <AddTodo
        value=""
        onChange={() => {}}
        onSubmit={(event) => event.preventDefault()}
        error="Please enter a todo item"
      />,
    );

    expect(screen.getByLabelText(/new todo item/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add todo/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /please enter a todo item/i,
    );
  });

  test("TodoItem renders the task and fires toggle and delete handlers", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    const onDelete = jest.fn();

    render(
      <TodoItem
        todo={{ id: "1", text: "Read a book", completed: false }}
        onToggle={onToggle}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("Read a book")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox", {
      name: /mark "read a book" as complete/i,
    });

    await user.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith("1");

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  test("TodoList shows an empty-state message when no todos exist", () => {
    render(<TodoList todos={[]} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(
      screen.getByText(/no todos yet. add one above!/i),
    ).toBeInTheDocument();
  });

  test("TodoList renders each todo item in the list", () => {
    const todos = [
      { id: "1", text: "Task one", completed: false },
      { id: "2", text: "Task two", completed: true },
    ];

    render(
      <TodoList todos={todos} onToggle={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getByText("Task one")).toBeInTheDocument();
    expect(screen.getByText("Task two")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(2);
  });

  test("App renders the title and empty state", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /my todo list/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no todos yet. add one above!/i),
    ).toBeInTheDocument();
  });

  test("App adds a todo item and validates empty input", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/new todo item/i);
    await user.type(input, "Buy milk");
    await user.click(screen.getByRole("button", { name: /add todo/i }));

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText(/1 item/i)).toBeInTheDocument();
    expect(input).toHaveValue("");

    await user.click(screen.getByRole("button", { name: /add todo/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      /please enter a todo item/i,
    );
  });

  test("App toggles a todo and then deletes it", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/new todo item/i);
    await user.type(input, "Write tests");
    await user.click(screen.getByRole("button", { name: /add todo/i }));

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);
    expect(screen.getByText("Write tests")).toHaveClass("todo-text");

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);
    expect(screen.queryByText("Write tests")).not.toBeInTheDocument();
  });
});
