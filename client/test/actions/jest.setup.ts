import { config } from 'dotenv';
config({ path: '.env.test' });

// *Optional: clear mocks if you mock e.g. cookies()
beforeEach(() => {
  jest.clearAllMocks();
});

/// 🔧 What mocks actually do
/// When you create a mock function like:

/// const fn = jest.fn();
/// Jest records every call to that function:


/// fn('a');
/// fn('b');
/// console.log(fn.mock.calls); // → [['a'], ['b']]
/// This history is preserved across tests unless you clear it.

/// 🧼 What jest.clearAllMocks() does
/// It resets the call history of all mocks: