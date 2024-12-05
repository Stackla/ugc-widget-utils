import type { Features, ISdk, Style } from "../"

declare const sdk: ISdk

export function getTileSize(settings?: Features["tileSizeSettings"]) {
  const style = sdk.getStyleConfig()
  const { inline_tile_size } = style

  const tileSizes: { [key: string]: string } = {
    small: settings?.small ?? "173px",
    medium: settings?.medium ?? "265.5px",
    large: settings?.large ?? "400px"
  }

  if (!inline_tile_size) {
    return tileSizes["medium"]
  }

  return tileSizes[inline_tile_size]
}

export function getTileSizeByWidget(tileSizeSettings?: Features["tileSizeSettings"]) {
  const sizeWithUnit = getTileSize(tileSizeSettings)
  const sizeUnitless = sizeWithUnit.replace("px", "")
  return { "--tile-size": sizeWithUnit, "--tile-size-unitless": sizeUnitless }
}

export function trimHashValuesFromObject(obj: Style) {
  return Object.entries(obj).reduce((acc: Record<string, string>, [key, value]) => {
    acc[key] = typeof value === "string" && value.startsWith("#") ? value.replace("#", "") : value
    return acc
  }, {})
}

/**
 * @description Get the CSS variables for the widget
 * @params tileSizeSettings - Custom tile size settings, small, medium, large
 */
export default function getCSSVariables(tileSizeSettings?: Features["tileSizeSettings"]): string {
  const styles = sdk.getStyleConfig()
  const inlineTileSettings = sdk.getInlineTileConfig()
  const {
    widget_background,
    text_tile_background,
    text_tile_font_color,
    text_tile_link_color,
    text_tile_user_name_font_color,
    text_tile_user_handle_font_color,
    shopspot_btn_background,
    shopspot_btn_font_color,
    margin,
    text_tile_font_size,
    text_tile_user_name_font_size,
    text_tile_user_handle_font_size,
    shopspot_icon,
    expanded_tile_border_radius,
    tile_tag_background,
    inline_tile_border_radius,
    shopspot_btn_font_size
  } = trimHashValuesFromObject(styles)

  const { show_timestamp, show_caption } = inlineTileSettings

  const cssVariables: { [key: string]: string } = {
    "--widget-background": `#${widget_background}`,
    "--text-tile-background": `#${text_tile_background}`,
    "--text-tile-font-color": `#${text_tile_font_color}`,
    "--text-tile-link-color": `#${text_tile_link_color}`,
    "--text-tile-user-name-font-color": `#${text_tile_user_name_font_color}`,
    "--text-tile-user-handle-font-color": `#${text_tile_user_handle_font_color}`,
    "--text-tile-tag-font-color": `#${text_tile_font_color}`,
    "--shopspot-btn-background": `#${shopspot_btn_background}`,
    "--shopspot-btn-font-color": `#${shopspot_btn_font_color}`,
    "--margin": `${margin ? margin : 0}px`,
    "--text-tile-font-size": `${text_tile_font_size}px`,
    "--text-caption-paragraph-font-size": `${text_tile_font_size || 12}px`,
    "--text-tile-user-name-font-size": `${text_tile_user_name_font_size}px`,
    "--text-tile-user-handle-font-size": `${text_tile_user_handle_font_size || 12}px`,
    "--show-caption": `${show_caption ? "block" : "none"}`,
    "--tile-timephrase-display": `${show_timestamp ? "inline-block" : "none"}`,
    "--shopspot-icon": shopspot_icon ? shopspot_icon : `#000`,
    "--tags-gap": `4px`,
    "--cta-button-background-color": `#${shopspot_btn_background}`,
    "--cta-button-font-color": `#${shopspot_btn_font_color}`,
    "--cta-button-font-size": `${shopspot_btn_font_size}px`,
    "--expanded-tile-border-radius": `${expanded_tile_border_radius}px`,
    ...getTileSizeByWidget(tileSizeSettings),
    "--tile-tag-background": `#${tile_tag_background}`,
    "--inline-tile-border-radius": `${inline_tile_border_radius}px`
  }

  return Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n")
}
