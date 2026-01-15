import { Asset } from '../../assets';

export interface IPublicTypeSimulatorRenderer {
  readonly isSimulatorRenderer: true;
  run(): void;
  load(asset: Asset): Promise<any>;
}
