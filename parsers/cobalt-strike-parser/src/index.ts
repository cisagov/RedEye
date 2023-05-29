#! /usr/bin/env node

import { Command } from 'commander';
import { registerBeaconCommand } from './beacon';
import { registerCampaignCommand } from './campaign';
import { registerInfoCommand } from './info.command';
import { registerValidateFilesCommand } from './validate-files.command';
const program = new Command();
program
	.name('RedEye - Cobalt Strike Parser')
	.description('CLI to parse Cobalt Strike Log Files')
	.version('0.0.1', '-v, --version', 'output the current version');
registerCampaignCommand(program);
registerBeaconCommand(program);
registerInfoCommand(program);
registerValidateFilesCommand(program);
program.parse();
