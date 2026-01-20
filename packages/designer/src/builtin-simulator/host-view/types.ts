import { Project } from '../../project';
import { BuiltinSimulatorHost, BuiltinSimulatorProps } from '../host';

export type SimulatorHostProps = BuiltinSimulatorProps & {
  project: Project;
  onMount?: (host: BuiltinSimulatorHost) => void;
};
