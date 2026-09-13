"""Regression checks for the repository validator; fixtures never alter the site."""
import hashlib
import importlib.util
import json
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
        self.write('alligator-chess/index.html', '<title>Game</title><link rel="canonical" href="https://jinsung4069.github.io/alligator-chess/">')
        names = ['src/game.ts', 'public/icon.svg', 'scripts/copy-export.mjs', 'package.json', 'package-lock.json', 'next.config.ts', 'postcss.config.mjs', 'tailwind.config.ts', 'tsconfig.json']
        for name in names:
            self.write('apps/alligator-chess/' + name, '{}')
        digest = lambda p: hashlib.sha256((self.root / p).read_bytes()).hexdigest()
        manifest = {'source': {n: digest('apps/alligator-chess/' + n) for n in names}, 'files': {'index.html': digest('alligator-chess/index.html')}}
        self.write('alligator-chess/export-manifest.json', json.dumps(manifest))

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')

    def errors(self):
        return checker.check_site(self.root.resolve())['errors']

    def test_valid_site(self):
        self.assertEqual(self.errors(), [])

    def test_line_endings_do_not_report_a_stale_export(self):
        path = self.root / 'apps/alligator-chess/src/game.ts'
        path.write_bytes(b'{}\r\n')
        manifest_file = self.root / 'alligator-chess/export-manifest.json'
        manifest = json.loads(manifest_file.read_text())
        manifest['source']['src/game.ts'] = hashlib.sha256(b'{}\n').hexdigest()
        manifest_file.write_text(json.dumps(manifest), encoding='utf-8')
        self.assertEqual(self.errors(), [])

    def test_missing_asset(self):
        (self.root / 'image.svg').unlink()
        self.assertTrue(any('missing local target /image.svg' in e for e in self.errors()))

    def test_stale_source_export(self):
        self.write('apps/alligator-chess/src/game.ts', 'changed')
        self.assertTrue(any('source changed without a matching export' in e for e in self.errors()))

    def test_modified_export(self):
        self.write('alligator-chess/index.html', '<title>Edited</title>')
        self.assertTrue(any('files changed without a matching export' in e for e in self.errors()))

    def test_redirect_requires_query_and_fragment(self):
        self.write('old.html', '<title>Moved</title><script>location.replace("/")</script>')
        self.assertTrue(any('redirect must preserve query and fragment' in e for e in self.errors()))

    def test_internal_html_link_is_rejected(self):
        p = self.root / 'index.html'
        p.write_text(p.read_text() + '<a href="/index.html">Home</a>', encoding='utf-8')
        self.assertTrue(any('link should use a folder URL' in e for e in self.errors()))

if __name__ == '__main__':
    unittest.main()
