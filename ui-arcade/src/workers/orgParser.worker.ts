// Web Worker: parse the org challenges file off the main thread.
// Vite bundles the org file as a raw string at build time.
import rawOrg from '../../vim-golf-challenges/README.org?raw'
import { parseOrgChallenges } from '../engine/orgChallengesParser'

const challenges = parseOrgChallenges(rawOrg)
self.postMessage(challenges)
