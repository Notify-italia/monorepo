import { INotifyStat } from '@notify/interfaces';
import { endOfDay, startOfDay } from 'date-fns';
import { Types } from 'mongoose';
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
    owner: INotifyStat['owner'],
    period: INotifyStat['period'] = {
      //midnight of today
      from: startOfDay(new Date()),
      //23:59 of today
      to: endOfDay(new Date()),
    },
    valueToAdd?: INotifyStat['value']
  ) {
    const stat = await this.getStat(type, new Types.ObjectId(owner), period);

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
    owner: Types.ObjectId,
    period: INotifyStat['period']
  ) {
    const foundStat = await StatModel.findOne({
      type,
      owner,
      $and: [
        {
          'period.from': {
            $gte: period.from,
          },
        },
        {
          'period.to': {
            $lte: period.to,
          },
        },
      ],
    });

    if (!foundStat) {
      const generatedStat = new StatModel({
        type,
        period,
        owner,
        value: 0,
      });

      await generatedStat.save();

      return generatedStat;
    }

    return foundStat;
  }
}
