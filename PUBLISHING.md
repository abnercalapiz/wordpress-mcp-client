# Publishing to npm

This guide walks through publishing the WordPress MCP Client to npm.

## Prerequisites

1. **npm account**: Create at https://www.npmjs.com/signup
2. **Organization**: Reserve @jezweb namespace (if not already done)
3. **Node.js**: Version 14+ installed
4. **Git**: Repository initialized

## First Time Setup

### 1. Login to npm
```bash
npm login
```

### 2. Create Organization (if needed)
```bash
npm org create abnerjezweb
```

## Publishing Steps

### 1. Install Dependencies
```bash
cd wordpress-mcp-client
npm install
```

### 2. Build the Package
```bash
npm run build
```

This creates:
- `dist/index.js` - CommonJS build
- `dist/index.mjs` - ES Module build  
- `dist/index.d.ts` - TypeScript definitions

### 3. Run Tests
```bash
npm test
```

### 4. Test Package Locally
```bash
npm pack
# This creates abnerjezweb-wordpress-mcp-client-1.0.0.tgz

# Test in another project:
cd /tmp
mkdir test-package
cd test-package
npm init -y
npm install /path/to/abnerjezweb-wordpress-mcp-client-1.0.0.tgz
```

### 5. Publish to npm
```bash
npm publish --access public
```

## Version Management

### Update Version
```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major
```

### Publish Updated Version
```bash
npm publish
```

## Best Practices

### 1. Always Test Before Publishing
- Run `npm test`
- Test pack with `npm pack`
- Install locally and verify

### 2. Update Documentation
- Update README.md with changes
- Update CHANGELOG.md
- Update examples if API changed

### 3. Git Tags
```bash
git tag v1.0.0
git push origin v1.0.0
```

### 4. GitHub Release
Create release on GitHub with:
- Release notes
- Link to npm package
- Migration guide (if breaking changes)

## Maintenance

### Check Package Info
```bash
npm info @abnerjezweb/wordpress-mcp-client
```

### View Published Files
```bash
npm pack --dry-run
```

### Deprecate Old Versions
```bash
npm deprecate @abnerjezweb/wordpress-mcp-client@"< 1.0.0" "Please upgrade to v1.0.0"
```

## Troubleshooting

### "402 Payment Required"
- Ensure `--access public` flag is used
- Check organization settings

### "E403 Forbidden"
- Verify npm login: `npm whoami`
- Check package name availability
- Ensure you have publish rights

### Build Errors
- Clear dist folder: `rm -rf dist`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## CI/CD Publishing

For automated publishing, add to GitHub Actions:

```yaml
name: Publish to npm
on:
  release:
    types: [created]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## Next Steps After Publishing

1. **Test Installation**:
   ```bash
   npm install @abnerjezweb/wordpress-mcp-client
   ```

2. **Update WordPress Plugin Docs**:
   - Add npm package link to plugin README
   - Create integration guide

3. **Announce Release**:
   - GitHub release notes
   - Plugin changelog
   - Social media (if applicable)

4. **Monitor Usage**:
   - Check npm download stats
   - Monitor GitHub issues
   - Respond to user feedback