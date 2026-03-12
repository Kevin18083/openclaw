# Claude PR Assistant 配置

> 来源：用户桌面文件 | 日期：2026-03-09

---

## 📋 概述

**用途**：GitHub 上 @claude 自动回复机器人

**触发**：评论、PR 审查、Issue 中包含 `@claude`

---

## ⚙️ 配置

**文件**：`.github/workflows/claude-pr-assistant.yml`

### 触发条件

```yaml
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

# 当评论包含 @claude 时触发
if: |
  (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
  (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
  (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
  (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
```

### Job 配置

```yaml
jobs:
  claude-code-action:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude PR Action
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          timeout_minutes: '60'
```

---

## 🔧 可选配置

### 1. 使用 OAuth Token

```yaml
# 或使用 OAuth token
claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

### 2. 限制网络访问

```yaml
experimental_allowed_domains: |
  .anthropic.com
  .github.com
  api.github.com
  .githubusercontent.com
  bun.sh
  registry.npmjs.org
  .blob.core.windows.net
```

### 3. 运行模式

```yaml
# mode: tag  # Default: responds to @claude mentions
# mode: always  # Always respond
# mode: silent  # Only respond when explicitly mentioned
```

---

## 💡 学习收获

### 1. GitHub Actions 条件判断

```yaml
if: |
  contains(github.event.comment.body, '@claude') ||
  contains(github.event.review.body, '@claude')
```

### 2. 权限配置

```yaml
permissions:
  contents: read
  pull-requests: read
  issues: read
  id-token: write  # OIDC token for API auth
```

### 3. 官方 Action 使用

```yaml
uses: anthropics/claude-code-action@beta
```

---

## 🔗 相关资源

| 资源 | 链接 |
|------|------|
| Claude Code Action | https://github.com/anthropics/claude-code-action |
| GitHub Actions | https://docs.github.com/actions |

---

*版本：1.0 | 学习时间：2026-03-09*
