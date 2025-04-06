<img src="logo.svg" width="280" alt="tempomat">

[Tempo.io](https://tempo.io) cloud CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tempomat.svg)](https://npmjs.org/package/tempomat)
[![License](https://img.shields.io/npm/l/tempomat.svg)](https://github.com/szymonkozak/tempomat/blob/master/LICENSE)

If you don't like using Jira/Tempo web UI for time logging and prefer a command line tools, tempomat is a simple CLI which allows you to manage your worklogs in Tempo Cloud service. It also includes time tracker feature.

Save time, it's much easier and faster to log time and browse worklogs using tempomat CLI.

## Table of contents
<!-- toc -->
* [Table of contents](#table-of-contents)
* [Usage](#usage)
* [Configuration](#configuration)
* [Commands](#commands)
* [Contributing](#contributing)
* [Changelog](#changelog)
* [License](#license)
<!-- tocstop -->

## Usage
```
$ npm install -g tempomat

$ tempo setup

$ tempo l abc-1 14-14:30
Logging time... Done.
Successfully logged 30m to ABC-1, type tempo d 123458 to undo.

$ tempo ls
Loading worklogs... Done.
┌─────────────────────────────────────────────────┐
│              March: 120/132h (+1h)              │
├─────────────────────────────────────────────────┤
│              Thursday, 2020-03-26               │
├────────┬─────────────┬───────────────┬──────────┤
│     id │     from-to │         issue │ duration │
├────────┼─────────────┼───────────────┼──────────┤
│ 123456 │ 09:20-09:50 │      ABC-1234 │      30m │
├────────┼─────────────┼───────────────┼──────────┤
│ 123457 │ 10:20-14:00 │      ABC-2222 │    3h40m │
├────────┼─────────────┼───────────────┼──────────┤
│ 123458 │ 14:00-14:30 │ (lunch) ABC-1 │      30m │
├────────┴─────────────┴───────────────┼──────────┤
│                 Required 6h, logged: │    4h40m │
└──────────────────────────────────────┴──────────┘

$ tempo d 123458
Deleting worklog 123458... Done.
Succesfully deleted worklog 123458. Deleted worklog details: ABC-1, 14:00-14:30 (30m)
```

## Configuration

To use tempomat, you need to configure it with your Tempo and Atlassian credentials. Run `tempo setup` and follow these steps:

1. **Jira Profile URL** (Step 1/4)
   - Required to get your account ID and hostname
   - Click on your avatar in Jira navigation header
   - Click on "profile" option
   - Copy and paste the URL (should look like: `https://{yourCompanyName}.atlassian.net/jira/people/{accountId}`)

2. **Atlassian User Email** (Step 2/4)
   - Your Jira/Atlassian account email
   - Required for authentication with Atlassian API

3. **Atlassian API Token** (Step 3/4)
   - Required to fetch issue IDs based on issue keys
   - Generate at: https://id.atlassian.com/manage-profile/security/api-tokens
   - The setup process will open this page automatically

4. **Tempo API Token** (Step 4/4)
   - Required for Tempo API authentication
   - Generate at: `https://{yourCompanyName}.atlassian.net/plugins/servlet/ac/io.tempo.jira/tempo-app#!/configuration/api-integration`
   - The setup process will open this page automatically

> **Note**: Since version 2.0.0, both Atlassian and Tempo tokens are required because Tempo API v4 requires issue IDs instead of issue keys. The tool automatically fetches issue IDs using the Atlassian API.

## Commands

<!-- commands -->
* [`tempo alias:delete ALIAS_NAME`](#tempo-aliasdelete-alias_name)
* [`tempo alias:list`](#tempo-aliaslist)
* [`tempo alias:set ALIAS ISSUE_KEY`](#tempo-aliasset-alias-issue_key)
* [`tempo autocomplete [SHELL]`](#tempo-autocomplete-shell)
* [`tempo delete WORKLOG_ID`](#tempo-delete-worklog_id)
* [`tempo help [COMMAND]`](#tempo-help-command)
* [`tempo list [WHEN]`](#tempo-list-when)
* [`tempo log ISSUE_KEY_OR_ALIAS DURATION_OR_INTERVAL [WHEN]`](#tempo-log-issue_key_or_alias-duration_or_interval-when)
* [`tempo setup`](#tempo-setup)
* [`tempo tracker:delete ISSUE_KEY_OR_ALIAS`](#tempo-trackerdelete-issue_key_or_alias)
* [`tempo tracker:list`](#tempo-trackerlist)
* [`tempo tracker:pause ISSUE_KEY_OR_ALIAS`](#tempo-trackerpause-issue_key_or_alias)
* [`tempo tracker:resume ISSUE_KEY_OR_ALIAS`](#tempo-trackerresume-issue_key_or_alias)
* [`tempo tracker:start ISSUE_KEY_OR_ALIAS`](#tempo-trackerstart-issue_key_or_alias)
* [`tempo tracker:stop ISSUE_KEY_OR_ALIAS`](#tempo-trackerstop-issue_key_or_alias)

## `tempo alias:delete ALIAS_NAME`

delete issue key alias

```
USAGE
  $ tempo alias:delete ALIAS_NAME [-h] [--debug]

ARGUMENTS
  ALIAS_NAME  Alias name

FLAGS
  -h, --help   Show CLI help.
  --debug

DESCRIPTION
  delete issue key alias

EXAMPLES
  $ tempo alias:delete lunch
```

_See code: [src/commands/alias/delete.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/alias/delete.ts)_

## `tempo alias:list`

print aliases list

```
USAGE
  $ tempo alias:list [-h] [--debug]

FLAGS
  -h, --help   Show CLI help.
  --debug

DESCRIPTION
  print aliases list

EXAMPLES
  $ tempo alias:list
```

_See code: [src/commands/alias/list.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/alias/list.ts)_

## `tempo alias:set ALIAS ISSUE_KEY`

set issue key alias, then alias can be used instead of issue key

```
USAGE
  $ tempo alias:set ALIAS ISSUE_KEY [-h] [--debug]

ARGUMENTS
  ALIAS      alias name
  ISSUE_KEY  issue key

FLAGS
  -h, --help   Show CLI help.
  --debug

DESCRIPTION
  set issue key alias, then alias can be used instead of issue key

EXAMPLES
  $ tempo alias:set lunch abc-123
```

_See code: [src/commands/alias/set.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/alias/set.ts)_

## `tempo autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ tempo autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ tempo autocomplete
  $ tempo autocomplete bash
  $ tempo autocomplete zsh
  $ tempo autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.4.6/src/commands/autocomplete/index.ts)_

## `tempo delete WORKLOG_ID`

[or d], delete the worklog with given id, this can be used also to delete a multiple worklogs

```
USAGE
  $ tempo delete WORKLOG_ID... [-h] [--debug]

ARGUMENTS
  WORKLOG_ID...  worklog ids to delete, like 123456

FLAGS
  -h, --help   Show CLI help.
  --debug

DESCRIPTION
  [or d], delete the worklog with given id, this can be used also to delete a multiple worklogs

ALIASES
  $ tempo d

EXAMPLES
  $ tempo delete 123456
  $ tempo d 123456
  $ tempo delete 123456 123457
```

_See code: [src/commands/delete.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/delete.ts)_

## `tempo help [COMMAND]`

Display help for tempo.

```
USAGE
  $ tempo help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for tempo.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.27/src/commands/help.ts)_

## `tempo list [WHEN]`

[or ls], print worklogs from provided date (YYYY-MM-DD or 'y' as yesterday)

```
USAGE
  $ tempo list [WHEN] [-h] [--debug] [-v]

ARGUMENTS
  WHEN  date to fetch worklogs, defaulted to today
        * date in YYYY-MM-DD format
        * y as yesterday

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose  verbose output with description and task link
  --debug

DESCRIPTION
  [or ls], print worklogs from provided date (YYYY-MM-DD or 'y' as yesterday)

ALIASES
  $ tempo ls

EXAMPLES
  $ tempo list
  $ tempo ls
  $ tempo list y 
  $ tempo list yesterday 
  $ tempo list 2020-02-17
  $ tempo list -v
```

_See code: [src/commands/list.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/list.ts)_

## `tempo log ISSUE_KEY_OR_ALIAS DURATION_OR_INTERVAL [WHEN]`

[or l], add a new worklog using duration or interval (abc-123 15m or abc-123 11-12:30)

```
USAGE
  $ tempo log ISSUE_KEY_OR_ALIAS DURATION_OR_INTERVAL [WHEN] [-h] [--debug] [-d <value>] [-s <value>] [-r <value>]

ARGUMENTS
  ISSUE_KEY_OR_ALIAS    issue key or alias
  DURATION_OR_INTERVAL  worklog duration (e.g 15m) or interval (e.g 11:30-14)
  WHEN                  date to add worklog, defaulted to today
                        * date in YYYY-MM-DD format
                        * y as yesterday

FLAGS
  -d, --description=<value>         description for worklog
  -h, --help                        Show CLI help.
  -r, --remaining-estimate=<value>  remaining estimate
  -s, --start=<value>               start time (HH:mm format), used when the input is a duration
  --debug

DESCRIPTION
  [or l], add a new worklog using duration or interval (abc-123 15m or abc-123 11-12:30)

ALIASES
  $ tempo l

EXAMPLES
  $ tempo log abc-123 1h 
  $ tempo l abc-123 1h 
  $ tempo log abc-123 15m 
  $ tempo log abc-123 1h15m 
  $ tempo log abc-123 11-14
  $ tempo log abc-123 11-14:30
  $ tempo log abc-123 11:35-14:20 
  $ tempo log abc-123 11.35-14.20 
  $ tempo log abc-123 1h15m 2019-02-17
  $ tempo log abc-123 1h15m y
  $ tempo log abc-123 1h15m yesterday
  $ tempo log abc-123 1h15m -d "worklog description"
  $ tempo log abc-123 1h15m --start 10:30
  $ tempo log abc-123 1h15m -s 9
```

_See code: [src/commands/log.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/log.ts)_

## `tempo setup`

setup cli, this is required before the first use

```
USAGE
  $ tempo setup

DESCRIPTION
  setup cli, this is required before the first use

EXAMPLES
  $ tempo setup
```

_See code: [src/commands/setup.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/setup.ts)_

## `tempo tracker:delete ISSUE_KEY_OR_ALIAS`

delete a tracker

```
USAGE
  $ tempo tracker:delete ISSUE_KEY_OR_ALIAS [-h] [--debug]

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key or alias

FLAGS
  -h, --help   Show CLI help.
  --debug

DESCRIPTION
  delete a tracker

EXAMPLES
  $ tempo tracker:delete abc-123
```

_See code: [src/commands/tracker/delete.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/tracker/delete.ts)_

## `tempo tracker:list`

list all trackers

```
USAGE
  $ tempo tracker:list [-h] [--debug]

FLAGS
  -h, --help   Show CLI help.
  --debug

DESCRIPTION
  list all trackers

EXAMPLES
  $ tempo tracker:list
```

_See code: [src/commands/tracker/list.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/tracker/list.ts)_

## `tempo tracker:pause ISSUE_KEY_OR_ALIAS`

[or pause], pause a tracker that is currently running

```
USAGE
  $ tempo tracker:pause ISSUE_KEY_OR_ALIAS [-h] [--debug]

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key or alias

FLAGS
  -h, --help   Show CLI help.
  --debug

DESCRIPTION
  [or pause], pause a tracker that is currently running

ALIASES
  $ tempo pause

EXAMPLES
  $ tempo tracker:pause abc-123
  $ tempo pause abc-123
```

_See code: [src/commands/tracker/pause.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/tracker/pause.ts)_

## `tempo tracker:resume ISSUE_KEY_OR_ALIAS`

resume tracking time

```
USAGE
  $ tempo tracker:resume ISSUE_KEY_OR_ALIAS [-h] [--debug]

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key or alias

FLAGS
  -h, --help   Show CLI help.
  --debug

DESCRIPTION
  resume tracking time

EXAMPLES
  $ tempo tracker:resume abc-123
  $ tempo resume abc-123
```

_See code: [src/commands/tracker/resume.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/tracker/resume.ts)_

## `tempo tracker:start ISSUE_KEY_OR_ALIAS`

[or start], start a new tracker

```
USAGE
  $ tempo tracker:start ISSUE_KEY_OR_ALIAS [-h] [--debug] [-d <value>] [--stop-previous]

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key or alias

FLAGS
  -d, --description=<value>  description for worklog once tracker is stopped
  -h, --help                 Show CLI help.
  --debug
      --stop-previous        stops and logs previous tracker with the same issue key if it exists

DESCRIPTION
  [or start], start a new tracker

ALIASES
  $ tempo start

EXAMPLES
  $ tempo tracker:start abc-123
  $ tempo start abc-123
  $ tempo tracker:start abc-123 -d "worklog description"
```

_See code: [src/commands/tracker/start.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/tracker/start.ts)_

## `tempo tracker:stop ISSUE_KEY_OR_ALIAS`

[or stop], stop a tracker and log it

```
USAGE
  $ tempo tracker:stop ISSUE_KEY_OR_ALIAS [-h] [--debug] [-d <value>] [-r <value>]

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key or alias

FLAGS
  -d, --description=<value>         description for worklog
  -h, --help                        Show CLI help.
  -r, --remaining-estimate=<value>  remaining estimate
  --debug

DESCRIPTION
  [or stop], stop a tracker and log it

ALIASES
  $ tempo stop

EXAMPLES
  $ tempo tracker:stop abc-123
  $ tempo stop abc-123
  $ tempo tracker:stop abc-123 -d "worklog description"
```

_See code: [src/commands/tracker/stop.ts](https://github.com/szymonkozak/tempomat/blob/v2.0.0-beta.0/src/commands/tracker/stop.ts)_
<!-- commandsstop -->

## Contributing

If you'd like to contribute to tempomat, please follow these steps:

1. Open an issue describing the changes you plan to make
2. Wait for approval before starting development
3. Once approved, you can set up the project locally:

```bash
git clone https://github.com/szymonkozak/tempomat.git
cd tempomat
npm install
npm run build
npm test
```

To run the CLI tool locally, call:
```bash
bin/run
```

After making your changes:
- Run tests & lint to ensure everything works: `npm test` and `npm run lint`
- Build the project: `npm run build`
- Submit a pull request with a clear description of your changes

## Changelog

For a detailed list of changes, see the [CHANGELOG.md](CHANGELOG.md) file.

## License

```
MIT License

Copyright (c) 2020 Szymon Kozak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
