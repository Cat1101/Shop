'use client';

import { useActionState, useState } from 'react';
import { SubmitButton } from '../../shared/submit-button';
import { loginAccount, registerAccount, verifyAccount } from './actions';

export function AccountForm({ register, next }: { register: boolean; next?: string }) {
  const [state, action] = useActionState(register ? registerAccount : loginAccount, {});
  const [email, setEmail] = useState('');

  return (
    <form className="grid gap-4" action={action}>
      <input type="hidden" name="next" value={next ?? ''} />
      <label className="grid gap-1.5 text-sm font-extrabold">
        Электронная почта
        <input
          className="field font-medium"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={254}
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm font-extrabold">
        Пароль
        <input
          className="field font-medium"
          type="password"
          name="password"
          autoComplete={register ? 'new-password' : 'current-password'}
          minLength={8}
          maxLength={128}
          required
        />
        {register && <span className="text-sm font-medium text-muted">От 8 до 128 символов</span>}
      </label>
      <SubmitButton pendingText={register ? 'Регистрируем…' : 'Входим…'} fullWidth>
        {register ? 'Зарегистрироваться' : 'Войти'}
      </SubmitButton>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-message" role="status">{state.success}</p>}
    </form>
  );
}

export function VerificationForm({ token }: { token: string }) {
  const [state, action] = useActionState(verifyAccount, {});

  return (
    <form className="grid justify-items-start gap-4" action={action}>
      <input type="hidden" name="token" value={token} />
      {!state.success && <SubmitButton pendingText="Подтверждаем…">Подтвердить адрес</SubmitButton>}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-message" role="status">{state.success}</p>}
    </form>
  );
}
