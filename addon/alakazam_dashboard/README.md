# Alakazam Dashboard Add-on

A standalone Home Assistant add-on that serves the Alakazam Dashboard and auto-updates from GitHub.

## Features

- ✅ **No HACS required** - Standalone add-on
- ✅ **Auto-updates** - Pulls latest build from GitHub automatically
- ✅ **Proper MIME types** - Nginx serves files with correct Content-Type headers
- ✅ **Ingress support** - Accessible through Home Assistant UI
- ✅ **Configurable** - Set update interval and GitHub repo/branch

## Installation

1. Copy the `addon` folder to your Home Assistant `addons` directory:
   ```
   /config/addons/alakazam_dashboard/
   ```

2. In Home Assistant:
   - Go to **Settings** → **Add-ons** → **Add-on Store**
   - Click the three dots (⋮) → **Repositories**
   - Add: `/config/addons` (or the path where you put the addon)
   - The add-on should appear in your store

3. Click **Install**, then **Start**

4. Click **Open Web UI** to access the dashboard

## Configuration

Edit the add-on configuration to customize:

- `update_interval`: How often to check for updates (in seconds, default: 3600 = 1 hour)
- `github_repo`: GitHub repository (default: `matdoidge/alakazam-dashboard`)
- `github_branch`: Branch to use (default: `main`)

## Usage

After installation, access the dashboard at:
- **Via Ingress**: Click "Open Web UI" in the add-on
- **Direct URL**: `http://homeassistant.local:8080` (if ports are exposed)

Add to your dashboard as an iframe:
```yaml
type: iframe
url: http://homeassistant.local:8080
```

## How It Works

1. The add-on runs an Nginx web server
2. On startup, it downloads the latest build from your GitHub repo
3. It periodically checks for updates (configurable interval)
4. Nginx serves the files with proper MIME types
5. The dashboard connects to Home Assistant automatically

## Benefits Over HACS

- ✅ No subdirectory download issues
- ✅ Proper MIME type handling
- ✅ Auto-updates from your repo
- ✅ Full control over the serving environment
- ✅ Works with any build structure
