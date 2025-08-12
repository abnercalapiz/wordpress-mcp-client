#!/usr/bin/env node

const MCPConfigManager = require('./mcp-config-manager');
const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');

const manager = new MCPConfigManager();

// CLI configuration
program
  .name('mcp-site')
  .description('WordPress MCP Site Manager - Automatically add WordPress sites to MCP clients')
  .version('1.0.0');

// Add site command
program
  .command('add <url>')
  .description('Add a WordPress site to MCP client configurations')
  .option('-c, --clients <clients...>', 'Target clients (claude, roo, custom)', ['claude'])
  .option('-i, --id <id>', 'Custom site ID (auto-generated if not provided)')
  .option('-n, --name <name>', 'Custom site name')
  .option('--skip-validation', 'Skip site validation')
  .option('--custom-path <path>', 'Path to custom config file')
  .action(async (url, options) => {
    try {
      console.log(chalk.blue('\n🔧 WordPress MCP Site Manager\n'));

      // If no specific clients provided, ask user
      if (!options.clients || options.clients.length === 0) {
        const { selectedClients } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedClients',
            message: 'Select MCP clients to add the site to:',
            choices: [
              { name: 'Claude Desktop', value: 'claude' },
              { name: 'Roo Code (VS Code)', value: 'roo' },
              { name: 'Custom Config File', value: 'custom' }
            ],
            default: ['claude']
          }
        ]);
        options.clients = selectedClients;
      }

      // If custom client selected but no path provided, ask for it
      if (options.clients.includes('custom') && !options.customPath) {
        const { customPath } = await inquirer.prompt([
          {
            type: 'input',
            name: 'customPath',
            message: 'Enter path for custom config file:',
            default: './mcp-sites.json'
          }
        ]);
        options.customPath = customPath;
      }

      const result = await manager.addSite(url, options);

      console.log(chalk.green('\n✅ Site added successfully!\n'));
      console.log(chalk.white('Site Details:'));
      console.log(chalk.gray('  ID:  '), result.siteId);
      console.log(chalk.gray('  Name:'), result.siteName);
      console.log(chalk.gray('  URL: '), result.url);

      console.log(chalk.white('\nConfiguration Results:'));
      Object.entries(result.results).forEach(([client, status]) => {
        if (status.success) {
          console.log(chalk.green(`  ✓ ${client}: ${status.path}`));
        } else {
          console.log(chalk.red(`  ✗ ${client}: ${status.error}`));
        }
      });

      console.log(chalk.yellow('\n⚠️  Restart your MCP clients for changes to take effect.'));

    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// List sites command
program
  .command('list')
  .description('List configured WordPress sites')
  .option('-c, --client <client>', 'Target client (claude, roo)', 'claude')
  .action((options) => {
    try {
      console.log(chalk.blue(`\n📋 WordPress Sites in ${options.client}:\n`));

      const sites = manager.listSites(options.client);

      if (sites.length === 0) {
        console.log(chalk.gray('No WordPress sites configured.'));
      } else {
        sites.forEach((site, index) => {
          console.log(chalk.white(`${index + 1}. ${site.name || site.id}`));
          console.log(chalk.gray(`   ID:  ${site.id}`));
          console.log(chalk.gray(`   URL: ${site.url}`));
          console.log();
        });
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Remove site command
program
  .command('remove <siteId>')
  .description('Remove a WordPress site from configuration')
  .option('-c, --client <client>', 'Target client (claude, roo)', 'claude')
  .action(async (siteId, options) => {
    try {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Remove site "${siteId}" from ${options.client}?`,
          default: false
        }
      ]);

      if (!confirm) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }

      const success = manager.removeSite(siteId, options.client);

      if (success) {
        console.log(chalk.green(`\n✅ Site "${siteId}" removed from ${options.client}.`));
        console.log(chalk.yellow('⚠️  Restart your MCP client for changes to take effect.'));
      } else {
        console.log(chalk.red(`\n❌ Failed to remove site "${siteId}".`));
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Validate site command
program
  .command('validate <url>')
  .description('Validate a WordPress site has MCP endpoints')
  .action(async (url) => {
    try {
      console.log(chalk.blue('\n🔍 Validating WordPress MCP endpoints...\n'));

      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }

      const result = await manager.validateSite(url);

      if (result.valid) {
        console.log(chalk.green('✅ Site validation successful!\n'));
        console.log(chalk.white('Site Information:'));
        console.log(chalk.gray('  Name:'), result.name);
        console.log(chalk.gray('  Endpoints:'), Object.keys(result.endpoints).join(', '));
        console.log(chalk.gray('  Capabilities:'), Object.entries(result.capabilities)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(', '));
      } else {
        console.log(chalk.red('❌ Site validation failed!\n'));
        console.log(chalk.red(`Error: ${result.error}`));
        console.log(chalk.yellow('\nTroubleshooting:'));
        console.log('1. Ensure the LLM Ready plugin is installed and activated');
        console.log('2. Check that WordPress REST API is enabled');
        console.log('3. Verify the site URL is correct');
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Interactive mode for adding sites')
  .action(async () => {
    try {
      console.log(chalk.blue('\n🔧 WordPress MCP Site Manager - Interactive Mode\n'));

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'url',
          message: 'Enter WordPress site URL:',
          validate: (input) => input.length > 0 || 'URL is required'
        },
        {
          type: 'input',
          name: 'name',
          message: 'Enter site name (optional):',
        },
        {
          type: 'input',
          name: 'id',
          message: 'Enter site ID (optional, auto-generated if empty):',
        },
        {
          type: 'checkbox',
          name: 'clients',
          message: 'Select MCP clients:',
          choices: [
            { name: 'Claude Desktop', value: 'claude', checked: true },
            { name: 'Roo Code (VS Code)', value: 'roo' },
            { name: 'Custom Config File', value: 'custom' }
          ]
        },
        {
          type: 'confirm',
          name: 'validate',
          message: 'Validate site before adding?',
          default: true
        }
      ]);

      // Handle custom config path if needed
      if (answers.clients.includes('custom')) {
        const { customPath } = await inquirer.prompt([
          {
            type: 'input',
            name: 'customPath',
            message: 'Enter path for custom config file:',
            default: './mcp-sites.json'
          }
        ]);
        answers.customPath = customPath;
      }

      const result = await manager.addSite(answers.url, {
        clients: answers.clients,
        siteId: answers.id || null,
        siteName: answers.name || null,
        skipValidation: !answers.validate,
        customPath: answers.customPath
      });

      console.log(chalk.green('\n✅ Site added successfully!\n'));
      console.log(chalk.white('Summary:'));
      console.log(chalk.gray('  ID:  '), result.siteId);
      console.log(chalk.gray('  Name:'), result.siteName);
      console.log(chalk.gray('  URL: '), result.url);

      console.log(chalk.yellow('\n⚠️  Restart your MCP clients for changes to take effect.'));

    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}