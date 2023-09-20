import {
	findCommandText,
	findOsFromMetaLine,
	findPidFromMetaLine,
	findUserNameFromMetaLine,
	findMetadataOrigin,
	findHostIpFromPath,
	findProcessFromMetaLine,
} from './regex';

describe('Metadata lines tests', () => {
	const unknownFromIpCase =
		'04/04 17:49:16 [metadata] unknown <- 192.168.202.134; computer: ADAM-PC; user: SYSTEM *; process: iexplore.exe; pid: 1012; os: Windows; version: 6.1; beacon arch: x64 (x64)';

	const beaconToIpCase =
		'02/09 22:06:21 [metadata] beacon_91510 -> 192.168.202.144; computer: CLIENT-7-1; user: SYSTEM *; process: RuntimeBroker.exe; pid: 916; os: Windows; version: 6.1; beacon arch: x86 (x64)';

	const ipToIPCase =
		'04/04 14:17:22 [metadata] 54.333.127.54 <- 206.333.62.109; computer: USD-672; user: jrout; process: rundll32.exe; pid: 4264; os: Windows; version: 6.1; beacon arch: x64 (x64)';

	test('findOsFromMetaLine', () => {
		expect(findOsFromMetaLine(unknownFromIpCase)).toBe('Windows');
		expect(findOsFromMetaLine(beaconToIpCase)).toBe('Windows');
	});

	test('findPidFromMetaLine', () => {
		expect(findPidFromMetaLine(unknownFromIpCase)).toBe(1012);
		expect(findPidFromMetaLine(beaconToIpCase)).toBe(916);
	});

	test('findUserNameFromMetaLine', () => {
		expect(findUserNameFromMetaLine(unknownFromIpCase)).toBe('SYSTEM *');
		expect(findUserNameFromMetaLine(beaconToIpCase)).toBe('SYSTEM *');
	});

	test('findProcessFromMetaLine', () => {
		expect(findProcessFromMetaLine(unknownFromIpCase)).toBe('iexplore.exe');
		expect(findProcessFromMetaLine(beaconToIpCase)).toBe('RuntimeBroker.exe');
	});

	test('findMetadataOrigin', () => {
		expect(findMetadataOrigin(unknownFromIpCase)).toBe('unknown');
		expect(findMetadataOrigin(beaconToIpCase)).toBe('beacon_91510');
		expect(findMetadataOrigin(ipToIPCase)).toBe('54.333.127.54');
	});
});

describe('Find command types', () => {
	const ps = '04/22 15:52:30 [input] <raptorsqueak> ps';
	const clear = '04/22 15:52:36 [input] <raptorsqueak> clear';
	const sleep = '04/22 15:53:22 [input] <raptorsqueak> sleep 1800 20';
	const shinject = '04/23 16:14:41 [input] <raptorsqueak> shinject 5832 x64 /root/share/Data/Payloads/1https_64.bin';
	const kill = '04/23 16:23:52 [input] <analyst1> kill 5832';
	const utcLine = '07/31 18:24:09 UTC [input] <analyst1> exit';
	const jump = '07/31 17:25:46 UTC [input] <analyst1> jump winrm64 WIN-10-03 smb';
	const empty = '04/25 16:30:42 [output]';
	const executeAssembly =
		'10/23 18:52:13 UTC [input] <analyst1> execute-assembly /home/raptor/Source/cobaltstrike/scripts/RunKeyDropper.exe List-Persist';

	test('Finds the command name', () => {
		expect(findCommandText(ps)).toBe('ps');
		expect(findCommandText(clear)).toBe('clear');
		expect(findCommandText(sleep)).toBe('sleep');
		expect(findCommandText(shinject)).toBe('shinject');
		expect(findCommandText(kill)).toBe('kill');
		expect(findCommandText(utcLine)).toBe('exit');
		expect(findCommandText(jump)).toBe('jump');
		expect(findCommandText(empty)).toBe('(empty)');
		expect(findCommandText(executeAssembly)).toBe('execute-assembly');
	});
});

describe('IP parsing', () => {
	test('Find IP address in path', () => {
		expect(findHostIpFromPath('192.168.1.1')).toBe('192.168.1.1');
		expect(findHostIpFromPath('/192.168.1.1')).toBe('192.168.1.1');
		expect(findHostIpFromPath('ajfhlksf/192.168.1.1/as;dlfas;dlfj')).toBe('192.168.1.1');
		expect(findHostIpFromPath('fail')).toBeFalsy();
	});
});
