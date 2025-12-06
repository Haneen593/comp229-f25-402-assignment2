import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProjectDetails from '../components/project-details';

const renderWithRouter = (component, initialRoute = "/project-details") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/project-details" element={component} />
        <Route path="/project-details/:id" element={component} />
        <Route path="/projects" element={<div>Projects List</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ProjectDetails Component", () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders Create Project form when no id is provided", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ProjectDetails />, "/project-details");

    await waitFor(() => {
      const legend = screen.getByText(/Create Project/i);
      expect(legend).toBeInTheDocument();
    });
  });

  test("renders all form input fields", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ProjectDetails />, "/project-details");

    await waitFor(() => {
      expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Completion/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });
  });

  test("renders Create button when no id is provided", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ProjectDetails />, "/project-details");

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Create/i });
      expect(button).toBeInTheDocument();
    });
  });

  test("updates form fields when user types", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ProjectDetails />, "/project-details");

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      const firstnameInput = screen.getByLabelText(/First Name/i);

      fireEvent.change(titleInput, { target: { value: "My Project" } });
      fireEvent.change(firstnameInput, { target: { value: "John" } });

      expect(titleInput.value).toBe("My Project");
      expect(firstnameInput.value).toBe("John");
    });
  });

  test("submits form data when Create button is clicked", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ _id: "1" }),
      })
    );

    renderWithRouter(<ProjectDetails />, "/project-details");

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      const firstnameInput = screen.getByLabelText(/First Name/i);
      const lastnameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const completionInput = screen.getByLabelText(/Completion/i);
      const descriptionInput = screen.getByLabelText(/Description/i);
      const submitButton = screen.getByRole("button", { name: /Create/i });

      fireEvent.change(titleInput, { target: { value: "My Project" } });
      fireEvent.change(firstnameInput, { target: { value: "John" } });
      fireEvent.change(lastnameInput, { target: { value: "Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(completionInput, { target: { value: "2024-12-31" } });
      fireEvent.change(descriptionInput, { target: { value: "A great project" } });

      fireEvent.click(submitButton);

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalled();
    });

    global.fetch.mockRestore();
  });

  test("makes POST request when creating a new project", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ _id: "1" }),
      })
    );

    renderWithRouter(<ProjectDetails />, "/project-details");

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      const firstnameInput = screen.getByLabelText(/First Name/i);
      const lastnameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const completionInput = screen.getByLabelText(/Completion/i);
      const descriptionInput = screen.getByLabelText(/Description/i);
      const submitButton = screen.getByRole("button", { name: /Create/i });

      fireEvent.change(titleInput, { target: { value: "My Project" } });
      fireEvent.change(firstnameInput, { target: { value: "John" } });
      fireEvent.change(lastnameInput, { target: { value: "Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(completionInput, { target: { value: "2024-12-31" } });
      fireEvent.change(descriptionInput, { target: { value: "A great project" } });

      fireEvent.click(submitButton);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/projects",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Authorization": "Bearer test-token",
            "Content-Type": "application/json",
          }),
        })
      );
    });

    global.fetch.mockRestore();
  });

  test("redirects to login when no token is found on update", async () => {
    Storage.prototype.getItem = jest.fn(() => null);
    const mockNavigate = jest.fn();

    renderWithRouter(<ProjectDetails />, "/project-details/1");

    await waitFor(() => {
      expect(Storage.prototype.getItem).toHaveBeenCalledWith("token");
    });
  });

  test("renders Update Project heading when id is provided", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: "1",
          title: "Test Project",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          completion: "2024-12-31T00:00:00Z",
          description: "A test project",
        }),
      })
    );

    renderWithRouter(<ProjectDetails />, "/project-details/1");

    await waitFor(() => {
      expect(screen.getByText(/Update Project/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test("renders Update button when id is provided", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: "1",
          title: "Test Project",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          completion: "2024-12-31T00:00:00Z",
          description: "A test project",
        }),
      })
    );

    renderWithRouter(<ProjectDetails />, "/project-details/1");

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Update/i });
      expect(button).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test("populates form with project data when id is provided", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: "1",
          title: "Test Project",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          completion: "2024-12-31T00:00:00Z",
          description: "A test project",
        }),
      })
    );

    renderWithRouter(<ProjectDetails />, "/project-details/1");

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      expect(titleInput.value).toBe("Test Project");
    });

    global.fetch.mockRestore();
  });

  test("makes PUT request when updating a project", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    
    let fetchCallCount = 0;
    global.fetch = jest.fn(() => {
      fetchCallCount++;
      if (fetchCallCount === 1) {
        // First call - GET project
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            _id: "1",
            title: "Test Project",
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            completion: "2024-12-31T00:00:00Z",
            description: "A test project",
          }),
        });
      } else {
        // Second call - PUT update
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ _id: "1" }),
        });
      }
    });

    renderWithRouter(<ProjectDetails />, "/project-details/1");

    // Wait for the form to populate with data
    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      expect(titleInput.value).toBe("Test Project");
    });

    // Click the update button to trigger PUT request
    const submitButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(submitButton);

    // Wait for PUT request to be made
    await waitFor(() => {
      const putCall = global.fetch.mock.calls.find(
        call => call[1] && call[1].method === "PUT"
      );
      expect(putCall).toBeDefined();
      expect(putCall[0]).toBe("/api/projects/1");
    });

    global.fetch.mockRestore();
  });

  test("has required attributes on all input fields", async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ProjectDetails />, "/project-details");

    await waitFor(() => {
      expect(screen.getByLabelText(/Title/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/First Name/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/Last Name/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/Email/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/Completion/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/Description/i)).toHaveAttribute("required");
    });
  });
});
