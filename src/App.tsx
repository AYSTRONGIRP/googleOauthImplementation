import { useState } from 'react'
import './App.css'

// Interface for OAuth Parameters
interface OAuthParams {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  include_granted_scopes: string;
  state: string; 
}

function oauthSignIn(): void {
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create Form Element
  const form = document.createElement('form');
  form.method = 'GET';
  form.action = oauth2Endpoint;

  // OAuth Parameters (Replace with your actual values)
  const params: OAuthParams = {
    client_id: '687117743395-hbvmn1vdft2jloimo7o5jal7d3ct628c.apps.googleusercontent.com',
    redirect_uri: 'http://localhost:5173',
    response_type: 'token',
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
    include_granted_scopes: 'true',
    state: 'pass-through value', // Consider using a more secure state
  };

  // Add Parameters to Form
  for (const [key, value] of Object.entries(params)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  // Append and Submit Form
  document.body.appendChild(form);
  console.log(form)
  form.submit();
}

import CGauth from './components/cGauth';
function App() {
  const [count, setCount] = useState(0)

  
  return (
    <>
      <CGauth/>
    </>
  )
}

export default App
