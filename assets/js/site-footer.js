class SiteFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                .site-footer {
                    text-align: center;
                    color: #64748b;
                    background: #ffffff;
                    border-top: 1px solid #e2e8f0;
                    padding: 3rem 0;
                    margin-top: 3rem;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 1rem 0;
                    display: inline-flex;
                    gap: 1.5rem;
                }

                .footer-links li {
                    display: inline-block;
                }

                .footer-links a {
                    color: #1e293b;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.3s ease;
                }

                .footer-links a:hover {
                    color: #3b82f6;
                }

                .footer-credit {
                    margin: 0;
                    font-size: 0.875rem;
                }
            </style>

            <footer class="site-footer">
                <div class="container">
                    <ul class="footer-links">
                        <li><a href="/">Projects</a></li>
                    </ul>
                    <p class="footer-credit">Made with ❤️ by Kamran Gasimov</p>
                </div>
            </footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);
