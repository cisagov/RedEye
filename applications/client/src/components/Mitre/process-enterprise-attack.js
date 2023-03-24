/**
 * Run this to generate a dataset of named MITRE ATT&CKs for use in the UI
 * `node ./process-enterprise-attack.js`
 * https://attack.mitre.org/
 * https://github.com/mitre/cti
 */

const fs = require('fs');
const path = require('path');

// update this file from https://github.com/mitre/cti/blob/master/enterprise-attack/enterprise-attack.json
const enterpriseAttack = require('./enterprise-attack.json');
// we could also add the other items from ics, mobile, and pre? if they have the same format

const mitreAttackDictionary = {};

const mitreAttacks = enterpriseAttack.objects.map((object) => {
	const externalReference = object.external_references?.find((ref) => ref.source_name === 'mitre-attack');

	// some of the externalReferences don't have a mitre-attack associated
	if (!externalReference) return { name: object.name };

	const mitreAttack = {
		name: object.name,
		id: externalReference.external_id,
		url: externalReference.url,
	};

	mitreAttackDictionary[externalReference.external_id] = mitreAttack;

	return mitreAttack;
});

console.log(`Parsed ${Object.entries(mitreAttackDictionary).length} MITRE ATT&CK ids`);

// it helps to manually run prettier on this after its generated
const mitreAttackDictionaryPathTs = path.join(__dirname, 'mitreAttackDictionary.ts');
const tsFileContents = `export const mitreAttackDictionary = ${JSON.stringify(mitreAttackDictionary)}`;
fs.writeFile(mitreAttackDictionaryPathTs, tsFileContents, (err) => {
	if (err) console.error(err);
});

// not needed for now
// const mitreAttackDictionaryPathJson = path.join(__dirname, 'mitreAttackDictionary.json');
// fs.writeFile(mitreAttackDictionaryPathJson, JSON.stringify(mitreAttackDictionary), (err) => {
// 	if (err) console.error(err);
// });
