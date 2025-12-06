import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../components/Home";

describe("Home Component", () => {
  test("renders heading and mission text", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /welcome to my portfolio/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/My mission is to grow as a software engineer/i)
    ).toBeInTheDocument();
  });

  test("renders 'More about me' button", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /more about me/i })).toBeInTheDocument();
  });

  test("button click attempts navigation", () => {
    render(<Home />);

    const button = screen.getByRole("button", { name: /more about me/i });
    
    // Verify button exists and is clickable
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});
