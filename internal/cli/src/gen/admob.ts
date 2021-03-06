import _ from 'lodash'
import { pkgsDirJoin } from '../utils'
import {
  buildUtils,
  indent4,
  renderJavaContants,
  renderSwiftContants,
  renderTsContants,
  warnMessage,
} from './shared'

const Actions = _.mapValues(
  {
    ready: null,
    configRequest: null,
    setAppMuted: null,
    setAppVolume: null,
    // BannerAd
    bannerShow: null,
    bannerHide: null,
    // InterstitialAd
    interstitialIsLoaded: null,
    interstitialLoad: null,
    interstitialShow: null,
    // RewardedAd
    rewardedIsLoaded: null,
    rewardedLoad: null,
    rewardedShow: null,
  },
  (v, k) => (v === null ? k : v) as string,
)

const Events = _.mapValues(
  {
    initComplete: null,
    ready: null,
    // BannerAd
    bannerLoad: 'banner.load',
    bannerLoadFail: 'banner.loadFail',
    bannerOpen: 'banner.open',
    bannerClose: 'banner.close',
    bannerImpression: 'banner.impression',
    bannerClick: 'banner.click',
    // InterstitialAd
    interstitialLoad: 'interstitial.load',
    interstitialLoadFail: 'interstitial.loadFail',
    interstitialOpen: 'interstitial.open',
    interstitialClose: 'interstitial.close',
    interstitialImpression: 'interstitial.impression',
    interstitialClick: 'interstitial.click',
    // RewardedAd
    rewardedLoad: 'rewarded.load',
    rewardedLoadFail: 'rewarded.loadFail',
    rewardedOpen: 'rewarded.open',
    rewardedClose: 'rewarded.close',
    rewardedReward: 'rewarded.reward',
    rewardedShowFail: 'rewarded.showFail',
  },
  (v, k) => `admob.${v === null ? k : v}`,
)

const AdSizeTypes = [
  'BANNER',
  'LARGE_BANNER',
  'MEDIUM_RECTANGLE',
  'FULL_BANNER',
  'LEADERBOARD',
  'SMART_BANNER',
]

function buildJava(): string {
  const linesActions = renderJavaContants(Actions)
  const linesEvents = renderJavaContants(Events)

  const linesAdSizeType = [
    `${indent4(2)}${AdSizeTypes.map((s) => `${s}`).join(', ')};`,
    '',
    `${indent4(2)}public static AdSize getAdSize(Object adSize) {`,
    ..._.flatMap(AdSizeTypes, (s) => [
      `${indent4(3)}if (AdSizeType.${s}.equals(adSize)) {`,
      `${indent4(4)}return AdSize.${s};`,
      `${indent4(3)}}`,
    ]),
    `${indent4(3)}return null;`,
    `${indent4(2)}}`,
  ].join('\n')

  return `// ${warnMessage}
package admob.plugin;

import com.google.android.gms.ads.AdSize;

public final class Generated {
    public final class Actions {
${linesActions}
    }

    public final class Events {
${linesEvents}
    }

    public enum AdSizeType {
${linesAdSizeType}
    }
}
`
}

function buildSwift(): string {
  const linesEvents = renderSwiftContants(Events)

  return `// ${warnMessage}
struct AMSBannerPosition {
    static let bottom = "bottom"
    static let top = "top"
}

struct AMSEvents {
${linesEvents}
}
`
}

function buildTypeScript(): string {
  const linesActions = renderTsContants(Actions)
  const linesEvents = renderTsContants(Events)

  const adSizeType = AdSizeTypes.map((s) => `  ${s},`).join('\n')

  return `// ${warnMessage}
import { exec } from 'cordova'

export enum NativeActions {
${linesActions}
}

export enum Events {
${linesEvents}
}

export enum AdSizeType {
${adSizeType}
}
${buildUtils('AdMob', 'NativeActions')}
`
}

export default async () => ({
  files: [
    { path: 'cordova/src/android/Generated.java', f: buildJava },
    {
      path: 'cordova/src/ios/AMSGenerated.swift',
      f: buildSwift,
    },
    { path: 'cordova/ts/generated.ts', f: buildTypeScript },
  ],
  pkgDir: pkgsDirJoin('cordova'),
  tagertDir: 'src/admob/plugin',
})
