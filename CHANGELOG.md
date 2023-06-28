# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [3.1.1] - 2023-06-28
### Fixed
- Fixed with Twist format being rejected

## [3.1.0] - 2023-06-27
### Added
- Added support for Twist  
  *Use `FormatType.FT_TWIST` for Twist decks*

## [3.0.1] - 2023-06-05
### Fixed
- Fixed sideboardCards being required in deckDefinition

## [3.0.0] - 2023-06-05
### Added
- Added support for sideboards  
  *DeckDefinition now accepts an optional sideboardCards paramter of the shape `[dbfId, count, ownerDbfId]`*
- Added `DeckCard` type  
  *Use `DeckCard[]` over `DeckList` in your code*

## [2.2.1] - 2021-03-25
### Added
- Added support for the Classic format  
  *Use `FormatType.FT_CLASSIC` for decks in the classic format*

## [2.1.0] - 2019-02-05
### Added
- Export FormatType constants  
  *Use `FormatType.FT_WILD` or `FormatType.FT_STANDARD` in place of magical constants when checking a decks format*

## [2.0.0] - 2018-02-09
### Added
- Added browser bundles
- Added ES module bundles
- Added Typescript typings

### Changed
- Always return canonical deckstrings and deck definitions  
  *A canonical deckstring/deck definition has all heroes and cards sorted by dbf id in ascending order*

### Removed
- Removed test code in npm package

## [1.1.0] - 2017-07-27
### Changed
- Switched deckstrings.js to UMD build

## [1.0.1] - 2017-07-27
### Fixed
- Fixed unnecessary dependency

## [1.0.0] - 2017-07-27
### Changed
- Hoisted builds using Rollup

## [0.2.0] - 2017-05-31
### Added
- Tests (using Mocha and Chai)

### Changed
- encode: Skip counts with 0
- encode: Verify parameters more strictly

### Fixed
- decode: Fix invalid deckstring version message

## [0.1.1] - 2017-05-25
### Added
- Changelog (http://keepachangelog.com/)

### Fixed
- Fix a decoding bug

[Unreleased]: https://github.com/HearthSim/npm-deckstrings/compare/v3.1.1...HEAD
[3.1.1]: https://github.com/HearthSim/npm-deckstrings/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/HearthSim/npm-deckstrings/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/HearthSim/npm-deckstrings/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/HearthSim/npm-deckstrings/compare/v2.2.1...v3.0.0
[2.2.1]: https://github.com/HearthSim/npm-deckstrings/compare/v2.1.0...v2.2.1
[2.1.0]: https://github.com/HearthSim/npm-deckstrings/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/HearthSim/npm-deckstrings/compare/1.1.0...v2.0.0
[1.1.0]: https://github.com/HearthSim/npm-deckstrings/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/HearthSim/npm-deckstrings/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/HearthSim/npm-deckstrings/compare/0.2.0...1.0.0
[0.2.0]: https://github.com/HearthSim/npm-deckstrings/compare/0.1.1...0.2.0
[0.1.1]: https://github.com/HearthSim/npm-deckstrings/compare/0.1.0...0.1.1
