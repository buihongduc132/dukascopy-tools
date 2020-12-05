import _instrumentMeta from '../../dev-utils/instruments.json';

export interface InstrumentData {
  name: string;
  description: string;
  minStartDate: string;
  decimalFactor: number;
  minStartDateDaily: string;
  group: string;
}

export type InstrumentMetaData = {
  [key: string]: InstrumentData;
};

export const instrumentMetaData: InstrumentMetaData = _instrumentMeta;
