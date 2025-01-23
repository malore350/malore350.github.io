class Footer extends HTMLElement {
      constructor() {
          super();
      }
  
      connectedCallback() {
          this.innerHTML = `
              <footer class="text-center text-muted bg-body" data-bs-theme="dark">
                  <div class="container py-4 py-lg-5">
                      <ul class="list-inline">
                          <li class="list-inline-item me-4"><a class="link-light" href="/">Projects</a></li>
                          <li class="list-inline-item me-4"><a class="link-light" href="privacy.html">Privacy</a></li>
                          <li class="list-inline-item"><a class="link-light" href="hire-me.html">Hire me</a></li>
                      </ul>
                      <p class="mb-0">Made with ❤️ by Kamran Gasimov</p>
                  </div>
              </footer>
          `;
      }
  }
  
  customElements.define('site-footer', Footer);