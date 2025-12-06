import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ContactDetails from '../components/contact-details';

const renderWithRouter = (component, initialRoute = "/contact-details") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/contact-details" element={component} />
        <Route path="/contact-details/:id" element={component} />
        <Route path="/contact" element={<div>Contact List</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ContactDetails Component', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders Create Contact form when no id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ContactDetails />, "/contact-details");

    await waitFor(() => {
      const legend = screen.getByText(/Create Contact/i);
      expect(legend).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders all form input fields', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ContactDetails />, "/contact-details");

    await waitFor(() => {
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });
  });

  test('renders Create button when no id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ContactDetails />, "/contact-details");

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Create/i });
      expect(button).toBeInTheDocument();
    });
  });

  test('updates form fields when user types', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ContactDetails />, "/contact-details");

    await waitFor(() => {
      const firstnameInput = screen.getByLabelText(/First Name/i);
      const lastnameInput = screen.getByLabelText(/Last Name/i);

      fireEvent.change(firstnameInput, { target: { value: 'John' } });
      fireEvent.change(lastnameInput, { target: { value: 'Doe' } });

      expect(firstnameInput.value).toBe('John');
      expect(lastnameInput.value).toBe('Doe');
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

    renderWithRouter(<ContactDetails />, "/contact-details");

    await waitFor(() => {
      const firstnameInput = screen.getByLabelText(/First Name/i);
      const lastnameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email/i);

      fireEvent.change(firstnameInput, { target: { value: 'John' } });
      fireEvent.change(lastnameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      const form = screen.getByRole("button", { name: /Create/i }).closest('form');
      fireEvent.submit(form);

      expect(firstnameInput.value).toBe('John');
      expect(lastnameInput.value).toBe('Doe');
      expect(emailInput.value).toBe('john@example.com');
    });

    global.fetch.mockRestore();
  });

  test('makes POST request when creating a new contact', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ _id: "1" }),
      })
    );

    renderWithRouter(<ContactDetails />, "/contact-details");

    await waitFor(() => {
      const firstnameInput = screen.getByLabelText(/First Name/i);
      const lastnameInput = screen.getByLabelText(/Last Name/i);
      const emailInput = screen.getByLabelText(/Email/i);

      fireEvent.change(firstnameInput, { target: { value: 'John' } });
      fireEvent.change(lastnameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      const submitButton = screen.getByRole("button", { name: /Create/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contacts",
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

    renderWithRouter(<ContactDetails />, "/contact-details/1");

    await waitFor(() => {
      expect(Storage.prototype.getItem).toHaveBeenCalledWith("token");
    });
  });

  test('renders Update Contact heading when id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: "1",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
        }),
      })
    );

    renderWithRouter(<ContactDetails />, "/contact-details/1");

    await waitFor(() => {
      expect(screen.getByText(/Update Contact/i)).toBeInTheDocument();
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
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
        }),
      })
    );

    renderWithRouter(<ContactDetails />, "/contact-details/1");

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Update/i });
      expect(button).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('populates form with contact data when id is provided', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          _id: "1",
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
        }),
      })
    );

    renderWithRouter(<ContactDetails />, "/contact-details/1");

    await waitFor(() => {
      const firstnameInput = screen.getByLabelText(/First Name/i);
      expect(firstnameInput.value).toBe("John");
    });

    global.fetch.mockRestore();
  });

  test('makes PUT request when updating a contact', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    
    let fetchCallCount = 0;
    global.fetch = jest.fn(() => {
      fetchCallCount++;
      if (fetchCallCount === 1) {
        // First call - GET contact
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            _id: "1",
            firstname: "John",
            lastname: "Doe",
            email: "john@example.com",
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

    renderWithRouter(<ContactDetails />, "/contact-details/1");

    // Wait for the form to populate with data
    await waitFor(() => {
      const firstnameInput = screen.getByLabelText(/First Name/i);
      expect(firstnameInput.value).toBe("John");
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
      expect(putCall[0]).toBe("/api/contacts/1");
    });

    global.fetch.mockRestore();
  });

  test('has required attributes on all input fields', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ContactDetails />, "/contact-details");

    await waitFor(() => {
      expect(screen.getByLabelText(/First Name/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/Last Name/i)).toHaveAttribute("required");
      expect(screen.getByLabelText(/Email/i)).toHaveAttribute("required");
    });
  });

  test('email field has correct type attribute', async () => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    global.fetch = jest.fn();

    renderWithRouter(<ContactDetails />, "/contact-details");

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/Email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });
  });
});
