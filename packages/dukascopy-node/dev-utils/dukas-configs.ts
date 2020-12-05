
import fs from 'fs';
import path from 'path';

let dukasConfigJson: any;

export const dukasConfigMetaData = async () => {
    if (dukasConfigJson) return dukasConfigJson;

    const data = await fs.readFileSync(
        path.join(
            __dirname,
            './dukas_instruments'
        )
    );

    const dukasConfigStr = data.toString()
        .replace(/_callbacks____[a-z0-9]+\(/, '')
        .replace(/\)$/, '');
    const _dukasConfigJson: any = JSON.parse(dukasConfigStr);
    dukasConfigJson = _dukasConfigJson;

    return dukasConfigJson;
}

export const getDukasInstruments = async () => {
    const { instruments, groups } = await dukasConfigMetaData();
    const groupMap: any = Object.entries(groups)
        .reduce((prev, [groupId, groupInfo]: any) => {
            // console.log(',,,prev', prev);
            return {
                ...prev,
                ...(groupInfo.instruments || []).reduce((_prev: any, groupInstruments: any) => {
                    // console.log('...groupInstruments', groupInstruments);
                    return {
                        ..._prev,
                        [groupInstruments]: groupId
                    }
                }, {})
            }
        }, {});

    const instrumentArr = Object.entries(instruments)
        .reduce((prev, [instrument, instrumentInfo]: any) => {
            const _key = instrument
                .replace(/\./g, '')
                .replace(/\//g, '')
                .toLowerCase();
            const {
                pipValue,
                history_start_tick,
                history_start_day
            } = instrumentInfo;


            return {
                ...prev,
                [_key]: {
                    ...instrumentInfo,
                    group: groupMap[instrument] || 'n/a',
                    decimalFactor: 1 / pipValue * 10,
                    minStartDate: new Date(+history_start_tick).toISOString().split('T')[0],
                    minStartDateDaily: new Date(+history_start_day).toISOString().split('T')[0]
                }
            }
    }, {});

    fs.writeFile(
        path.join(
            __dirname,
            './instruments.json'
        ),
        JSON.stringify(instrumentArr, undefined, 2),
        () => { }
    );
}