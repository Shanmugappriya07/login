/**
 * Shared auth helper to make login.html <-> signup.html swap smoothly
 * - Place this file in js/auth.js
 * - Both HTML files reference the same script
 *
 * Behavior:
 * - Clicking the "Create one" link on login page fetches signup.html,
 *   extracts the right panel (.right) and replaces the current page's right panel,
 *   then triggers the .card.swap animation so panels swap.
 * - Vice versa: clicking "Login" on signup page fetches login.html and swaps back.
 *
 * Notes:
 * - This uses relative paths: 'signup.html' and 'login.html' — keep files at same folder level.
 * - After injecting the new right panel HTML, the script re-binds the internal links and form handlers.
 */

(function(){
  const card = document.getElementById('cardBox');

  // Helper to fetch target page and extract .right innerHTML
  async function fetchRightPanel(url){
    try{
      const res = await fetch(url, {cache: "no-store"});
      if(!res.ok) throw new Error('Fetch failed: ' + res.status);
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const right = doc.querySelector('.right');
      return right ? right.innerHTML : null;
    }catch(err){
      console.error('Failed to fetch', url, err);
      return null;
    }
  }

  // Replace the current right panel content with HTML, and rebind links/forms
  function injectRight(html, showSignup){
    const rightEl = document.querySelector('.right');
    if(!rightEl) return;
    rightEl.innerHTML = html;

    // set swap state
    if(showSignup) card.classList.add('swap'); else card.classList.remove('swap');

    // re-bind internal links/buttons inside the injected panel
    bindPanelControls();
  }

  // Bind links and forms in the current .right panel
  function bindPanelControls(){
    const linkToSignup = document.getElementById('linkToSignup');
    const linkToLogin = document.getElementById('linkToLogin');

    if(linkToSignup){
      linkToSignup.addEventListener('click', async (e) => {
        e.preventDefault();
        const html = await fetchRightPanel('signup.html');
        if(html) injectRight(html, true);
      });
    }

    if(linkToLogin){
      linkToLogin.addEventListener('click', async (e) => {
        e.preventDefault();
        const html = await fetchRightPanel('login.html');
        if(html) injectRight(html, false);
      });
    }

    // Bind login form if present (preserve IDs)
    const loginForm = document.getElementById('loginForm');
    if(loginForm){
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Hook your actual auth logic here.
        // Example: collect values and send to backend:
        const email = document.getElementById('email') ? document.getElementById('email').value : '';
        const password = document.getElementById('password') ? document.getElementById('password').value : '';
        const messageEl = document.getElementById('message');
        // simple demo validation:
        if(!email || !password){
          if(messageEl) messageEl.textContent = 'Please enter email and password.';
          return;
        }
        if(messageEl) messageEl.textContent = '';
        // TODO: replace with fetch to your login endpoint
        console.log('Login submit', {email, password});
        if(messageEl) messageEl.textContent = 'Logging in... (demo)';
        // Simulate success
        setTimeout(()=>{ if(messageEl) messageEl.textContent = 'Logged in (demo)'; }, 800);
      });
    }

    // Bind signup form if present
    const signupForm = document.getElementById('signupForm');
    if(signupForm){
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // collect signup fields; IDs used in signup.html: firstName, lastName, suEmail, suPassword
        const firstName = document.getElementById('firstName') ? document.getElementById('firstName').value : '';
        const lastName = document.getElementById('lastName') ? document.getElementById('lastName').value : '';
        const suEmail = document.getElementById('suEmail') ? document.getElementById('suEmail').value : '';
        const suPassword = document.getElementById('suPassword') ? document.getElementById('suPassword').value : '';
        console.log('Signup submit', {firstName,lastName,suEmail});
        // TODO: replace with your signup endpoint
        alert('Signup submitted (demo). Hook your signup API here.');
      });
    }
  }

  // On initial load, bind controls for the existing page's right panel
  document.addEventListener('DOMContentLoaded', () => {
    bindPanelControls();
  });
})();
