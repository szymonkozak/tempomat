# Changelog

All notable changes to this project will be documented in this file.

This project adheres to Semantic Versioning.

## [2.0.0] - Unreleased yet

### Changed
- Migrated from Tempo API v3 to v4
- Switched from using issueKey to issueId for worklogs (which is required in API v4)
- Added integration with Atlassian API to fetch issueId based on issueKey
- Requires reconfiguration after installation (run `tempo setup`)
- New configuration requires Atlassian user email and Atlassian token
- See [#66](https://github.com/szymonkozak/tempomat/issues/66) for more details about why Atlassian token is needed
- Updated most of dependencies

## [1.1.0] - 2020-08-13

### Added
- Tracker feature
- Display aliases in the worklogs table

### Changed
- Adapted setup instructions to fit new tempo version

### Fixed
- Error handling issues
- Time related issues

## [1.0.5] - 2020-07-29

- Initial release 