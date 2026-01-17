#!/usr/bin/env node

/**
 * 🔍 ADVANCED PROJECT SCANNER - SocialX Tweeter
 * Senior-level comprehensive project analysis tool
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ANSI Colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Logging utilities
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Project scanner class
class ProjectScanner {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      security: [],
      performance: [],
      codeQuality: [],
      dependencies: [],
      configuration: [],
    };
  }

  async runFullScan() {
    log.header("🔍 SOCIALX TWEETER - ADVANCED PROJECT SCAN");

    try {
      await this.checkDependencies();
      await this.analyzeTypeScript();
      await this.scanSecurity();
      await this.analyzeBundle();
      await this.checkConfiguration();
      await this.performanceAnalysis();
      await this.generateReport();
    } catch (error) {
      log.error(`Scan failed: ${error.message}`);
      process.exit(1);
    }
  }

  async checkDependencies() {
    log.info("Checking dependencies...");

    try {
      // Check for outdated packages
      const outdated = execSync("npm outdated --json", { encoding: "utf8" });
      const outdatedPackages = JSON.parse(outdated);

      Object.entries(outdatedPackages).forEach(([pkg, info]) => {
        if (info.current !== info.latest) {
          this.results.dependencies.push({
            type: "outdated",
            package: pkg,
            current: info.current,
            latest: info.latest,
            severity: this.calculateSeverity(info.current, info.latest),
          });
        }
      });

      // Check for vulnerabilities
      const audit = execSync("npm audit --json", { encoding: "utf8" });
      const auditResults = JSON.parse(audit);

      if (auditResults.vulnerabilities) {
        Object.entries(auditResults.vulnerabilities).forEach(([pkg, vuln]) => {
          this.results.security.push({
            type: "vulnerability",
            package: pkg,
            severity: vuln.severity,
            recommendation: vuln.recommendation,
          });
        });
      }

      log.success("Dependency analysis completed");
    } catch (error) {
      log.warning(`Dependency check incomplete: ${error.message}`);
    }
  }

  async analyzeTypeScript() {
    log.info("Analyzing TypeScript configuration...");

    try {
      // Check tsconfig.json
      const tsconfigPath = path.join(this.projectRoot, "tsconfig.json");
      if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

        // Check for strict mode
        if (!tsconfig.compilerOptions?.strict) {
          this.results.codeQuality.push({
            type: "ts-configuration",
            issue: "Strict mode not enabled",
            recommendation: 'Enable "strict": true in compilerOptions',
          });
        }

        // Check for strictNullChecks
        if (!tsconfig.compilerOptions?.strictNullChecks) {
          this.results.codeQuality.push({
            type: "ts-configuration",
            issue: "strictNullChecks not enabled",
            recommendation: "Enable strict null checking",
          });
        }
      }

      // Run TypeScript compilation with strict checks
      try {
        execSync("npx tsc --noEmit --strict", { stdio: "pipe" });
        log.success("TypeScript strict compilation passed");
      } catch (error) {
        this.results.codeQuality.push({
          type: "ts-compilation",
          issue: "TypeScript strict compilation errors",
          details: error.stdout?.toString() || error.message,
        });
      }
    } catch (error) {
      log.warning(`TypeScript analysis incomplete: ${error.message}`);
    }
  }

  async scanSecurity() {
    log.info("Scanning for security issues...");

    // Check for hardcoded secrets
    const secretPatterns = [
      { pattern: /password\s*=\s*['"][^'"]+['"]/gi, name: "Hardcoded passwords" },
      { pattern: /secret\s*[:=]\s*['"][^'"]+['"]/gi, name: "Hardcoded secrets" },
      { pattern: /api[key]*\s*[:=]\s*['"][^'"]+['"]/gi, name: "Hardcoded API keys" },
    ];

    const filesToScan = this.getAllSourceFiles([".ts", ".tsx", ".js", ".jsx"]);

    filesToScan.forEach((file) => {
      try {
        const content = fs.readFileSync(file, "utf8");
        secretPatterns.forEach(({ pattern, name }) => {
          if (pattern.test(content)) {
            this.results.security.push({
              type: "hardcoded-secret",
              issue: name,
              file: path.relative(this.projectRoot, file),
              severity: "high",
            });
          }
        });
      } catch (error) {
        // Skip unreadable files
      }
    });

    log.success("Security scan completed");
  }

  async analyzeBundle() {
    log.info("Analyzing bundle composition...");

    try {
      // Get build stats if available
      const buildDir = path.join(this.projectRoot, ".next");
      if (fs.existsSync(buildDir)) {
        const stats = fs.statSync(buildDir);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        this.results.performance.push({
          type: "bundle-size",
          size: `${sizeMB} MB`,
          recommendation: sizeMB > 100 ? "Consider code splitting" : "Bundle size acceptable",
        });
      }

      // Check for large dependencies
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, "package.json"), "utf8")
      );
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      Object.entries(deps).forEach(([dep, version]) => {
        // This would need actual size checking from bundle analyzer
        if (dep.includes("material") || dep.includes("lodash")) {
          this.results.performance.push({
            type: "large-dependency",
            dependency: dep,
            recommendation: "Consider lighter alternatives",
          });
        }
      });
    } catch (error) {
      log.warning(`Bundle analysis incomplete: ${error.message}`);
    }
  }

  async checkConfiguration() {
    log.info("Checking project configuration...");

    // Check Next.js config
    const nextConfigPath = path.join(this.projectRoot, "next.config.ts");
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, "utf8");

      // Check for deprecated configs
      if (configContent.includes("experimental.turbo")) {
        this.results.configuration.push({
          type: "deprecated-config",
          issue: "experimental.turbo is deprecated",
          recommendation: "Use turbopack configuration instead",
        });
      }
    }

    // Check for missing env vars
    const envExamplePath = path.join(this.projectRoot, ".env.example");
    if (fs.existsSync(envExamplePath)) {
      const envExample = fs.readFileSync(envExamplePath, "utf8");
      const requiredVars = envExample.match(/^([A-Z_]+)/gm) || [];

      const envLocalPath = path.join(this.projectRoot, ".env.local");
      if (fs.existsSync(envLocalPath)) {
        const envLocal = fs.readFileSync(envLocalPath, "utf8");
        requiredVars.forEach((varName) => {
          if (!envLocal.includes(`${varName}=`)) {
            this.results.configuration.push({
              type: "missing-env",
              issue: `Missing environment variable: ${varName}`,
              severity: "medium",
            });
          }
        });
      }
    }
  }

  async performanceAnalysis() {
    log.info("Running performance analysis...");

    try {
      // Check for common performance anti-patterns
      const antiPatterns = [
        {
          pattern: /\buseEffect\([^}]*\[\]\)/g,
          name: "Empty dependency arrays in useEffect",
          recommendation: "Consider using useMemo or useCallback instead",
        },
        {
          pattern: /console\.(log|warn|error)/g,
          name: "Console statements in production code",
          recommendation: "Remove or conditionally disable console logs",
        },
      ];

      const sourceFiles = this.getAllSourceFiles([".ts", ".tsx"]);
      sourceFiles.forEach((file) => {
        try {
          const content = fs.readFileSync(file, "utf8");
          antiPatterns.forEach(({ pattern, name, recommendation }) => {
            if (pattern.test(content)) {
              this.results.performance.push({
                type: "anti-pattern",
                issue: name,
                file: path.relative(this.projectRoot, file),
                recommendation,
              });
            }
          });
        } catch (error) {
          // Skip unreadable files
        }
      });
    } catch (error) {
      log.warning(`Performance analysis incomplete: ${error.message}`);
    }
  }

  getAllSourceFiles(extensions) {
    const files = [];
    const excludeDirs = ["node_modules", ".next", ".git", "coverage"];

    function walkDir(dir) {
      try {
        const items = fs.readdirSync(dir);
        items.forEach((item) => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory() && !excludeDirs.includes(item)) {
            walkDir(fullPath);
          } else if (stat.isFile() && extensions.some((ext) => item.endsWith(ext))) {
            files.push(fullPath);
          }
        });
      } catch (error) {
        // Skip inaccessible directories
      }
    }

    walkDir(this.projectRoot);
    return files;
  }

  calculateSeverity(current, latest) {
    // Simple version comparison logic
    const currentParts = current.split(".").map(Number);
    const latestParts = latest.split(".").map(Number);

    if (latestParts[0] > currentParts[0]) return "high"; // Major version bump
    if (latestParts[1] > currentParts[1]) return "medium"; // Minor version bump
    return "low"; // Patch version bump
  }

  async generateReport() {
    log.header("📋 SCAN RESULTS SUMMARY");

    // Summary statistics
    const totalIssues = Object.values(this.results).flat().length;
    const highSeverity = Object.values(this.results)
      .flat()
      .filter((i) => i.severity === "high").length;

    console.log(`${colors.bright}Total Issues Found: ${totalIssues}${colors.reset}`);
    console.log(`${colors.red}High Severity: ${highSeverity}${colors.reset}`);

    // Detailed breakdown
    Object.entries(this.results).forEach(([category, issues]) => {
      if (issues.length > 0) {
        console.log(
          `\n${colors.cyan}${category.toUpperCase()} (${issues.length} issues):${colors.reset}`
        );
        issues.forEach((issue) => {
          const color =
            issue.severity === "high"
              ? colors.red
              : issue.severity === "medium"
                ? colors.yellow
                : colors.dim;
          console.log(`  ${color}• ${issue.issue || issue.type}${colors.reset}`);
          if (issue.recommendation) {
            console.log(`    ${colors.dim}→ ${issue.recommendation}${colors.reset}`);
          }
        });
      }
    });

    // Action items
    log.header("🔧 RECOMMENDED ACTIONS");

    const actions = [
      "1. Address high-severity security vulnerabilities immediately",
      "2. Enable strict TypeScript mode for better type safety",
      "3. Update deprecated Next.js configurations",
      "4. Remove hardcoded secrets from source code",
      "5. Optimize bundle size by removing unused dependencies",
    ];

    actions.forEach((action) => console.log(`${colors.green}${action}${colors.reset}`));

    console.log(`\n${colors.bright}Scan completed successfully!${colors.reset}`);
  }
}

// Execute the scanner
if (require.main === module) {
  const scanner = new ProjectScanner();
  scanner.runFullScan().catch(console.error);
}

module.exports = ProjectScanner;
