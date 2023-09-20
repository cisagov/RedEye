#! /usr/bin/env node

import { Command } from 'commander';
import { registerCampaignCommand } from './parse-campaign.command';
import { registerInfoCommand } from './info.command';
import { registerValidateFilesCommand } from './validate-files.command';
const program = new Command();
program
	.name('RedEye - Sliver Parser')
	.description('CLI to parse Sliver DB & Log Files')
	.version('0.0.1', '-v, --version', 'output the current version');
registerCampaignCommand(program);
registerInfoCommand(program);
registerValidateFilesCommand(program);
program.parse();
