import { render, screen } from "@testing-library/react";
import Services from "../components/Services";

describe("Services Component", () => {
  test("renders services page heading", () => {
    render(<Services />);

    const headings = screen.getAllByText(/My Services/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  test("renders services introduction text", () => {
    render(<Services />);

    expect(
      screen.getByText(/Here are some of the services I can offer/i)
    ).toBeInTheDocument();
  });

  test("renders Web Development service card", () => {
    render(<Services />);

    expect(screen.getByText(/Web Development/i)).toBeInTheDocument();
    expect(
      screen.getByText(/I create responsive websites using HTML, CSS, JavaScript, and React/i)
    ).toBeInTheDocument();
  });

  test("renders Software Development service card", () => {
    render(<Services />);

    expect(screen.getByText(/Software Development/i)).toBeInTheDocument();
    expect(
      screen.getByText(/I develop software applications using C#, Java, and Python/i)
    ).toBeInTheDocument();
  });

  test("renders Database Management service card", () => {
    render(<Services />);

    expect(screen.getByText(/Database Management/i)).toBeInTheDocument();
    expect(
      screen.getByText(/I design and manage databases with Oracle SQL/i)
    ).toBeInTheDocument();
  });

  test("renders service images with correct alt text", () => {
    render(<Services />);

    const webDevImg = screen.getByAltText("Web Development");
    const softwareDevImg = screen.getByAltText("Software Development");
    const dbMgmtImg = screen.getByAltText("Database Management");

    expect(webDevImg).toBeInTheDocument();
    expect(softwareDevImg).toBeInTheDocument();
    expect(dbMgmtImg).toBeInTheDocument();

    expect(webDevImg).toHaveClass("service-image");
    expect(softwareDevImg).toHaveClass("service-image");
    expect(dbMgmtImg).toHaveClass("service-image");
  });

  test("renders three service cards", () => {
    render(<Services />);

    const serviceCards = screen.getAllByRole("img", { class: "service-image" });
    expect(serviceCards.length).toBe(3);
  });
});
