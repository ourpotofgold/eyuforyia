/**
 * Eyuforyia / Quetiemals Cookie Consent
 * Gates AdSense until user accepts.
 */
(function () {
  var CONSENT_KEY = 'eyuforyia_cookie_consent';
  var PUB_ID = 'ca-pub-7932735753046865';

  function hasConsent() {
    try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch (e) { return false; }
  }
  function setConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {}
  }
  function loadAdSense() {
    if (window.__eyuAdsLoaded) return;
    window.__eyuAdsLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + PUB_ID;
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }
  function hideBanner() {
    var el = document.getElementById('eyu-cookie-banner');
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 280);
  }
  function accept() { setConsent('accepted'); hideBanner(); loadAdSense(); }
  function reject() { setConsent('rejected'); hideBanner(); }

  function showBanner() {
    if (document.getElementById('eyu-cookie-banner')) return;
    var css = document.createElement('style');
    css.textContent = [
      '#eyu-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:99999;',
      'background:#0f0d1a;border-top:1px solid rgba(153,102,255,0.3);',
      'padding:16px 18px;font-family:"Exo 2",system-ui,sans-serif;',
      'color:#e2ddf5;box-shadow:0 -8px 32px rgba(0,0,0,0.45);',
      'transition:opacity 0.28s ease,transform 0.28s ease;opacity:1;transform:translateY(0);}',
      '#eyu-cookie-banner .cc-inner{max-width:760px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:14px;}',
      '#eyu-cookie-banner .cc-text{flex:1;min-width:220px;font-size:13px;line-height:1.55;color:#9893b8;}',
      '#eyu-cookie-banner .cc-text a{color:#ff9de2;text-decoration:none;}',
      '#eyu-cookie-banner .cc-text a:hover{text-decoration:underline;}',
      '#eyu-cookie-banner .cc-actions{display:flex;gap:10px;flex-shrink:0;}',
      '#eyu-cookie-banner .cc-btn{border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}',
      '#eyu-cookie-banner .cc-accept{background:#9966ff;color:#fff;}',
      '#eyu-cookie-banner .cc-accept:hover{background:#b388ff;}',
      '#eyu-cookie-banner .cc-reject{background:transparent;color:#9893b8;border:1px solid rgba(255,255,255,0.12);}',
      '#eyu-cookie-banner .cc-reject:hover{border-color:rgba(255,255,255,0.25);color:#e2ddf5;}',
      '@media(max-width:480px){#eyu-cookie-banner .cc-inner{flex-direction:column;align-items:stretch;}',
      '#eyu-cookie-banner .cc-actions{width:100%;}#eyu-cookie-banner .cc-btn{flex:1;text-align:center;}}'
    ].join('');
    document.head.appendChild(css);

    var banner = document.createElement('div');
    banner.id = 'eyu-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cc-inner">' +
        '<div class="cc-text">' +
          'We use cookies for essential site features and, with your consent, advertising (Google AdSense). ' +
          'See our <a href="' + (/(?:^|[\/\])HTML[\/\][^\/\]+\.html$/i.test(location.pathname) ? 'privacy.html' : 'HTML/privacy.html') + '">Privacy Policy</a>.' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button type="button" class="cc-btn cc-reject" id="cc-reject">Reject</button>' +
          '<button type="button" class="cc-btn cc-accept" id="cc-accept">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    document.getElementById('cc-accept').addEventListener('click', accept);
    document.getElementById('cc-reject').addEventListener('click', reject);
  }

  function init() {
    if (hasConsent()) { loadAdSense(); return; }
    try { if (localStorage.getItem(CONSENT_KEY) === 'rejected') return; } catch (e) {}
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
  init();
})();
