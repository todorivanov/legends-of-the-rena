# Branch Protection Setup

To ensure pull requests cannot be merged when tests fail, configure the following branch protection rules in GitHub repository settings.

## Setup Instructions

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Click **Add rule** or edit the existing rule for `main`

## Recommended Configuration

### Branch name pattern
```
main
```

### Protection Rules

#### Required Status Checks
☑️ **Require status checks to pass before merging**
- ☑️ Require branches to be up to date before merging
- **Required checks:**
  - `Required Tests (PR Gate)` (from pr-checks.yml)
  - `Unit Tests` (from ci.yml)
  - `PR Validation Summary` (from pr-checks.yml)

#### Pull Request Reviews
☑️ **Require a pull request before merging**
- ☑️ Require approvals: `1`
- ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☑️ Require review from Code Owners (optional)

#### Additional Settings
☑️ **Require conversation resolution before merging**
☑️ **Do not allow bypassing the above settings**

## Testing the Setup

1. Create a branch with failing tests
2. Open a pull request to `main`
3. Verify that:
   - Tests run automatically
   - Merge button is blocked if tests fail
   - PR shows red ❌ status for failed checks

## Workflow Files

- `.github/workflows/pr-checks.yml` - Dedicated PR validation
- `.github/workflows/ci.yml` - Main CI/CD pipeline
- Both include test jobs that must pass

## Maintenance

After setting up branch protection:
- Tests will automatically block merging on failure
- No manual intervention needed
- Tests run on every push to PR
- Coverage reports are preserved in artifacts
