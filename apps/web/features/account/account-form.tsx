'use client';

import { useActionState } from 'react';
import { loginAccount, registerAccount, verifyAccount } from './actions';

export function AccountForm({ register, next }: { register: boolean; next?: string }) {
  const [state, action, pending] = useActionState(register ? registerAccount : loginAccount, {});

  return (
    <form className="details-form" action={action}>
      <input type="hidden" name="next" value={next ?? ''} />
      <label>
        Электронная почта
        <input type="email" name="email" autoComplete="email" maxLength={254} required />
      </label>
      <label>
        Пароль
        <input
          type="password"
          name="password"
          autoComplete={register ? 'new-password' : 'current-password'}
          minLength={8}
          maxLength={128}
          required
        />
      </label>
      <button className="primary" disabled={pending}>
        {register ? 'Зарегистрироваться' : 'Войти'}
      </button>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p role="status">{state.success}</p>}
    </form>
  );
}

export function VerificationForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(verifyAccount, {});

  return (
    <form className="details-form" action={action}>
      <input type="hidden" name="token" value={token} />
      {!state.success && <button className="primary" disabled={pending}>Подтвердить адрес</button>}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p role="status">{state.success}</p>}
    </form>
  );
}
