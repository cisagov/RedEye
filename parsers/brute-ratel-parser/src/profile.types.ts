export interface BruteRatelProfile {
	admin_list: AdminList;
	autoruns: string[];
	badger_graph: BadgerGraph;
	badgers: Badgers;
	c2_handler: string;
	click_script: ClickScript;
	comm_enc_key: string;
	dns_debug: boolean;
	listeners: Listeners;
	root_page: string;
	ssl_cert: string;
	ssl_key: string;
	stage_key: string;
	user_activity: { [user: string]: UserActivityList };
	user_list: UserList;
	users: Users;
}
export interface AdminList {
	[key: string]: string;
}
export interface GraphBadger {
	name: string;
	children?: GraphBadger[]; // TODO: verify how brute ratel handles children
}
export interface BadgerGraph {
	[key: string]: GraphBadger[];
}
export interface ProfileBadger {
	b_arch: string;
	b_bld: string;
	b_c2: string;
	b_c2_id: string;
	b_cookie: string;
	b_h_name: string;
	b_ip: string;
	b_l_ip: string;
	b_p_name: string;
	b_pid: string;
	b_seen: string;
	b_tid: string;
	b_uid: string;
	b_wver: string;
	dead: boolean;
	is_pvt: boolean;
	pipeline: string;
	pvt_master: string;
}
export interface Badgers {
	[key: string]: ProfileBadger;
}
export interface ClickScript {
	[key: string]: string[];
}
export interface RequestHeaders {
	Accept: string;
	'Accept-Language': string;
	Connection: string;
	'Content-Encoding': string;
	'Content-Type': string;
	Host: string;
}
export interface ResponseHeaders {
	'Access-Control-Allow-Methods': string;
	'Access-Control-Allow-Origin': string;
	'Content-Type': string;
	'Strict-Transport-Security': string;
}
export interface Listener {
	append_response: string;
	auth_count: number;
	auth_type: boolean;
	c2_authkeys: string[];
	c2_uri: string[];
	die_offline: boolean;
	host: string;
	is_random: boolean;
	jitter: number;
	obfsleep: string;
	os_type: string;
	port: string;
	prepend_response: string;
	request_headers: RequestHeaders;
	response_headers: ResponseHeaders;
	rotational_host: string;
	sleep: number;
	ssl: boolean;
	useragent: string;
}
export interface Listeners {
	[key: string]: Listener;
}
export interface ActivityMitre {
	Tactic: string;
	Technique: string[];
}
export interface UserActivity {
	badger: string;
	full_cmd: string;
	host: string;
	mitre: ActivityMitre[];
	time: string;
	user: string;
}
export interface UserActivityList {
	[command: string]: UserActivity[];
}
export interface UserList {
	[key: string]: string;
}
export interface UsersActive {
	[key: string]: string;
}
export interface Users {
	active: UsersActive;
}
