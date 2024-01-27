import { INotifyStat } from '@notify/interfaces';
import { setHours, setMinutes } from 'date-fns';
import { StatDocument, StatModel } from '../models/model.stat';
import { BadRequestError } from './errors/errors';

export class StatManager {
  public get value() {
    return this._stat;
  }

  constructor(private _stat: StatDocument) {}

  /**
   * Adds a stat to the database for the given type and period.
   * @param type
   * @param valueToAdd
   */
  public static async increment(
    type: INotifyStat['type'],
    period: INotifyStat['period'] = {
      //midnight of today
      from: setMinutes(setHours(new Date(), 0), 0),
      //23:59 of today
      to: setMinutes(setHours(new Date(), 23), 59),
    },
    valueToAdd?: INotifyStat['value']
  ) {
    const stat = await StatModel.findOne({
      type,
      period,
    });

    if (!stat) {
      throw new BadRequestError(
        'Stat non trovata, questo non dovrebbe accadere mai :/'
      );
    }

    stat.value += valueToAdd || 1;

    await stat.save();

    return new StatManager(stat);
  }

  /**
   * Obtains a stat from the database for the given type and period.
   * @param type
   * @param period
   * @returns
   */
  public static async getStat(
    type: INotifyStat['type'],
    period: INotifyStat['period']
  ) {
    const foundStat = await StatModel.findOne({
      type,
      period: {
        from: { $gte: period.from },
        to: { $lte: period.to },
      },
    });

    if (!foundStat) {
      const generatedStat = new StatModel({
        type,
        period,
        value: 0,
      });

      await generatedStat.save();

      return generatedStat;
    }

    return foundStat;
  }
}
