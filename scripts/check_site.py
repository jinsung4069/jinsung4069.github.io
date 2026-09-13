#!/usr/bin/env python3
"""Check published local links, folder URLs, sitemap and the committed game export.

Usage: python scripts/check_site.py [--root PATH]
No network access or third-party Python packages are needed.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
import argparse
import hashlib
import json
import os
import re
import xml.etree.ElementTree as ET

ORIGIN = 'https://jinsung4069.github.io'
# These are separate GitHub Pages projects, not files in this repository.
EXTERNAL_PROJECTS = {'astar-pathfinding', 'simplequiz', 'AlligatorChess'}
EXCLUDED = {'.git', '.claude', '.codex', '.agents', '.playwright-cli', 'apps', 'scripts', 'tests', 'node_modules', '__pycache__'}

TEXT_TYPES = {'.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.svg', '.html', '.txt', '.map'}

def file_hash(path):
    content = path.read_bytes()
    if path.suffix in TEXT_TYPES:
        content = content.replace(b'\r\n', b'\n')
    return hashlib.sha256(content).hexdigest()

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.references = []
        self.canonical = None
        self.has_title = False
        self.main_count = 0
        self.has_skip = False
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.has_title |= tag == 'title'
        self.main_count += tag == 'main'
        self.has_skip |= tag == 'a' and 'skip-link' in attrs.get('class', '').split()
        for name in ('href', 'src', 'poster', 'data-src'):
            if attrs.get(name):
                self.references.append((name, attrs[name]))
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')


def check_site(root):
    errors, references = [], set()
    pages = []

    def error(message):
        errors.append(message)

    def local_reference(value, source, attribute='asset'):
        if not value or value.startswith(('#', 'data:', 'mailto:', 'tel:', 'javascript:')) or '${' in value:
            return
        url = urlsplit(urljoin(ORIGIN + source, value))
        if url.netloc != 'jinsung4069.github.io':
            return
        path = unquote(url.path)
        if path.strip('/').split('/')[0] in EXTERNAL_PROJECTS:
            return
        destination = (root / path.lstrip('/')).resolve()
        if not destination.is_relative_to(root):
            error(f'{source}: path escapes site root: {value}')
            return
        references.add(path)
        if not destination.exists() or (destination.is_dir() and not (destination / 'index.html').is_file()):
            error(f'{source}: missing local target {value}')
        if attribute == 'href' and path.endswith('.html') and path != '/404.html':
            error(f'{source}: link should use a folder URL: {value}')

    for folder, dirs, files in os.walk(root):
        dirs[:] = [name for name in dirs if name not in EXCLUDED and not name.startswith(('tmp-', 'temp-', 'scratch-'))]
        for name in files:
            path = Path(folder) / name
            url = '/' + path.relative_to(root).as_posix()
            if path.suffix == '.html':
                text = path.read_text(encoding='utf-8-sig')
                doc = Document(text)
                pages.append(url)
                if not doc.has_title:
                    error(f'{url}: page title is missing')
                for attr, value in doc.references:
                    local_reference(value, url, attr)
                legacy = name != 'index.html' and not url.startswith('/alligator-chess/') and url != '/404.html'
                if legacy:
                    match = re.search(r'location\.replace\([\'"]([^\'"]+)[\'"]\s*\+\s*location\.search\s*\+\s*location\.hash\)', text)
                    if not match:
                        error(f'{url}: redirect must preserve query and fragment')
                    else:
                        local_reference(match[1], url)
                    if not doc.canonical:
                        error(f'{url}: redirect canonical is missing')
                elif name == 'index.html' and not url.startswith('/alligator-chess/404/'):
                    expected = ORIGIN + url[:-len('index.html')]
                    if doc.canonical != expected:
                        error(f'{url}: expected canonical {expected}')
                if '/js/main.js' in text:
                    if '/js/preferences.js' not in text or doc.main_count != 1 or not doc.has_skip:
                        error(f'{url}: shared page needs preferences, one main landmark and a skip link')
            elif path.suffix == '.css':
                for value in re.findall(r'url\(\s*[\'"]?([^\)\'\"]+)', path.read_text(encoding='utf-8-sig')):
                    local_reference(value.strip(), url)

    # Lecture viewers load these image and video paths from JSON at runtime.
    course_data = root / 'data/lectures/computer-education2'
    if course_data.is_dir():
        def inspect_data(value):
            if isinstance(value, dict):
                for item in value.values(): inspect_data(item)
            elif isinstance(value, list):
                for item in value: inspect_data(item)
            elif isinstance(value, str) and value.startswith(('../images/', '../media/', '/images/', '/media/')):
                local_reference(value, '/computer-education2/')
        for path in course_data.glob('*.json'):
            try:
                inspect_data(json.loads(path.read_text(encoding='utf-8-sig')))
            except (ValueError, OSError) as exc:
                error(f'{path.relative_to(root)}: invalid course data: {exc}')

    try:
        sitemap = ET.parse(root / 'sitemap.xml')
        urls = [node.text for node in sitemap.findall('.//{*}loc')]
        if len(urls) != len(set(urls)):
            error('sitemap.xml: duplicate URL')
        for url in urls:
            local_reference(url, '/sitemap.xml', 'href')
    except (OSError, ET.ParseError) as exc:
        error(f'sitemap.xml: {exc}')
    if not (root / '404.html').is_file():
        error('Custom 404.html is missing')
    if not (root / '.nojekyll').is_file():
        error('.nojekyll is required for the game bundle assets')

    manifest_file = root / 'alligator-chess/export-manifest.json'
    if manifest_file.exists():
        manifest = json.loads(manifest_file.read_text(encoding='utf-8-sig'))
        for kind, folder in [('source', root / 'apps/alligator-chess'), ('files', root / 'alligator-chess')]:
            entries = manifest.get(kind, {})
            if not entries:
                error(f'Game {kind} manifest is empty; rebuild the game')
            for name, expected in entries.items():
                path = (folder / name).resolve()
                if not path.is_relative_to(folder.resolve()) or not path.is_file():
                    error(f'Game {kind} file is missing or invalid: {name}')
                elif file_hash(path) != expected:
                    error(f'Game {kind} changed without a matching export: {name}')
        app = root / 'apps/alligator-chess'
        source_names = set()
        for name in ('src', 'public', 'scripts', 'package.json', 'package-lock.json', 'next.config.ts', 'postcss.config.mjs', 'tailwind.config.ts', 'tsconfig.json'):
            path = app / name
            for file in path.rglob('*') if path.is_dir() else [path]:
                if file.is_file():
                    source_names.add(file.relative_to(app).as_posix())
        if source_names != set(manifest.get('source', {})):
            error('Game source file list changed; rebuild the game')
    else:
        error('Game export manifest is missing; rebuild the game')
    return {'html_pages': len(pages), 'local_targets': len(references), 'errors': errors}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
    args = parser.parse_args()
    result = check_site(args.root.resolve())
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return bool(result['errors'])


if __name__ == '__main__':
    raise SystemExit(main())
