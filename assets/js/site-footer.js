class SiteFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                .site-footer {
                    background: radial-gradient(circle at top left, #f8fafc, #f1f5f9);
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    padding: 3rem 0;
                    margin-top: 4rem;
                    position: relative;
                    overflow: hidden;
                }

                .site-footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 4px;
                    background: linear-gradient(90deg, #3b82f6, #60a5fa);
                    border-radius: 0 0 4px 4px;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .footer-content {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                }

                .footer-heart {
                    display: inline-block;
                    animation: heartbeat 1.5s ease-in-out infinite;
                    color: #ef4444;
                }

                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }

                .footer-text {
                    color: #64748b;
                    font-size: 0.9rem;
                    font-weight: 500;
                    margin: 0;
                    letter-spacing: 0.01em;
                    transition: all 0.3s ease;
                }

                .footer-text:hover {
                    color: #3b82f6;
                }

                .footer-decorative-dots {
                    position: absolute;
                    top: 2rem;
                    right: 10%;
                    display: flex;
                    gap: 8px;
                    opacity: 0.3;
                }

                .footer-decorative-dots::before,
                .footer-decorative-dots::after {
                    content: '';
                    width: 8px;
                    height: 8px;
                    background: #3b82f6;
                    border-radius: 50%;
                }

                @media (max-width: 768px) {
                    .footer-decorative-dots {
                        display: none;
                    }
                }
            </style>

            <footer class="site-footer">
                <div class="container">
                    <div class="footer-content">
                        <p class="footer-text">
                            Crafted with <span class="footer-heart">❤️</span> by Kamran Gasimov
                        </p>
                    </div>
                </div>
                <div class="footer-decorative-dots"></div>
            </footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);
