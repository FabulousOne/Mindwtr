#!/usr/bin/env bun

import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

interface AuditResult {
    file: string;
    issues: string[];
    useMemoCount: number;
    useEffectCount: number;
    score: number;
}

function walk(dir: string): string[] {
    const entries = readdirSync(dir);
    const files: string[] = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            files.push(...walk(fullPath));
        } else if (entry.endsWith('.tsx')) {
            files.push(fullPath);
        }
    }
    return files;
}

function auditComponent(filePath: string): AuditResult {
    const content = readFileSync(filePath, 'utf-8');
    const issues: string[] = [];

    const useMemoCount = (content.match(/useMemo\(/g) || []).length;
    const useEffectCount = (content.match(/useEffect\(/g) || []).length;

    if (content.includes('.filter(') && !content.includes('useMemo')) {
        issues.push('Array filter without useMemo');
    }

    if (content.includes('.map(') && !content.includes('useMemo') && useMemoCount === 0) {
        issues.push('Array map without useMemo');
    }

    if (useMemoCount > 10) {
        issues.push(`Too many useMemo (${useMemoCount}), consider refactoring`);
    }

    if (/useTaskStore\s*\(\s*\)/.test(content) && !content.includes('shallow')) {
        issues.push('Full store subscription without shallow equality');
    }

    const renderBlocks = content.match(/return \([\s\S]*?\);/g) || [];
    for (const render of renderBlocks) {
        if (render.includes('.map(') && !render.includes('useMemo')) {
            issues.push('Array map in render without memoization');
            break;
        }
    }

    let score = 100;
    score -= issues.length * 10;
    score -= Math.max(0, (useMemoCount - 5) * 5);
    score -= Math.max(0, (useEffectCount - 3) * 5);

    return {
        file: filePath,
        issues,
        useMemoCount,
        useEffectCount,
        score: Math.max(0, score),
    };
}

const viewsDir = join(process.cwd(), 'apps/desktop/src/components/views');
const viewFiles = walk(viewsDir);

console.log('Performance Audit\n');

const results = viewFiles.map((file) => auditComponent(file));
results.sort((a, b) => a.score - b.score);

for (const result of results) {
    const label = result.score >= 80 ? '[OK]' : result.score >= 60 ? '[WARN]' : '[FAIL]';
    console.log(`${label} ${result.file} (Score: ${result.score})`);
    console.log(`   useMemo: ${result.useMemoCount}, useEffect: ${result.useEffectCount}`);
    if (result.issues.length > 0) {
        for (const issue of result.issues) {
            console.log(`   - ${issue}`);
        }
    }
    console.log('');
}

const avgScore = results.reduce((sum, r) => sum + r.score, 0) / Math.max(results.length, 1);
console.log(`Average Score: ${avgScore.toFixed(1)}`);
console.log(`Components needing attention: ${results.filter((r) => r.score < 60).length}`);

const failUnderArgIndex = process.argv.indexOf('--fail-under');
const failUnderArg = failUnderArgIndex >= 0 ? Number(process.argv[failUnderArgIndex + 1]) : undefined;
const failUnderEnv = process.env.PERF_FAIL_UNDER ? Number(process.env.PERF_FAIL_UNDER) : undefined;
const failUnder = Number.isFinite(failUnderArg) ? failUnderArg : failUnderEnv;

if (typeof failUnder === 'number' && Number.isFinite(failUnder) && avgScore < failUnder) {
    console.error(`\nPerformance audit failed: Average Score ${avgScore.toFixed(1)} < ${failUnder}`);
    process.exit(1);
}
