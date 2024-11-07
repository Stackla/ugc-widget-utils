import { loadExpandedTileTemplates } from "./libs/components/expanded-tile-swiper"
import { loadTemplates } from "./widget-loader"

const sdk = {
  addSharedCssCustomStyles: jest.fn(),
  addCSSToComponent: jest.fn(),
  addTemplateToComponent: jest.fn(),
  placement: {
    getWidgetId: jest.fn().mockReturnValue("widget-id")
  }
}

// @ts-expect-error globals
global.sdk = sdk

jest.mock("./libs/components/expanded-tile-swiper", () => ({
  loadExpandedTileTemplates: jest.fn()
}))

const settings = {
  features: {
    showTitle: true,
    preloadImages: true,
    disableWidgetIfNotEnabled: true,
    addNewTilesAutomatically: true,
    handleLoadMore: true,
    limitTilesPerPage: true,
    hideBrokenImages: true,
    loadExpandedTileSlider: true
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
    resize: []
  },
  extensions: {
    swiper: false,
    masonry: false
  },
  templates: {
    direct_uploader: {
      style: {
        css: "body { color: red; }",
        global: false
      },
      template: () => "<p>Hello!</p>"
    },
    shopspots: {
      style: {
        css: "body { color: blue; }",
        global: true
      },
      template: () => "<p>Hi!</p>"
    }
  }
}

describe("loadTemplates", () => {
  beforeEach(() => {
    jest.clearAllMocks() // Clear mocks before each test
  })

  it("should call loadExpandedTileTemplates when loadExpandedTileSlider is true", () => {
    loadTemplates(settings)

    expect(loadExpandedTileTemplates).toHaveBeenCalled()
  })

  it("should not call loadExpandedTileTemplates when loadExpandedTileSlider is false", () => {
    const mutatedSettings = {
      ...settings,
      features: {
        ...settings.features,
        loadExpandedTileSlider: false
      }
    }

    loadTemplates(mutatedSettings)

    expect(loadExpandedTileTemplates).not.toHaveBeenCalled()
  })

  it("should not add templates if settings.templates is empty or undefined", () => {
    const mutatedSettings = {
      ...settings,
      templates: {}
    }

    loadTemplates(mutatedSettings)

    expect(sdk.addSharedCssCustomStyles).not.toHaveBeenCalled()
    expect(sdk.addCSSToComponent).not.toHaveBeenCalled()
    expect(sdk.addTemplateToComponent).not.toHaveBeenCalled()
  })

  it("should process templates with custom templates correctly", () => {
    const mutatedSettings = {
      ...settings,
      templates: {
        shopspots: {
          style: {
            css: "body { color: red; }",
            global: false
          },
          template: () => "<p>Hello!</p>"
        }
      }
    }

    loadTemplates(mutatedSettings)

    expect(sdk.addCSSToComponent).toHaveBeenCalledWith("body { color: red; }", "shopspots")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(sdk.addTemplateToComponent).toHaveBeenCalledWith(expect.any(Function), "shopspots")
  })

  it("should process global styles correctly", () => {
    const mutatedSettings = {
      ...settings,
      templates: {
        shopspots: {
          style: {
            css: "body { color: red; }",
            global: true
          },
          template: () => "<p>Hello!</p>"
        }
      }
    }

    loadTemplates(mutatedSettings)

    expect(sdk.addSharedCssCustomStyles).toHaveBeenCalledWith(
      expect.any(String), // Random key, so we don't know the value
      "body { color: red; }",
      ["widget-id", "shopspots"]
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(sdk.addTemplateToComponent).toHaveBeenCalledWith(expect.any(Function), "shopspots")
  })
})