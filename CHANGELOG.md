# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.9] - 2024-12-12

### Changed
- Removed automatic configuration functionality for better reliability
- Replaced with manual configuration guide and helper tools
- CLI now provides `generate`, `show-config`, and `test` commands for manual setup
- Focus on user-controlled configuration
- Updated all documentation to use working configurations with built-in MCP server

### Added
- Manual setup documentation with detailed instructions
- Configuration generator for different MCP clients
- Server testing functionality
- Working example configurations for Claude Desktop and Roo Code

### Removed
- Auto-add functionality and all related code
- Automatic modification of MCP client configuration files
- Outdated example configurations using non-existent packages
- References to @modelcontextprotocol/server-fetch
- Claude Desktop troubleshooting guide with outdated information

## [1.0.8] - 2024-12-12

### Added
- Built-in MCP server (`wordpress-mcp-server`) that Claude Desktop and Roo Code can use directly
- Support for Roo Code (VS Code extension) with stdio-based MCP server
- HTTP-based MCP server for Roo Code (`wordpress-mcp-server-roo`) as alternative option
- Automatic configuration now uses the built-in server instead of non-existent packages
- New binary entry points for MCP servers
- Easy setup documentation for manual configuration
- Comprehensive Roo Code setup guide

### Fixed
- Fixed "Could not connect to MCP server" error in Claude Desktop
- Replaced dependency on non-existent @modelcontextprotocol/server-fetch package
- Updated mcp-config-manager.js to use the built-in server for both Claude and Roo

### Changed
- Configuration format updated for better compatibility
- Roo Code configuration now uses stdio type with the same built-in server
- Added bin directory to published npm package files
- Updated list sites functionality to handle both old and new configuration formats for all clients
- README now mentions support for both Claude Desktop and Roo Code

## [1.0.7] - 2024-12-12

### Fixed
- Fixed CLI version display - now shows correct version instead of hardcoded 1.0.0
- CLI now reads version from package.json dynamically

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
- 🚀 **CLI Tool** (`mcp-site`) for helping with WordPress MCP configuration
  - Generate configuration for Claude Desktop, Roo Code, and custom clients
  - Show configuration examples
  - Test MCP server functionality
- 📚 Comprehensive documentation suite
  - Manual Setup Documentation (MANUAL_SETUP.md)
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