// Normalize explicit index.html visits while preserving query strings and anchors.
if (/^https?:$/.test(location.protocol) && location.pathname.endsWith('/index.html')) {
    location.replace(location.pathname.slice(0, -'index.html'.length) + location.search + location.hash);
}
