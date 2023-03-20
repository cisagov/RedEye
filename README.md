# RedEye
Red Team C2 Log Visualization

![RedEye Screenshot](docs/images/RedEye-Hero-Screenshot.png)

RedEye is an open-source analytic tool developed by [CISA](https://www.cisa.gov/) and [DOE](https://www.energy.gov/)’s [Pacific Northwest National Laboratory](https://www.pnnl.gov/) to assist [Red Teams](https://en.wikipedia.org/wiki/Red_team) with visualizing and reporting command and control activities. This tool, released in October 2022 on GitHub, allows an operator to assess and display complex data, evaluate mitigation strategies, and enable effective decision making in response to a Red Team assessment. The tool parses logs, such as those from [Cobalt Strike](https://www.cobaltstrike.com/), and presents the data in an easily digestible format. The users can then tag and add comments to activities displayed within the tool. The operators can use the RedEye’s presentation mode to present findings and workflow to stakeholders.

RedEye can assist an operator to efficiently:
- Replay and demonstrate Red Team’s assessment activities as they occurred rather than manually pouring through thousands of lines of log text.
- Display and evaluate complex assessment data to enable effective decision making.
- Gain a clearer understanding of the attack path taken and the hosts compromised during a Red Team assessment or penetration test.

Red Team: [![Red Team](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/rsybgk&style=flat&logo=cypress)](https://cloud.cypress.io/projects/rsybgk/runs)
Blue Team: [![Blue Team](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/46ahz3&style=flat&logo=cypress)](https://cloud.cypress.io/projects/46ahz3/runs)

## [User Guide](<docs/User Guide.md>)
Follow the User Guide to learn about the RedEye feature set.

## Quick start
1. **Download** the latest RedEye binaries for [your OS](#platform-support) from the [Releases](https://github.com/cisagov/RedEye/releases) page.
2. **Pick a mode** and **Run the server**
	-[ **Red Team mode**](#red-team) enables the full feature set: upload C2 logs, explore data, and create presentations. To start the server in Red Team mode, run in the command line:
	```
	AUTHENTICATION_PASSWORD=<your_password> ./RedEye --redTeam
	```
	  You must provide a password to run in RedTeam mode.
	- [**Blue Team mode**](#blue-team) (default) enables a simplified, read-only UI for reviewing campaigns exported by a Red Team. To start the server in Blue Team mode. Double-click on the 'RedEye' executable or run `./RedEye` from the command line.
3. **Use the web app** in a browser at http://127.0.0.1:4000. The RedEye binary runs as a server in a terminal window and will automatically open the web app UI your default browser. You must close the terminal window to quit the RedEye server.

_**MacOS Issue** - When running RedEye for the first time, you may get a "not verified" error. You must go to "System Preferences" > "Security & Privacy" > "General" and click "Open Anyway." More info on the [apple support page](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/)._

## Red Team & Blue Team Modes
RedEye has two modes that cover two stages of the Red Teaming process. [Red Team mode](#red-team) allows for import of C2 data, editing of imported data, and make comments and presentations. After curating and annotating the campaign data, the Red Team can export the campaign as a standalone .redeye file and [hand off to a Blue Team](#blue-team-presentation-handoff) for reporting and remediation. [Blue Team mode](#blue-team) runs RedEye in a simplified read-only mode for viewing curated data exported by a Red Team.

_Note: Both Red and Blue Team modes can be started from the same RedEye application binary._

### Red Team
The downloaded binary comes in two parts:
- The `RedEye` application binary
- The `parsers` folder containing the `cs-parser` Cobalt Strike log parser binary

There are three options to run RedEye in Red Team mode:
1. Run the downloaded binary, passing in the `--redTeam` and password options:
	```
	AUTHENTICATION_PASSWORD=<your_password> ./RedEye --redTeam
	```
2. Clone, install, and run the project directly (covered in the [Local Build](#local-build) section).
3. Docker Compose
	1. Clone the repo
	2. Update the environment variables in `docker-compose.yml`.
	3. Run: 
	```
	docker-compose -f docker-compose.yml up -d redeye-core
	```

### Blue Team
The Blue Team mode is a simplified, read-only UI for displaying data that has been curated, annotated, and exported by a Red Team. This mode runs by default to make startup more simple for the Blue Team.

The Blue Team version can be run by double-clicking the 'RedEye' application binary. RedEye runs at http://127.0.0.1:4000 (by default) and will automatically open your default browser.

### Blue Team Presentation Handoff
If a `campaigns` folder is located in the same directory as the `RedEye` application, RedEye will attempt to import any `.redeye` campaign files within. Campaign files can be exported in the Red Team mode.

To prepare a version for the Blue Team, follow these two steps:
1. Copy the `RedEye` application binary to an empty folder.
2. Create a `campaigns` folder in the same directory and place the `.redeye` campaign files you want to send inside.
```
Folder/
	RedEye
	campaigns/
		Campaign-01.redeye
		Campaign-02.redeye
```
`.redeye` files can also be uploaded in Blue Team mode via the "+ Add Campaign" dialog.

## RedEye Server Settings
RedEye runs as a server and can be setup to serve the UI on a network
***{instructions}***
### RedEye Server parameters
Type `./Redeye -h` to view the options
```
-d, --developmentMode [boolean]  put the database and server in development mode
-r, --redTeam [boolean]          run the server in red team mode
-p, --port [number]              the port the server should be exposed at
-t, --childProcesses [number]    max # of child processes the parser can use
-h, --help                       display help for command
```

you can also configure the sever parameters in an `.env` file that sits next to the `RedEye` binary
***{is this true?}***
```env
AUTHENTICATION_PASSWORD=937038570
AUTHENTICATION_SECRET=supertopsecretdonttellanyone
DATABASE_MODE=DEV_PERSIST
SERVER_BLUE_TEAM=false
SERVER_PRODUCTION=false
```

## Local Build
### Required Packages
- [Node.js](https://nodejs.org/en/) >= v16
- Install yarn: `npm install -g yarn`
- Run: `yarn install` // Installs all packages
- Run either:
	1. `yarn release:all` to build a binary for Linux, macOS, and Windows
	2. `yarn release:(mac|windows|linux)` .
- platform options:
	- mac
	- windows
	- linux
## Development
### Setup
Install [Node.js](https://nodejs.org/en/) >= v16 ***{is this true? my v18 doesn't work?}***
Install [yarn](https://yarnpkg.com/) globally via [npm](https://www.npmjs.com/package/yarn)
```
npm install -g yarn
```
Install package dependencies
```
yarn install
```
#### Quick Start Development
Runs the project in development mode
```sh
yarn start
```
#### Advanced Development
It is recommended to run the server and client in two separate terminals
```sh
yarn start:client
```
...in another terminal
```sh
yarn start:server
```
#### Build
to build a binary for Linux, macOS, and Windows
```shell
yarn release:all
```
to build for a specific platform, replace `all` with the platform name
```shell
yarn release:(mac|windows|linux)
```

## Platform support
- Linux
	- Ubuntu 18 and newer
	- Kali Linux 2020.1 and newer
	- Others may be supported but are untested
- macOS
	- El Capitan and newer
- Windows
	- Windows 7 and newer
ARM support is experimental


---


<div align="center">

<img alt="CISA Logo" src="docs/images/CISA Logo.png" height="35%" width="35%"/>

<img alt="RedEye Logo" src="applications/client/public/logos/Logo-Dark.svg" height="35%" width="35%"/>

</div>