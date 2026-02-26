/*
   Global 'Spin & Win' Promotion Logic
   Injects a premium overlay and a navigation link on all pages.
*/

(function() {
    // 1. Inject the Navigation Link
    function injectNavLink() {
        const navBar = document.querySelector('.navbar-nav');
        if (navBar && !document.querySelector('.nav-spin-wheel')) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `<a class="nav-link nav-spin-wheel" href="https://tinyfont.me/spin-the-wheel-names/?utm_source=stickmanclimb&utm_medium=nav&utm_campaign=global" target="_blank">🎡 Spin Wheel</a>`;
            navBar.insertBefore(li, navBar.firstChild);
        }
    }

    // 2. Inject the Promotion Overlay
    function injectOverlay() {
        if (document.getElementById('globalSpinPromo')) return;

        const overlay = document.createElement('div');
        overlay.id = 'globalSpinPromo';
        overlay.className = 'spin-promo-overlay';
        
        overlay.innerHTML = `
            <div class="spin-promo-content">
                <div class="promo-badge">Featured Fun</div>
                <h2 class="spin-promo-title">Take a Break & Spin the Wheel!</h2>
                <div class="spin-wheel-grid">
                    <a href="https://tinyfont.me/spin-the-wheel-emoji/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">🤩</span>
                        <span class="label">Emoji Wheel</span>
                    </a>
                    <a href="https://tinyfont.me/spin-the-wheel-names/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">👤</span>
                        <span class="label">Name Wheel</span>
                    </a>
                    <a href="https://tinyfont.me/spin-the-wheel-images/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">🖼️</span>
                        <span class="label">Image Wheel</span>
                    </a>
                    <a href="https://tinyfont.me/spin-the-wheel-yes-no/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">✅</span>
                        <span class="label">Yes/No Hub</span>
                    </a>
                    <a href="https://tinyfont.me/spin-the-wheel-nfl/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">🏈</span>
                        <span class="label">NFL Picker</span>
                    </a>
                    <a href="https://tinyfont.me/spin-the-wheel-nba/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">🏀</span>
                        <span class="label">NBA Team</span>
                    </a>
                    <a href="https://tinyfont.me/spin-the-wheel-color/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">🌈</span>
                        <span class="label">Color Wheel</span>
                    </a>
                    <a href="https://tinyfont.me/spin-the-wheel-dinner/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">🍕</span>
                        <span class="label">What to Eat</span>
                    </a>
                    <a href="https://tinyfont.me/spin-the-wheel-alphabet/?utm_source=stickmanclimb&utm_medium=global_overlay" target="_blank" class="spin-card">
                        <span class="icon">🔤</span>
                        <span class="label">Alphabet</span>
                    </a>
                </div>
                <button class="continue-btn" onclick="document.getElementById('globalSpinPromo').style.display='none'">CONTINUE TO GAME</button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Logic: Show overlay on first load per session
        if (!sessionStorage.getItem('spinPromoSeen')) {
            setTimeout(() => {
                overlay.style.display = 'flex';
                sessionStorage.setItem('spinPromoSeen', 'true');
            }, 1000); // 1 second delay
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectNavLink();
            injectOverlay();
        });
    } else {
        injectNavLink();
        injectOverlay();
    }
})();

// Original Search Logic (Retained for compatibility)
function search_animal() {
  let input = document.getElementById("searchbar").value;
  if (!input) return;
  input = input.toLowerCase();
  let x = document.getElementsByClassName("animals");

  for (let i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(input)) {
      x[i].style.display = "none";
    } else {
      x[i].style.display = "block";
    }
  }
}