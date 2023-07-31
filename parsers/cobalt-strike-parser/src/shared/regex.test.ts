import { findHostNameFromMetadataLine, findFileName, isIpAddress, findOperatorName } from './regex';

test('findHostNameFromMetadataLine', () => {
	const unknownFromIpCase =
		'04/04 17:49:16 [metadata] unknown <- 192.168.202.134; computer: ADAM-PC; user: SYSTEM *; pid: 1012; os: Windows; version: 6.1; beacon arch: x64 (x64)';

	const beaconToIpCase =
		'02/09 22:06:21 [metadata] beacon_91510 -> 192.168.202.144; computer: CLIENT-7-1; user: SYSTEM *; pid: 916; os: Windows; version: 6.1; beacon arch: x86 (x64)';

	const ipToIPCase =
		'04/04 14:17:22 [metadata] 54.333.127.54 <- 206.333.62.109; computer: USD-672; user: jrout; pid: 4264; os: Windows; version: 6.1; beacon arch: x64 (x64)';

	expect(findHostNameFromMetadataLine(unknownFromIpCase)).toBe('ADAM-PC');
	expect(findHostNameFromMetadataLine(beaconToIpCase)).toBe('CLIENT-7-1');
	expect(findHostNameFromMetadataLine(ipToIPCase)).toBe('USD-672');
});

test('Find a file name', () => {
	expect(findFileName('./index.php')).toBe('index.php');
	expect(findFileName('D:/var/www/www.example.com/index.php')).toBe('index.php');
	expect(findFileName('C:/var/www/www.example.com/index.php')).toBe('index.php');
	expect(findFileName(`.\\var\\www\\www.example.com\\index.php`)).toBe('index.php');
	expect(findFileName(`\\var\\www\\www.example.com\\index.php`)).toBe('index.php');
	expect(findFileName('/var/www/www.example.com/index.php')).toBe('index.php');
	expect(findFileName('./var/www/www.example.com/index.php')).toBe('index.php');
	expect(findFileName('D:\\\\var\\\\www\\\\www.example.com\\\\index.php')).toBe('index.php');
	expect(findFileName('\\index.php')).toBe('index.php');
	expect(findFileName('/Users/farr135/Repos/redeye/server/dist/campaign/1/108/beacon_953732058.log')).toBe(
		'beacon_953732058.log'
	);
});

test('Is an IP address', () => {
	expect(isIpAddress('192.168.1.1')).toBe(true);
	expect(isIpAddress('000.0000.00.00')).toBe(false);
	expect(isIpAddress('912.456.123.123')).toBe(false);
	expect(isIpAddress('255.256.255.255')).toBe(false);
	expect(isIpAddress('255.255.255.255')).toBe(true);
	expect(isIpAddress('10.0.0.0')).toBe(true);
	expect(isIpAddress('abc/10.0.0.0')).toBe(false);
});

test('Find operator name from line', () => {
	expect(findOperatorName('07/31 18:24:09 UTC [input] <raptorsqueak> exit')).toEqual('raptorsqueak');
	expect(findOperatorName('07/31 18:24:09 UTC [input] <analyst2> exit')).toEqual('analyst2');
	expect(findOperatorName('07/31 18:24:09 UTC [input] <analyst#1_1> exit')).toEqual('analyst#1_1');
});
