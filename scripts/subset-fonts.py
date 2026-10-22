"""Generate lossless unicode-range subsets; retain all original mapped characters.

Install fonttools==4.60.1 brotli==1.2.0 before running. Originals and OFL stay intact.
"""
from pathlib import Path
from collections import Counter
import re
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
def unicode_ranges(group):
    ranges = []
    for code in sorted(group):
        if ranges and code == ranges[-1][1] + 1:
            ranges[-1][1] = code
        else:
            ranges.append([code, code])
    return ','.join(f'U+{first:X}' + (f'-{last:X}' if first != last else '') for first, last in ranges)

counts = Counter()
for folder, pattern in [('data/lectures', '*.json'), ('js', '*.js')]:
    for path in sorted((ROOT / folder).rglob(pattern)):
        counts.update(ord(c) for c in path.read_text(encoding='utf-8') if 0xAC00 <= ord(c) <= 0xD7A3)
common = [code for code, count in counts.most_common(2048)]
destination = ROOT / 'fonts/freesentation/subsets'
destination.mkdir(exist_ok=True)
for source in sorted((ROOT / 'fonts/freesentation').glob('*.woff2')):
    original = TTFont(source)
    codes = set(original.getBestCmap())
    groups = [codes & set(range(0x100))]
    groups += [codes & set(common[i:i + 512]) for i in range(0, len(common), 512)]
    remaining = sorted(codes - set.union(*groups))
    groups += [set(remaining[i:i + 2048]) for i in range(0, len(remaining), 2048)]
    css = ['/* Freesentation, SIL OFL 1.1. All original Unicode mappings retained. */']
    weight = int(re.search(r'-(\d)', source.name)[1]) * 100
    covered = set()
    for i, group in enumerate(groups):
        if not group:
            continue
        font = TTFont(source)
        options = subset.Options()
        options.recalc_timestamp = False
        engine = subset.Subsetter(options=options)
        engine.populate(unicodes=group)
        engine.subset(font)
        filename = f'{source.stem}-{i}.woff2'
        font.save(destination / filename)
        actual = set(TTFont(destination / filename).getBestCmap())
        assert actual == group, (filename, group - actual)
        covered |= actual
        ranges = unicode_ranges(group)
        css.append(f"@font-face{{font-family:Freesentation;src:url('{filename}') format('woff2');font-style:normal;font-weight:{weight};font-display:swap;unicode-range:{ranges}}}")
    assert covered == codes
    (destination / f'{source.stem}.css').write_text('\n'.join(css)+'\n', encoding='utf-8')
    print(source.name, len(codes), 'characters preserved', flush=True)
