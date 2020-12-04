import { Config } from '@bhd/dukascopy-node';

export interface CliConfig extends Required<Config> {
  dir: string;
  silent: boolean;
}
