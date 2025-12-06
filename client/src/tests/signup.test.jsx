import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../components/SignUp";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("SignUp Component", () => {
  test("renders sign up form heading", () => {
    renderWithRouter(<SignUp setUser={() => {}} />);

    const legend = screen.getByRole("group");
    expect(legend).toBeInTheDocument();
  });

  test("renders username input field", () => {
    renderWithRouter(<SignUp setUser={() => {}} />);

    const usernameInput = screen.getByLabelText(/Username:/i);
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
    expect(usernameInput).toHaveAttribute("name", "username");
  });

  test("renders email input field", () => {
    renderWithRouter(<SignUp setUser={() => {}} />);

    const emailInput = screen.getByLabelText(/Email:/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
  });

  test("renders password input field", () => {
    renderWithRouter(<SignUp setUser={() => {}} />);

    const passwordInput = screen.getByLabelText(/Password:/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
  });

  test("renders sign up submit button", () => {
    renderWithRouter(<SignUp setUser={() => {}} />);

    const submitButton = screen.getByRole("button", { name: /Sign Up/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("updates form data when user types in inputs", () => {
    renderWithRouter(<SignUp setUser={() => {}} />);

    const usernameInput = screen.getByLabelText(/Username:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.value).toBe("testuser");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("displays error message on failed sign up", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify({ error: "Username already exists" })),
      })
    );

    renderWithRouter(<SignUp setUser={() => {}} />);

    const usernameInput = screen.getByLabelText(/Username:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Username already exists/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test("makes fetch request with correct data on form submit", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ message: "Account created successfully" })),
      })
    );

    renderWithRouter(<SignUp setUser={() => {}} />);

    const usernameInput = screen.getByLabelText(/Username:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "testuser",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );
    });

    global.fetch.mockRestore();
  });
});
