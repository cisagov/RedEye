import { findUploadFileNameFromTaskLine, splitIndicatorLine } from './processUploadCommand';

describe('Upload command testing', () => {
	test('Indicator line', () => {
		const line =
			'03/07 10:31:45 [indicator] file: d3c63b300adb246696fb4da093927074 275456 bytes infoPhishAMSI64-System.dll';
		const results = splitIndicatorLine(line);
		expect(results).toEqual({
			md5: 'd3c63b300adb246696fb4da093927074',
			bytes: '275456',
			fileName: 'infoPhishAMSI64-System.dll',
		});
	});

	test('Task Line', () => {
		expect(
			findUploadFileNameFromTaskLine(
				'05/02 20:08:11 [task] Tasked beacon to upload /root/share/CodeRepo/mimikatz.exe as mimikatz.exe'
			)
		).toEqual('/root/share/CodeRepo/mimikatz.exe');
		expect(
			findUploadFileNameFromTaskLine(
				'03/07 10:31:45 [task] Tasked beacon to upload /root/lab/dns1p/persistence/system/referenceFiles/infoPhishAMSI64-System.dll as infoPhishAMSI64-System.dll'
			)
		).toEqual('/root/lab/dns1p/persistence/system/referenceFiles/infoPhishAMSI64-System.dll');
	});
});
