import {
  addAutoAddTileFeature,
  addCSSVariablesToPlacement,
  addLoadMoreButtonFeature,
  addTilesPerPageFeature,
  Callback,
  EventCallback,
  loadExpandedTileFeature,
  loadTitle,
  loadWidgetIsEnabled,
  registerExpandedTileCrossSellersRendered,
  registerExpandedTileRenderedListener,
  registerLoadListener,
  registerResizeListener,
  registerTileBgImageError,
  registerTileBgImgRenderComplete,
  registerTileClosedListener,
  registerTileExpandListener,
  registerTilesUpdated,
  registerWidgetInitComplete
} from "./libs"
import { onExpandedTileCrossSellersRendered } from "./libs/components/expanded-tile-swiper/product-recs-swiper.loader"
import getCSSVariables from "./libs/css-variables"
import { ISdk } from "./types"
import {
  handleTileImageError,
  handleAllTileImageRendered,
  renderMasonryLayout
} from "./libs/extensions/masonry.extension"
import { loadAllUnloadedTiles } from "./libs/extensions/swiper/loader.extension"

declare const sdk: ISdk

interface Features {
  showTitle: boolean
  preloadImages: boolean
  disableWidgetIfNotEnabled: boolean
  addNewTilesAutomatically: boolean
  handleLoadMore: boolean
  limitTilesPerPage: boolean
  hideBrokenImages: boolean
}

interface Extensions {
  swiper: boolean
  masonry: boolean
}

interface Callbacks {
  resize: Callback[]
  onLoad: Callback[]
  onExpandTile: Callback[]
  onTileClose: Callback[]
  onTileRendered: Callback[]
  onTilesUpdated: Callback[]
  onCrossSellersRendered: Callback[]
  widgetInitComplete: Callback[]
  tileBgImgRenderComplete: Callback[]
  tileBgImageError: EventCallback[]
}

export interface MyWidgetSettings {
  features: Partial<Features>
  callbacks: Partial<Callbacks>
  extensions: Partial<Extensions>
}

export interface EnforcedWidgetSettings {
  features: Features
  callbacks: Callbacks
  extensions: Extensions
}

export function loadListeners(settings: EnforcedWidgetSettings) {
  const {
    onLoad,
    onExpandTile,
    onTileClose,
    onTileRendered,
    onCrossSellersRendered,
    onTilesUpdated,
    widgetInitComplete,
    tileBgImgRenderComplete,
    tileBgImageError,
    resize
  } = settings.callbacks

  if (onLoad && onLoad.length) {
    onLoad.forEach(event => registerLoadListener(event))
  }

  if (onExpandTile && onExpandTile.length) {
    onExpandTile.forEach(event => registerExpandedTileRenderedListener(event))
  }

  if (onTileClose && onTileClose.length) {
    onTileClose.forEach(event => registerTileClosedListener(event))
  }

  if (onTileRendered && onTileRendered.length) {
    onTileRendered.forEach(event => registerTileExpandListener(event))
  }

  if (onCrossSellersRendered && onCrossSellersRendered.length) {
    onCrossSellersRendered.forEach(event => registerExpandedTileCrossSellersRendered(event))
  }

  if (widgetInitComplete && widgetInitComplete.length) {
    widgetInitComplete.forEach(event => registerWidgetInitComplete(event))
  }

  if (tileBgImgRenderComplete && tileBgImgRenderComplete.length) {
    tileBgImgRenderComplete.forEach(event => registerTileBgImgRenderComplete(event))
  }

  if (tileBgImageError && tileBgImageError.length) {
    tileBgImageError.forEach(event => registerTileBgImageError(event))
  }

  if (resize && resize.length) {
    resize.forEach(event => registerResizeListener(event))
  }

  if (onTilesUpdated && onTilesUpdated.length) {
    onTilesUpdated.forEach(event => registerTilesUpdated(event))
  }

  registerExpandedTileCrossSellersRendered(onExpandedTileCrossSellersRendered)
}

function loadMasonryCallbacks(settings: EnforcedWidgetSettings) {
  settings.callbacks.widgetInitComplete.push(() => {
    loadAllUnloadedTiles()
    setTimeout(() => renderMasonryLayout(), 1000)
  })

  settings.callbacks.onTilesUpdated.push(() => {
    renderMasonryLayout()
  })

  settings.callbacks.tileBgImgRenderComplete.push(() => {
    handleAllTileImageRendered()
    setTimeout(handleAllTileImageRendered, 1000)
  })

  settings.callbacks.tileBgImageError.push((event: Event) => {
    const customEvent = event as CustomEvent
    const tileWithError = customEvent.detail.data.target as HTMLElement
    handleTileImageError(tileWithError)
  })

  settings.callbacks.resize!.push(() => {
    renderMasonryLayout(false, true)
  })

  return settings
}

function mergeSettingsWithDefaults(settings: MyWidgetSettings): EnforcedWidgetSettings {
  return {
    features: {
      showTitle: true,
      preloadImages: true,
      disableWidgetIfNotEnabled: true,
      addNewTilesAutomatically: true,
      handleLoadMore: true,
      limitTilesPerPage: true,
      hideBrokenImages: true,
      ...settings.features
    },
    callbacks: {
      onLoad: [],
      onExpandTile: [],
      onTileClose: [],
      onTileRendered: [],
      onCrossSellersRendered: [],
      onTilesUpdated: [],
      widgetInitComplete: [],
      tileBgImgRenderComplete: [],
      tileBgImageError: [],
      resize: [],
      ...settings.callbacks
    },
    extensions: {
      swiper: false,
      masonry: false,
      ...settings.extensions
    }
  }
}

async function loadFeatures(settings: EnforcedWidgetSettings) {
  const {
    showTitle,
    preloadImages,
    disableWidgetIfNotEnabled,
    addNewTilesAutomatically,
    handleLoadMore,
    limitTilesPerPage,
    hideBrokenImages
  } = settings.features

  sdk.tiles.preloadImages = preloadImages
  sdk.tiles.hideBrokenTiles = hideBrokenImages

  if (disableWidgetIfNotEnabled) {
    loadWidgetIsEnabled()
  }

  if (showTitle) {
    loadTitle()
  }

  loadExpandedTileFeature()

  if (addNewTilesAutomatically) {
    addAutoAddTileFeature()
  }

  if (handleLoadMore) {
    await import("./libs/components/load-more")
    addLoadMoreButtonFeature()
  }

  if (limitTilesPerPage) {
    addTilesPerPageFeature()
  }

  return settings
}

function loadExtensions(settings: EnforcedWidgetSettings) {
  const { extensions } = settings

  if (extensions?.masonry) {
    settings = loadMasonryCallbacks(settings)
  }

  return settings
}

export function initialiseFeatures(settings: MyWidgetSettings) {
  if (Object.keys(settings.features).length === 0) {
    settings.features = {
      showTitle: true,
      preloadImages: true,
      disableWidgetIfNotEnabled: true,
      addNewTilesAutomatically: true,
      handleLoadMore: true,
      limitTilesPerPage: true
    }
  }

  return settings
}

export function loadWidget(settings: MyWidgetSettings) {
  const settingsWithDefaults = mergeSettingsWithDefaults(settings)
  addCSSVariablesToPlacement(getCSSVariables())
  loadFeatures(settingsWithDefaults)
  loadExtensions(settingsWithDefaults)
  loadListeners(settingsWithDefaults)
}
