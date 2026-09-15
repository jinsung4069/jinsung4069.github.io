"""Omit citations to reused lecture decks, retaining external publications."""
import re

LECTURE_TITLES = {
    '4차 산업 혁명과 인공지능',
    'AI 시대에 우리는 어떻게 배울 것인가?',
    '인공 지능 역사',
    '인간과 인공지능의 공존',
    '기계 학습의 원리',
    '기계 학습의 원리(자연어 처리)',
    '인공지능 융합교육',
}

def clean_source_text(text):
    if not text.startswith('출처:'):
        return text
    parts = [part.strip() for part in text.split(':', 1)[1].split(',')]
    if not any(part in LECTURE_TITLES for part in parts):
        return text
    remaining = [part for part in parts if part not in LECTURE_TITLES
                 and not re.fullmatch(r'(2024년 (강의 )?사례|2018년 조사 자료)', part)]
    return '출처: ' + ', '.join(remaining) if remaining else ''
