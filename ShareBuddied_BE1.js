const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = 'your_secret_key';

app.use(bodyParser.json());

// Dummy user database
const users = [
  { id: 1, username: 'user1', password: 'password1', mfaEnabled: true }
];

// Dummy MFA secret keys
const mfaSecrets = {
  'user1': 'mfa_secret_key_1'
};

// Authenticate user with MFA
app.post('/login', (req, res) => {
  const { username, password, mfaCode } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (user.mfaEnabled) {
    const secretKey = mfaSecrets[user.username];
    const verified = verifyMFACode(mfaCode, secretKey);

    if (!verified) {
      return res.status(401).json({ error: 'Invalid MFA code' });
    }
  }

  // Authentication successful, generate JWT token
  const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// Verify MFA code
function verifyMFACode(mfaCode, secretKey) {
  // Implement your MFA verification logic here (e.g., using TOTP or other methods)
  // For simplicity, let's assume a hardcoded MFA secret key
  const expectedCode = '123456'; // Hardcoded MFA code for demo purposes
  return mfaCode === expectedCode;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
