import { EnumNotifyUserType, INotifyUser } from '@notify/interfaces';
import { NextFunction, Request, Response } from 'express';

import { BadRequestError } from '../errors';
import { wLog } from '../services';

export const permittedRoles = <T>(roles: EnumNotifyUserType[]) => {
  return (req: Request<T>, res: Response, next: NextFunction) => {
    const user = req.currentUser as INotifyUser;

    if (!user) {
      wLog('User not found', 'error');
      throw new BadRequestError('Errore di autenticazione');
    }

    if (!_isAllowed(roles, user)) {
      wLog('User not allowed', 'error');
      throw new BadRequestError(
        'Non hai i permessi per accedere a questa risorsa'
      );
    }

    next();
  };
};

const _isAllowed = (roles: EnumNotifyUserType[], user: INotifyUser) => {
  return roles.some((role) => role === user.userType);
};
