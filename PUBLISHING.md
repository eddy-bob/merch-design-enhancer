# Publishing Guide: How npm Installation Works & Deployment

## 📦 How npm Installation Works

### 1. **What npm Looks For**

When someone runs `npm install merch-design-enhancer`, npm:

1. **Searches the npm registry** for your package name
2. **Downloads the package** based on the `files` field in `package.json`
3. **Installs dependencies** listed in `dependencies` (not `devDependencies`)
4. **Sets up the package** so users can import it

### 2. **Key Fields in package.json**

```json
{
  "name": "merch-design-enhancer", // Package name on npm
  "version": "1.0.0", // Version number
  "main": "dist/index.js", // Entry point when someone imports
  "types": "dist/index.d.ts", // TypeScript definitions entry
  "files": [
    // What gets published (only these!)
    "dist",
    "README.md"
  ]
}
```

**Important:**

- `main`: Points to the compiled JavaScript file users will import
- `types`: Points to TypeScript definitions for type checking
- `files`: **Only** these files/folders are included in the published package
- Everything else is ignored (or use `.npmignore` to exclude)

### 3. **What Gets Published**

Based on your `package.json`:

✅ **Included:**

- `dist/` folder (compiled JavaScript + TypeScript definitions)
- `README.md` (documentation)
- `package.json` (always included)

❌ **Excluded:**

- `src/` (source TypeScript files - users don't need these)
- `node_modules/` (users install their own)
- `test/` (test files)
- `tsconfig.json` (build config)
- Everything in `.npmignore`

### 4. **How Users Import Your Package**

After installation, users can do:

```typescript
// This resolves to dist/index.js
import { MerchDesignEnhancer, ProductType } from 'merch-design-enhancer';

// npm looks for:
// 1. node_modules/merch-design-enhancer/package.json
// 2. Reads "main": "dist/index.js"
// 3. Imports from node_modules/merch-design-enhancer/dist/index.js
```

## 🚀 How to Publish to npm

### Step 1: Create an npm Account

1. Go to [npmjs.com](https://www.npmjs.com)
2. Click "Sign Up"
3. Verify your email

### Step 2: Login via Command Line

```bash
npm login
```

Enter your:

- Username
- Password
- Email
- OTP (if 2FA is enabled)

### Step 3: Verify Package Name Availability

```bash
# Check if the name is taken
npm view merch-design-enhancer
```

If it says "404 Not Found", the name is available! ✅

### Step 4: Build Your Package

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

**Verify the build:**

```bash
# Check that dist/ folder exists and has files
ls -la dist/
```

### Step 5: Test Locally (Optional but Recommended)

Before publishing, test that your package works:

```bash
# In your package directory
npm pack
```

This creates a `.tgz` file (like `merch-design-enhancer-1.0.0.tgz`).

Test it in another project:

```bash
# In a test project
npm install /path/to/merch-design-enhancer-1.0.0.tgz
```

### Step 6: Check What Will Be Published

```bash
# See exactly what files will be included
npm pack --dry-run
```

This shows you the file list without creating the tarball.

### Step 7: Publish!

```bash
npm publish
```

**What happens:**

1. `prepublishOnly` script runs automatically (builds your package)
2. npm creates a tarball from files in the `files` array
3. Uploads to npm registry
4. Your package is now live! 🎉

### Step 8: Verify Publication

```bash
# Check your package on npm
npm view merch-design-enhancer

# Or visit in browser
# https://www.npmjs.com/package/merch-design-enhancer
```

## 📝 Versioning

### Semantic Versioning (semver)

Format: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`)

- **PATCH** (1.0.0 → 1.0.1): Bug fixes, no breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes

### Update Version

```bash
# Update patch version (1.0.0 → 1.0.1)
npm version patch

# Update minor version (1.0.0 → 1.1.0)
npm version minor

# Update major version (1.0.0 → 2.0.0)
npm version major
```

This:

1. Updates `package.json` version
2. Creates a git commit (if in a git repo)
3. Creates a git tag

Then publish:

```bash
npm publish
```

## 🔒 Publishing Scoped Packages (Optional)

If your package name is taken, use a scope:

```json
{
  "name": "@yourusername/merch-design-enhancer"
}
```

Publish with:

```bash
npm publish --access public
```

## ✅ Pre-Publish Checklist

Before publishing, make sure:

- [ ] ✅ Package name is available
- [ ] ✅ `package.json` has correct name, version, description
- [ ] ✅ `main` and `types` point to correct files
- [ ] ✅ `files` array includes only what's needed
- [ ] ✅ Build succeeds (`npm run build`)
- [ ] ✅ `dist/` folder contains compiled files
- [ ] ✅ README.md is clear and complete
- [ ] ✅ No sensitive data (API keys, passwords) in code
- [ ] ✅ License is specified
- [ ] ✅ Tested locally with `npm pack`

## 🎯 Common Commands Reference

```bash
# Build the package
npm run build

# See what will be published
npm pack --dry-run

# Create tarball for testing
npm pack

# Publish to npm
npm publish

# Update version and publish
npm version patch && npm publish

# Unpublish (only within 72 hours)
npm unpublish merch-design-enhancer@1.0.0

# View your package
npm view merch-design-enhancer

# Check if logged in
npm whoami
```

## 🐛 Troubleshooting

### "Package name already taken"

- Choose a different name
- Use a scoped package: `@yourusername/merch-design-enhancer`

### "You must verify your email"

- Check your email and verify your npm account

### "403 Forbidden"

- Make sure you're logged in: `npm whoami`
- Check if you have publish permissions

### "File not found" errors

- Make sure `dist/` folder exists
- Run `npm run build` first
- Check `main` and `types` paths in `package.json`

## 📚 Next Steps After Publishing

1. **Install and test** in a fresh project:

   ```bash
   npm install merch-design-enhancer
   ```

2. **Share your package** - Add to your GitHub README, share on social media

3. **Monitor usage** - Check npm stats on your package page

4. **Handle issues** - Users may open issues on GitHub (if you link it)

5. **Update regularly** - Fix bugs, add features, bump version

---

**Your package is ready to publish!** 🚀

Run `npm publish` when you're ready to share it with the world!
