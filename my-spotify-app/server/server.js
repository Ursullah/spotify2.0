import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { stringify } from 'querystring';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

// Spotify credentials stored in environment variables for security
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

// Function to generate a random string for the 'state' parameter (used for security against CSRF)
const generateRandomString = length => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Route that initiates the Spotify login flow
app.get('/login', (req, res) => {
  const state = generateRandomString(16); // Generate a unique state value
  const scope = 'user-read-private user-read-email playlist-read-private user-top-read'; // Scopes define what data the app can access

  // Build the authorization URL with query parameters
  const params = stringify({
    response_type: 'code', // Spotify will return an authorization code
    client_id,
    scope,
    redirect_uri,
    state,
  });

  // Redirect the user to Spotify's authorization page
  res.redirect('https://accounts.spotify.com/authorize?' + params);
});

// Spotify redirects here after user approves or denies access
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;   // Extract authorization code
  const state = req.query.state || null; // Extract returned state

  // Basic validation to ensure code and state are present
  if (!code || !state) {
    return res.redirect('/#' + stringify({ error: 'state_mismatch' }));
  }

  // Prepare POST request to exchange the authorization code for access and refresh tokens
  try {
    const response = await axios.post ('https://accounts.spotify.com/api/token',
        stringify({
            code,
            redirect_uri,
            grant_type: 'authorization_code',
        }),
        {
            headers: {
                'Authorization' : 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }
    );
    const { access_token, refresh_token } = response.data; // Extract tokens from response

    res.redirect(`http://localhost:5173/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.redirect('/#' + stringify({ error: 'invalid_token' }));
  }
});

app.get('/refresh_token', async (req, res) => {
  const refresh_token = req.query.refresh_token;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      stringify({
        grant_type: 'refresh_token',
        refresh_token,
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json(response.data); // Contains new access_token (and optionally refresh_token)
  } catch (err) {
    res.status(400).json({ error: 'Unable to refresh token' });
  }
});

// Route for testing server
app.get('/', (req, res) => {
  res.send('Spotify auth server is running.');
});
// Start the Express server
app.listen(8888, () => {
  console.log('Server running on http://127.0.0.1:8888');
});



// The following block is obsolete and should be removed because token exchange is already handled above using axios.
//   // Send request to get the tokens
//   post(authOptions, (error, response, body) => {
//     if (!error && response.statusCode === 200) {
//       const access_token = body.access_token;     // Token used to access Spotify APIs
//       const refresh_token = body.refresh_token;   // Token used to get a new access_token when it expires

//       // Redirect user to the frontend dashboard with tokens passed as query parameters
//       res.redirect(`http://localhost:5173/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
//     } else {
//       // Handle error during token exchange
//       res.redirect('/#' + stringify({ error: 'invalid_token' }));
//     }
//   });yes