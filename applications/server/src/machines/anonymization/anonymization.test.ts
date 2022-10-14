import { replaceHashes, replacePasswords } from './replace-regex';

const testHash2 = `08/17 20:20:30 UTC [output]received output:
[DC] 'raptor.int' will be the domain
[DC] 'DC01.raptor.int' will be the DC server
[DC] Exporting domain 'raptor.int'
1001\tDC01$\t5118bc738c278733d8857e8c7e9bf272\t532480
500\tAdministrator\te0b95107af635a8bd6b502e0e1af82ea\t512
502\tkrbtgt\t75b00ab89c935a3773f611d30db6b219\t514
1000\tdeveloper\t39bf3ac12facd6b5611e5a27a09516b9\t544
1104\tjdoe\t83414a69a47afeec7e3a37d05a81dc3b\t66048
1105\tWIN-10-02$\ta645f73d6d79c32ec0793338f6995747\t4096
1107\tWIN-10-03$\t99f79427a6977dc72f10358ea26bc96e\t4096
1106\tfflintstone\t735cb4e58d9e5e0468f8e1259fb28dad\t66048`;
const testHashes = `05/28 15:16:40 UTC [output]received password hashes:
Administrator:500:CChxezipgwzzgcdtkwdfzotlxzmxozqi2:CCkoxdxnbsrscxocmkqcjgdqsrlmrtyt2:::
DataManager:1002:CChxezipgwzzgcdtkwdfzotlxzmxozqi2:CCertbgfbqmewawlzoocvdyyfoiwgrhz2:::
DefaultAccount:503:CChxezipgwzzgcdtkwdfzotlxzmxozqi1:CChxlaajwndfgpzxywblxjmbutkchkel2:::
Guest:501:CChxezipgwzzgcdtkwdfzotlxzmxozqi1:CChxlaajwndfgpzxywblxjmbutkchkel2:::
securedl01:1003:CChxezipgwzzgcdtkwdfzotlxzmxozqi1:CCyxlungqrgzuztmtvfupawgdeqmqtrs3:::
`;

const passwords = `
08/17 19:58:46 UTC [output]received output:

Authentication Id : 0 ; 380553 (00000000:0005ce89)
Session           : Interactive from 1
User Name         : jdoe
Domain            : RAPTOR
Logon Server      : DC01
Logon Time        : 8/17/2020 12:43:48 PM
SID               : e5250c6aa75ad92bebf480168d2457
\tmsv :\t
\t [00000003] Primary
\t * Username : jdoe
\t * Domain   : RAPTOR
\t * NTLM     : 47f3dd88cd19505888b530c6796463
\t * SHA1     : 1f225707cc804e6da8144ecb435f43
\t * DPAPI    : 6b8b77e2f9c34739d6bbb25e9fde58
\ttspkg :\t
\twdigest :\t
\t * Username : jdoe
\t * Domain   : RAPTOR
\t * Password : (null)
\tkerberos :\t
\t * Username : jdoe
\t * Domain   : RAPTOR.INT
\t * Password : (null)
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 380511 (00000000:0005ce5f)
Session           : Interactive from 1
User Name         : jdoe
Domain            : RAPTOR
Logon Server      : DC01
Logon Time        : 8/17/2020 12:43:48 PM
SID               : e5250c6aa75ad92bebf480168d2457
\tmsv :\t
\t [00000003] Primary
\t * Username : jdoe
\t * Domain   : RAPTOR
\t * NTLM     : 47f3dd88cd19505888b530c6796463
\t * SHA1     : 1f225707cc804e6da8144ecb435f43
\t * DPAPI    : 6b8b77e2f9c34739d6bbb25e9fde58
\ttspkg :\t
\twdigest :\t
\t * Username : jdoe
\t * Domain   : RAPTOR
\t * Password : (null)
\tkerberos :\t
\t * Username : jdoe
\t * Domain   : RAPTOR.INT
\t * Password : (null)
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 997 (00000000:000003e5)
Session           : Service from 0
User Name         : LOCAL SERVICE
Domain            : NT AUTHORITY
Logon Server      : (null)
Logon Time        : 8/14/2020 4:02:58 PM
SID               : S-1-5-19
\tmsv :\t
\ttspkg :\t
\twdigest :\t
\t * Username : (null)
\t * Domain   : (null)
\t * Password : (null)
\tkerberos :\t
\t * Username : (null)
\t * Domain   : (null)
\t * Password : (null)
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 58318 (00000000:0000e3ce)
Session           : Interactive from 1
User Name         : DWM-1
Domain            : Window Manager
Logon Server      : (null)
Logon Time        : 8/14/2020 4:02:58 PM
SID               : S-1-5-90-0-1
\tmsv :\t
\t [00000003] Primary
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * NTLM     : 318ae94ada8ac5af6a010a9d292e25
\t * SHA1     : 8506d91f8d8a5456c146c7dbda96f6
\ttspkg :\t
\twdigest :\t
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * Password : (null)
\tkerberos :\t
\t * Username : WIN-10-02$
\t * Domain   : raptor.int
\t * Password : fcbeb4b708ee8fa8fc3cebdb7b6bf7(O,:^2#Y1d;!2ZhbLw4yBjF*Z:86b65d816b5fe2aa5702d8cd7dfa56/\`<V:d\\<3 s25
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 58073 (00000000:0000e2d9)
Session           : Interactive from 1
User Name         : DWM-1
Domain            : Window Manager
Logon Server      : (null)
Logon Time        : 8/14/2020 4:02:58 PM
SID               : S-1-5-90-0-1
\tmsv :\t
\t [00000003] Primary
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * NTLM     : 318ae94ada8ac5af6a010a9d292e25
\t * SHA1     : 8506d91f8d8a5456c146c7dbda96f6
\ttspkg :\t
\twdigest :\t
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * Password : (null)
\tkerberos :\t
\t * Username : WIN-10-02$
\t * Domain   : raptor.int
\t * Password : fcbeb4b708ee8fa8fc3cebdb7b6bf7(O,:^2#Y1d;!2ZhbLw4yBjF*Z:86b65d816b5fe2aa5702d8cd7dfa56/\`<V:d\\<3 s25
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 996 (00000000:000003e4)
Session           : Service from 0
User Name         : WIN-10-02$
Domain            : RAPTOR
Logon Server      : (null)
Logon Time        : 8/14/2020 4:02:58 PM
SID               : S-1-5-20
\tmsv :\t
\t [00000003] Primary
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * NTLM     : 318ae94ada8ac5af6a010a9d292e25
\t * SHA1     : 8506d91f8d8a5456c146c7dbda96f6
\ttspkg :\t
\twdigest :\t
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * Password : (null)
\tkerberos :\t
\t * Username : win-10-02$
\t * Domain   : RAPTOR.INT
\t * Password : (null)
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 37599 (00000000:000092df)
Session           : Interactive from 0
User Name         : UMFD-0
Domain            : Font Driver Host
Logon Server      : (null)
Logon Time        : 8/14/2020 4:02:58 PM
SID               : S-1-5-96-0-0
\tmsv :\t
\t [00000003] Primary
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * NTLM     : 318ae94ada8ac5af6a010a9d292e25
\t * SHA1     : 8506d91f8d8a5456c146c7dbda96f6
\ttspkg :\t
\twdigest :\t
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * Password : (null)
\tkerberos :\t
\t * Username : WIN-10-02$
\t * Domain   : raptor.int
\t * Password : fcbeb4b708ee8fa8fc3cebdb7b6bf7(O,:^2#Y1d;!2ZhbLw4yBjF*Z:86b65d816b5fe2aa5702d8cd7dfa56/\`<V:d\\<3 s25
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 37532 (00000000:0000929c)
Session           : Interactive from 1
User Name         : UMFD-1
Domain            : Font Driver Host
Logon Server      : (null)
Logon Time        : 8/14/2020 4:02:58 PM
SID               : S-1-5-96-0-1
\tmsv :\t
\t [00000003] Primary
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * NTLM     : 318ae94ada8ac5af6a010a9d292e25
\t * SHA1     : 8506d91f8d8a5456c146c7dbda96f6
\ttspkg :\t
\twdigest :\t
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * Password : (null)
\tkerberos :\t
\t * Username : WIN-10-02$
\t * Domain   : raptor.int
\t * Password : fcbeb4b708ee8fa8fc3cebdb7b6bf7(O,:^2#Y1d;!2ZhbLw4yBjF*Z:86b65d816b5fe2aa5702d8cd7dfa56/\`<V:d\\<3 s25
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 36304 (00000000:00008dd0)
Session           : UndefinedLogonType from 0
User Name         : (null)
Domain            : (null)
Logon Server      : (null)
Logon Time        : 8/14/2020 4:02:58 PM
SID               : 
\tmsv :\t
\t [00000003] Primary
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * NTLM     : 318ae94ada8ac5af6a010a9d292e25
\t * SHA1     : 8506d91f8d8a5456c146c7dbda96f6
\ttspkg :\t
\twdigest :\t
\tkerberos :\t
\tssp :\t
\tcredman :\t

Authentication Id : 0 ; 999 (00000000:000003e7)
Session           : UndefinedLogonType from 0
User Name         : WIN-10-02$
Domain            : RAPTOR
Logon Server      : (null)
Logon Time        : 8/14/2020 4:02:58 PM
SID               : S-1-5-18
\tmsv :\t
\ttspkg :\t
\twdigest :\t
\t * Username : WIN-10-02$
\t * Domain   : RAPTOR
\t * Password : (null)
\tkerberos :\t
\t * Username : win-10-02$
\t * Domain   : RAPTOR.INT
\t * Password : (null)
\tssp :\t
\tcredman :\t
`;

test('Hashes 1', () => {
	const hash = replaceHashes(testHashes, {});
	expect(hash).not.toContain('CChxezipgwzzgcdtkwdfzotlxzmxozqi');
});

test('Hashes 2', () => {
	const hash = replaceHashes(testHash2, {});
	expect(hash).not.toContain('5118bc738c278733d8857e8c7e9bf272');
});

test('Passwords', () => {
	const hash = replacePasswords(passwords, {});
	expect(hash).not.toContain(
		'fcbeb4b708ee8fa8fc3cebdb7b6bf7(O,:^2#Y1d;!2ZhbLw4yBjF*Z:86b65d816b5fe2aa5702d8cd7dfa56/`<V:d\\<3 s25'
	);
});
