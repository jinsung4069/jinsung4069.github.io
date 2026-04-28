(function() {
    const STORAGE_KEY = 'databaseLabProgressV1';
    const KCI_CSV_PATH = '../data/kci_articles.csv';
    const SQL_JS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/';
    const RESULT_LIMIT = 50;

    const ui = {
        module: { ko: '모듈', en: 'Module' },
        completed: { ko: '완료', en: 'Complete' },
        notCompleted: { ko: '진행 전', en: 'Open' },
        score: { ko: '점수', en: 'Score' },
        attempts: { ko: '시도', en: 'Attempts' },
        concept: { ko: '개념 요약', en: 'Concept Summary' },
        scenario: { ko: '실습 시나리오', en: 'Practice Scenario' },
        task: { ko: '실습 과제', en: 'Practice Task' },
        check: { ko: '실행 및 채점', en: 'Run and Check' },
        next: { ko: '다음 모듈', en: 'Next Module' },
        restart: { ko: '첫 모듈로', en: 'First Module' },
        explanation: { ko: '해설', en: 'Explanation' },
        sample: { ko: '예시 답안', en: 'Sample Answer' },
        choiceHelp: { ko: '옳은 설계 결정을 모두 선택하세요.', en: 'Select every correct design decision.' },
        successTitle: { ko: '좋습니다. 이 모듈을 완료했습니다.', en: 'Nice work. This module is complete.' },
        retryTitle: { ko: '조금 더 다듬어 보세요.', en: 'A little more refinement needed.' },
        choiceResult: { ko: '필수 선택지 {correct}개 중 {selected}개를 맞혔고, 부적절한 선택지는 {wrong}개입니다.', en: 'You matched {selected} of {correct} required choices and selected {wrong} unsuitable choices.' },
        sqlResult: { ko: '요구 조건 {total}개 중 {met}개를 만족했습니다.', en: 'Your answer satisfies {met} of {total} requirements.' },
        resetConfirm: { ko: '데이터베이스 구축 실습 진도와 점수를 초기화할까요?', en: 'Reset Database Lab progress and scores?' },
        datasetLoading: { ko: '데이터셋 로딩 중', en: 'Loading Dataset' },
        datasetReady: { ko: '데이터셋 준비 완료', en: 'Dataset Ready' },
        datasetError: { ko: '데이터셋 오류', en: 'Dataset Error' },
        datasetTitle: { ko: 'KCI 논문 실습 데이터', en: 'KCI Article Practice Data' },
        datasetLoadingBody: { ko: 'KCI CSV와 SQLite 엔진을 불러오는 중입니다.', en: 'Loading the KCI CSV and SQLite engine.' },
        datasetReadyBody: { ko: 'CSV를 브라우저 SQLite에 적재했습니다. 검색 체험과 SQL 응용/활용 모듈은 실제 질의 결과를 사용합니다.', en: 'The CSV has been loaded into browser SQLite. The search experience and SQL modules use real query results.' },
        datasetFallbackBody: { ko: 'CSV 또는 SQL 엔진 로딩에 실패했습니다. 선택형 모듈은 계속 사용할 수 있습니다.', en: 'CSV or SQL engine loading failed. Choice modules remain available.' },
        rows: { ko: '행', en: 'Rows' },
        columns: { ko: '컬럼', en: 'Columns' },
        journals: { ko: '학술지', en: 'Journals' },
        keywords: { ko: '키워드', en: 'Keywords' },
        resultPreview: { ko: '실행 결과 미리보기', en: 'Result Preview' },
        noRows: { ko: '표시할 결과 행이 없습니다.', en: 'No result rows to display.' },
        blockedSql: { ko: '원본 KCI 테이블은 직접 수정할 수 없습니다. article_review 같은 실습용 파생 테이블을 사용하세요.', en: 'Source KCI tables cannot be modified directly. Use derived practice tables such as article_review.' },
        sqlUnavailable: { ko: 'KCI 데이터셋 또는 SQLite 엔진이 아직 준비되지 않았습니다.', en: 'The KCI dataset or SQLite engine is not ready yet.' },
        runSearch: { ko: '검색 실행', en: 'Run Search' },
        resetSearch: { ko: '검색 초기화', en: 'Reset Search' },
        generatedSql: { ko: '실제 실행 SQL', en: 'Generated SQL' },
        searchResults: { ko: '검색 결과', en: 'Search Results' },
        searchExperienceResult: { ko: '체험 조건 {total}개 중 {met}개를 만족했습니다.', en: 'You completed {met} of {total} experience requirements.' },
        searchNotRun: { ko: '왼쪽 조건을 조정한 뒤 검색 실행을 눌러 SQL과 결과를 확인하세요.', en: 'Adjust filters on the left, then run the search to inspect SQL and results.' },
        searchRunCount: { ko: '실행 횟수', en: 'Runs' }
    };

    const modules = [
        {
            id: 'physical',
            kind: 'choice',
            title: {
                ko: '물리 데이터베이스 설계',
                en: 'Physical Database Design'
            },
            subtitle: {
                ko: '논리 모델을 실제 DBMS에 맞는 테이블, 키, 제약조건, 인덱스로 구체화합니다.',
                en: 'Turn a logical model into concrete tables, keys, constraints, and indexes for a DBMS.'
            },
            summary: [
                {
                    ko: '물리 설계는 저장 구조, 데이터 타입, 키, 인덱스, 제약조건을 정해 성능과 무결성을 함께 확보하는 단계입니다.',
                    en: 'Physical design chooses storage structure, data types, keys, indexes, and constraints to balance performance and integrity.'
                },
                {
                    ko: 'PK/FK와 CHECK 제약조건은 애플리케이션 코드 밖에서도 데이터 품질을 지키는 안전장치입니다.',
                    en: 'PK/FK and CHECK constraints protect data quality beyond application code.'
                },
                {
                    ko: '인덱스는 조회 패턴을 기준으로 설계하며, 과도한 인덱스는 입력/수정 성능을 떨어뜨릴 수 있습니다.',
                    en: 'Indexes should match query patterns; too many indexes can slow inserts and updates.'
                }
            ],
            scenario: {
                ko: '온라인 강의 플랫폼에서 주문과 주문상세를 저장하려고 합니다. 주요 조회는 회원별 주문 목록, 기간별 매출, 주문별 상세 내역입니다. 주문상세는 같은 주문 안에서 동일 상품이 한 번만 등장해야 합니다.',
                en: 'An online learning platform needs to store orders and order items. Common queries are member order history, sales by date range, and details for a single order. The same product must appear only once inside an order.'
            },
            prompt: {
                ko: '다음 중 물리 설계 결정으로 적절한 항목을 모두 고르세요.',
                en: 'Select all decisions that are appropriate for the physical design.'
            },
            choices: [
                { id: 'numeric-key', text: { ko: '주문번호는 문자열보다 BIGINT 같은 정수형 식별자로 정의한다.', en: 'Define order numbers as numeric identifiers such as BIGINT instead of generic strings.' } },
                { id: 'pk-fk', text: { ko: '주문상세의 order_no는 주문 테이블의 PK를 참조하는 FK로 둔다.', en: 'Make order_item.order_no a foreign key referencing the order table primary key.' } },
                { id: 'composite-unique', text: { ko: '주문상세에는 (order_no, product_id) 복합 PK 또는 UNIQUE 제약조건을 둔다.', en: 'Use a composite PK or UNIQUE constraint on (order_no, product_id) for order items.' } },
                { id: 'query-index', text: { ko: '회원별/기간별 조회를 위해 member_id, order_date 중심의 인덱스를 검토한다.', en: 'Consider indexes around member_id and order_date for member and date-range queries.' } },
                { id: 'check-constraints', text: { ko: 'quantity > 0, status 코드 범위 같은 CHECK 제약조건을 둔다.', en: 'Add CHECK constraints such as quantity > 0 and valid status codes.' } },
                { id: 'money-decimal', text: { ko: '금액은 부동소수점보다 DECIMAL/NUMERIC 계열로 저장한다.', en: 'Store money values as DECIMAL/NUMERIC rather than floating-point types.' } },
                { id: 'all-varchar', text: { ko: '향후 변경에 대비해 모든 컬럼을 VARCHAR(255)로 통일한다.', en: 'Use VARCHAR(255) for every column to prepare for future changes.' } },
                { id: 'duplicate-product-name', text: { ko: '조회 편의를 위해 주문상세마다 상품명을 반복 저장하고 상품 테이블은 만들지 않는다.', en: 'Repeat product names in every order item and skip a product table for convenience.' } }
            ],
            correct: ['numeric-key', 'pk-fk', 'composite-unique', 'query-index', 'check-constraints', 'money-decimal'],
            hint: {
                ko: '타입은 의미에 맞게, 키와 제약조건은 무결성에 맞게, 인덱스는 조회 패턴에 맞게 고릅니다.',
                en: 'Match types to meaning, keys and constraints to integrity, and indexes to query patterns.'
            },
            explanation: {
                ko: '정수형 식별자, FK, 복합 유일성, 조회 기반 인덱스, CHECK 제약조건, DECIMAL 금액 타입은 물리 설계의 핵심 선택입니다. 모든 값을 VARCHAR로 처리하거나 정규화해야 할 상품 정보를 반복 저장하면 무결성과 성능 모두 나빠질 수 있습니다.',
                en: 'Numeric identifiers, FKs, composite uniqueness, query-driven indexes, CHECK constraints, and DECIMAL money types are solid physical design choices. Treating every value as VARCHAR or duplicating product data weakens integrity and performance.'
            },
            sample: {
                ko: 'orders(order_no PK, member_id FK, order_date, total_amount DECIMAL, status CHECK)\norder_items(order_no FK, product_id FK, quantity CHECK, sale_price DECIMAL, PK(order_no, product_id))',
                en: 'orders(order_no PK, member_id FK, order_date, total_amount DECIMAL, status CHECK)\norder_items(order_no FK, product_id FK, quantity CHECK, sale_price DECIMAL, PK(order_no, product_id))'
            }
        },
        {
            id: 'search-experience',
            kind: 'search',
            runtime: 'sqlite',
            title: {
                ko: '논문 검색 SQL 체험',
                en: 'Article Search SQL Experience'
            },
            subtitle: {
                ko: '검색 화면에서 조건을 선택하면 브라우저 SQLite가 어떤 SQL로 KCI 논문을 찾는지 확인합니다.',
                en: 'Use a search screen and inspect the SQL that browser SQLite runs against KCI articles.'
            },
            summary: [
                {
                    ko: '웹 검색창의 검색어, 연도, 학술지, 키워드 필터는 SQL의 WHERE 조건으로 바뀝니다.',
                    en: 'Search terms, years, journals, and keyword filters become SQL WHERE clauses.'
                },
                {
                    ko: '정렬 옵션은 ORDER BY, 결과 개수 제한은 LIMIT으로 표현됩니다.',
                    en: 'Sort options become ORDER BY, and result limits become LIMIT.'
                },
                {
                    ko: '프론트엔드는 사용자가 이해하기 쉬운 화면을 제공하고, 데이터베이스는 SQL로 실제 행을 찾아 반환합니다.',
                    en: 'The frontend provides an approachable interface, while the database finds and returns rows through SQL.'
                }
            ],
            scenario: {
                ko: '학습자가 KCI 논문을 검색하는 간단한 프론트엔드를 사용합니다. 왼쪽에서 검색어와 필터를 바꾸면 오른쪽에서 실제 실행 SQL과 결과 테이블을 바로 확인할 수 있습니다.',
                en: 'A learner uses a compact KCI article search frontend. Changing filters on the left shows the actual SQL and result table on the right.'
            },
            prompt: {
                ko: '검색어, 연도, 학술지 또는 키워드 조건을 바꿔 검색을 두 번 이상 실행해 보세요. 각 검색이 SELECT, WHERE, JOIN/EXISTS, ORDER BY, LIMIT으로 어떻게 표현되는지 관찰합니다.',
                en: 'Run at least two searches with different terms, years, journals, or keyword filters. Observe how each search becomes SELECT, WHERE, JOIN/EXISTS, ORDER BY, and LIMIT.'
            },
            checks: [
                { id: 'run-twice', label: { ko: '검색을 2회 이상 실행', en: 'Run the search at least twice' } },
                { id: 'generated-select', label: { ko: '생성 SQL에 SELECT와 kci_articles 포함', en: 'Generated SQL includes SELECT and kci_articles' } },
                { id: 'where-filter', label: { ko: '검색/연도/학술지/키워드 필터가 WHERE로 반영', en: 'Search, year, journal, or keyword filters appear in WHERE' } },
                { id: 'keyword-link', label: { ko: '키워드 조건이 article_keywords와 연결', en: 'Keyword filtering connects to article_keywords' } },
                { id: 'result-rows', label: { ko: '실제 SQLite 검색 결과 반환', en: 'SQLite returns real search rows' } }
            ],
            hint: {
                ko: '왼쪽 필터를 바꾼 뒤 검색 실행을 두 번 이상 눌러 보세요. 키워드 필터를 입력하면 article_keywords 테이블과 연결되는 SQL을 볼 수 있습니다.',
                en: 'Change filters on the left and run the search at least twice. Entering a keyword filter reveals SQL connected to article_keywords.'
            },
            explanation: {
                ko: '검색 프론트엔드는 사용자가 SQL을 직접 쓰지 않아도 데이터베이스 질의를 만들 수 있게 해 줍니다. 검색어는 LIKE, 연도는 비교 조건, 학술지는 동등 조건, 키워드는 article_keywords를 참조하는 EXISTS 조건으로 바뀌며, 실제 SQLite 실행 결과가 화면에 표시됩니다.',
                en: 'A search frontend lets users build database queries without writing SQL directly. Terms become LIKE, years become comparisons, journals become equality filters, keywords become EXISTS against article_keywords, and SQLite results are rendered on screen.'
            },
            sample: {
                ko: "SELECT a.article_id, a.title, a.journal, a.publication_year\nFROM kci_articles a\nWHERE (a.title LIKE '%AI%' OR a.abstract LIKE '%AI%')\n  AND a.publication_year >= 2024\n  AND EXISTS (\n    SELECT 1 FROM article_keywords kw\n    WHERE kw.article_id = a.article_id\n      AND kw.keyword LIKE '%education%'\n  )\nORDER BY a.publication_year DESC\nLIMIT 20;",
                en: "SELECT a.article_id, a.title, a.journal, a.publication_year\nFROM kci_articles a\nWHERE (a.title LIKE '%AI%' OR a.abstract LIKE '%AI%')\n  AND a.publication_year >= 2024\n  AND EXISTS (\n    SELECT 1 FROM article_keywords kw\n    WHERE kw.article_id = a.article_id\n      AND kw.keyword LIKE '%education%'\n  )\nORDER BY a.publication_year DESC\nLIMIT 20;"
            }
        },
        {
            id: 'sql-application',
            kind: 'sql',
            runtime: 'sqlite',
            title: {
                ko: 'SQL 응용',
                en: 'SQL Application'
            },
            subtitle: {
                ko: 'KCI 논문 CSV를 이용해 DDL, DML, TCL 흐름을 실제 SQLite에서 실행합니다.',
                en: 'Run DDL, DML, and TCL in SQLite using the KCI article CSV.'
            },
            summary: [
                {
                    ko: 'KCI 데이터는 kci_articles 테이블에 적재되어 있으며, 사용자는 실습용 파생 테이블을 만들어 데이터를 조작합니다.',
                    en: 'The KCI data is loaded into kci_articles, and you manipulate a derived practice table.'
                },
                {
                    ko: '원본 테이블은 직접 수정하지 않고 CREATE TABLE AS SELECT, UPDATE, DELETE로 작업 흐름을 연습합니다.',
                    en: 'Practice with CREATE TABLE AS SELECT, UPDATE, and DELETE without changing the source table.'
                },
                {
                    ko: 'COMMIT은 실행 흐름에 포함하고, ROLLBACK은 실패 대응 절차로 SQL 주석에 명시합니다.',
                    en: 'COMMIT is included in the runnable flow, while ROLLBACK is documented as the failure procedure in a SQL comment.'
                }
            ],
            scenario: {
                ko: 'KCI 논문 중 2024년 이후 논문 일부를 검토 대상 테이블 article_review로 복사하고, 최신 논문 상태를 갱신한 뒤 제목이 비어 있는 행을 정리합니다.',
                en: 'Copy recent KCI articles into an article_review table, update review status for newer articles, and clean rows with missing titles.'
            },
            prompt: {
                ko: 'article_review 테이블을 만들고 kci_articles에서 2024년 이후 논문을 20건 이상 INSERT 하세요. review_status 컬럼을 두고 2025년 이후 논문은 RECENT로 UPDATE, 제목 누락 행은 DELETE, COMMIT과 실패 시 ROLLBACK 절차를 포함하세요.',
                en: 'Create article_review, insert at least 20 articles from kci_articles published since 2024, add review_status, update articles since 2025 to RECENT, delete rows with missing titles, and include COMMIT plus a ROLLBACK failure procedure.'
            },
            placeholder: {
                ko: 'CREATE TABLE article_review (...);\nINSERT INTO article_review\nSELECT ... FROM kci_articles WHERE publication_year >= 2024 LIMIT 20;\nUPDATE article_review SET review_status = ...;\nDELETE FROM article_review WHERE ...;\nCOMMIT;\n-- 실패 시 ROLLBACK;',
                en: 'CREATE TABLE article_review (...);\nINSERT INTO article_review\nSELECT ... FROM kci_articles WHERE publication_year >= 2024 LIMIT 20;\nUPDATE article_review SET review_status = ...;\nDELETE FROM article_review WHERE ...;\nCOMMIT;\n-- ROLLBACK on failure;'
            },
            checks: [
                { id: 'runs', label: { ko: 'SQL이 오류 없이 실행됨', en: 'SQL runs without errors' } },
                { id: 'create-review', label: { ko: 'article_review 테이블 생성', en: 'Create article_review table' } },
                { id: 'insert-source', label: { ko: 'kci_articles에서 INSERT', en: 'Insert from kci_articles' } },
                { id: 'required-columns', label: { ko: 'article_id, title, publication_year, review_status 컬럼 포함', en: 'Include article_id, title, publication_year, and review_status' } },
                { id: 'row-count', label: { ko: '검토 행 20건 이상 생성', en: 'Create at least 20 review rows' } },
                { id: 'update-status', label: { ko: 'UPDATE로 RECENT 상태 반영', en: 'Apply RECENT status with UPDATE' } },
                { id: 'delete-cleanup', label: { ko: 'DELETE로 제목 누락 행 정리', en: 'Clean missing-title rows with DELETE' } },
                { id: 'commit-rollback', label: { ko: 'COMMIT과 ROLLBACK 절차 포함', en: 'Include COMMIT and ROLLBACK procedure' } }
            ],
            hint: {
                ko: '원본 kci_articles는 SELECT 원천으로만 사용하고, article_review를 만든 뒤 그 테이블에서 UPDATE/DELETE를 수행하세요.',
                en: 'Use kci_articles only as a SELECT source, then run UPDATE/DELETE on article_review.'
            },
            explanation: {
                ko: 'SQL 응용은 구조 정의와 데이터 조작을 하나의 업무 흐름으로 묶는 연습입니다. 이 실습에서는 KCI 원본 CSV를 읽기 전용 원천으로 두고, 검토용 파생 테이블에서 INSERT, UPDATE, DELETE, COMMIT 절차를 실제로 실행합니다.',
                en: 'SQL application combines structure definition and data manipulation into a workflow. Here, KCI CSV data stays as a read-only source while INSERT, UPDATE, DELETE, and COMMIT run against a review table.'
            },
            sample: {
                ko: 'BEGIN TRANSACTION;\nCREATE TABLE article_review (\n  article_id TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  publication_year INTEGER,\n  review_status TEXT DEFAULT \'PENDING\'\n);\n\nINSERT INTO article_review (article_id, title, publication_year, review_status)\nSELECT article_id, title, publication_year, \'PENDING\'\nFROM kci_articles\nWHERE publication_year >= 2024\nORDER BY publication_year DESC, article_id\nLIMIT 30;\n\nUPDATE article_review\nSET review_status = \'RECENT\'\nWHERE publication_year >= 2025;\n\nDELETE FROM article_review\nWHERE title IS NULL OR TRIM(title) = \'\';\n\nCOMMIT;\n-- 실패 시 ROLLBACK;',
                en: 'BEGIN TRANSACTION;\nCREATE TABLE article_review (\n  article_id TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  publication_year INTEGER,\n  review_status TEXT DEFAULT \'PENDING\'\n);\n\nINSERT INTO article_review (article_id, title, publication_year, review_status)\nSELECT article_id, title, publication_year, \'PENDING\'\nFROM kci_articles\nWHERE publication_year >= 2024\nORDER BY publication_year DESC, article_id\nLIMIT 30;\n\nUPDATE article_review\nSET review_status = \'RECENT\'\nWHERE publication_year >= 2025;\n\nDELETE FROM article_review\nWHERE title IS NULL OR TRIM(title) = \'\';\n\nCOMMIT;\n-- ROLLBACK on failure;'
            }
        },
        {
            id: 'sql-usage',
            kind: 'sql',
            runtime: 'sqlite',
            title: {
                ko: 'SQL 활용',
                en: 'SQL Usage'
            },
            subtitle: {
                ko: 'KCI 논문, 학술지, 키워드 테이블을 조인해 실제 분석 질의를 작성합니다.',
                en: 'Write analytical queries by joining KCI articles, journals, and keywords.'
            },
            summary: [
                {
                    ko: '데이터셋은 kci_articles, journals, article_keywords 세 테이블로 구성됩니다.',
                    en: 'The dataset is available as kci_articles, journals, and article_keywords.'
                },
                {
                    ko: 'JOIN, GROUP BY, HAVING, 서브쿼리를 이용해 연도별/학술지별 연구 동향을 분석합니다.',
                    en: 'Use JOIN, GROUP BY, HAVING, and subqueries to analyze research trends by year and journal.'
                },
                {
                    ko: 'CREATE INDEX IF NOT EXISTS를 사용하면 반복 조회 조건을 물리 설계 관점으로 연결할 수 있습니다.',
                    en: 'CREATE INDEX IF NOT EXISTS connects repeated query conditions back to physical design.'
                }
            ],
            scenario: {
                ko: 'AI 또는 인공지능 키워드가 포함된 논문을 대상으로, 학술지와 연도별 논문 수를 집계해 일정 건수 이상인 그룹만 보여주는 분석 질의를 만듭니다.',
                en: 'Analyze articles containing AI-related keywords, grouped by journal and publication year, and show only groups above a threshold.'
            },
            prompt: {
                ko: 'kci_articles, journals, article_keywords를 JOIN하고, AI/인공지능 관련 키워드를 서브쿼리로 필터링하세요. 연도와 학술지별 COUNT를 구하고 GROUP BY, HAVING, CREATE INDEX IF NOT EXISTS를 포함하세요.',
                en: 'Join kci_articles, journals, and article_keywords, filter AI-related keywords with a subquery, count articles by year and journal, and include GROUP BY, HAVING, and CREATE INDEX IF NOT EXISTS.'
            },
            placeholder: {
                ko: 'CREATE INDEX IF NOT EXISTS ...;\nSELECT a.publication_year, j.journal, COUNT(DISTINCT a.article_id) AS article_count\nFROM ...\nJOIN ...\nWHERE a.article_id IN (SELECT ...)\nGROUP BY ...\nHAVING COUNT(...) >= 2;',
                en: 'CREATE INDEX IF NOT EXISTS ...;\nSELECT a.publication_year, j.journal, COUNT(DISTINCT a.article_id) AS article_count\nFROM ...\nJOIN ...\nWHERE a.article_id IN (SELECT ...)\nGROUP BY ...\nHAVING COUNT(...) >= 2;'
            },
            checks: [
                { id: 'runs', label: { ko: 'SQL이 오류 없이 실행됨', en: 'SQL runs without errors' } },
                { id: 'index', label: { ko: 'CREATE INDEX 포함', en: 'Include CREATE INDEX' } },
                { id: 'tables', label: { ko: '세 테이블 모두 사용', en: 'Use all three tables' } },
                { id: 'join', label: { ko: 'JOIN으로 테이블 연결', en: 'Connect tables with JOIN' } },
                { id: 'subquery', label: { ko: '서브쿼리로 키워드 조건 필터링', en: 'Filter keyword condition with a subquery' } },
                { id: 'group-having', label: { ko: 'GROUP BY와 HAVING 사용', en: 'Use GROUP BY and HAVING' } },
                { id: 'count-result', label: { ko: '집계 결과 행 반환', en: 'Return aggregate result rows' } },
                { id: 'result-columns', label: { ko: 'publication_year, journal, article_count 결과 컬럼 포함', en: 'Return publication_year, journal, and article_count columns' } }
            ],
            hint: {
                ko: '키워드 조건은 article_keywords에서 찾고, 본문 집계는 kci_articles와 journals를 조인해 수행하세요.',
                en: 'Find keyword conditions in article_keywords, then aggregate by joining kci_articles and journals.'
            },
            explanation: {
                ko: 'SQL 활용은 실제 데이터에서 의미 있는 결과 집합을 도출하는 연습입니다. 이 문제는 키워드 테이블에서 분석 대상을 좁히고, 논문과 학술지 테이블을 조인한 뒤 GROUP BY/HAVING으로 집계 조건을 검증합니다.',
                en: 'SQL usage extracts meaningful result sets from real data. This task narrows the target articles in the keyword table, joins articles and journals, and validates grouped conditions with GROUP BY/HAVING.'
            },
            sample: {
                ko: 'CREATE INDEX IF NOT EXISTS idx_article_keywords_keyword\nON article_keywords(keyword);\n\nSELECT\n  a.publication_year,\n  j.journal,\n  COUNT(DISTINCT a.article_id) AS article_count\nFROM kci_articles a\nJOIN journals j ON j.journal = a.journal\nJOIN article_keywords k ON k.article_id = a.article_id\nWHERE a.article_id IN (\n  SELECT article_id\n  FROM article_keywords\n  WHERE keyword LIKE \'%AI%\'\n     OR keyword LIKE \'%인공지능%\'\n     OR keyword LIKE \'%Artificial Intelligence%\'\n)\nGROUP BY a.publication_year, j.journal\nHAVING COUNT(DISTINCT a.article_id) >= 2\nORDER BY a.publication_year DESC, article_count DESC;',
                en: 'CREATE INDEX IF NOT EXISTS idx_article_keywords_keyword\nON article_keywords(keyword);\n\nSELECT\n  a.publication_year,\n  j.journal,\n  COUNT(DISTINCT a.article_id) AS article_count\nFROM kci_articles a\nJOIN journals j ON j.journal = a.journal\nJOIN article_keywords k ON k.article_id = a.article_id\nWHERE a.article_id IN (\n  SELECT article_id\n  FROM article_keywords\n  WHERE keyword LIKE \'%AI%\'\n     OR keyword LIKE \'%인공지능%\'\n     OR keyword LIKE \'%Artificial Intelligence%\'\n)\nGROUP BY a.publication_year, j.journal\nHAVING COUNT(DISTINCT a.article_id) >= 2\nORDER BY a.publication_year DESC, article_count DESC;'
            }
        },
        {
            id: 'data-conversion',
            kind: 'choice',
            title: {
                ko: '데이터 전환',
                en: 'Data Conversion'
            },
            subtitle: {
                ko: '원천 데이터를 목표 스키마로 옮기기 전 매핑, 정제, 검증 기준을 세웁니다.',
                en: 'Define mapping, cleansing, and validation rules before moving source data into a target schema.'
            },
            summary: [
                {
                    ko: '데이터 전환은 추출, 정제, 변환, 적재, 검증으로 이어지는 품질 관리 과정입니다.',
                    en: 'Data conversion is a quality process across extraction, cleansing, transformation, loading, and validation.'
                },
                {
                    ko: '전환 설계서에는 컬럼 매핑, 타입 변환, 기본값, 오류 처리, 검증 방법이 명확해야 합니다.',
                    en: 'A conversion design should clarify column mapping, type conversion, defaults, error handling, and validation.'
                },
                {
                    ko: 'KCI 엑셀을 CSV로 전환할 때도 중복 논문 ID, 빈 값, 날짜/숫자 타입, 키워드 분리를 검증해야 합니다.',
                    en: 'The KCI Excel-to-CSV conversion also needs checks for duplicate article IDs, blanks, date/numeric types, and keyword splitting.'
                }
            ],
            scenario: {
                ko: '여러 KCI 엑셀 파일을 하나의 CSV로 합치고, 논문 ID 기준 중복을 제거한 뒤 SQL 실습에 사용할 정규화 CSV를 만듭니다.',
                en: 'Multiple KCI Excel files are merged into CSV, deduplicated by article ID, and normalized for SQL practice.'
            },
            prompt: {
                ko: '데이터 전환 계획에 반드시 포함해야 할 항목을 모두 선택하세요.',
                en: 'Select every item that must be included in the data conversion plan.'
            },
            choices: [
                { id: 'mapping', text: { ko: '원천 컬럼과 목표 컬럼의 매핑표를 작성한다.', en: 'Create a mapping table between source and target columns.' } },
                { id: 'trim', text: { ko: '제목, 저자, 키워드의 불필요한 줄바꿈과 공백을 정제한다.', en: 'Clean unnecessary line breaks and spaces in titles, authors, and keywords.' } },
                { id: 'date-format', text: { ko: '발행연도와 발행일을 목표 타입에 맞게 변환한다.', en: 'Convert publication year and date into target-friendly types.' } },
                { id: 'keyword-split', text: { ko: '키워드를 분리해 article_keywords 같은 분석용 테이블로 만들 수 있게 한다.', en: 'Split keywords so an article_keywords analysis table can be built.' } },
                { id: 'dedupe', text: { ko: '논문 ID 기준 중복 탐지 및 source_files 병합 기준을 정한다.', en: 'Define duplicate detection by article ID and source_files merging.' } },
                { id: 'reject-required', text: { ko: '논문 ID 같은 필수값 누락 행은 오류 로그로 분리한다.', en: 'Separate rows missing required values such as article ID into an error log.' } },
                { id: 'validate', text: { ko: '전환 후 건수, 필수 컬럼, 중복 ID 검증을 수행한다.', en: 'Validate row counts, required columns, and duplicate IDs after conversion.' } },
                { id: 'load-invalid', text: { ko: '전환 속도를 위해 오류 행도 모두 목표 테이블에 그대로 적재한다.', en: 'Load every invalid row into the target table unchanged to maximize speed.' } },
                { id: 'ignore-types', text: { ko: '원천 엑셀의 문자열 길이를 그대로 믿고 목표 타입 검토를 생략한다.', en: 'Trust source Excel string lengths and skip target type review.' } }
            ],
            correct: ['mapping', 'trim', 'date-format', 'keyword-split', 'dedupe', 'reject-required', 'validate'],
            hint: {
                ko: '전환 계획은 무엇을 어디로 옮기는지, 어떻게 고치는지, 잘 옮겨졌는지까지 포함해야 합니다.',
                en: 'A conversion plan must cover what moves where, how it is cleaned, and how success is verified.'
            },
            explanation: {
                ko: '데이터 전환은 단순 복사가 아니라 품질 보증 절차입니다. KCI 파일처럼 여러 원천을 합칠 때는 컬럼 매핑, 공백 정제, 타입 변환, 키워드 분리, 중복 처리, 오류 분리, 전환 검증이 필요합니다.',
                en: 'Data conversion is not simple copying; it is a quality-assurance process. For multiple KCI sources, mapping, cleansing, type conversion, keyword splitting, duplicate handling, error separation, and validation are required.'
            },
            sample: {
                ko: '1. 원본 컬럼 union 보존\n2. 실습용 핵심 컬럼으로 정규화\n3. ART 논문 ID 기준 중복 제거와 source_files 병합\n4. CSV 재로딩 후 행 수, 필수 컬럼, 중복 ID 검증',
                en: '1. Preserve the union of source columns\n2. Normalize to practice-friendly columns\n3. Deduplicate by ART article ID and merge source_files\n4. Reload CSV and validate row counts, required columns, and duplicate IDs'
            }
        }
    ];

    let progress = loadProgress();
    const dataset = {
        status: 'loading',
        error: '',
        rows: [],
        columns: [],
        sampleRows: [],
        journalCount: 0,
        keywordCount: 0,
        SQL: null
    };
    const searchExperienceState = {
        runs: 0,
        filters: null,
        lastSql: '',
        lastResult: null,
        lastError: ''
    };

    document.addEventListener('DOMContentLoaded', () => {
        render();
        initializeDataset();

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

    async function initializeDataset() {
        try {
            if (typeof initSqlJs !== 'function') {
                throw new Error('sql.js is not loaded');
            }
            dataset.SQL = await initSqlJs({
                locateFile: file => `${SQL_JS_CDN}${file}`
            });
            const response = await fetch(KCI_CSV_PATH);
            if (!response.ok) {
                throw new Error(`CSV request failed: ${response.status}`);
            }
            const csvText = await response.text();
            const parsed = parseCsv(csvText);
            dataset.columns = parsed.headers;
            dataset.rows = parsed.rows;
            dataset.sampleRows = parsed.rows.slice(0, 5);
            const db = createKciDatabase();
            dataset.journalCount = scalar(db, 'SELECT COUNT(*) FROM journals');
            dataset.keywordCount = scalar(db, 'SELECT COUNT(*) FROM article_keywords');
            db.close();
            dataset.status = 'ready';
        } catch (error) {
            dataset.status = 'error';
            dataset.error = error.message || String(error);
        }
        render();
    }

    function getLang() {
        return document.documentElement.lang === 'en' ? 'en' : 'ko';
    }

    function text(value) {
        if (typeof value === 'string') return value;
        return value[getLang()] || value.ko || value.en || '';
    }

    function defaultProgress() {
        return {
            currentModule: modules[0].id,
            completedModules: [],
            scores: {},
            attempts: {}
        };
    }

    function loadProgress() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!saved || !saved.currentModule) return defaultProgress();
            return {
                ...defaultProgress(),
                ...saved,
                completedModules: Array.isArray(saved.completedModules) ? saved.completedModules : [],
                scores: saved.scores || {},
                attempts: saved.attempts || {}
            };
        } catch (error) {
            return defaultProgress();
        }
    }

    function saveProgress() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }

    function render() {
        renderOverview();
        renderDatasetStatus();
        renderTabs();
        renderModule();
    }

    function renderOverview() {
        const completed = progress.completedModules.length;
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');
        const averageScore = document.getElementById('averageScore');
        const currentModuleLabel = document.getElementById('currentModuleLabel');
        const currentModule = getCurrentModule();

        if (progressText) {
            progressText.textContent = `${completed} / ${modules.length}`;
        }
        if (progressFill) {
            progressFill.style.width = `${completed / modules.length * 100}%`;
        }
        if (averageScore) {
            const scoreValues = Object.values(progress.scores);
            const average = scoreValues.length ? Math.round(scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length) : 0;
            averageScore.textContent = `${average}`;
        }
        if (currentModuleLabel) {
            currentModuleLabel.textContent = text(currentModule.title);
        }
    }

    function renderDatasetStatus() {
        const container = document.getElementById('datasetStatus');
        if (!container) return;

        const statusText = dataset.status === 'ready'
            ? text(ui.datasetReady)
            : dataset.status === 'error'
                ? text(ui.datasetError)
                : text(ui.datasetLoading);
        const body = dataset.status === 'ready'
            ? text(ui.datasetReadyBody)
            : dataset.status === 'error'
                ? `${text(ui.datasetFallbackBody)} ${dataset.error ? `(${dataset.error})` : ''}`
                : text(ui.datasetLoadingBody);

        container.innerHTML = `
            <div>
                <p class="overview-label">${escapeHtml(text(ui.datasetTitle))}</p>
                <h2>${escapeHtml(statusText)}</h2>
                <p>${escapeHtml(body)}</p>
                <div class="dataset-metrics">
                    <span class="dataset-metric">${escapeHtml(text(ui.rows))}: ${dataset.rows.length.toLocaleString()}</span>
                    <span class="dataset-metric">${escapeHtml(text(ui.columns))}: ${dataset.columns.length}</span>
                    <span class="dataset-metric">${escapeHtml(text(ui.journals))}: ${dataset.journalCount.toLocaleString()}</span>
                    <span class="dataset-metric">${escapeHtml(text(ui.keywords))}: ${dataset.keywordCount.toLocaleString()}</span>
                </div>
            </div>
            <span class="dataset-status-pill ${dataset.status}">${escapeHtml(statusText)}</span>
        `;
    }

    function renderTabs() {
        const tabs = document.getElementById('moduleTabs');
        if (!tabs) return;

        tabs.innerHTML = '';
        modules.forEach((module, index) => {
            const button = document.createElement('button');
            const score = progress.scores[module.id] || 0;
            const isComplete = progress.completedModules.includes(module.id);
            button.type = 'button';
            button.className = `module-tab${progress.currentModule === module.id ? ' active' : ''}${isComplete ? ' complete' : ''}`;
            button.innerHTML = `
                <span class="module-tab-title">${index + 1}. ${escapeHtml(text(module.title))}</span>
                <span class="module-tab-meta">${escapeHtml(isComplete ? text(ui.completed) : text(ui.notCompleted))} · ${escapeHtml(text(ui.score))} ${score}</span>
            `;
            button.addEventListener('click', () => {
                progress.currentModule = module.id;
                saveProgress();
                render();
            });
            tabs.appendChild(button);
        });
    }

    function renderModule() {
        const container = document.getElementById('moduleContent');
        if (!container) return;

        const module = getCurrentModule();
        const score = progress.scores[module.id] || 0;
        const attemptCount = progress.attempts[module.id] || 0;

        container.innerHTML = `
            <div class="module-heading">
                <div>
                    <p class="overview-label">${escapeHtml(text(ui.module))}</p>
                    <h2>${escapeHtml(text(module.title))}</h2>
                    <p>${escapeHtml(text(module.subtitle))}</p>
                </div>
                <div class="score-pill">${escapeHtml(text(ui.score))} ${score} · ${escapeHtml(text(ui.attempts))} ${attemptCount}</div>
            </div>

            <section class="lab-section">
                <h3>${escapeHtml(text(ui.concept))}</h3>
                <ul class="concept-list">
                    ${module.summary.map(item => `<li>${escapeHtml(text(item))}</li>`).join('')}
                </ul>
            </section>

            <section class="lab-section">
                <h3>${escapeHtml(text(ui.scenario))}</h3>
                <div class="scenario-box">${escapeHtml(text(module.scenario))}</div>
                ${module.runtime === 'sqlite' ? renderDatasetPreview() : ''}
            </section>

            <section class="lab-section">
                <h3>${escapeHtml(text(ui.task))}</h3>
                <p>${escapeHtml(text(module.prompt))}</p>
                ${renderExercise(module)}
                <div class="lab-actions">
                    <button id="checkAnswer" type="button">${escapeHtml(text(ui.check))}</button>
                    <button id="nextModule" class="secondary-action" type="button">${escapeHtml(isLastModule(module) ? text(ui.restart) : text(ui.next))}</button>
                </div>
                <div id="feedbackBox" class="feedback-box"></div>
            </section>

            <section class="lab-section">
                <h3>${escapeHtml(text(ui.explanation))}</h3>
                <div class="explanation-card">${escapeHtml(text(module.explanation))}</div>
                <pre class="sample-code" aria-label="${escapeHtml(text(ui.sample))}">${escapeHtml(text(module.sample))}</pre>
            </section>
        `;

        document.getElementById('checkAnswer').addEventListener('click', () => checkAnswer(module));
        document.getElementById('nextModule').addEventListener('click', () => goToNextModule(module));
        if (module.kind === 'search') {
            attachSearchExperience();
        }
    }

    function renderDatasetPreview() {
        if (dataset.status !== 'ready') {
            return `<div class="sql-note">${escapeHtml(text(ui.sqlUnavailable))}</div>`;
        }

        const previewColumns = ['article_id', 'title', 'journal', 'publication_year'];
        return `
            <div class="sql-note">
                <strong>kci_articles</strong>, <strong>journals</strong>, <strong>article_keywords</strong>
                · ${escapeHtml(text(ui.rows))}: ${dataset.rows.length.toLocaleString()}
            </div>
            ${renderResultTable({
                columns: previewColumns,
                values: dataset.sampleRows.map(row => previewColumns.map(column => row[column] || ''))
            }, 5)}
        `;
    }

    function renderChoiceExercise(module) {
        return `
            <p class="overview-label">${escapeHtml(text(ui.choiceHelp))}</p>
            <div class="choice-grid">
                ${module.choices.map(choice => `
                    <label class="choice-option">
                        <input type="checkbox" name="labChoice" value="${escapeHtml(choice.id)}">
                        <span>${escapeHtml(text(choice.text))}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    function renderExercise(module) {
        if (module.kind === 'choice') return renderChoiceExercise(module);
        if (module.kind === 'search') return renderSearchExperience();
        return renderSqlExercise(module);
    }

    function renderSearchExperience() {
        const filters = searchExperienceState.filters || {
            term: 'AI',
            yearFrom: '2024',
            yearTo: '',
            journal: '',
            keyword: 'AI',
            sort: 'year-desc'
        };
        const disabled = dataset.status !== 'ready' ? ' disabled' : '';
        const outputHtml = renderSearchOutput();

        return `
            <div class="search-experience-grid">
                <form id="paperSearchForm" class="search-form search-panel">
                    <label>
                        <span>${escapeHtml(text({ ko: '검색어', en: 'Search Term' }))}</span>
                        <input id="searchTerm" type="text" value="${escapeHtml(filters.term)}" placeholder="AI">
                    </label>
                    <div class="search-form-row">
                        <label>
                            <span>${escapeHtml(text({ ko: '시작 연도', en: 'From Year' }))}</span>
                            <input id="searchYearFrom" type="number" min="1900" max="2100" value="${escapeHtml(filters.yearFrom)}" placeholder="2024">
                        </label>
                        <label>
                            <span>${escapeHtml(text({ ko: '종료 연도', en: 'To Year' }))}</span>
                            <input id="searchYearTo" type="number" min="1900" max="2100" value="${escapeHtml(filters.yearTo)}" placeholder="2026">
                        </label>
                    </div>
                    <label>
                        <span>${escapeHtml(text({ ko: '학술지', en: 'Journal' }))}</span>
                        <select id="searchJournal"${disabled}>
                            <option value="">${escapeHtml(text({ ko: '전체 학술지', en: 'All Journals' }))}</option>
                            ${getSearchJournalOptions(filters.journal)}
                        </select>
                    </label>
                    <label>
                        <span>${escapeHtml(text({ ko: '키워드 필터', en: 'Keyword Filter' }))}</span>
                        <input id="searchKeyword" type="text" value="${escapeHtml(filters.keyword)}" placeholder="AI">
                    </label>
                    <label>
                        <span>${escapeHtml(text({ ko: '정렬', en: 'Sort' }))}</span>
                        <select id="searchSort">
                            <option value="year-desc"${filters.sort === 'year-desc' ? ' selected' : ''}>${escapeHtml(text({ ko: '최신 연도순', en: 'Newest Year' }))}</option>
                            <option value="year-asc"${filters.sort === 'year-asc' ? ' selected' : ''}>${escapeHtml(text({ ko: '오래된 연도순', en: 'Oldest Year' }))}</option>
                            <option value="title-asc"${filters.sort === 'title-asc' ? ' selected' : ''}>${escapeHtml(text({ ko: '제목 가나다순', en: 'Title A-Z' }))}</option>
                        </select>
                    </label>
                    <div class="search-actions">
                        <button id="runSearchExperience" type="submit"${disabled}>${escapeHtml(text(ui.runSearch))}</button>
                        <button id="resetSearchExperience" class="secondary-action" type="button">${escapeHtml(text(ui.resetSearch))}</button>
                    </div>
                    <p class="result-meta">${escapeHtml(text(ui.searchRunCount))}: ${searchExperienceState.runs}</p>
                </form>
                <div class="search-panel sql-preview-panel">
                    ${outputHtml}
                </div>
            </div>
        `;
    }

    function renderSqlExercise(module) {
        return `
            <div class="sql-note">${escapeHtml(module.id === 'sql-application'
                ? text({ ko: '실습용 article_review 테이블은 매 실행마다 새 SQLite DB에서 평가됩니다.', en: 'article_review is evaluated in a fresh SQLite database on each run.' })
                : text({ ko: 'SELECT 결과는 최대 50행까지 표시됩니다.', en: 'SELECT results are displayed up to 50 rows.' }))}</div>
            <textarea id="sqlAnswer" class="answer-area" spellcheck="false" placeholder="${escapeHtml(text(module.placeholder))}"></textarea>
        `;
    }

    function attachSearchExperience() {
        const form = document.getElementById('paperSearchForm');
        const resetButton = document.getElementById('resetSearchExperience');
        if (form) {
            form.addEventListener('submit', event => {
                event.preventDefault();
                runSearchExperience();
            });
        }
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                searchExperienceState.runs = 0;
                searchExperienceState.filters = null;
                searchExperienceState.lastSql = '';
                searchExperienceState.lastResult = null;
                searchExperienceState.lastError = '';
                renderModule();
            });
        }
    }

    function runSearchExperience() {
        const output = document.querySelector('.sql-preview-panel');
        searchExperienceState.filters = readSearchFilters();

        if (dataset.status !== 'ready') {
            searchExperienceState.lastError = text(ui.sqlUnavailable);
            searchExperienceState.lastSql = '';
            searchExperienceState.lastResult = null;
            if (output) output.innerHTML = renderSearchOutput();
            return;
        }

        let db;
        try {
            const sql = buildSearchSql(searchExperienceState.filters);
            searchExperienceState.lastSql = sql;
            db = createKciDatabase();
            const results = db.exec(sql);
            searchExperienceState.runs += 1;
            searchExperienceState.lastResult = results.length ? results[0] : null;
            searchExperienceState.lastError = '';
        } catch (error) {
            searchExperienceState.lastError = error.message || String(error);
            searchExperienceState.lastResult = null;
        } finally {
            if (db) db.close();
        }

        const runCount = document.querySelector('.search-form .result-meta');
        if (runCount) {
            runCount.textContent = `${text(ui.searchRunCount)}: ${searchExperienceState.runs}`;
        }
        if (output) {
            output.innerHTML = renderSearchOutput();
        }
    }

    function readSearchFilters() {
        return {
            term: document.getElementById('searchTerm')?.value.trim() || '',
            yearFrom: document.getElementById('searchYearFrom')?.value.trim() || '',
            yearTo: document.getElementById('searchYearTo')?.value.trim() || '',
            journal: document.getElementById('searchJournal')?.value || '',
            keyword: document.getElementById('searchKeyword')?.value.trim() || '',
            sort: document.getElementById('searchSort')?.value || 'year-desc'
        };
    }

    function buildSearchSql(filters) {
        const where = [];
        if (filters.term) {
            const pattern = sqlLikePattern(filters.term);
            where.push(`(a.title LIKE ${pattern} OR a.title_en LIKE ${pattern} OR a.abstract LIKE ${pattern} OR a.abstract_en LIKE ${pattern} OR a.authors LIKE ${pattern})`);
        }
        if (filters.yearFrom) {
            where.push(`a.publication_year >= ${Number(filters.yearFrom) || 0}`);
        }
        if (filters.yearTo) {
            where.push(`a.publication_year <= ${Number(filters.yearTo) || 9999}`);
        }
        if (filters.journal) {
            where.push(`a.journal = ${sqlString(filters.journal)}`);
        }
        if (filters.keyword) {
            const keywordPattern = sqlLikePattern(filters.keyword);
            where.push(`EXISTS (
    SELECT 1
    FROM article_keywords kw
    WHERE kw.article_id = a.article_id
      AND kw.keyword LIKE ${keywordPattern}
)`);
        }

        const orderBy = filters.sort === 'year-asc'
            ? 'a.publication_year ASC, a.title ASC'
            : filters.sort === 'title-asc'
                ? 'a.title ASC, a.publication_year DESC'
                : 'a.publication_year DESC, a.title ASC';

        return `SELECT
  a.article_id,
  a.title,
  a.journal,
  a.publication_year,
  a.authors,
  SUBSTR(COALESCE(a.abstract, a.abstract_en, ''), 1, 120) AS abstract_preview
FROM kci_articles a
${where.length ? `WHERE ${where.join('\n  AND ')}` : ''}
ORDER BY ${orderBy}
LIMIT 20;`;
    }

    function renderSearchOutput() {
        const sql = searchExperienceState.lastSql || `-- ${text(ui.searchNotRun)}`;
        const result = searchExperienceState.lastResult;
        return `
            <div class="generated-sql-block">
                <p class="overview-label">${escapeHtml(text(ui.generatedSql))}</p>
                <pre class="generated-sql">${escapeHtml(sql)}</pre>
            </div>
            <div class="search-results-block">
                <p class="overview-label">${escapeHtml(text(ui.searchResults))}</p>
                ${searchExperienceState.lastError ? `<div class="feedback-box visible retry">${escapeHtml(searchExperienceState.lastError)}</div>` : ''}
                ${result ? renderResultTable(result, 20) : `<p class="result-meta">${escapeHtml(text(ui.searchNotRun))}</p>`}
                ${result ? `<p class="result-meta">${escapeHtml(text(ui.rows))}: ${result.values.length.toLocaleString()}</p>` : ''}
            </div>
        `;
    }

    function getSearchJournalOptions(selectedJournal) {
        if (dataset.status !== 'ready') return '';
        const journals = Array.from(new Set(dataset.rows.map(row => row.journal).filter(Boolean))).sort();
        return journals.map(journal => `
            <option value="${escapeHtml(journal)}"${journal === selectedJournal ? ' selected' : ''}>${escapeHtml(journal)}</option>
        `).join('');
    }

    function sqlLikePattern(value) {
        return sqlString(`%${value}%`);
    }

    function sqlString(value) {
        return `'${String(value).replace(/'/g, "''")}'`;
    }

    async function checkAnswer(module) {
        const result = module.kind === 'choice'
            ? evaluateChoice(module)
            : module.kind === 'search'
                ? evaluateSearchExperience(module)
                : await evaluateSql(module);
        progress.attempts[module.id] = (progress.attempts[module.id] || 0) + 1;
        progress.scores[module.id] = Math.max(progress.scores[module.id] || 0, result.score);

        if (result.passed && !progress.completedModules.includes(module.id)) {
            progress.completedModules.push(module.id);
        }

        saveProgress();
        renderOverview();
        renderTabs();
        showFeedback(module, result);
        updateScorePill(module);
    }

    function evaluateChoice(module) {
        const selected = Array.from(document.querySelectorAll('input[name="labChoice"]:checked')).map(input => input.value);
        const correct = new Set(module.correct);
        const selectedSet = new Set(selected);
        const correctSelected = selected.filter(id => correct.has(id)).length;
        const wrongSelected = selected.filter(id => !correct.has(id)).length;
        const missing = module.correct.filter(id => !selectedSet.has(id));
        const passed = wrongSelected === 0 && missing.length === 0;
        const score = passed ? 100 : Math.max(0, Math.round((correctSelected / module.correct.length) * 80 - wrongSelected * 15));

        return {
            kind: 'choice',
            passed,
            score,
            correctSelected,
            wrongSelected,
            totalCorrect: module.correct.length,
            missing
        };
    }

    function evaluateSearchExperience(module) {
        const sql = searchExperienceState.lastSql.toLowerCase();
        const filters = searchExperienceState.filters || {};
        const resultRows = searchExperienceState.lastResult?.values?.length || 0;
        const hasAnyFilter = Boolean(filters.term || filters.yearFrom || filters.yearTo || filters.journal || filters.keyword);
        const details = [
            detail('run-twice', searchExperienceState.runs >= 2),
            detail('generated-select', /\bselect\b/.test(sql) && sql.includes('kci_articles')),
            detail('where-filter', hasAnyFilter && /\bwhere\b/.test(sql)),
            detail('keyword-link', Boolean(filters.keyword) && sql.includes('article_keywords')),
            detail('result-rows', resultRows > 0)
        ];
        const metCount = details.filter(item => item.met).length;

        return {
            kind: 'experience',
            passed: metCount === details.length,
            score: Math.round(metCount / details.length * 100),
            metCount,
            total: details.length,
            details,
            errorMessage: searchExperienceState.lastError,
            moduleId: module.id
        };
    }

    async function evaluateSql(module) {
        const input = document.getElementById('sqlAnswer');
        const rawSql = input ? input.value : '';
        const strippedSql = stripSqlComments(rawSql).toLowerCase();
        const keywordSql = rawSql.toLowerCase();

        if (dataset.status !== 'ready') {
            return sqlFailure(module, text(ui.sqlUnavailable));
        }

        if (isUnsafeSql(strippedSql)) {
            return sqlFailure(module, text(ui.blockedSql));
        }

        let db;
        try {
            db = createKciDatabase();
            const results = db.exec(rawSql);
            const details = module.id === 'sql-application'
                ? evaluateSqlApplication(db, strippedSql, keywordSql, results, null)
                : evaluateSqlUsage(strippedSql, results, null);
            return buildSqlResult(module, details, results, null);
        } catch (error) {
            if (db) db.close();
            const details = module.checks.map(check => ({
                id: check.id,
                label: text(check.label),
                met: false
            }));
            return buildSqlResult(module, details, [], error.message || String(error));
        } finally {
            if (db) db.close();
        }
    }

    function evaluateSqlApplication(db, strippedSql, keywordSql) {
        const details = [];
        const tableExists = scalar(db, "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='article_review'") > 0;
        const columns = tableExists ? tableColumns(db, 'article_review') : [];
        const rowCount = tableExists ? scalar(db, 'SELECT COUNT(*) FROM article_review') : 0;
        const recentCount = tableExists && columns.includes('review_status')
            ? scalar(db, "SELECT COUNT(*) FROM article_review WHERE review_status = 'RECENT'")
            : 0;
        const emptyTitleCount = tableExists && columns.includes('title')
            ? scalar(db, "SELECT COUNT(*) FROM article_review WHERE title IS NULL OR TRIM(title) = ''")
            : 0;

        details.push(detail('runs', true));
        details.push(detail('create-review', tableExists));
        details.push(detail('insert-source', /\binsert\s+into\s+article_review\b[\s\S]*\bfrom\s+kci_articles\b/.test(strippedSql)));
        details.push(detail('required-columns', ['article_id', 'title', 'publication_year', 'review_status'].every(column => columns.includes(column))));
        details.push(detail('row-count', rowCount >= 20));
        details.push(detail('update-status', /\bupdate\s+article_review\s+set\b[\s\S]*review_status[\s\S]*recent/.test(strippedSql) && recentCount > 0));
        details.push(detail('delete-cleanup', /\bdelete\s+from\s+article_review\b[\s\S]*\bwhere\b/.test(strippedSql) && emptyTitleCount === 0));
        details.push(detail('commit-rollback', /\bcommit\b/.test(strippedSql) && /\brollback\b/.test(keywordSql)));
        return details;
    }

    function evaluateSqlUsage(strippedSql, results) {
        const finalResult = results.length ? results[results.length - 1] : null;
        const columns = finalResult ? finalResult.columns.map(column => column.toLowerCase()) : [];
        const rowCount = finalResult ? finalResult.values.length : 0;
        const usesAllTables = ['kci_articles', 'journals', 'article_keywords'].every(table => strippedSql.includes(table));
        const hasResultColumns = ['publication_year', 'journal', 'article_count'].every(column => columns.includes(column));

        return [
            detail('runs', true),
            detail('index', /\bcreate\s+index\b/.test(strippedSql)),
            detail('tables', usesAllTables),
            detail('join', /\bjoin\b/.test(strippedSql)),
            detail('subquery', /\bin\s*\(\s*select\b|\bexists\s*\(\s*select\b/.test(strippedSql)),
            detail('group-having', /\bgroup\s+by\b/.test(strippedSql) && /\bhaving\b/.test(strippedSql)),
            detail('count-result', /\bcount\s*\(/.test(strippedSql) && rowCount > 0),
            detail('result-columns', hasResultColumns)
        ];
    }

    function detail(id, met) {
        const module = getCurrentModule();
        const check = module.checks.find(item => item.id === id);
        return {
            id,
            label: check ? text(check.label) : id,
            met
        };
    }

    function sqlFailure(module, errorMessage) {
        const details = module.checks.map(check => ({
            id: check.id,
            label: text(check.label),
            met: false
        }));
        return buildSqlResult(module, details, [], errorMessage);
    }

    function buildSqlResult(module, details, results, errorMessage) {
        const metCount = details.filter(item => item.met).length;
        const passed = metCount === details.length;
        return {
            kind: 'sql',
            passed,
            score: Math.round(metCount / details.length * 100),
            metCount,
            total: details.length,
            details,
            results,
            errorMessage,
            moduleId: module.id
        };
    }

    function showFeedback(module, result) {
        const box = document.getElementById('feedbackBox');
        if (!box) return;

        const className = result.passed ? 'success' : 'retry';
        const title = result.passed ? text(ui.successTitle) : text(ui.retryTitle);
        const summary = result.kind === 'choice'
            ? format(text(ui.choiceResult), {
                correct: result.totalCorrect,
                selected: result.correctSelected,
                wrong: result.wrongSelected
            })
            : result.kind === 'experience'
                ? format(text(ui.searchExperienceResult), {
                    total: result.total,
                    met: result.metCount
                })
                : format(text(ui.sqlResult), {
                    total: result.total,
                    met: result.metCount
                });
        const hasRequirementFeedback = result.kind === 'sql' || result.kind === 'experience';

        box.className = `feedback-box visible ${className}`;
        box.innerHTML = `
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(summary)}</p>
            ${result.errorMessage ? `<p>${escapeHtml(result.errorMessage)}</p>` : ''}
            ${result.passed ? '' : `<p>${escapeHtml(text(module.hint))}</p>`}
            ${hasRequirementFeedback ? renderRequirementFeedback(result.details) : ''}
            ${result.kind === 'sql' ? renderSqlResults(result.results) : ''}
        `;
    }

    function renderRequirementFeedback(details) {
        return `
            <ul class="requirement-list">
                ${details.map(item => `
                    <li class="${item.met ? 'met' : 'missing'}">${item.met ? 'OK' : 'Check'} · ${escapeHtml(item.label)}</li>
                `).join('')}
            </ul>
        `;
    }

    function renderSqlResults(results) {
        if (!results || !results.length) {
            return `<p class="result-meta">${escapeHtml(text(ui.noRows))}</p>`;
        }
        const last = results[results.length - 1];
        return `
            <h3>${escapeHtml(text(ui.resultPreview))}</h3>
            ${renderResultTable(last, RESULT_LIMIT)}
            <p class="result-meta">${escapeHtml(text(ui.rows))}: ${last.values.length.toLocaleString()}${last.values.length > RESULT_LIMIT ? ` (${RESULT_LIMIT} shown)` : ''}</p>
        `;
    }

    function renderResultTable(result, limit) {
        if (!result || !result.columns || !result.values || !result.values.length) {
            return `<p class="result-meta">${escapeHtml(text(ui.noRows))}</p>`;
        }
        const rows = result.values.slice(0, limit);
        return `
            <div class="result-table-wrap">
                <table class="result-table">
                    <thead>
                        <tr>${result.columns.map(column => `<th>${escapeHtml(column)}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                ${row.map(cell => `<td class="truncate-cell" title="${escapeHtml(cell == null ? '' : String(cell))}">${escapeHtml(cell == null ? '' : String(cell))}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
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
        render();
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

    function isUnsafeSql(sql) {
        return /\b(drop\s+table|delete\s+from|update|insert\s+into|replace\s+into|alter\s+table)\s+(kci_articles|journals|article_keywords)\b/.test(sql);
    }

    function stripSqlComments(sql) {
        return sql
            .replace(/--.*$/gm, ' ')
            .replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function createKciDatabase() {
        const db = new dataset.SQL.Database();
        db.run(`
            CREATE TABLE kci_articles (
                article_id TEXT PRIMARY KEY,
                title TEXT,
                title_en TEXT,
                authors TEXT,
                journal TEXT,
                publisher TEXT,
                publication_year INTEGER,
                published_date TEXT,
                doi TEXT,
                url TEXT,
                keywords TEXT,
                keywords_en TEXT,
                abstract TEXT,
                abstract_en TEXT,
                citation_count INTEGER,
                reference_count INTEGER,
                source_files TEXT
            );

            CREATE TABLE journals (
                journal_id INTEGER PRIMARY KEY AUTOINCREMENT,
                journal TEXT UNIQUE,
                publisher TEXT,
                article_count INTEGER,
                first_year INTEGER,
                last_year INTEGER
            );

            CREATE TABLE article_keywords (
                article_id TEXT,
                keyword TEXT,
                keyword_language TEXT
            );
        `);

        const articleStmt = db.prepare(`
            INSERT INTO kci_articles VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        dataset.rows.forEach(row => {
            articleStmt.run([
                row.article_id,
                row.title,
                row.title_en,
                row.authors,
                row.journal,
                row.publisher,
                toNumber(row.publication_year),
                row.published_date,
                row.doi,
                row.url,
                row.keywords,
                row.keywords_en,
                row.abstract,
                row.abstract_en,
                toNumber(row.citation_count),
                toNumber(row.reference_count),
                row.source_files
            ]);
        });
        articleStmt.free();

        db.run(`
            INSERT INTO journals (journal, publisher, article_count, first_year, last_year)
            SELECT journal, MIN(publisher), COUNT(*), MIN(publication_year), MAX(publication_year)
            FROM kci_articles
            WHERE TRIM(journal) <> ''
            GROUP BY journal;
        `);

        const keywordStmt = db.prepare('INSERT INTO article_keywords VALUES (?, ?, ?)');
        dataset.rows.forEach(row => {
            splitKeywords(row.keywords).forEach(keyword => keywordStmt.run([row.article_id, keyword, 'ko']));
            splitKeywords(row.keywords_en).forEach(keyword => keywordStmt.run([row.article_id, keyword, 'en']));
        });
        keywordStmt.free();

        return db;
    }

    function parseCsv(csvText) {
        const rows = [];
        let current = [];
        let field = '';
        let inQuotes = false;
        const textValue = csvText.replace(/^\uFEFF/, '');

        for (let i = 0; i < textValue.length; i++) {
            const char = textValue[i];
            const next = textValue[i + 1];

            if (char === '"') {
                if (inQuotes && next === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                current.push(field);
                field = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (char === '\r' && next === '\n') i++;
                current.push(field);
                if (current.some(value => value !== '')) rows.push(current);
                current = [];
                field = '';
            } else {
                field += char;
            }
        }

        if (field || current.length) {
            current.push(field);
            rows.push(current);
        }

        const headers = rows.shift() || [];
        return {
            headers,
            rows: rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ''])))
        };
    }

    function splitKeywords(value) {
        return String(value || '')
            .split(/[,;；、]/)
            .map(item => item.trim())
            .filter(Boolean)
            .slice(0, 30);
    }

    function tableColumns(db, tableName) {
        const result = db.exec(`PRAGMA table_info(${tableName})`);
        if (!result.length) return [];
        return result[0].values.map(row => String(row[1]).toLowerCase());
    }

    function scalar(db, sql) {
        const result = db.exec(sql);
        if (!result.length || !result[0].values.length) return 0;
        return Number(result[0].values[0][0]) || 0;
    }

    function toNumber(value) {
        const number = Number(value);
        return Number.isFinite(number) ? number : null;
    }

    function format(template, values) {
        return Object.entries(values).reduce((output, [key, value]) => output.replace(`{${key}}`, value), template);
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
