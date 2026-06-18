import { ipcMain } from 'electron';
import { comparePasswords } from '@/shared/helpers/hash.utils';
import { UserService } from '@/modules/user/services/user.service';

export function registerAuthHandlers(): void {
  const userService = new UserService();

  ipcMain.handle(
    'auth:login',
    async (_event, credentials: { usernameOrEmail: string; password: string }) => {
      const user = await userService.findOneByUsernameOrEmail(credentials.usernameOrEmail);
      if (!user?.password || !user.isActive) {
        return null;
      }

      const valid = await comparePasswords(credentials.password, user.password);
      if (!valid) {
        return null;
      }

      const { password: _password, ...safeUser } = user;
      return safeUser;
    },
  );
}
