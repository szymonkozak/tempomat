tempomat
========

[Tempo.io](https://tempo.io) cloud CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tempomat.svg)](https://npmjs.org/package/tempomat)
[![License](https://img.shields.io/npm/l/tempomat.svg)](https://github.com/szymonkozak/tempomat/blob/master/LICENSE)

If you don’t like using Jira/Tempo web UI for time logging and prefer a command line tools, tempomat is a simple CLI which allows you to manage your worklogs in Tempo Cloud service. It also includes time tracker feature.

Save time, it’s much easier and faster to log time and browse worklogs using tempomat CLI.

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

## Commands

* [`tempo help [COMMAND]`](#tempo-help-command)
* [`tempo setup`](#tempo-setup)
* [`tempo log ISSUE_KEY_OR_ALIAS DURATION_OR_INTERVAL [WHEN]`](#tempo-log-issue_key_or_alias-duration_or_interval-when)
* [`tempo list [WHEN]`](#tempo-list-when)
* [`tempo delete WORKLOG_ID`](#tempo-delete-worklog_id)
* [`tempo autocomplete [SHELL]`](#tempo-autocomplete-shell)
* [`tempo alias:set ALIAS_NAME ISSUE_KEY`](#tempo-aliasset-alias_name-issue_key)
* [`tempo alias:delete ALIAS_NAME`](#tempo-aliasdelete-alias_name)
* [`tempo alias:list`](#tempo-aliaslist)

Tracker commands are still in beta:

* [`tempo tracker:start ISSUE_KEY_OR_ALIAS`](#tempo-trackerstart-issue_key_or_alias)
* [`tempo tracker:stop ISSUE_KEY_OR_ALIAS`](#tempo-trackerstop-issue_key_or_alias)
* [`tempo tracker:pause ISSUE_KEY_OR_ALIAS`](#tempo-trackerpause-issue_key_or_alias)
* [`tempo tracker:resume ISSUE_KEY_OR_ALIAS`](#tempo-trackerresume-issue_key_or_alias)
* [`tempo tracker:delete ISSUE_KEY_OR_ALIAS`](#tempo-trackerdelete-issue_key_or_alias)
* [`tempo tracker:list`](#tempo-trackerlist)

### `tempo help [COMMAND]`

display help for tempo

```
USAGE
  $ tempo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

### `tempo setup`

setup cli, this is required before the first use

```
USAGE
  $ tempo setup

EXAMPLE
  tempo setup
```


### `tempo log ISSUE_KEY_OR_ALIAS DURATION_OR_INTERVAL [WHEN]`

[or l], add a new worklog using duration or interval (abc-123 15m or abc-123 11-12:30)

```
USAGE
  $ tempo log ISSUE_KEY_OR_ALIAS DURATION_OR_INTERVAL [WHEN]

ARGUMENTS
  ISSUE_KEY_OR_ALIAS    issue key, like abc-123 or alias
  DURATION_OR_INTERVAL  worklog duration (e.g 15m) or interval (e.g 11:30-14)

  WHEN                  date to add worklog, defaulted to today
                        * date in YYYY-MM-DD format
                        * y as yesterday

OPTIONS
  -d, --description=description  worklog description
  -h, --help                     show CLI help
  -s, --start=start              start time (HH:mm format), used when the input is a duration
  --debug

ALIASES
  $ tempo l

EXAMPLES
  tempo log abc-123 1h 
  tempo l abc-123 1h 
  tempo log abc-123 15m 
  tempo log abc-123 1h15m 
  tempo log abc-123 11-14
  tempo log abc-123 11-14:30
  tempo log abc-123 11:35-14:20 
  tempo log abc-123 11.35-14.20 
  tempo log abc-123 1h15m 2019-02-17
  tempo log abc-123 1h15m y
  tempo log abc-123 1h15m yesterday
  tempo log abc-123 1h15m -d "worklog description"
  tempo log abc-123 1h15m --start 10:30
  tempo log abc-123 1h15m -s 9
```

### `tempo list [WHEN]`

[or ls], print worklogs from provided date (YYYY-MM-DD or 'y' as yesterday)

```
USAGE
  $ tempo list [WHEN]

ARGUMENTS
  WHEN  date to fetch worklogs, defaulted to today
        * date in YYYY-MM-DD format
        * y as yesterday

OPTIONS
  -h, --help     show CLI help
  -v, --verbose  verbose output with description and task link
  --debug

ALIASES
  $ tempo ls

EXAMPLES
  tempo list
  tempo ls
  tempo list y 
  tempo list yesterday 
  tempo list 2020-02-17
  tempo list -v
```

### `tempo delete WORKLOG_ID`

[or d], delete the worklog with given id, this can be used also to delete a multiple worklogs

```
USAGE
  $ tempo delete WORKLOG_ID

ARGUMENTS
  WORKLOG_ID  worklog ids to delete, like 123456

OPTIONS
  -h, --help  show CLI help
  --debug

ALIASES
  $ tempo d

EXAMPLES
  tempo delete 123456
  tempo d 123456
  tempo delete 123456 123457
```

### `tempo autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ tempo autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ tempo autocomplete
  $ tempo autocomplete bash
  $ tempo autocomplete zsh
  $ tempo autocomplete --refresh-cache
```

### `tempo alias:set ALIAS_NAME ISSUE_KEY`

set issue key alias, then alias can be used instead of issue key

```
USAGE
  $ tempo alias:set ALIAS_NAME ISSUE_KEY

ARGUMENTS
  ALIAS_NAME
  ISSUE_KEY   issue key, like abc-123

OPTIONS
  -h, --help  show CLI help
  --debug

EXAMPLE
  tempo alias:set lunch abc-123
```

### `tempo alias:delete ALIAS_NAME`

delete issue key alias

```
USAGE
  $ tempo alias:delete ALIAS_NAME

OPTIONS
  -h, --help  show CLI help
  --debug

EXAMPLE
  tempo alias:delete lunch
```

### `tempo alias:list`

print aliases list

```
USAGE
  $ tempo alias:list

OPTIONS
  -h, --help  show CLI help
  --debug

EXAMPLE
  tempo alias:list
```

### `tempo tracker:start ISSUE_KEY_OR_ALIAS`

[or start], start a new tracker

```
USAGE
  $ tempo tracker:start ISSUE_KEY_OR_ALIAS

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key, like abc-123 or alias

OPTIONS
  -d, --description=description  description for worklog once tracker is stopped
  -h, --help                     show CLI help
  --debug
  --stop-previous                stops and logs previous tracker with the same issue key if it exists

ALIASES
  $ tempo start

EXAMPLES
  tempo tracker:start abc-123
  tempo start abc-123
  tempo tracker:start abc-123 -d "worklog description"
```

### `tempo tracker:stop ISSUE_KEY_OR_ALIAS`

[or stop], stop a tracker and log it

```
USAGE
  $ tempo tracker:stop ISSUE_KEY_OR_ALIAS

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key, like abc-123 or alias

OPTIONS
  -d, --description=description  description for worklog
  -h, --help                     show CLI help
  --debug

ALIASES
  $ tempo stop

EXAMPLES
  tempo tracker:stop abc-123
  tempo stop abc-123
  tempo tracker:stop abc-123 -d "worklog description"
```

### `tempo tracker:resume ISSUE_KEY_OR_ALIAS`

[or resume], resume a tracker that is currently paused

```
USAGE
  $ tempo tracker:resume ISSUE_KEY_OR_ALIAS

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key, like abc-123 or alias

OPTIONS
  -h, --help  show CLI help
  --debug

ALIASES
  $ tempo resume

EXAMPLES
  tempo tracker:resume abc-123
  tempo resume abc-123
```

### `tempo tracker:pause ISSUE_KEY_OR_ALIAS`

[or pause], pause a tracker that is currently running

```
USAGE
  $ tempo tracker:pause ISSUE_KEY_OR_ALIAS

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key, like abc-123 or alias

OPTIONS
  -h, --help  show CLI help
  --debug

ALIASES
  $ tempo pause

EXAMPLES
  tempo tracker:pause abc-123
  tempo pause abc-123
```

### `tempo tracker:delete ISSUE_KEY_OR_ALIAS`

delete a tracker

```
USAGE
  $ tempo tracker:delete ISSUE_KEY_OR_ALIAS

ARGUMENTS
  ISSUE_KEY_OR_ALIAS  issue key, like abc-123 or alias

OPTIONS
  -h, --help  show CLI help
  --debug

EXAMPLE
  tempo tracker:delete abc-123
```

### `tempo tracker:list`

list all trackers

```
USAGE
  $ tempo tracker:list

EXAMPLE
  tempo tracker:list
```

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