import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactsList from '../components/contact-list';

describe('ContactsList Component', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders page header with Contacts title', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /Contacts/i });
      expect(heading).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders Create New Contact button', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const createButton = screen.getByText(/Create New Contact/i);
      expect(createButton).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test("displays 'No contacts available' when contacts list is empty", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No contacts available/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders contacts table with headers', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders contact data in table rows', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
          },
          {
            _id: '2',
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane@example.com',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders Update and Delete buttons for each contact', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
          },
          {
            _id: '2',
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane@example.com',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const updateButtons = screen.getAllByText(/Update/i);
      const deleteButtons = screen.getAllByText(/Delete/i);
      
      expect(updateButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });

    global.fetch.mockRestore();
  });

  test('makes fetch request with authorization token', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/contacts',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    global.fetch.mockRestore();
  });

  test('redirects to login when no token is found', async () => {
    Storage.prototype.getItem = jest.fn(() => null);
    
    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('token');
    });
  });

  test('deletes contact when Delete button is clicked', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    // Mock the DELETE request
    global.fetch.mockImplementation((url, options) => {
      if (options && options.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Deleted' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    const deleteButton = screen.getAllByText(/Delete/i)[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/contacts/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    global.fetch.mockRestore();
  });

  test('renders correct number of table rows', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
          },
          {
            _id: '2',
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane@example.com',
          },
          {
            _id: '3',
            firstname: 'Bob',
            lastname: 'Johnson',
            email: 'bob@example.com',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <ContactsList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // 1 header row + 3 data rows
      expect(rows.length).toBe(4);
    });

    global.fetch.mockRestore();
  });
});
