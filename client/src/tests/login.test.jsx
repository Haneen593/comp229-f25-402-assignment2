import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../components/Login";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Login Component", () => {
  test("renders login form with heading", () => {
    renderWithRouter(<Login setUser={() => {}} />);

    const fieldset = screen.getByRole("group");
    expect(fieldset).toBeInTheDocument();
  });

  test("renders email input field", () => {
    renderWithRouter(<Login setUser={() => {}} />);

    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "text");
    expect(emailInput).toHaveAttribute("name", "email");
  });

  test("renders password input field", () => {
    renderWithRouter(<Login setUser={() => {}} />);

    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
  });

  test("renders login submit button", () => {
    renderWithRouter(<Login setUser={() => {}} />);

    const submitButton = screen.getByRole("button", { name: /Login/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("updates form data when user types in inputs", () => {
    renderWithRouter(<Login setUser={() => {}} />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("displays error message on failed login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify({ error: "Invalid email or password" })),
      })
    );

    renderWithRouter(<Login setUser={() => {}} />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test("makes fetch request with correct data on form submit", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ 
          token: "test-token",
          user: { email: "test@example.com", username: "testuser" }
        })),
      })
    );

    renderWithRouter(<Login setUser={() => {}} />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/auth/signin",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      );
    });

    global.fetch.mockRestore();
  });

  test("handles empty response from server", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(""),
      })
    );

    renderWithRouter(<Login setUser={() => {}} />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to login/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test("calls setUser on successful login", async () => {
    const setUserMock = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ 
          token: "test-token-123",
          user: { email: "test@example.com", username: "testuser" }
        })),
      })
    );

    renderWithRouter(<Login setUser={setUserMock} />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalledWith({
        username: "testuser",
        token: "test-token-123",
      });
    });

    global.fetch.mockRestore();
  });
});
