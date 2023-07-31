import { BeaconLineType } from '@redeye/models';
import { findBeaconLineType, containsBeaconLineType, getBeaconFromPath } from './beaconRegex';

const beaconInput = '07/31 18:24:09 UTC [input] <raptorsqueak> exit';
const oldBeaconTask = '02/09 22:06:47 [task] Tasked beacon to list processes';
const beaconCheckin = '02/09 22:06:55 [checkin] host called home, sent: 12 bytes';
const beaconError = '02/09 22:07:13 [error] lost link to parent beacon: 192.168.202.147';
const beaconSleepJitter = 'Tasked beacon to sleep for 60s (20% jitter)';
const metaData =
	'04/04 17:49:16 [metadata] unknown <- 192.168.202.134; computer: ADAM-PC; user: SYSTEM *; pid: 1012; os: Windows; version: 6.1; beacon arch: x64 (x64)';
const logLineTypeWrench =
	'F	195568	10/28/2018 12:21:08	[20181023]-Change-{20181023} [AWS] [East] [VPC] auslnxapvopnt02.pdf';

test('Beacon log line type', () => {
	expect(findBeaconLineType(beaconInput)).toBe(BeaconLineType.INPUT);
	expect(findBeaconLineType(oldBeaconTask)).toBe(BeaconLineType.TASK);
	expect(findBeaconLineType(beaconCheckin)).toBe(BeaconLineType.CHECKIN);
	expect(findBeaconLineType(beaconError)).toBe(BeaconLineType.ERROR);
	expect(findBeaconLineType(metaData)).toBe(BeaconLineType.METADATA);
	expect(findBeaconLineType(beaconSleepJitter)).toBeFalsy();
	expect(findBeaconLineType(logLineTypeWrench)).toBeFalsy();
});

test('Beacon Input contains name', () => {
	expect(containsBeaconLineType(beaconSleepJitter)).toBe(false);
	expect(containsBeaconLineType(beaconInput)).toBe(true);
	expect(containsBeaconLineType(oldBeaconTask)).toBe(true);
	expect(containsBeaconLineType(beaconCheckin)).toBe(true);
	expect(containsBeaconLineType(beaconError)).toBe(true);
	expect(containsBeaconLineType(metaData)).toBe(true);
});

test('Get beacon id from path', () => {
	expect(getBeaconFromPath('beacon_91510')).toBe('91510');
	expect(getBeaconFromPath('/Users/cleanup/Desktop/logs/log-backups/1https/190502/127.0.0.1/beacon_99909.log')).toBe(
		'99909'
	);
	expect(getBeaconFromPath('unknown')).toBe(undefined);
});
