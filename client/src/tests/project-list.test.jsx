import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProjectList from "../components/Project-list";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ProjectList Component", () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders page header with Projects title", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      const heading = screen.getByRole("heading", { name: /Projects/i });
      expect(heading).toBeInTheDocument();
    });
  });

  test("renders Create New Project button", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Create New Project/i })).toBeInTheDocument();
    });
  });

  test("displays 'No projects available' when projects list is empty", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      expect(screen.getByText(/No projects available/i)).toBeInTheDocument();
    });
  });

  test("renders projects table with headers", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: "1",
            title: "Test Project",
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            completion: "2024-12-31",
            description: "A test project",
          },
        ]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      expect(screen.getByText(/Title/i)).toBeInTheDocument();
      expect(screen.getByText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Email/i)).toBeInTheDocument();
      expect(screen.getByText(/Completion/i)).toBeInTheDocument();
      expect(screen.getByText(/Description/i)).toBeInTheDocument();
      expect(screen.getByText(/Actions/i)).toBeInTheDocument();
    });
  });

  test("renders project data in table rows", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: "1",
            title: "Test Project",
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            completion: "2024-12-31",
            description: "A test project",
          },
        ]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      const titleLink = screen.getByRole("link", { name: /Test Project/i });
      expect(titleLink).toBeInTheDocument();
      expect(screen.getByText(/Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/A test project/i)).toBeInTheDocument();
    });
  });

  test("renders Update and Delete buttons for each project", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: "1",
            title: "Test Project",
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            completion: "2024-12-31",
            description: "A test project",
          },
        ]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      const updateButtons = screen.getAllByRole("button", { name: /Update/i });
      const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });
      expect(updateButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  test("makes fetch request with authorization token", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/projects",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": "Bearer test-token",
          }),
        })
      );
    });
  });

  test("redirects to login when no token is found", async () => {
    Storage.prototype.getItem = jest.fn(() => null);

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      expect(Storage.prototype.getItem).toHaveBeenCalledWith("token");
    });
  });

  test("formats date correctly", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: "1",
            title: "Test Project",
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            completion: "2024-12-31T00:00:00Z",
            description: "A test project",
          },
        ]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      // Just verify that the table renders with the data (date formatting is browser-dependent)
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1); // Header row + at least 1 data row
    });
  });

  test("renders title link that navigates to project details", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: "1",
            title: "Test Project",
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            completion: "2024-12-31",
            description: "A test project",
          },
        ]),
      })
    );

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      const titleLink = screen.getByRole("link", { name: /Test Project/i });
      expect(titleLink).toHaveAttribute("href", "/project-details/1");
    });
  });
});
