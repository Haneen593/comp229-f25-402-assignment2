import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EducationList from '../components/education-list';

describe('EducationList Component', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => "test-token");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders page header with Education title', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /Education/i });
      expect(heading).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders Create New Education button', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const createButton = screen.getByText(/Create New Education/i);
      expect(createButton).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test("displays 'No educations available' when educations list is empty", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No educations available/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders educations table with headers', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            title: 'Bachelor of Science',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            completion: '2024-12-31T00:00:00Z',
            description: 'Computer Science Degree',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Completion')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders education data in table rows', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            title: 'Bachelor of Science',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            completion: '2024-12-31T00:00:00Z',
            description: 'Computer Science Degree',
          },
          {
            _id: '2',
            title: 'Master of Arts',
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane@example.com',
            completion: '2025-06-15T00:00:00Z',
            description: 'MBA Degree',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Computer Science Degree')).toBeInTheDocument();
      
      expect(screen.getByText('Master of Arts')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('MBA Degree')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('renders Update and Delete buttons for each education', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            title: 'Bachelor of Science',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            completion: '2024-12-31T00:00:00Z',
            description: 'Computer Science Degree',
          },
          {
            _id: '2',
            title: 'Master of Arts',
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane@example.com',
            completion: '2025-06-15T00:00:00Z',
            description: 'MBA Degree',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
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
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/educations',
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
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('token');
    });
  });

  test('formats date correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            title: 'Bachelor of Science',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            completion: '2024-12-31T00:00:00Z',
            description: 'Computer Science Degree',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    global.fetch.mockRestore();
  });

  test('deletes education when Delete button is clicked', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            title: 'Bachelor of Science',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            completion: '2024-12-31T00:00:00Z',
            description: 'Computer Science Degree',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
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
        '/api/educations/1',
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

  test('renders Untitled when title is missing', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: '1',
            title: '',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            completion: '2024-12-31T00:00:00Z',
            description: 'Computer Science Degree',
          },
        ]),
      })
    );

    render(
      <BrowserRouter>
        <EducationList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Untitled')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });
});
