---
name: coding-core-rules
description: Core coding principles based on Linus Torvalds' philosophy - simplicity, clarity, efficiency, and small commits
---

# Coding Core Rules

Follow these principles when implementing features, fixing bugs, and refactoring code.

## Linus Torvalds' Seven Rules

### 1. Keep it simple or don't do it
- Start with the simplest solution that works
- Avoid over-engineering or premature complexity
- If a solution requires multiple layers of abstraction, reconsider the approach
- Simple code is easier to maintain, test, and debug

### 2. Don't be afraid to delete useless code
- Dead code is technical debt
- Remove code that isn't used or tested
- Delete branches, utilities, or features that no longer serve a purpose
- Deletion is progress, not loss

### 3. If you need comments, rewrite it
- Code should be self-explanatory
- Rename variables and functions to clarify intent
- Break complex logic into smaller, named functions
- Comments become outdated; clear code doesn't

Example (Bad):
```javascript
// Add 10% tax
const t = p * 1.1
```

Example (Good):
```javascript
const priceWithTax = basePrice * TAX_RATE
```

### 4. Don't mix refactors with fixes
- One commit = one logical change
- Refactoring is different from bug fixing
- Separate concerns make code reviews and rollbacks easier
- Mix refactors and fixes = hard to identify what caused new problems

Bad workflow:
```
Commit: Fix login bug AND rename variables AND simplify logic
```

Good workflow:
```
Commit 1: Fix login bug
Commit 2: Rename variables for clarity
Commit 3: Simplify authentication logic
```

### 5. If you can't explain it quickly, it's wrong
- Should be able to describe the change in 1-2 sentences
- If explanation is complex, the code probably is too
- Use this as a test: Can you explain the commit in your pull request title?
- If you can't, break it into smaller commits

### 6. Make it work first, optimize later
- Get it working and tested
- Then identify bottlenecks with profiling
- Optimize only where it matters
- Premature optimization wastes time and introduces bugs

Workflow:
```
Step 1: Write working code that passes tests
Step 2: Measure performance (profiling)
Step 3: Identify real bottlenecks
Step 4: Optimize only bottlenecks
Step 5: Re-test to verify no regressions
```

### 7. Small commits or you're hiding something
- Each commit should be self-contained and reviewable
- Large commits are hard to review and harder to revert
- Small commits make git blame, git bisect, and rollbacks easier
- If a commit is hard to explain, it's too big

Commit guidelines:
- 1 feature per commit
- 1 bug fix per commit
- 1 refactor per commit
- Size: Should take < 5 minutes to review

## Implementation Workflow

When tasked with a feature or fix:

### Step 1: Analyze
Understand what is being asked:
- What is the requirement?
- What is the current behavior?
- What should the new behavior be?
- What are the constraints?

### Step 2: Plan
Create a concrete plan with specific steps:
- Break the work into small, logical chunks
- Each chunk should be one commit
- Show the plan to the user for confirmation
- Adjust based on feedback

### Step 3: Implement
For each step:
- Write working code (Rule 6: Make it work first)
- Keep it simple (Rule 1)
- Remove anything unused (Rule 2)
- Clean up code or rewrite instead of commenting (Rule 3)
- Run diagnostics to find errors
- Make a small commit (Rule 7)

### Step 4: Verify
After each implementation:
- Run tests or manual verification
- Check for regressions
- Ensure it matches the requirement
- Suggest the user make a commit

## Guidelines

### Code Quality

Keep code simple:
- Avoid deep nesting (max 3 levels)
- Functions should do one thing
- Aim for < 50 lines per function
- Use meaningful variable names

Avoid:
- Magic numbers (use named constants)
- Nested ternaries
- Complex regular expressions without explanation
- Multiple responsibilities per function

### Commits

Size: Keep commits small and focused

```
Good commit: 5-30 lines changed
Bad commit: 500 lines changed across 10 files
```

Message format:
```
[type] Short description under 50 chars

Optional body explaining why, not what.
```

Types: fix, feat, refactor, test, docs, style, perf

Example:
```
fix: resolve null pointer in user authentication

User.verify() was called without checking if user exists.
Added null check before accessing user properties.
```

### Refactoring vs Fixing

Refactoring = improving code structure without changing behavior
Fixing = changing behavior to correct a bug or add a feature

Always separate in different commits.

### Documentation

Only create documentation when:
- The user specifically asks for it
- The code is genuinely complex and can't be simplified (Rule 3)
- It's part of the original requirement

Otherwise, let the code speak for itself.

### No Emojis

Do not use emojis in:
- Code comments
- Commit messages
- Documentation
- Code at all

Keep communication clear and professional.

## Decision Tree

When making a change, ask:

1. Can I simplify this?
   - YES: Simplify it
   - NO: Continue

2. Is this code used?
   - NO: Delete it
   - YES: Continue

3. Does it need comments?
   - YES: Rewrite it instead
   - NO: Continue

4. Does this change mix refactor + fix?
   - YES: Split into separate commits
   - NO: Continue

5. Can I explain it quickly?
   - NO: Break into smaller commits
   - YES: Continue

6. Is this the simplest implementation?
   - NO: Simplify it (back to step 1)
   - YES: Make the commit

## When to Ask for User Confirmation

- Before starting major work (show the plan)
- When something is unclear or ambiguous
- When multiple approaches are possible
- When changes affect multiple files
- Before optimizing (to avoid premature optimization)

## Quick Checklist

Before committing:

- [ ] Code is simple and clear
- [ ] No unused code
- [ ] No comments needed (or rewritten)
- [ ] Only one logical change per commit
- [ ] Can explain it in 1-2 sentences
- [ ] Is working and tested
- [ ] Commit message is clear
- [ ] No emojis in any text
