"""Regression checks for the repository validator; fixtures never alter the site."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('check_site', Path(__file__).resolve().parents[1] / 'scripts/check_site.py')
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)

class SiteCheckTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='portfolio-check-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.write('.nojekyll', '')
        self.write('index.html', '<title>Home</title><link rel="canonical" href="https://jinsung4069.github.io/"><img src="/image.svg">')
        self.write('image.svg', '<svg/>')
        self.write('404.html', '<title>Not found</title><a href="/">Home</a>')
        self.write('sitemap.xml', '<urlset><url><loc>https://jinsung4069.github.io/</loc></url></urlset>')

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')

    def errors(self):
        return checker.check_site(self.root.resolve())['errors']

    def test_valid_site(self):
        self.assertEqual(self.errors(), [])

    def test_missing_asset(self):
        (self.root / 'image.svg').unlink()
        self.assertTrue(any('missing local target /image.svg' in e for e in self.errors()))

    def test_redirect_requires_query_and_fragment(self):
        self.write('old.html', '<title>Moved</title><script>location.replace("/")</script>')
        self.assertTrue(any('redirect must preserve query and fragment' in e for e in self.errors()))

    def test_internal_html_link_is_rejected(self):
        p = self.root / 'index.html'
        p.write_text(p.read_text() + '<a href="/index.html">Home</a>', encoding='utf-8')
        self.assertTrue(any('link should use a folder URL' in e for e in self.errors()))

if __name__ == '__main__':
    unittest.main()
