export function mergeAssets(assets: any, incrementalAssets: any): any {
  if (incrementalAssets.packages) {
    assets.packages = [...(assets.packages || []), ...incrementalAssets.packages]
  }

  if (incrementalAssets.components) {
    assets.components = [...(assets.components || []), ...incrementalAssets.components]
  }

  mergeAssetsComponentList(assets, incrementalAssets, 'componentList')
  mergeAssetsComponentList(assets, incrementalAssets, 'bizComponentList')

  return assets
}

function mergeAssetsComponentList(assets: any, incrementalAssets: any, listName: any): void {
  if (incrementalAssets[listName]) {
    if (assets[listName]) {
      // 根据title进行合并
      incrementalAssets[listName]?.map((item: any) => {
        let matchFlag = false
        assets[listName]?.map((assetItem: any) => {
          if (assetItem.title === item.title) {
            assetItem.children = assetItem.children.concat(item.children)
            matchFlag = true
          }

          return assetItem
        })

        !matchFlag && assets[listName]?.push(item)
        return item
      })
    }
  }
}