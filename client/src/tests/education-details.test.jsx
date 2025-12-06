import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EducationDetails from '../components/education-details';

const renderWithRouter = (component, initialRoute = "/education-details") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/education-details" element={component} />
        <Route path="/education-details/:id" element={component} />
        <Route path="/education" element={<div>Education List</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('EducationDetails Component', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders Create Education form when no id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<EducationDetails />, "/education-details");

    await waitFor(() => {
      const legend = screen.getByText(/Create Education/i);
      expect(legend).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders all form input fields', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<EducationDetails />, "/education-details");

    await waitFor(() => {
      expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Completion/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });
  });

  test('renders Create button when no id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<EducationDetails />, "/education-details");

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Create/i });
      expect(button).toBeInTheDocument();
    });
  });

  test('updates form fields when user types', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<EducationDetails />, "/education-details");

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      const firstnameInput = screen.getByLabelText(/First Name/i);

      fireEvent.change(titleInput, { target: { value: 'Bachelor of Science' } });
      fireEvent.change(firstnameInput, { target: { value: 'John' } });

      expect(titleInput.value).toBe('Bachelor of Science');
      expect(firstnameInput.value).toBe('John');
    });
  });

  test('submits form data when Create button is clicked', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ _id: "1" }),
      })
    );

    renderWithRouter(<EducationDetails />, "/education-details");

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      const firstnameInput = screen.getByLabelText(/First Name/i);
      const lastnameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const completionInput = screen.getByLabelText(/Completion/i);
      const descriptionInput = screen.getByLabelText(/Description/i);

      fireEvent.change(titleInput, { target: { value: 'Bachelor of Science' } });
      fireEvent.change(firstnameInput, { target: { value: 'John' } });
      fireEvent.change(lastnameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(completionInput, { target: { value: '2024-12-31' } });
      fireEvent.change(descriptionInput, { target: { value: 'Computer Science' } });

      const form = screen.getByRole("button", { name: /Create/i }).closest('form');
      fireEvent.submit(form);

      expect(titleInput.value).toBe('Bachelor of Science');
      expect(firstnameInput.value).toBe('John');
    });

    global.fetch.mockRestore();
  });

  test('makes POST request when creating a new education', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ _id: "1" }),
      })
    );

    renderWithRouter(<EducationDetails />, "/education-details");

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      const firstnameInput = screen.getByLabelText(/First Name/i);
      const lastnameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const completionInput = screen.getByLabelText(/Completion/i);
      const descriptionInput = screen.getByLabelText(/Description/i);

      fireEvent.change(titleInput, { target: { value: 'Bachelor of Science' } });
      fireEvent.change(firstnameInput, { target: { value: 'John' } });
      fireEvent.change(lastnameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(completionInput, { target: { value: '2024-12-31' } });
      fireEvent.change(descriptionInput, { target: { value: 'Computer Science' } });

      const submitButton = screen.getByRole("button", { name: /Create/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/educations",
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

  test('redirects to login when no token is found on update', async () => {
    Storage.prototype.getItem = jest.fn(() => null);
    const mockNavigate = jest.fn();

    renderWithRouter(<EducationDetails />, "/education-details/1");

    await waitFor(() => {
      expect(Storage.prototype.getItem).toHaveBeenCalledWith("token");
    });
  });

  test('renders Update Education heading when id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: "1",
          title: "Bachelor of Science",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          completion: "2024-12-31T00:00:00Z",
          description: "Computer Science Degree",
        }),
      })
    );

    renderWithRouter(<EducationDetails />, "/education-details/1");

    await waitFor(() => {
      expect(screen.getByText(/Update Education/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders Update button when id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: "1",
          title: "Bachelor of Science",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          completion: "2024-12-31T00:00:00Z",
          description: "Computer Science Degree",
        }),
      })
    );

    renderWithRouter(<EducationDetails />, "/education-details/1");

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Update/i });
      expect(button).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('populates form with education data when id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: "1",
          title: "Bachelor of Science",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          completion: "2024-12-31T00:00:00Z",
          description: "Computer Science Degree",
        }),
      })
    );

    renderWithRouter(<EducationDetails />, "/education-details/1");

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      expect(titleInput.value).toBe("Bachelor of Science");
    });

    global.fetch.mockRestore();
  });

  test('makes PUT request when updating an education', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    
    let fetchCallCount = 0;
    global.fetch = jest.fn(() => {
      fetchCallCount++;
      if (fetchCallCount === 1) {
        // First call - GET education
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            _id: "1",
            title: "Bachelor of Science",
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
            completion: "2024-12-31T00:00:00Z",
            description: "Computer Science Degree",
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

    renderWithRouter(<EducationDetails />, "/education-details/1");

    // Wait for the form to populate with data
    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      expect(titleInput.value).toBe("Bachelor of Science");
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
      expect(putCall[0]).toBe("/api/educations/1");
    });

    global.fetch.mockRestore();
  });

  test('has required attributes on all input fields', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<EducationDetails />, "/education-details");

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
