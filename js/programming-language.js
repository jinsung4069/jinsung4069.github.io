(function() {
    const STORAGE_KEY = 'programmingLanguageLabProgressV1';

    const ui = {
        module: { ko: '모듈', en: 'Module' },
        complete: { ko: '완료', en: 'Complete' },
        open: { ko: '진행 중', en: 'Open' },
        score: { ko: '점수', en: 'Score' },
        attempts: { ko: '시도', en: 'Attempts' },
        canvasHelp: { ko: '아래 캔버스에 직접 따라 작성해 보세요.', en: 'Type the code into the canvas below.' },
        expectedOutput: { ko: '예상 출력', en: 'Expected Output' },
        check: { ko: '실행 체험 / 채점', en: 'Experience Run / Check' },
        fillSample: { ko: '예시 코드 넣기', en: 'Fill Sample Code' },
        next: { ko: '다음 모듈', en: 'Next Module' },
        first: { ko: '첫 모듈로', en: 'First Module' },
        successTitle: { ko: '좋습니다. 핵심 패턴을 모두 반영했습니다.', en: 'Nice. Every key pattern is present.' },
        retryTitle: { ko: '조금 더 다듬어 보세요.', en: 'A little more refinement needed.' },
        resultSummary: { ko: '요구사항 {total}개 중 {met}개를 만족했습니다.', en: 'You satisfied {met} of {total} requirements.' },
        emptyHint: { ko: '코드를 입력하거나 예시 코드를 넣은 뒤 다시 채점해 보세요.', en: 'Enter code or fill the sample, then check again.' },
        resetConfirm: { ko: '프로그래밍 언어 실습 진도와 점수를 초기화할까요?', en: 'Reset Programming Language Lab progress and scores?' },
        topicsTitle: { ko: '핵심 범위', en: 'Topic Map' },
        topicsBody: {
            ko: '자료형, 변수명, 연산자, 출력, 조건문, 반복문, 배열, 문자열, 포인터, Python 컬렉션, 함수, 클래스, 스크립트 언어, 라이브러리를 실습 단위로 묶었습니다.',
            en: 'Data types, names, operators, output, branching, loops, arrays, strings, pointers, Python collections, functions, classes, script languages, and libraries are grouped into practice modules.'
        },
        practiceGoal: { ko: '실습 목표', en: 'Practice Goal' },
        concepts: { ko: '핵심 개념', en: 'Key Concepts' },
        comparePoint: { ko: '비교 포인트', en: 'Comparison Point' },
        experience: { ko: '체험 포인트', en: 'Experience Point' }
    };

    const modules = [
        {
            id: 'types-variables',
            icon: 'fa-cubes',
            language: 'C / Java / Python',
            title: { ko: '자료형과 변수명', en: 'Types and Names' },
            subtitle: {
                ko: 'C/JAVA 자료형, C 구조체, Python 시퀀스 자료형, 변수명 규칙, 가비지 콜렉터를 한 번에 확인합니다.',
                en: 'Review C/JAVA types, C structs, Python sequence types, naming rules, and garbage collection together.'
            },
            concepts: [
                { title: { ko: 'C/JAVA 자료형', en: 'C/JAVA Types' }, body: { ko: '정수, 문자, 논리값은 언어마다 크기와 표현 방식이 다릅니다.', en: 'Integers, characters, and booleans differ by language in size and expression.' } },
                { title: { ko: '구조체와 클래스', en: 'Structs and Classes' }, body: { ko: 'C는 struct로 서로 다른 자료를 묶고, Java/Python은 객체로 상태와 동작을 묶습니다.', en: 'C groups mixed data with struct, while Java/Python often group state and behavior as objects.' } },
                { title: { ko: '변수명 규칙', en: 'Naming Rules' }, body: { ko: '영문자, 숫자, 밑줄을 쓰되 첫 글자는 숫자가 될 수 없습니다.', en: 'Letters, digits, and underscores are allowed, but names cannot start with a digit.' } },
                { title: { ko: '가비지 콜렉터', en: 'Garbage Collector' }, body: { ko: 'Java/Python은 사용하지 않는 객체 메모리를 자동 회수하는 흐름을 갖습니다.', en: 'Java/Python can reclaim unused object memory automatically.' } }
            ],
            goal: {
                ko: 'C 구조체로 학생 정보를 묶고, Java의 int/char/boolean 자료형과 Python 리스트를 주석 또는 코드로 함께 비교해 보세요.',
                en: 'Write a C struct for student data, then compare Java int/char/boolean and a Python list in comments or code.'
            },
            starter: 'struct Student {\n    int id;\n    char grade;\n};\n\n// Java: int score = 95; char level = \'A\'; boolean passed = true;\n// Python: values = [95, "A", True]',
            solution: 'struct Student {\n    int id;\n    char grade;\n};\n\nint main(void) {\n    struct Student s = {2026, \'A\'};\n    // Java: int score = 95; char level = \'A\'; boolean passed = true;\n    // Python: values = [95, "A", True]\n    return 0;\n}',
            expectedOutput: { ko: '출력 없음 - 자료형과 변수 선언 구조 확인', en: 'No output - inspect type and variable declarations' },
            hint: { ko: 'struct, int, char, boolean, list 또는 대괄호, 올바른 변수명을 모두 넣어 보세요.', en: 'Include struct, int, char, boolean, a list or brackets, and valid variable names.' },
            checks: [
                check('struct', { ko: 'C 구조체 struct 선언 포함', en: 'Include a C struct declaration' }, /struct\s+\w+/i),
                check('int-char', { ko: 'int와 char 자료형 사용', en: 'Use int and char types' }, /\bint\b[\s\S]*\bchar\b|\bchar\b[\s\S]*\bint\b/i),
                check('java-boolean', { ko: 'Java 논리 자료형 boolean 비교', en: 'Compare Java boolean' }, /\bboolean\b/i),
                check('python-list', { ko: 'Python 리스트 또는 시퀀스 표현 포함', en: 'Include a Python list or sequence expression' }, /\[[\s\S]*\]|list\s*\(|range\s*\(/i),
                check('valid-name', { ko: '숫자로 시작하지 않는 변수명 사용', en: 'Use names that do not start with a digit' }, /\b[a-zA-Z_][a-zA-Z0-9_]*\s*(=|;|\{|\()/)
            ]
        },
        {
            id: 'operators-output',
            icon: 'fa-terminal',
            language: 'C / Java / Python',
            title: { ko: '연산자와 출력', en: 'Operators and Output' },
            subtitle: {
                ko: '산술, 비트, 논리, 조건 연산자와 C printf, Java 출력 함수, Python print의 차이를 체험합니다.',
                en: 'Practice arithmetic, bitwise, logical, conditional operators, and output functions in C, Java, and Python.'
            },
            concepts: [
                { title: { ko: '산술/비트/논리', en: 'Arithmetic/Bit/Logic' }, body: { ko: '%, &, ^, |, !, &&, || 같은 연산자는 계산 목적이 서로 다릅니다.', en: 'Operators such as %, &, ^, |, !, &&, and || serve different calculation purposes.' } },
                { title: { ko: '조건 연산자', en: 'Conditional Operator' }, body: { ko: 'C/Java의 a < b ? b : a 형태는 조건에 따라 값을 선택합니다.', en: 'C/Java use a < b ? b : a to choose a value based on a condition.' } },
                { title: { ko: '서식 문자열', en: 'Format Specifiers' }, body: { ko: '%d, %c, %s는 정수, 문자, 문자열 출력 형식을 지정합니다.', en: '%d, %c, and %s specify integer, character, and string output.' } },
                { title: { ko: '출력 함수', en: 'Output Functions' }, body: { ko: 'C printf, Java printf/print/println, Python print는 출력 제어 방식이 다릅니다.', en: 'C printf, Java printf/print/println, and Python print control output differently.' } }
            ],
            goal: {
                ko: '두 정수 중 큰 값을 조건 연산자로 고르고, C/Java/Python 출력 방식 중 두 가지 이상을 코드에 넣어 비교해 보세요.',
                en: 'Choose the larger of two integers with a conditional operator, then compare at least two output styles from C/Java/Python.'
            },
            starter: 'int a = 7, b = 11;\nint mx = a < b ? b : a;\nprintf("%d", mx);\n// Java: System.out.printf("%d", mx);\n// Python: print(mx, end=",")',
            solution: 'int a = 7, b = 11;\nint mx = a < b ? b : a;\nprintf("%d", mx);\n// Java\nSystem.out.printf("%d", mx);\nSystem.out.println(" is max");\n// Python\nprint(mx, end=",")',
            expectedOutput: '11',
            hint: { ko: '?: 조건 연산자, printf 또는 System.out, print, 그리고 %d 서식을 함께 확인하세요.', en: 'Look for the ?: conditional operator, printf or System.out, print, and the %d specifier.' },
            checks: [
                check('conditional', { ko: '조건 연산자 ? : 사용', en: 'Use the ? : conditional operator' }, /\?.*:/s),
                check('format-d', { ko: '%d 정수 서식 포함', en: 'Include %d integer formatting' }, /%d/),
                check('c-output', { ko: 'C printf 출력 사용', en: 'Use C printf output' }, /\bprintf\s*\(/),
                check('java-output', { ko: 'Java System.out 출력 비교', en: 'Compare Java System.out output' }, /System\.out\.(printf|print|println)\s*\(/),
                check('python-output', { ko: 'Python print 출력 비교', en: 'Compare Python print output' }, /\bprint\s*\(/)
            ]
        },
        {
            id: 'control-flow',
            icon: 'fa-code-branch',
            language: 'C / Java / Python / Shell',
            title: { ko: '조건문과 반복문', en: 'Branching and Loops' },
            subtitle: {
                ko: 'if, switch, for, while, do-while, Python range 반복, 쉘 스크립트 제어문을 하나의 흐름으로 봅니다.',
                en: 'Connect if, switch, for, while, do-while, Python range loops, and shell script control statements.'
            },
            concepts: [
                { title: { ko: '단순 if문', en: 'Simple if' }, body: { ko: '조건이 참일 때만 실행하거나, else로 거짓일 때의 실행을 분리합니다.', en: 'Run code only when a condition is true, or separate the false branch with else.' } },
                { title: { ko: 'switch문', en: 'switch' }, body: { ko: '여러 분기를 case로 나누고 break 누락 시 다음 case까지 흐를 수 있습니다.', en: 'Separate many branches with case; missing break may continue into the next case.' } },
                { title: { ko: 'for/while', en: 'for/while' }, body: { ko: '정해진 횟수는 for, 조건 지속은 while로 표현하는 경우가 많습니다.', en: 'Use for for known counts and while for condition-based repetition.' } },
                { title: { ko: '스크립트 제어문', en: 'Script Controls' }, body: { ko: '쉘은 if, case, for, while, until 같은 선택형/반복형 제어문을 씁니다.', en: 'Shell scripts use selection and repetition controls such as if, case, for, while, and until.' } }
            ],
            goal: {
                ko: '1부터 10까지의 합을 구하는 for 반복과 Python range를 비교하고, 과일 번호를 switch 또는 if/elif로 분기해 보세요.',
                en: 'Compare a for loop that sums 1..10 with Python range, then branch fruit numbers with switch or if/elif.'
            },
            starter: 'int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum = sum + i;\n}\n\nswitch (fruit) {\n    case 1:\n        printf("banana");\n        break;\n}\n\n# Python: for i in range(1, 11):',
            solution: 'int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum = sum + i;\n}\n\nswitch (fruit) {\n    case 1:\n        printf("banana");\n        break;\n    case 2:\n        printf("strawberry");\n        break;\n    default:\n        printf("none");\n}\n\n# Python\nfor i in range(1, 11):\n    total = total + i\nif fruit == 1:\n    print("banana")\nelif fruit == 2:\n    print("strawberry")',
            expectedOutput: { ko: 'sum = 55, fruit = banana 또는 strawberry', en: 'sum = 55, fruit = banana or strawberry' },
            hint: { ko: 'for 조건식, switch/case/break, Python range(1, 11), if/elif 중 빠진 부분을 찾아보세요.', en: 'Check for a for condition, switch/case/break, Python range(1, 11), and if/elif.' },
            checks: [
                check('for-loop', { ko: '1부터 10까지 누적하는 for문 포함', en: 'Include a for loop summing 1 through 10' }, /for\s*\([^)]*1[^)]*<=\s*10[^)]*(\+\+|\+=\s*1)[^)]*\)/i),
                check('sum-update', { ko: 'sum 또는 total에 반복 변수 누적', en: 'Accumulate the loop variable into sum or total' }, /\b(sum|total)\s*=\s*\1\s*\+\s*\w+|\b(sum|total)\s*\+=\s*\w+/i),
                check('switch-case', { ko: 'switch/case 분기 포함', en: 'Include switch/case branching' }, /\bswitch\s*\([\s\S]*\bcase\b/i),
                check('break', { ko: 'case 종료를 위한 break 포함', en: 'Include break to end a case' }, /\bbreak\s*;/i),
                check('python-range', { ko: 'Python range 반복 비교', en: 'Compare a Python range loop' }, /for\s+\w+\s+in\s+range\s*\(\s*1\s*,\s*11\s*\)\s*:/i),
                check('if-elif', { ko: 'Python if/elif 또는 if/else 비교', en: 'Compare Python if/elif or if/else' }, /\bif\b[\s\S]*(elif|else)\b/i)
            ]
        },
        {
            id: 'data-boxes',
            icon: 'fa-table-cells',
            language: 'C / Python / Java',
            title: { ko: '배열, 문자열, 포인터, 컬렉션', en: 'Arrays, Strings, Pointers, Collections' },
            subtitle: {
                ko: 'C의 1차원/2차원 배열, 문자열 널 문자, 포인터와 배열, Python 리스트/딕셔너리/range/slice를 연결합니다.',
                en: 'Connect C arrays, string null characters, pointers and arrays, and Python list/dictionary/range/slice concepts.'
            },
            concepts: [
                { title: { ko: 'C 배열', en: 'C Arrays' }, body: { ko: '1차원 배열은 일직선, 2차원 배열은 행과 열로 값을 배치합니다.', en: 'A 1D array lines values up; a 2D array arranges values by row and column.' } },
                { title: { ko: '문자열 널 문자', en: 'String Null Character' }, body: { ko: 'C 문자열 배열 끝에는 문자열 종료를 알리는 \\0이 들어갑니다.', en: 'C string arrays end with \\0 to mark the end of the string.' } },
                { title: { ko: '포인터와 배열', en: 'Pointers and Arrays' }, body: { ko: '배열 이름은 첫 번째 요소 주소처럼 다룰 수 있고 *(a+1)로 접근할 수 있습니다.', en: 'An array name can behave like the first element address, and *(a+1) accesses an element.' } },
                { title: { ko: 'Python 컬렉션', en: 'Python Collections' }, body: { ko: '리스트는 변경 가능, 딕셔너리는 키로 접근, 슬라이스는 일부 구간을 잘라냅니다.', en: 'Lists are mutable, dictionaries use keys, and slices return selected ranges.' } }
            ],
            goal: {
                ko: 'C 배열과 포인터 접근을 쓰고, Python 리스트/딕셔너리/슬라이스/range를 함께 비교해 보세요.',
                en: 'Use C array and pointer access, then compare Python list, dictionary, slice, and range.'
            },
            starter: 'int a[5] = {1, 2, 3, 4, 5};\nint *p = a;\nprintf("%d", *(p + 1));\nchar word[5] = "love";\n\n# Python\nitems = [1, "mike", 23.45]\nprofile = {"name": "Hong", "age": 25}\nprint(items[1:3])',
            solution: 'int a[5] = {1, 2, 3, 4, 5};\nint *p = a;\nprintf("%d", *(p + 1));\nchar word[5] = "love"; // l o v e \\0\nint b[2][3] = {{11, 22, 33}, {44, 55, 66}};\n\n# Python\nitems = [1, "mike", 23.45]\nprofile = {"name": "Hong", "age": 25}\nnums = list(range(1, 15, 3))\nprint(items[1:3])',
            expectedOutput: '2\n["mike", 23.45]',
            hint: { ko: '배열 [], 포인터 *, 문자열 \\0, 딕셔너리 {}, range, slice [1:3] 중 빠진 개념을 보세요.', en: 'Look for arrays [], pointer *, string \\0, dictionary {}, range, and slice [1:3].' },
            checks: [
                check('c-array', { ko: 'C 배열 선언 포함', en: 'Include a C array declaration' }, /\b(int|char|long)\s+\w+\s*\[[^\]]+\]/i),
                check('pointer', { ko: '포인터 선언 또는 간접 연산자 사용', en: 'Use a pointer declaration or dereference operator' }, /\*\s*\w+|\w+\s*=\s*&\w+/),
                check('pointer-array', { ko: '포인터로 배열 요소 접근', en: 'Access an array element with a pointer' }, /\*\s*\(\s*\w+\s*\+\s*\d+\s*\)|\*\s*\(\s*\w+\s*\+\s*\w+\s*\)/),
                check('string-null', { ko: 'C 문자열 또는 널 문자 개념 포함', en: 'Include a C string or null character concept' }, /"[^"]*"|\\0/),
                check('dictionary', { ko: 'Python 딕셔너리 키-값 표현 포함', en: 'Include a Python dictionary key-value expression' }, /\{[^{}:]+:[^{}]+\}/),
                check('range-slice', { ko: 'Python range와 slice 표현 포함', en: 'Include Python range and slice expressions' }, /range\s*\([\s\S]*\)[\s\S]*\[[^\]]*:[^\]]*\]|\[[^\]]*:[^\]]*\][\s\S]*range\s*\(/i)
            ]
        },
        {
            id: 'functions-libraries',
            icon: 'fa-layer-group',
            language: 'Python / Java / C',
            title: { ko: '함수, 클래스, 라이브러리', en: 'Functions, Classes, Libraries' },
            subtitle: {
                ko: 'Python 함수와 클래스, 스크립트 언어의 성격, Java 예외 처리와 가비지 콜렉터, 표준/외부 라이브러리를 비교합니다.',
                en: 'Compare Python functions/classes, scripting language traits, Java exception handling and GC, and standard/external libraries.'
            },
            concepts: [
                { title: { ko: 'Python 함수', en: 'Python Function' }, body: { ko: '클래스 없이 def 함수만 단독으로 정의하고 호출할 수 있습니다.', en: 'A def function can be defined and called without a class.' } },
                { title: { ko: 'Python 클래스', en: 'Python Class' }, body: { ko: 'class 안에 속성과 메소드를 정의하고 객체를 만들어 사용합니다.', en: 'Define attributes and methods in a class, then create objects to use them.' } },
                { title: { ko: 'Java 예외 처리', en: 'Java Exceptions' }, body: { ko: 'try-catch-finally는 오류 상황과 무조건 실행할 정리 코드를 나눕니다.', en: 'try-catch-finally separates error handling from cleanup that always runs.' } },
                { title: { ko: '라이브러리', en: 'Libraries' }, body: { ko: '표준 라이브러리는 언어 기본 제공, 외부 라이브러리는 설치 후 사용합니다.', en: 'Standard libraries come with the language; external libraries are installed before use.' } }
            ],
            goal: {
                ko: 'Python 함수와 클래스를 작성하고, Java try-catch-finally 및 표준/외부 라이브러리 차이를 주석으로 정리해 보세요.',
                en: 'Write a Python function and class, then summarize Java try-catch-finally and standard/external libraries in comments.'
            },
            starter: 'def calc(x, y):\n    x *= y\n    return x\n\nclass Cls:\n    x = 10\n    def add(self, a):\n        return a + self.x\n\nprint(calc(3, 4))',
            solution: 'def calc(x, y):\n    x *= y\n    return x\n\nclass Cls:\n    x = 10\n    def add(self, a):\n        return a + self.x\n\nobj = Cls()\nobj.x = 5\nprint(calc(3, 4), obj.add(5))\n\n# Java: try { ... } catch (Exception e) { ... } finally { ... }\n# Library: standard library is built in, external library is installed before use.',
            expectedOutput: '12 10',
            hint: { ko: 'def/return, class/self, 객체 호출, try/catch/finally, standard/external library 키워드를 확인하세요.', en: 'Check for def/return, class/self, object method call, try/catch/finally, and standard/external library keywords.' },
            checks: [
                check('def-return', { ko: 'Python def 함수와 return 포함', en: 'Include a Python def function and return' }, /\bdef\s+\w+\s*\([^)]*\)\s*:[\s\S]*\breturn\b/i),
                check('class-self', { ko: 'Python class와 self 메소드 포함', en: 'Include a Python class and self method' }, /\bclass\s+\w+\s*:[\s\S]*\bdef\s+\w+\s*\(\s*self/i),
                check('object-call', { ko: '객체 생성 후 메소드 호출', en: 'Create an object and call a method' }, /\w+\s*=\s*\w+\s*\(\s*\)[\s\S]*\.\w+\s*\(/),
                check('java-exception', { ko: 'Java try-catch-finally 예외 처리 언급', en: 'Mention Java try-catch-finally exception handling' }, /\btry\b[\s\S]*\bcatch\b[\s\S]*\bfinally\b/i),
                check('library', { ko: '표준/외부 라이브러리 차이 언급', en: 'Mention standard/external library distinction' }, /(standard|표준)[\s\S]*(external|외부)|(external|외부)[\s\S]*(standard|표준)/i)
            ]
        }
    ];

    const comparisonScenarios = [
        {
            id: 'sum',
            title: { ko: '1부터 10까지 합', en: 'Sum 1 through 10' },
            intro: { ko: '같은 반복 누적 문제라도 C/Java는 초기값, 조건, 증가식을 한 줄에 쓰고 Python은 range를 사용합니다.', en: 'For the same accumulation task, C/Java place init, condition, and increment together; Python uses range.' },
            codes: {
                C: {
                    point: { ko: 'for문의 세 구역과 sum 누적을 직접 관리합니다.', en: 'Manage the three for-loop parts and sum update directly.' },
                    code: 'int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum += i;\n}\nprintf("%d", sum);'
                },
                Python: {
                    point: { ko: 'range(1, 11)은 1 이상 11 미만을 만듭니다.', en: 'range(1, 11) produces numbers from 1 up to but not including 11.' },
                    code: 'total = 0\nfor i in range(1, 11):\n    total += i\nprint(total)'
                },
                Java: {
                    point: { ko: 'C와 유사한 for문을 쓰고 System.out.println으로 줄바꿈 출력합니다.', en: 'Use a C-like for loop and System.out.println for line output.' },
                    code: 'int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum += i;\n}\nSystem.out.println(sum);'
                }
            }
        },
        {
            id: 'fruit',
            title: { ko: '과일 번호 분기', en: 'Fruit Branch' },
            intro: { ko: 'C/Java는 switch-case가 자연스럽고, Python은 if/elif/else로 같은 분기를 표현합니다.', en: 'C/Java naturally use switch-case, while Python expresses the same branch with if/elif/else.' },
            codes: {
                C: {
                    point: { ko: 'break가 없으면 다음 case까지 실행될 수 있습니다.', en: 'Without break, execution may continue into the next case.' },
                    code: 'switch (fruit) {\n    case 1:\n        printf("banana");\n        break;\n    case 2:\n        printf("strawberry");\n        break;\n    default:\n        printf("none");\n}'
                },
                Python: {
                    point: { ko: '콜론과 들여쓰기로 실행 블록을 표현합니다.', en: 'Colons and indentation define executable blocks.' },
                    code: 'if fruit == 1:\n    print("banana")\nelif fruit == 2:\n    print("strawberry")\nelse:\n    print("none")'
                },
                Java: {
                    point: { ko: 'System.out.print와 break를 case마다 함께 둡니다.', en: 'Place System.out.print and break inside each case.' },
                    code: 'switch (fruit) {\n    case 1:\n        System.out.print("banana");\n        break;\n    case 2:\n        System.out.print("strawberry");\n        break;\n    default:\n        System.out.print("none");\n}'
                }
            }
        },
        {
            id: 'format',
            title: { ko: '서식 출력', en: 'Formatted Output' },
            intro: { ko: '정수, 문자, 문자열을 출력할 때 C와 Java는 서식 문자열을 공유하고 Python은 sep/end 인자로 출력을 조절합니다.', en: 'C and Java share format specifiers for integers, characters, and strings; Python controls output with sep/end arguments.' },
            codes: {
                C: {
                    point: { ko: '%d, %c, %s로 출력 자료형을 지정합니다.', en: 'Use %d, %c, and %s for output types.' },
                    code: 'int score = 82;\nchar grade = \'A\';\nprintf("%d, %c", score, grade);'
                },
                Python: {
                    point: { ko: 'sep은 값 사이, end는 마지막 출력을 조절합니다.', en: 'sep controls separators and end controls the final output.' },
                    code: 'print(82, 24, sep="-", end=",")'
                },
                Java: {
                    point: { ko: 'printf는 서식 출력, println은 출력 후 줄바꿈입니다.', en: 'printf formats output; println moves to a new line afterward.' },
                    code: 'int score = 82;\nchar grade = \'A\';\nSystem.out.printf("%d, %c", score, grade);\nSystem.out.println();'
                }
            }
        }
    ];

    const languageProfiles = [
        {
            name: 'C',
            icon: 'fa-microchip',
            badge: { ko: '메모리 감각', en: 'Memory Control' },
            summary: { ko: '배열, 포인터, 구조체를 직접 다루며 컴퓨터 내부 동작을 가깝게 체험합니다.', en: 'Work directly with arrays, pointers, and structs to feel how memory is organized.' },
            points: [
                { ko: '장점: 실행 흐름과 메모리 사용을 세밀하게 제어할 수 있습니다.', en: 'Strength: fine-grained control over execution and memory.' },
                { ko: '주의: 포인터, 문자열 종료 문자, 배열 범위를 직접 신경 써야 합니다.', en: 'Watch out: pointers, string terminators, and array bounds need direct care.' }
            ]
        },
        {
            name: 'Python',
            icon: 'fa-feather-pointed',
            badge: { ko: '빠른 표현', en: 'Fast Expression' },
            summary: { ko: '리스트, 딕셔너리, range, 슬라이스로 적은 코드에 많은 의미를 담습니다.', en: 'Lists, dictionaries, range, and slices express rich behavior with compact code.' },
            points: [
                { ko: '장점: 입력, 반복, 컬렉션 처리가 간결해 실험이 빠릅니다.', en: 'Strength: input, loops, and collections are quick to experiment with.' },
                { ko: '주의: input은 문자열이므로 숫자 계산 전 int나 map으로 바꿔야 합니다.', en: 'Watch out: input returns strings, so numeric work needs int or map conversion.' }
            ]
        },
        {
            name: 'Java',
            icon: 'fa-mug-hot',
            badge: { ko: '정적 타입과 안정성', en: 'Static Types' },
            summary: { ko: '자료형을 명확히 쓰고, 객체와 예외 처리, 가비지 콜렉터가 큰 프로그램 구조를 돕습니다.', en: 'Explicit types, objects, exceptions, and garbage collection help structure larger programs.' },
            points: [
                { ko: '장점: 타입과 클래스 구조가 명확해 협업과 유지보수에 유리합니다.', en: 'Strength: explicit types and classes help collaboration and maintenance.' },
                { ko: '주의: 간단한 출력도 System.out처럼 문법이 길어질 수 있습니다.', en: 'Watch out: simple output can be more verbose with System.out syntax.' }
            ]
        }
    ];

    let progress = loadProgress();
    let activeScenario = comparisonScenarios[0].id;

    document.addEventListener('DOMContentLoaded', () => {
        render();

        const resetButton = document.getElementById('resetProgress');
        if (resetButton) {
            resetButton.addEventListener('click', resetProgress);
        }

        const observer = new MutationObserver(mutations => {
            if (mutations.some(mutation => mutation.attributeName === 'lang')) {
                render();
            }
        });
        observer.observe(document.documentElement, { attributes: true });
    });

    function render() {
        renderOverview();
        renderTopicMap();
        renderTabs();
        renderModule();
        renderComparisonTabs();
        renderComparison();
        renderProfiles();
    }

    function renderOverview() {
        const completed = progress.completedModules.length;
        const scores = modules.map(module => progress.scores[module.id] || 0);
        const attemptedScores = scores.filter(score => score > 0);
        const average = attemptedScores.length
            ? Math.round(attemptedScores.reduce((sum, score) => sum + score, 0) / attemptedScores.length)
            : 0;
        const current = getCurrentModule();

        setText('progressText', `${completed} / ${modules.length}`);
        setText('averageScore', average);
        setText('currentModuleLabel', text(current.title));

        const fill = document.getElementById('progressFill');
        if (fill) fill.style.width = `${Math.round(completed / modules.length * 100)}%`;
    }

    function renderTopicMap() {
        const container = document.getElementById('topicMap');
        if (!container) return;

        const tags = [
            'C/JAVA types',
            'struct',
            'Python sequence',
            'variable names',
            'garbage collector',
            'operators',
            'output',
            'control flow',
            'arrays and pointers',
            'Python basics',
            'class and function',
            'script and library'
        ];

        container.innerHTML = `
            <div>
                <p class="overview-label">${escapeHtml(text(ui.topicsTitle))}</p>
                <h2>${escapeHtml(text(ui.topicsTitle))}</h2>
                <p>${escapeHtml(text(ui.topicsBody))}</p>
            </div>
            <div class="topic-tags">
                ${tags.map(tag => `<span class="topic-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        `;
    }

    function renderTabs() {
        const container = document.getElementById('moduleTabs');
        if (!container) return;
        const current = getCurrentModule();

        container.innerHTML = modules.map(module => {
            const isActive = module.id === current.id;
            const isComplete = progress.completedModules.includes(module.id);
            return `
                <button class="module-tab ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}" type="button" data-module-id="${escapeHtml(module.id)}">
                    <i class="fas ${escapeHtml(module.icon)}" aria-hidden="true"></i>
                    <span class="module-tab-title">${escapeHtml(text(module.title))}</span>
                    <span class="module-tab-meta">${escapeHtml(module.language)} · ${escapeHtml(isComplete ? text(ui.complete) : text(ui.open))}</span>
                </button>
            `;
        }).join('');

        container.querySelectorAll('[data-module-id]').forEach(button => {
            button.addEventListener('click', () => {
                progress.currentModule = button.dataset.moduleId;
                saveProgress();
                renderOverview();
                renderTabs();
                renderModule();
            });
        });
    }

    function renderModule() {
        const container = document.getElementById('moduleContent');
        if (!container) return;
        const module = getCurrentModule();
        const savedCode = progress.code[module.id] || module.starter;

        container.innerHTML = `
            <div class="module-heading">
                <div>
                    <p class="overview-label">${escapeHtml(text(ui.module))} · ${escapeHtml(module.language)}</p>
                    <h2>${escapeHtml(text(module.title))}</h2>
                    <p>${escapeHtml(text(module.subtitle))}</p>
                </div>
                <div class="score-pill">${escapeHtml(text(ui.score))} ${progress.scores[module.id] || 0} · ${escapeHtml(text(ui.attempts))} ${progress.attempts[module.id] || 0}</div>
            </div>

            <p class="overview-label">${escapeHtml(text(ui.concepts))}</p>
            <div class="concept-grid">
                ${module.concepts.map(concept => `
                    <div class="concept-card">
                        <strong>${escapeHtml(text(concept.title))}</strong>
                        <span>${escapeHtml(text(concept.body))}</span>
                    </div>
                `).join('')}
            </div>

            <div class="practice-goal">
                <strong>${escapeHtml(text(ui.practiceGoal))}</strong>
                ${escapeHtml(text(module.goal))}
            </div>

            <div class="code-canvas">
                <div class="canvas-toolbar">
                    <span class="language-badge">${escapeHtml(module.language)}</span>
                    <span class="canvas-help">${escapeHtml(text(ui.canvasHelp))}</span>
                </div>
                <textarea id="codeAnswer" class="code-input" spellcheck="false">${escapeHtml(savedCode)}</textarea>
            </div>

            <div class="expected-output">
                <strong>${escapeHtml(text(ui.expectedOutput))}</strong>
                <pre>${escapeHtml(text(module.expectedOutput))}</pre>
            </div>

            <div class="lab-actions">
                <button id="checkCode" class="lab-action" type="button">${escapeHtml(text(ui.check))}</button>
                <button id="fillSample" class="lab-action secondary" type="button">${escapeHtml(text(ui.fillSample))}</button>
                <button id="nextModule" class="lab-action secondary" type="button">${escapeHtml(isLastModule(module) ? text(ui.first) : text(ui.next))}</button>
            </div>

            <div id="feedbackBox" class="feedback-box" aria-live="polite"></div>
        `;

        const input = document.getElementById('codeAnswer');
        if (input) {
            input.addEventListener('input', () => {
                progress.code[module.id] = input.value;
                saveProgress();
            });
        }

        document.getElementById('checkCode')?.addEventListener('click', () => checkAnswer(module));
        document.getElementById('fillSample')?.addEventListener('click', () => {
            const textarea = document.getElementById('codeAnswer');
            if (!textarea) return;
            textarea.value = module.solution;
            progress.code[module.id] = module.solution;
            saveProgress();
            textarea.focus();
        });
        document.getElementById('nextModule')?.addEventListener('click', () => goToNextModule(module));
    }

    function renderComparisonTabs() {
        const container = document.getElementById('comparisonTabs');
        if (!container) return;

        container.innerHTML = comparisonScenarios.map(scenario => `
            <button class="scenario-tab ${scenario.id === activeScenario ? 'active' : ''}" type="button" data-scenario-id="${escapeHtml(scenario.id)}">
                ${escapeHtml(text(scenario.title))}
            </button>
        `).join('');

        container.querySelectorAll('[data-scenario-id]').forEach(button => {
            button.addEventListener('click', () => {
                activeScenario = button.dataset.scenarioId;
                renderComparisonTabs();
                renderComparison();
            });
        });
    }

    function renderComparison() {
        const container = document.getElementById('comparisonContent');
        if (!container) return;
        const scenario = comparisonScenarios.find(item => item.id === activeScenario) || comparisonScenarios[0];

        container.innerHTML = `
            <p class="comparison-intro">${escapeHtml(text(scenario.intro))}</p>
            <div class="comparison-grid">
                ${Object.entries(scenario.codes).map(([language, item]) => `
                    <div class="compare-card">
                        <h3><i class="fas ${escapeHtml(languageIcon(language))}" aria-hidden="true"></i>${escapeHtml(language)}</h3>
                        <p><strong>${escapeHtml(text(ui.comparePoint))}:</strong> ${escapeHtml(text(item.point))}</p>
                        <pre class="compare-code">${escapeHtml(item.code)}</pre>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderProfiles() {
        const container = document.getElementById('languageProfiles');
        if (!container) return;

        container.innerHTML = languageProfiles.map(profile => `
            <article class="profile-card">
                <h3><i class="fas ${escapeHtml(profile.icon)}" aria-hidden="true"></i>${escapeHtml(profile.name)}</h3>
                <p>${escapeHtml(text(profile.summary))}</p>
                <span class="profile-pill">${escapeHtml(text(profile.badge))}</span>
                <ul>
                    ${profile.points.map(point => `<li>${escapeHtml(text(point))}</li>`).join('')}
                </ul>
            </article>
        `).join('');
    }

    function checkAnswer(module) {
        const input = document.getElementById('codeAnswer');
        const rawCode = input ? input.value : '';
        const details = module.checks.map(item => ({
            id: item.id,
            label: text(item.label),
            met: item.test(rawCode)
        }));
        const metCount = details.filter(item => item.met).length;
        const score = rawCode.trim() ? Math.round(metCount / details.length * 100) : 0;
        const passed = metCount === details.length;

        progress.attempts[module.id] = (progress.attempts[module.id] || 0) + 1;
        progress.scores[module.id] = Math.max(progress.scores[module.id] || 0, score);
        progress.code[module.id] = rawCode;

        if (passed && !progress.completedModules.includes(module.id)) {
            progress.completedModules.push(module.id);
        }

        saveProgress();
        renderOverview();
        renderTabs();
        showFeedback(module, {
            passed,
            score,
            metCount,
            total: details.length,
            details,
            empty: !rawCode.trim()
        });
        updateScorePill(module);
    }

    function showFeedback(module, result) {
        const box = document.getElementById('feedbackBox');
        if (!box) return;

        const title = result.passed ? text(ui.successTitle) : text(ui.retryTitle);
        const summary = result.empty
            ? text(ui.emptyHint)
            : format(text(ui.resultSummary), { met: result.metCount, total: result.total });

        box.className = `feedback-box visible ${result.passed ? 'success' : 'retry'}`;
        box.innerHTML = `
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(summary)}</p>
            ${result.passed ? '' : `<p>${escapeHtml(text(module.hint))}</p>`}
            <ul class="requirement-list">
                ${result.details.map(item => `<li>${item.met ? 'OK' : 'Check'} · ${escapeHtml(item.label)}</li>`).join('')}
            </ul>
        `;
    }

    function updateScorePill(module) {
        const scorePill = document.querySelector('.score-pill');
        if (!scorePill) return;
        scorePill.textContent = `${text(ui.score)} ${progress.scores[module.id] || 0} · ${text(ui.attempts)} ${progress.attempts[module.id] || 0}`;
    }

    function goToNextModule(module) {
        const currentIndex = modules.findIndex(item => item.id === module.id);
        const nextIndex = currentIndex === modules.length - 1 ? 0 : currentIndex + 1;
        progress.currentModule = modules[nextIndex].id;
        saveProgress();
        renderOverview();
        renderTabs();
        renderModule();
    }

    function resetProgress() {
        if (!window.confirm(text(ui.resetConfirm))) return;
        progress = defaultProgress();
        localStorage.removeItem(STORAGE_KEY);
        render();
    }

    function getCurrentModule() {
        return modules.find(module => module.id === progress.currentModule) || modules[0];
    }

    function isLastModule(module) {
        return modules[modules.length - 1].id === module.id;
    }

    function defaultProgress() {
        return {
            currentModule: modules[0].id,
            completedModules: [],
            scores: {},
            attempts: {},
            code: {}
        };
    }

    function loadProgress() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!saved || typeof saved !== 'object') return defaultProgress();
            return {
                ...defaultProgress(),
                ...saved,
                completedModules: Array.isArray(saved.completedModules) ? saved.completedModules : [],
                scores: saved.scores || {},
                attempts: saved.attempts || {},
                code: saved.code || {}
            };
        } catch (error) {
            return defaultProgress();
        }
    }

    function saveProgress() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }

    function check(id, label, pattern) {
        return {
            id,
            label,
            test(code) {
                return pattern.test(normalizeCode(code));
            }
        };
    }

    function normalizeCode(code) {
        return String(code || '')
            .replace(/[“”]/g, '"')
            .replace(/[‘’]/g, "'")
            .replace(/\r\n/g, '\n');
    }

    function getLang() {
        return document.documentElement.lang === 'en' ? 'en' : 'ko';
    }

    function text(value) {
        if (typeof value === 'string') return value;
        return value[getLang()] || value.ko || value.en || '';
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function format(template, values) {
        return Object.entries(values).reduce((output, [key, value]) => output.replace(`{${key}}`, value), template);
    }

    function languageIcon(language) {
        if (language === 'Python') return 'fa-feather-pointed';
        if (language === 'Java') return 'fa-mug-hot';
        return 'fa-microchip';
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
