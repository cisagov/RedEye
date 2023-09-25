# **RedEye**: Red Team C2 Log Visualization

<p align="center">
<img alt="RedEye Screenshot" src="https://github.com/cisagov/RedEye/blob/develop/docs/images/RedEye-Hero-Screenshot.png?raw=true" width="100%"/>
</p>

RedEye is an open-source analytic tool developed by [CISA](https://www.cisa.gov/) and [DOE](https://www.energy.gov/)’s [Pacific Northwest National Laboratory](https://www.pnnl.gov/) to assist [Red Teams](https://en.wikipedia.org/wiki/Red_team) with visualizing and reporting command and control activities. This tool allows an operator to assess and display complex data, evaluate mitigation strategies, and enable effective decision making in response to a Red Team assessment. The tool parses logs, such as those from [Cobalt Strike](https://www.cobaltstrike.com/), and presents the data in an easily digestible format. The users can then tag and add comments to activities displayed within the tool. The operators can use the RedEye’s presentation mode to present findings and workflow to stakeholders.

RedEye can assist an operator to efficiently:

- Replay and demonstrate Red Team’s assessment activities as they occurred rather than manually pouring through thousands of lines of log text.
- Display and evaluate complex assessment data to enable effective decision making.
- Gain a clearer understanding of the attack path taken and the hosts compromised during a Red Team assessment or penetration test.

| **Red Team** | **Blue Team** |
|:------------:|:-------------:|
| [![Red Team](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/rsybgk&style=flat&logo=cypress)](https://cloud.cypress.io/projects/rsybgk/runs) | [![Blue Team](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/46ahz3&style=flat&logo=cypress)](https://cloud.cypress.io/projects/46ahz3/runs) |

---

## ⚠️ This Repo Currently in Maintenance Mode ⚠️

This GitHub repository is no longer under active development. We'll review community issues and pull requests for bug fixes, but won't consider any new feature additions.

---

## Quick start

1. **Download** the latest RedEye binaries for your OS[\*](#platform-support) from the [Releases](https://github.com/cisagov/RedEye/releases) page.
2. **Pick a mode** and **Run the server**
   - [ **Red Team mode**](#red-team) enables the full feature set: upload C2 logs, explore data, and create presentations. _You must provide a password to run in Red Team mode._ To start the server in Red Team mode, run the following in a terminal.
		```
    	./RedEye --redTeam --password <your_password>
		```
   - [**Blue Team mode**](#blue-team) (default) enables a simplified, read-only UI for reviewing campaigns exported by a Red Team. To start the server in Blue Team mode, run the following in a terminal.
		```
    	./RedEye   # Or simplify double-click the "RedEye" executable 
		```
3. **Use the web app** in a browser at http://127.0.0.1:4000. The RedEye binary runs as a server in a terminal window and will automatically open the web app UI your default browser. You must close the terminal window to quit the RedEye server.
4. Try importing the [gt.redeye](https://github.com/cisagov/RedEye/raw/develop/applications/redeye-e2e/src/fixtures/gt.redeye) example dataset to get started. Or try a different [example dataset](#example-datasets).

_**MacOS Issue** - When running RedEye for the first time, you may get a "not verified" error. You must go to "System Preferences" > "Security & Privacy" > "General" and click "Open Anyway." More info on the [Apple support page](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/)._

### Follow the [User Guide](https://github.com/cisagov/RedEye/blob/develop/docs/UserGuide.md) to learn about RedEye's feature set.

---

## Red Team & Blue Team Modes

RedEye has two modes that cover two stages of the Red Teaming process. [Red Team mode](#red-team) allows importing C2 data, editing imported data, and making comments and presentations. After curating and annotating campaign data, Red Teams can export their campaign as a standalone `.redeye` file and [hand it off to a Blue Team](#blue-team-presentation-handoff) for reporting and remediation. [Blue Team mode](#blue-team) runs RedEye in a simplified read-only mode for viewing curated data exported by a Red Team.

_Note: Both Red and Blue Team modes can be started from the same RedEye application binary._

### Red Team

The downloaded binary comes in two parts:

- The `RedEye` application binary
- The `parsers` folder containing parser binaries (e.g. `cobalt-strike-parser` Cobalt Strike log parser binary)

There are three options to run RedEye in Red Team mode:

1. Run the downloaded binary, passing in the `--redTeam` and password options:
   ```
   ./RedEye --redTeam --password <your_password>
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

## Example Datasets
There are example datasets in this repo available for download. These are located in the [./applications/redeye-e2e/src/fixtures](https://github.com/cisagov/RedEye/tree/develop/applications/redeye-e2e/src/fixtures) folder. 
- **gtdataset** - available as [gt.redeye](https://github.com/cisagov/RedEye/raw/develop/applications/redeye-e2e/src/fixtures/gt.redeye) and as [Cobalt Strike Logs](https://github.com/cisagov/RedEye/tree/develop/applications/redeye-e2e/src/fixtures/gtdataset) 
- **smalldata** - available as [smalldata.redeye](https://github.com/cisagov/RedEye/raw/develop/applications/redeye-e2e/src/fixtures/smalldata.redeye) and as [Cobalt Strike Logs](https://github.com/cisagov/RedEye/tree/develop/applications/redeye-e2e/src/fixtures/smalldata) 
- **testdata** - available as [Cobalt Strike Logs](https://github.com/cisagov/RedEye/tree/develop/applications/redeye-e2e/src/fixtures/testdata)

You may want to use a tool like [download-directory.github.io](https://download-directory.github.io/) to download just one folder of a github repo

<!--
## RedEye Server Settings
RedEye runs as a server and can be setup to serve the UI on a network..

***{instructions}***
-->

## RedEye Server Parameters

Type `./Redeye -h` to view the options

```
-d, --developmentMode [boolean]  put the database and server in development mode
-r, --redTeam [boolean]          run the server in red team mode
--port [number]                  the port the server should be exposed at
-p, --password [string]          the password for user authentication
--parsers [string...]            A list of parsers to use or a flag to use all parsers in the parsers folder
-t, --childProcesses [number]    max # of child processes the parser can use
-h, --help                       display help for command
```

you can also configure the server parameters in a `config.json` file that sits next to the `RedEye` binary
```json5

{
	"password": "937038570",
	"redTeam": true,
	"parsers": ["cobalt-strike-parser", "brute-ratel-parser"] // or true/false
}
```

## Local Build

### Required Packages

- [Node.js](https://nodejs.org/en/) >= v16
- Install yarn: `npm install -g yarn`
- Run: `yarn install` // Installs all packages
- Run either:
  1.  `yarn release:all` to build a binary for Linux, macOS, and Windows
  2.  `yarn release:(mac|windows|linux)` .
- platform options:
  - mac
  - windows
  - linux

## Development

### Setup

Install [Node.js](https://nodejs.org/en/) >= v16
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
  - ARM support is experimental

---

<div align="center">

<img alt="CISA Logo" src="https://github.com/cisagov/RedEye/blob/develop/docs/images/CISA Logo.png?raw=true" height="35%" width="35%"/>

<img alt="RedEye Logo" src="https://raw.githubusercontent.com/cisagov/RedEye/2e0279ad4bdc798eb2ee6aa018bcd6ad66079d0e/applications/client/public/logos/Logo-Dark.svg" height="35%" width="35%"/>

</div>
