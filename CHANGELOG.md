# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2024-12-12

### Fixed
- Fixed search not working in Claude Desktop due to missing Content-Type header
- Fixed FETCH_CONFIG format in multisite example (must be JSON string, not object)
- Updated all configuration examples to include proper headers for search endpoint
- Fixed mcp-config-manager.js to generate correct search configuration

### Added
- Claude Desktop troubleshooting guide with detailed debugging steps
- Alternative configuration examples for when standard MCP server isn't available
- Working configuration example with proper JSON string format

### Improved
- All example configurations now consistently use JSON.stringify() for FETCH_CONFIG
- Search endpoint configuration now includes required Content-Type header

## [1.0.5] - 2024-12-12

### Added
- Comprehensive natural language documentation in README
- Clear examples for adding sites with name, ID, and multiple clients
- Step-by-step guide for removing sites
- Natural language examples for using MCP endpoints
- Explanation of what each endpoint does in plain English

### Improved
- README now includes practical examples of asking AI assistants about your WordPress site
- Better documentation structure with user-friendly language

## [1.0.4] - 2024-12-12

### Fixed
- Fixed "Cannot find module '../dist/index'" error when running mcp-site command
- Changed import path in mcp-config-manager.js to use package root

## [1.0.3] - 2024-12-12

### Fixed
- Fixed global CLI installation not creating mcp-site command
- Removed non-existent lib directory from files array
- Added CHANGELOG.md to published files
- Ensured scripts have proper execute permissions

## [1.0.2] - 2024-12-12

### Added
- 🚀 **CLI Tool** (`mcp-site`) for automatically adding WordPress sites to MCP clients
  - Add sites to Claude Desktop, Roo Code, and custom configurations
  - Interactive mode for guided setup
  - Site validation before adding
  - List and remove configured sites
- 📚 Comprehensive documentation suite
  - Auto-Add Documentation (MCP_AUTO_ADD.md)
  - API Documentation (API.md)
  - Examples Documentation (EXAMPLES.md) with 16 detailed examples
  - Troubleshooting Guide (TROUBLESHOOTING.md)
- 🔧 Configuration manager for multiple MCP clients
- 📦 NPM scripts for easy CLI usage
- ⚙️ ESLint configuration for code quality
- 🤖 Multi-site configuration example for Claude Desktop

### Fixed
- Fixed TypeScript type errors in request handling
- Fixed import paths for CommonJS compatibility
- Downgraded node-fetch from v3 to v2.7.0 for better compatibility
- Fixed missing lib directory issue in scripts
- Added missing @types/node-fetch dependency
- Removed outdated/incorrect MCP configuration examples

### Changed
- Updated examples to support both local development and npm package usage
- Improved error handling with proper type assertions
- Enhanced build configuration for better module compatibility
- Updated package.json with bin entry for global CLI installation
- Added commander, chalk, and inquirer dependencies for CLI

## [1.0.1] - 2024-08-11

### Added
- MCP configuration examples from the WordPress LLM Ready plugin
- Comprehensive README for configuration examples
- Examples for:
  - Claude Desktop configuration
  - Simple MCP configuration
  - Search-focused configuration
  - Full tools configuration
  - Connection examples

### Changed
- Improved project structure with organized examples directory

## [1.0.0] - 2024-08-11

### Initial Release
- TypeScript/JavaScript client for WordPress MCP endpoints
- Support for all LLM Ready MCP endpoints:
  - Discovery
  - Business information
  - Contact details
  - Services/products
  - Content search
  - Booking (placeholder)
- Multi-site support for managing multiple WordPress installations
- Comprehensive error handling
- Full TypeScript support with type definitions
- Examples for basic usage and multi-site configurations