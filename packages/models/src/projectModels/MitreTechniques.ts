import { registerEnumType } from 'type-graphql';

export enum MitreTechniques {
	Collection = 'Collection',
	CommandAndControl = 'Command&Control',
	CredentialAccess = 'CredentialAccess',
	DefenseEvasion = 'DefenseEvasion',
	Discovery = 'Discovery',
	Execution = 'Execution',
	Exfiltration = 'Exfiltration',
	Impact = 'Impact',
	GoldenTicket = 'GoldenTicket',
	InitialAccess = 'InitialAccess',
	LateralMovement = 'LateralMovement',
	Persistence = 'Persistence',
	PrivilegeEscalation = 'PrivilegeEscalation',
	Reconnaissance = 'Reconnaissance',
	ResourceDevelopment = 'ResourceDevelopment',
}

registerEnumType(MitreTechniques, {
	name: 'MitreTechniques',
	description: 'High level mitre technique',
});

export const mitreTechniques = {
	[MitreTechniques.GoldenTicket]: ['T1558.001'],
	[MitreTechniques.LateralMovement]: [
		'TA0008',
		'T1210',
		'T1534',
		'T1570',
		'T1563',
		'T1201',
		'T1091',
		'T1072',
		'T1080',
		'T1550',
	],
	[MitreTechniques.PrivilegeEscalation]: ['TA0004', 'T1548', 'T1134', 'T1484', 'T1611', 'T1068', 'T1055', 'T1078'],
};
