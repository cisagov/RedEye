/**
 * Run this to generate a dataset of named MITRE ATT&CKs for use in the UI
 * `node ./process-enterprise-attack.js`
 * https://attack.mitre.org/
 * https://github.com/mitre/cti
 */

const fs = require('fs');
const path = require('path');

// manually update this file from https://github.com/mitre/cti/blob/master/enterprise-attack/enterprise-attack.json
const enterpriseAttack = require('./enterprise-attack.json');
// we could also add the other items from ics, mobile, and pre? if they have the same format

const mitreAttackDictionary = {};

enterpriseAttack.objects.forEach((object) => {
	const externalReference = object.external_references?.find((ref) => ref.source_name === 'mitre-attack');

	// some of the externalReferences don't have a mitre-attack associated
	if (!externalReference) return { name: object.name };

	const { external_id: id, url } = externalReference;

	const mitreAttack = {
		name: object.name,
		id,
		url,
	};

	// Mire Attacks can have sub attacks formatted 'T0000.000'
	const [parentTechnique, subTechnique] = id.split('.');

	if (subTechnique != null) {
		mitreAttack.parentTechnique = parentTechnique;

		// add subTechnique to parentTechnique
		if (mitreAttackDictionary[parentTechnique] == null) {
			mitreAttackDictionary[parentTechnique] = { subTechniques: [subTechnique] };
		} else if (mitreAttackDictionary[parentTechnique].subTechniques == null) {
			mitreAttackDictionary[parentTechnique].subTechniques = [subTechnique];
		} else {
			mitreAttackDictionary[parentTechnique].subTechniques.push(subTechnique);
		}
	}

	// mitreAttackDictionary[id] may have been added from the subTechnique process
	if (mitreAttackDictionary[id] == null) {
		mitreAttackDictionary[id] = mitreAttack;
	} else {
		mitreAttackDictionary[id] = {
			...mitreAttackDictionary[id],
			...mitreAttack,
		};
	}

	return mitreAttack;
});

const alphabeticalMitreAttackDictionary = {};
Object.keys(mitreAttackDictionary)
	.sort()
	.forEach((id) => {
		alphabeticalMitreAttackDictionary[id] = mitreAttackDictionary[id].subTechniques
			? {
					...mitreAttackDictionary[id],
					subTechniques: mitreAttackDictionary[id].subTechniques.sort(),
			  }
			: mitreAttackDictionary[id];
	});

console.log(`Parsed ${Object.entries(alphabeticalMitreAttackDictionary).length} MITRE ATT&CK ids`);

// it helps to manually run prettier on this after its generated
const mitreAttackDictionaryPathTs = path.join(__dirname, 'mitreAttackDictionary.ts');
const tsFileContents = `export const mitreAttackDictionary = ${JSON.stringify(alphabeticalMitreAttackDictionary)}`;
fs.writeFile(mitreAttackDictionaryPathTs, tsFileContents, (err) => {
	if (err) console.error(err);
});
