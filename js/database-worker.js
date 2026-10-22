/* SQLite runs off the UI thread. Each query gets a pristine database snapshot. */
'use strict';
importScripts('/assets/site/sql-wasm.js');
const dataset={};
let snapshot;
const detail=(id,met)=>({id,met});
function executePreview(db, sql) {
 const results=[];
 for(const statement of db.iterateStatements(sql)) {
  const columns=statement.getColumnNames(),values=[];
  while(statement.step())if(values.length<50)values.push(statement.get());
  if(columns.length){if(results.length===50)results.shift();results.push({columns,values});}
 }
 return results;
}
async function initialize(){
 dataset.SQL=await initSqlJs({locateFile:file=>'/assets/site/'+file});
 const response=await fetch('/data/kci_articles.csv');
 if(!response.ok)throw Error('CSV request failed: '+response.status);
 const parsed=parseCsv(await response.text());dataset.rows=parsed.rows;
 const db=createKciDatabase();
 try{
  snapshot=db.export();
  const metadata={columns:parsed.headers,rowCount:parsed.rows.length,sampleRows:parsed.rows.slice(0,5),journals:[...new Set(parsed.rows.map(r=>r.journal).filter(Boolean))].sort(),journalCount:scalar(db,'SELECT COUNT(*) FROM journals'),keywordCount:scalar(db,'SELECT COUNT(*) FROM article_keywords')};
  dataset.rows=[];return metadata;
 }finally{db.close()}
}
self.onmessage=async({data:{id,type,sql,moduleId}})=>{
 try{
  if(type==='initialize'){self.postMessage({id,result:await initialize()});return}
  if(!snapshot)throw Error('Dataset is not ready');
  const stripped=stripSqlComments(sql).toLowerCase();
  if(isUnsafeSql(stripped))throw Error('Source tables cannot be modified');
  const db=new dataset.SQL.Database(snapshot);
  try{
   const results=executePreview(db,sql);
   const details=moduleId==='sql-application'?evaluateSqlApplication(db,stripped,sql.toLowerCase()):moduleId?evaluateSqlUsage(stripped,results):[];
   // Grading uses table counts and result existence; previews retain at most 50 rows.
   self.postMessage({id,result:{results,details}});
  }finally{db.close()}
 }catch(error){self.postMessage({id,error:error.message||String(error)})}
};

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

    function stripSqlComments(sql) {
        return sql
            .replace(/--.*$/gm, ' ')
            .replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function isUnsafeSql(sql) {
        return /\b(drop\s+table|delete\s+from|update|insert\s+into|replace\s+into|alter\s+table)\s+(kci_articles|journals|article_keywords)\b/.test(sql);
    }
