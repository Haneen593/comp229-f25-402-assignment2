import { render, screen } from "@testing-library/react";
import About from "../components/About";

describe("About Component", () => {
  test("renders name in about section", () => {
    render(<About />);

    expect(
      screen.getByText(/My name is/i)
    ).toBeInTheDocument();
    
    expect(
      screen.getByText(/Haneen Ftayeh/i)
    ).toBeInTheDocument();
  });

  test("renders profile image", () => {
    render(<About />);

    const profileImg = screen.getByAltText("Profile");
    expect(profileImg).toBeInTheDocument();
    expect(profileImg).toHaveAttribute("width", "200");
    expect(profileImg).toHaveAttribute("id", "profile-pic");
  });

  test("renders resume link", () => {
    render(<About />);

    const resumeLink = screen.getByRole("link", { name: /View My Resume/i });
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute("target", "_blank");
  });
});
