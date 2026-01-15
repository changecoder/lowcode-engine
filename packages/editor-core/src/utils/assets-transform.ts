import {
  IPublicTypeAssetsJson,
  IPublicTypeComponentDescription,
  IPublicTypePackage,
  IPublicTypeRemoteComponentDescription,
} from '@cc/lowcode-types';

export function assetsTransform(assets: IPublicTypeAssetsJson) {
  const { components, packages } = assets;
  const packageMaps = (packages || []).reduce(
    (acc: Record<string, IPublicTypePackage>, cur: IPublicTypePackage) => {
      const key = cur.id || cur.package || '';
      acc[key] = cur;
      return acc;
    },
    {} as any
  );
  components.forEach(
    (componentDesc: IPublicTypeComponentDescription | IPublicTypeRemoteComponentDescription) => {
      let { devMode } = componentDesc;
      const { schema, reference } = componentDesc;
      if ((devMode as string) === 'lowcode') {
        devMode = 'lowCode';
      } else if (devMode === 'proCode') {
        devMode = 'proCode';
      }
      if (devMode) {
        componentDesc.devMode = devMode;
      }
      if (devMode === 'lowCode' && !schema && reference) {
        const referenceId = reference.id || '';
        componentDesc.schema = packageMaps[referenceId].schema as any;
      }
    }
  );
  return assets;
}
