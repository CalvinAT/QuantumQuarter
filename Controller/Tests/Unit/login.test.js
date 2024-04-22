const { login } = require('../../handlers/loginHandler.js'); // Import the login function from your module
const bcrypt = require('bcrypt');

// Mocking the dependencies
jest.mock('../../dbConnection.js', () => ({
  connectToMySQL: jest.fn(() => ({
    query: jest.fn().mockImplementation((query, values) => {
      if (query === 'SELECT * FROM employee WHERE email = ?' && values && values[0] === 'suep@gmail.com') {
        return [
          {
            id: 1,
            name: 'Suep',
            email: 'suep@gmail.com',
            password: '$2b$10$N2ZoQeUfX.HCAthULSO2Mu.Wfrr6sSbcvuG8yc8NjH.VEYlu/XvUa', // hashed password for 'suep123'
            type: 0 
          }
        ];
      } else if (query === 'SELECT * FROM employee WHERE email = ?' && values && values[0] === 'asep@gmail.com') {
        return [
          {
            id: 2,
            name: 'Asep',
            email: 'asep@gmail.com',
            password: '$2b$10$X443bOKecNICZsttyjyNveIg6ZXma1ha/1OWVXb7O8fxiUy2AsNRK', // hashed password for 'asep123'
            type: 1 
          }
        ];
      } else {
        return []; // Return empty array for other queries or values
      }
    })
  }))
}));

jest.mock('../../handlers/authenticationHandler.js', () => ({
  generateToken: jest.fn(() => 'mocked-token')
}));

describe('login function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      }),
      header: jest.fn()
    };
  });

  it('should successfully log in with admin credentials', async () => {
    req.body.email = 'suep@gmail.com';
    req.body.password = 'suep123';

    await login(req, res);

    expect(res.header).toHaveBeenCalledWith('Authorization', 'Bearer mocked-token');
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: 'Login successful',
      result: {
        token: 'mocked-token',
        id: 1,
        name: 'Suep',
        email: 'suep@gmail.com',
        type: 0
      }
    });
  });

  it('should successfully log in with agent credentials', async () => {
    req.body.email = 'asep@gmail.com';
    req.body.password = 'asep123';

    await login(req, res);

    expect(res.header).toHaveBeenCalledWith('Authorization', 'Bearer mocked-token');
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: 'Login successful',
      result: {
        token: 'mocked-token',
        id: 2,
        name: 'Asep',
        email: 'asep@gmail.com',
        type: 1
      }
    });
  });

  it('should return 401 if email is not found', async () => {
    req.body.email = 'invalid@gmail.com';
    req.body.password = 'adminpassword';

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      message: 'Error: Invalid credentials'
    });
  });

  it('should return 401 if password is incorrect', async () => {
    req.body.email = 'suep@gmail.com';
    req.body.password = 'invalidpassword';

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Error: Invalid credentials',
      status: 401,
    });
  });
  
});
