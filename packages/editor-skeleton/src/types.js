export function isDockConfig(obj) {
  return obj && /Dock$/.test(obj.type)
}

export function isPanelDockConfig(obj) {
  return obj && obj.type === 'PanelDock'
}