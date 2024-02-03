import { EnumNotifyUserType, INotifyStat } from '@notify/interfaces';
import { endOfDay, startOfDay } from 'date-fns';
import { FilterQuery, Types } from 'mongoose';
import { AgentModel } from '../models/model.agent';
import { CompanyModel } from '../models/model.company';
import { StatDocument, StatModel } from '../models/model.stat';
import { BadRequestError } from './errors/errors';
import { genericUserQuery } from './users/service.query';

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
    //obtain the stat from the database
    const stat = await this.getStat({
      type,
      owner: new Types.ObjectId(owner),
      period,
    });

    if (!stat) {
      //this should never happen
      throw new BadRequestError(
        'Stat non trovata, questo non dovrebbe accadere mai :/'
      );
    }

    //increment the stat, if valueToAdd is not provided, increment by 1
    stat.value += valueToAdd || 1;

    //save the stat
    await stat.save();

    //update the user totals
    await this._updateUserTotals(owner, type, valueToAdd || 1);

    //return a new instance of the stat manager
    return new StatManager(stat);
  }

  /**
   * Obtains a stat from the database for the given type and period.
   * @param type
   * @param period
   * @returns
   */
  public static async getStat(filter: FilterQuery<StatDocument>) {
    //remove the period from the filter without modifying the original object
    const _filter = { ...filter };
    delete _filter.period;

    //find the stat in the database
    const foundStat = await StatModel.findOne({
      ..._filter,
      $and: [
        {
          'period.from': {
            $gte: filter.period.from,
          },
        },
        {
          'period.to': {
            $lte: filter.period.to,
          },
        },
      ],
    });

    if (!foundStat) {
      //if the stat is not found, create a new one
      const generatedStat = new StatModel({
        type: filter.type,
        period: filter.period,
        owner: filter.owner,
        value: 0,
      });

      //save the stat
      await generatedStat.save();

      //return the new stat
      return generatedStat;
    }

    //return the found stat
    return foundStat;
  }

  public static async report(filter: FilterQuery<StatDocument>) {
    return await StatModel.find(filter).lean();
  }

  public static async incrementCounter(
    type: INotifyStat['type'],
    owner: INotifyStat['owner'],
    userType: EnumNotifyUserType,
    value?: INotifyStat['value']
  ) {
    const user = await genericUserQuery<true>(userType, { _id: owner }, true);

    if (!user) {
      throw new BadRequestError('Utente non trovato');
    }

    if (!user.statsTotals?.[type]) {
      user.statsTotals[type] = 0;
    }

    user.statsTotals[type] += value || 1;
    user.markModified('statsTotals');

    await user.save();

    return user;
  }

  private static async _updateUserTotals(
    id: string,
    type: INotifyStat['type'],
    value: INotifyStat['value']
  ) {
    let user = await AgentModel.findOne({ _id: id });

    if (!user) {
      user = await CompanyModel.findOne({ _id: id });
    }

    if (!user) {
      throw new BadRequestError(
        "Utente non trovato per l'aggiornamento delle statistiche"
      );
    }

    if (!user.statsTotals[type]) {
      user.statsTotals[type] = 0;
    }

    user.statsTotals[type] += value;

    user.markModified('statsTotals');

    await user.save();
  }
}
