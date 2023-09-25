<div>
  <p align="center" width="100%">
    <source media="(prefers-color-scheme: dark)"  srcset="https://raw.githubusercontent.com/cisagov/RedEye/2e0279ad4bdc798eb2ee6aa018bcd6ad66079d0e/applications/client/public/logos/Logo-Dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/cisagov/RedEye/2e0279ad4bdc798eb2ee6aa018bcd6ad66079d0e/applications/client/public/logos/Logo-Light.png">
    <img width=25% alt="Redeye Logo" src="https://raw.githubusercontent.com/cisagov/RedEye/2e0279ad4bdc798eb2ee6aa018bcd6ad66079d0e/applications/client/public/logos/Logo-Dark.png">
  </p>    
</div>

# RedEye User Guide

RedEye is a visual analytic tool for supporting Red Team operations, analytics, and reporting. A critical aspect of Red Team engagements is to communicate to customers how successful breaches unfold so that they can assess mitigation strategies. Visualizing breaches can be a helpful but time-consuming task. RedEye offers a visualization tool to help Red Teams easily assess complex data for effective decision-making.

**Table of Contents**

- [RedEye User Guide](#redeye-user-guide)
  - [**Logging In/ Creating New User**](#logging-in-creating-new-user)
  - [**Campaign Cards**](#campaign-cards)
    - [**Uploading Campaigns**](#uploading-campaigns)
      - [Cobalt Strike](#cobalt-strike)
      - [Brute Ratel](#brute-ratel)
      - [.redeye File](#.redeye-file)
    - [Filter Existing Campaigns](#filter-existing-campaigns)
    - [Rename / Delete / Export Campaign](#rename--delete--export-campaign)
  - [**Explorer**](#explorer)
    - [Hosts Tab](#hosts-tab)
      - [Changing Host Color](#changing-host-color)
    - [Operators Tab](#operators-tab)
    - [Comments Tab](#comments-tab)
    - [Beacons Tab](#beacons-tab)
      - [Selecting Beacon from List](#selecting-beacon-from-list)
      - [Changing Beacon Color and Shape](#changing-beacon-color-and-shape)
        - [Expanding Raw Logs](#expanding-raw-logs)
    - [Adding Comments and Tags](#adding-comments-and-tags)
      - [Adding New Comments](#adding-new-comments)
      - [Multi-Command Comment](#multi-command-comment)
      - [Add command to existing comment](#add-command-to-an-existing-comment)
    - [Command Types Tab](#command-types-tab)
    - [Timeline](#timeline)
  - [**Settings Modal**](#settings-modal)
    - [Timezone](#timezone)
    - [Show/Hide Beacons](#showhide-beacons)
    - [Light Theme](#light-theme)
    - [Redacted Screenshot Mode](#redacted-screenshot-mode)
    - [Graph](#graph)
      - [Exporting Graph](#exporting-graph)
  - [**Search**](#search)
  - [**Presentations**](#presentations)

&nbsp;

## **Logging In/ Creating New User**

To create a new user, type a username in the user textbox, and click "+ New User" from the dropdown.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/NewUser.png?raw=true" width="65%" height="75%"/>
</p>

## **Campaign Cards**

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/CampaignCards.png?raw=true" width="95%" height="75%" />
</p>

Once logged in, you will be directed to the campaign cards screen. This is where you can upload new campaigns, and view a list of your previously uploaded campaigns.

### **Uploading Campaigns**

Redeye provides three ways to upload and visualize your campaign data.

#### Cobalt Strike

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/UploadCobaltStrike.png?raw=true" width="55%" />
</p>

With the Cobalt Strike option selecte and uploading multi-server or single-server folders, RedEye will automatically remove files that are\
not necessary. To view a list of all the files that were removed, hover over the "File Removed" icon.

#### Brute Ratel

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/UploadBruteRatel.png?raw=true" width="55%" />
</p>

Upload, parse and visualize your Brute Ratel campaigns with this option.

#### .redeye File

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/UploadRedEyeFile.png?raw=true" width="55%" />
</p>

Upload database files ending with .redeye or .sqlite. These are usually campaigns that were previously exported.

### Filter Existing Campaigns

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/FilterCampaigns.png?raw=true" width="85%" height="65%"/>
</p>

Filter through the list of uploaded campaigns by typing in the input field next to "Add a campaign" button.

### Rename / Delete / Export Campaign

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/DeleteRenameExport.png?raw=true" width="85%"/>
</p>

To rename, delete or export the campaign as a database file, click on the "More" icon.

## **Explorer**

After uploading and selecting a campaign, you will be directed to the Explore Tab.

### Hosts Tab

This tab shows the different servers linked to the campaign being viewed, as well as the Cobalt Strike server. Select a host to see all commands executed by the beacons on the server.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/HostsTab.png?raw=true" width="65%"/>
</p>

#### Changing Host Color

To change the color and shape of how a host appears in the graph, click on the "Details Tab" after selecting a host.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/ChangeHostColor.png?raw=true" width="65%" />
</p>

### Operators Tab

Any operators, along with the number of beacons and commands that it's associated with will appear here.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/OperatorsTab.png?raw=true" width="65%"/>
</p>

### Comments Tab

All comments, including multi-command comments that have been added to the campaign, will be displayed here. Other functionalities include:

- Deleting comments
- Editing a comment
  - Add/Remove Tags
- Replying to a comment
- Favoriting a comment

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/CommentsTab.png?raw=true" width="65%"/>
</p>

### Beacons Tab

All beacons and the total number of commands executed by the beacon are displayed. In addition, any tags, such as Privilege Escalation, Goldenticket, jump, or elevate will be indicated by an icon.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/BeaconsTab.png?raw=true" width="65%"/>
</p>

#### Selecting Beacon From List

Select a beacon from the Beacons Tab to find out more information, such as the commands, operators, comments, and metadata that it is associated with.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/SelectBeacon.png?raw=true" width="55%" />
</p>

#### Changing Beacon Color and Shape

To change the color and shape of how a beacon appears in the graph, click on the "Details Tab" after selecting a beacon.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/UpdateBeaconColorShape.png?raw=true" width="65%"/>
</p>

### Command Types Tab

The Command Types tab displays a list of all commands and the number of times the command was executed by the beacons in the campaign.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/CommandTypesTab.png?raw=true" width="60%"/>
</p>

##### Expanding Raw Logs

Select a command from the list to view the raw logs executed by the beacon. Here, you'll be able to see the different types of associated MITRE attacks, as well as the option to copy the log file text.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/RawLogs.png?raw=true" width="100%"/>
</p>

### Adding Comments and Tags

#### Adding New Comments

Hover over a command and click on the "Add Comment" button to add a new comment.\
Within the new comment modal, you can favorite this comment, add a tag, and comments about\
the command.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/AddNewComments.png?raw=true" width="85%"/>
</p>

#### Multi-Command Comment

Use the multi-command comment function to group multiple commands with one comment. Use the checkbox to select one or more comments, then click "Comment on commands".

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/MultiCommandComment.png?raw=true" width="55%" height="60%">
</p>

#### Add command to an existing comment

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/AddCommandExistingComment.png?raw=true" width="75%"/>
</p>

### Timeline

The timeline located above the graph provides users the ability to:

- Filter the campaign by a time range
- Display the graph as events occurred.
- Fast forward / reverse the time
- Use the scrubber to filter.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/Timeline.png?raw=true" width="100%"/>
</p>

## **Settings Modal**

### Timezone

By default, the timezone should be automatically set to appear as your current timezone. To view the campaign in a different timezone, uncheck the "AutoSelect" button and use the drop-down to select your desired timezone.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/ChangeTimeZone.png?raw=true"  width="85%"/>
</p>

### Show/Hide Beacons

To display or hide beacons, check or uncheck the "Show Hidden Beacons, Host, and Servers" button.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/ShowHideBeacon.png?raw=true"  width="75%"/>
</p>

### Light Theme

This toggle enables light theme mode for RedEye.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/LightThemeMode.png?raw=true"  width="75%"/>
</p>

### Redacted Screenshot Mode

When toggled, RedEye makes text unreadable in order to provide secure screenshots.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/RedactedScreenShot.png?raw=true"  width="75%"/>
</p>

### Graph

The graph shows how hosts and beacons are connected to the Cobalt Strike server. Hover over the host node to view how the beacons are linked to the host and hover over the beacons inside the host node to see how it's linked to one another.

Clicking on the host node will display a list of all commands, beacons, operators, comments, and metadata about the host. Selecting the beacon node will display all commands, operators, comments, and metadata about the beacon.

Use the graph controls located on the right to view graph legends, zoom in and out of the graph, and reset the graph.

#### Exporting Graph

To export the graph as displayed as an image, simply click the export button.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/Graph.png?raw=true" width="65%" height="55%"/><img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/GraphControls.png?raw=true"/>
</p>

## **Search**

Search is available from the `eyeglass` icon in the navigation bar.

Search enables:

- Full-text search across:

  - Beacons
  - Hosts
  - Teamservers
  - Operators
  - Comments
  - Commands
  - Command Type
  - Tags

- Filtering results in any of the above item types.
- Sorting results by:
  - Relevance (ascending and descending)
  - Name (ascending and descending)
  - Type (ascending and descending)

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/Search Mode.png?raw=true" width="85%"/>
</p>

Search can be activated from anywhere within a campaign with an OS-specific key combination:

- Windows - `CTRL + K`
- Mac - `CMD + K`
- Linux - `CTRL + K`

## **Presentations**

Presentation mode is available from the `presentation` icon in the navigation bar.

Presentations are a collection of comments and commands ordered by time and grouped by tag.

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/Presentation Selection.png?raw=true" width="85%"/>
</p>

The first screen is a list of presentations:

- The first two are a collection of "All" and "Favorite" comments in the campaign.
- The remaining are organized by the tags

Clicking on an item in the list will open the presentation

<p align="center">
<img src="https://github.com/cisagov/RedEye/blob/develop/docs/images/Presentation View.png?raw=true" width="85%"/>
</p>

Each presentation has "slides" ordered by the time of the command tied to the comment.

Move forward in the presentation using the `Next` button and move backward with the `previous arrow` button to the left of `Next`. There is a slide indicator below those controls that allows changing to a specific slide.

To return to the presentations list, click the `left arrow` button at the far left of the panel
