// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">Core Architecture</li><li class="chapter-item expanded "><a href="core/overview.html"><strong aria-hidden="true">1.</strong> Overview</a></li><li class="chapter-item expanded "><a href="core/block_manager.html"><strong aria-hidden="true">2.</strong> Block Manager</a></li><li class="chapter-item expanded "><a href="core/configuration.html"><strong aria-hidden="true">3.</strong> Configuration</a></li><li class="chapter-item expanded "><a href="core/storage.html"><strong aria-hidden="true">4.</strong> Storage System</a></li><li class="chapter-item expanded "><a href="core/block_pool.html"><strong aria-hidden="true">5.</strong> Block Pool</a></li><li class="chapter-item expanded "><a href="core/block_data.html"><strong aria-hidden="true">6.</strong> Block Data</a></li><li class="chapter-item expanded "><a href="core/layout.html"><strong aria-hidden="true">7.</strong> Layout Management</a></li><li class="chapter-item expanded "><a href="core/offload.html"><strong aria-hidden="true">8.</strong> Offloading</a></li><li class="chapter-item expanded "><a href="core/distributed.html"><strong aria-hidden="true">9.</strong> Distributed Management</a></li><li class="chapter-item expanded "><a href="core/events_metrics.html"><strong aria-hidden="true">10.</strong> Events and Metrics</a></li><li class="chapter-item expanded affix "><li class="part-title">Python Bindings</li><li class="chapter-item expanded "><a href="python/overview.html"><strong aria-hidden="true">11.</strong> Python API Overview</a></li><li class="chapter-item expanded "><a href="python/block.html"><strong aria-hidden="true">12.</strong> Block Interface</a></li><li class="chapter-item expanded "><a href="python/layer.html"><strong aria-hidden="true">13.</strong> Layer Interface</a></li><li class="chapter-item expanded "><a href="python/dlpack.html"><strong aria-hidden="true">14.</strong> DLPack Integration</a></li><li class="chapter-item expanded "><a href="python/vllm.html"><strong aria-hidden="true">15.</strong> vLLM Integration</a></li><li class="chapter-item expanded "><a href="python/block_list.html"><strong aria-hidden="true">16.</strong> Block Lists</a></li><li class="chapter-item expanded affix "><li class="part-title">Advanced Topics</li><li class="chapter-item expanded "><a href="advanced/performance.html"><strong aria-hidden="true">17.</strong> Performance Optimization</a></li><li class="chapter-item expanded "><a href="advanced/memory.html"><strong aria-hidden="true">18.</strong> Memory Management</a></li><li class="chapter-item expanded "><a href="advanced/errors.html"><strong aria-hidden="true">19.</strong> Error Handling</a></li><li class="chapter-item expanded "><a href="advanced/best_practices.html"><strong aria-hidden="true">20.</strong> Best Practices</a></li><li class="chapter-item expanded affix "><li class="part-title">API Reference</li><li class="chapter-item expanded "><a href="api/rust.html"><strong aria-hidden="true">21.</strong> Rust API Reference</a></li><li class="chapter-item expanded "><a href="api/python.html"><strong aria-hidden="true">22.</strong> Python API Reference</a></li><li class="chapter-item expanded "><a href="api/config.html"><strong aria-hidden="true">23.</strong> Configuration Reference</a></li><li class="chapter-item expanded affix "><li class="part-title">Examples</li><li class="chapter-item expanded "><a href="examples/basic_usage.html"><strong aria-hidden="true">24.</strong> Basic Usage</a></li><li class="chapter-item expanded "><a href="examples/advanced_usage.html"><strong aria-hidden="true">25.</strong> Advanced Usage</a></li><li class="chapter-item expanded "><a href="examples/vllm_integration.html"><strong aria-hidden="true">26.</strong> vLLM Integration</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
