
var YOUR_CLIENT_ID:string = '687117743395-hbvmn1vdft2jloimo7o5jal7d3ct628c.apps.googleusercontent.com';
var YOUR_REDIRECT_URI:string = 'http://localhost:5173';
    
      // Parse query string to see if page request is coming from OAuth 2.0 server.
      var fragmentString = location.hash.substring(1);
      var params :{[key:string]:string}= {};
      var regex = /([^&=]+)=([^&]*)/g, m;
      while (m = regex.exec(fragmentString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      if (Object.keys(params).length > 0 && params['state']) {
        if (params['state'] == localStorage.getItem('state')) {
          localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
    
          trySampleRequest();
        } else {
          console.log('State mismatch. Possible CSRF attack');
        }
      }
    
      // Function to generate a random state value
      function generateCryptoRandomState() {
        const randomValues = new Uint32Array(2);
        window.crypto.getRandomValues(randomValues);
        
        const randomChars = String.fromCharCode(...randomValues);
        // Encode as UTF-8  
        const utf8Encoder = new TextEncoder();
        const utf8Array = utf8Encoder.encode(
          String.fromCharCode(...randomValues)
        );
    
        // Base64 encode the UTF-8 data
        return btoa(String.fromCharCode(...utf8Array))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      }
      
      interface OAuth2Params {
        access_token?: string;
        [key: string]: any;
      }
      // If there's an access token, try an API request.
      // Otherwise, start OAuth 2.0 flow.
      function trySampleRequest() {
        var params:OAuth2Params|null = JSON.parse(localStorage.getItem('oauth2-test-params') || 'null');
        if (params && params['access_token']) {
          console.log('Access Token: ' + params['access_token']);
          var xhr = new XMLHttpRequest();
          xhr.open('GET',
              'https://www.googleapis.com/drive/v3/about?fields=user&' +
              'access_token=' + params['access_token']);
          xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4 && xhr.status === 200) {
              console.log(xhr.response);
            } else if (xhr.readyState === 4 && xhr.status === 401) {
              // Token invalid, so prompt for user permission.
              oauth2SignIn();
            }
          };
          xhr.send(null);
        } else {
          oauth2SignIn();
        }
      }
    
      /*
       * Create form to request access token from Google's OAuth 2.0 server.
       */
      function oauth2SignIn() {
        // create random state value and store in local storage
        var state = generateCryptoRandomState();
        localStorage.setItem('state', state);
    
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    
        // Create element to open OAuth 2.0 endpoint in new window.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);
    
        // Parameters to pass to OAuth 2.0 endpoint.
        params = {'client_id': YOUR_CLIENT_ID,
                      'redirect_uri': YOUR_REDIRECT_URI,
                      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
                      'state': state,
                      'include_granted_scopes': 'true',
                      'response_type': 'token'};
    
        // Add form parameters as hidden input values.
        for (const p in params) {
            if (params.hasOwnProperty(p)) {
          var input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', p);
          input.setAttribute('value', params[p]);
          form.appendChild(input);
            }
        }
    
        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
      }
const cGauth = () => {

  return (
    <div>
      <button onClick={trySampleRequest}>Google Auth</button>
    </div>
  )
}

export default cGauth
