# Security Policy

## 🔒 Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 4.x.x   | :white_check_mark: |
| 3.x.x   | :x:                |
| < 3.0   | :x:                |

## 🛡️ Reporting a Vulnerability

We take the security of Legends of the Arena seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not:
- **Open a public GitHub issue** for the vulnerability
- **Discuss the vulnerability publicly** until it has been addressed

### Please Do:
1. **Open a security advisory** on GitHub or contact the repository owner with:
   - Type of issue (e.g. XSS, data exposure, etc.)
   - Full paths of source file(s) related to the issue
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue

2. **Allow us time** to respond before any public disclosure

### What to Expect:
- **Response Time**: We will acknowledge receipt within 48 hours
- **Updates**: We will send you regular updates about our progress
- **Resolution**: We will work to resolve the issue as quickly as possible
- **Credit**: We will credit you in the release notes (if desired)

## 🔐 Security Best Practices

Since this is a browser-based game using localStorage:

### For Users:
- Don't share your browser's localStorage data
- Be cautious about running the game on public/shared computers
- Clear browser data if using on shared devices
- Keep your browser up to date

### For Developers:
- Never commit sensitive data (API keys, credentials)
- Validate and sanitize all user inputs
- Keep dependencies updated (`npm audit`)
- Review code changes for potential vulnerabilities
- Use Content Security Policy headers when deploying

## 🔍 Security Measures

### Current Security Practices:
- ✅ No backend/server - runs entirely client-side
- ✅ No user authentication or personal data collection
- ✅ No external API calls or data transmission
- ✅ Uses localStorage only for game save data
- ✅ Regular dependency updates
- ✅ ESLint security rules enabled
- ✅ No eval() or dangerous JavaScript patterns

### Known Limitations:
- Game save data is stored in browser localStorage (unencrypted)
- Client-side validation only (no server-side checks)
- No protection against save file manipulation (single-player game)

## 📦 Dependency Security

We regularly audit dependencies for vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically (when possible)
npm audit fix
```

## 🔄 Security Updates

Security updates are released as soon as possible after a vulnerability is confirmed:
- **Critical**: Immediate patch release
- **High**: Patch within 7 days
- **Medium**: Patch within 30 days
- **Low**: Patch in next regular release

## 📜 Disclosure Policy

- **Day 0**: Vulnerability reported to security team
- **Day 0-7**: Investigation and verification
- **Day 7-30**: Patch development and testing
- **Day 30+**: Release patch and public disclosure

## 🙏 Recognition

We appreciate security researchers who:
- Follow responsible disclosure
- Allow time for fixes before public disclosure
- Provide detailed reports

Recognized security researchers:
- *None yet - be the first!*

## 📞 Contact

- **GitHub Security Advisories**: https://github.com/todorivanov/ObjectFighterJS/security/advisories
- **Repository Owner**: @todorivanov
- **Response Time**: Within 48 hours

---

Thank you for helping keep Legends of the Arena and its users safe! 🛡️
