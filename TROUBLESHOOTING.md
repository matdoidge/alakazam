# Troubleshooting: Add-on Not Appearing in Store

If your add-on repository isn't appearing in Home Assistant's Add-on Store, follow these steps:

## Step 1: Verify Repository Structure

Your repository must have this structure:
```
repository.yaml (or repository.json)
addons/
  alakazam_dashboard/
    config.yaml
    Dockerfile
    ... (other files)
```

**Check on GitHub:**
- Visit: `https://github.com/matdoidge/alakazam/tree/main`
- Verify `repository.yaml` exists at root
- Verify `addons/alakazam_dashboard/config.yaml` exists

## Step 2: Check Supervisor Logs

1. Go to **Settings** → **System** → **Logs**
2. Select **Supervisor** from the dropdown (top right)
3. Look for errors mentioning:
   - "repository"
   - "alakazam"
   - "validation"
   - "invalid"

**Common errors:**
- `Invalid repository` - Repository structure issue
- `Validation error` - config.yaml has issues
- `Network error` - Can't reach GitHub

## Step 3: Clear Home Assistant Cache

1. **Remove repository:**
   - Settings → Add-ons → Add-on Store
   - Three dots (⋮) → Repositories
   - Remove `https://github.com/matdoidge/alakazam` if present

2. **Restart Supervisor:**
   - Settings → System → Hardware
   - Three dots (⋮) → Restart Host
   - Or use Terminal: `ha supervisor restart`

3. **Re-add repository:**
   - After restart, add: `https://github.com/matdoidge/alakazam`
   - Wait 30 seconds
   - Check Store tab

## Step 4: Verify Repository URL Format

Try these URL formats (one at a time):
- `https://github.com/matdoidge/alakazam` ✅ (Recommended)
- `github.com/matdoidge/alakazam` (without https)
- `https://raw.githubusercontent.com/matdoidge/alakazam/main/repository.yaml`

## Step 5: Check Network Connectivity

If you have SSH/Terminal access:
```bash
# Test if Home Assistant can reach GitHub
curl -L https://github.com/matdoidge/alakazam/raw/main/repository.yaml

# Should return the repository.yaml content
```

## Step 6: Verify config.yaml Format

The `config.yaml` must have these required fields:
- `name`
- `version`
- `slug`
- `description`
- `arch` (array)

**Check for common issues:**
- YAML syntax errors (indentation, quotes)
- Missing required fields
- Invalid schema format

## Step 7: Check Repository.yaml Format

Your `repository.yaml` should be:
```yaml
name: Alakazam Add-ons
url: https://github.com/matdoidge/alakazam
maintainer: matdoidge
```

**Verify on GitHub:**
- Visit: `https://github.com/matdoidge/alakazam/blob/main/repository.yaml`
- Should show the file contents

## Step 8: Force Refresh

1. **Hard refresh browser:**
   - Windows/Linux: `Ctrl + F5`
   - macOS: `Cmd + Shift + R`

2. **Check for updates:**
   - Settings → Add-ons → Add-on Store
   - Three dots (⋮) → Check for Updates

## Step 9: Check Home Assistant Version

Older versions might have issues. Update if possible:
- Settings → System → Updates
- Check for Supervisor updates

## Still Not Working?

1. **Check Supervisor logs** (most important!)
2. **Verify files are committed and pushed** to GitHub
3. **Try accessing repository.yaml directly** in browser
4. **Check if other repositories work** (to rule out network issues)

## Common Issues Found

- ❌ **Directory named `addon/` instead of `addons/`** - Fixed: renamed to `addons/`
- ❌ **Schema selector format not supported** - Fixed: simplified to `str?`
- ❌ **Files not committed/pushed** - Check: `git status` and `git push`
- ❌ **Home Assistant cache** - Fixed: restart Supervisor
