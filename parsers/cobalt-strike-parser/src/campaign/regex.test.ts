import { beaconFromKeyLoggerName, findFileName, getBeaconFromScreenShotName } from './regex';

test('Find beaconId from keylogger file name', () => {
	expect(beaconFromKeyLoggerName('keystrokes_330588776.txt')).toBe('330588776');
	expect(beaconFromKeyLoggerName('keystrokes_566254494.2.txt')).toBe('566254494');
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

test('Find beaconId from Screenshot file name', () => {
	expect(getBeaconFromScreenShotName('screen_0624_2187.jpg')).toBe('2187');
	expect(getBeaconFromScreenShotName('screen_b9d73e31_466682130.jpg')).toBe('466682130');
});
