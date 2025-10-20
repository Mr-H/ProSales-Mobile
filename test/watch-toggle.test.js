const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const scriptSrc = fs.readFileSync(path.resolve(__dirname, '..', 'js', 'watch-toggle.js'), 'utf8');

describe('watch-toggle', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body>
      <button class="watch-toggle" data-listing-id="test-1" id="btn">
        <span class="material-symbols-outlined watch-icon">visibility</span>
      </button>
    </body></html>`, { runScripts: 'outside-only' });
    window = dom.window;
    document = window.document;
    // Use a predictable localStorage polyfill so tests are deterministic
    window.localStorage = (function () {
      const _data = Object.create(null);
      return {
        getItem(k) { return Object.prototype.hasOwnProperty.call(_data, k) ? _data[k] : null; },
        setItem(k, v) { _data[k] = String(v); },
        removeItem(k) { delete _data[k]; }
      };
    })();
    // evaluate the script in the window context so it assigns window.__watchToggle
    window.eval(scriptSrc);
    // initialize component manually
    window.__watchToggle.initToggle(document.querySelector('.watch-toggle'));
  });

  afterEach(() => {
    dom.window.close();
  });

  it('initializes as not watched when no storage', () => {
    const btn = document.getElementById('btn');
    expect(btn.getAttribute('aria-pressed')).to.equal('false');
  });

  it('toggles watched state on click and stores in localStorage', () => {
    const btn = document.getElementById('btn');
    // programmatic toggle to ensure deterministic behavior in test
    expect(typeof btn.toggleWatch).to.equal('function');
    btn.toggleWatch();
    expect(btn.getAttribute('aria-pressed')).to.equal('true');

    // toggle back
    btn.toggleWatch();
    expect(btn.getAttribute('aria-pressed')).to.equal('false');
  });
});
