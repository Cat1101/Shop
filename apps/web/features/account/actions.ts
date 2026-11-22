'use server';

import { redirect } from 'next/navigation';
import { apiRequest, authorization, jsonRequest } from '../../shared/api';
import { readSession, removeSession, writeSession } from './session';

export interface AccountFormState {
  error?: string;
  success?: string;
}

export async function registerAccount(
  _state: AccountFormState,
  form: FormData,
): Promise<AccountFormState> {
  const response = await apiRequest('/auth/register', jsonRequest({
    email: form.get('email'),
    password: form.get('password'),
  })).catch(() => null);

  if (response?.ok) {
    return { success: 'Если адрес доступен для регистрации, вы получите письмо со ссылкой.' };
  }
  if (response?.status === 400) {
    return { error: 'Проверьте адрес почты и пароль. Пароль должен содержать от 8 до 128 символов.' };
  }
  if (response?.status === 429) {
    return { error: 'Попробуйте снова через минуту.' };
  }
  return { error: 'Отправить письмо сейчас не удалось. Попробуйте снова.' };
}

export async function loginAccount(
  _state: AccountFormState,
  form: FormData,
): Promise<AccountFormState> {
  const response = await apiRequest('/auth/login', jsonRequest({
    email: form.get('email'),
    password: form.get('password'),
  })).catch(() => null);

  if (!response?.ok) {
    if (response?.status === 403) {
      return { error: 'Сначала подтвердите электронную почту по ссылке из письма.' };
    }
    if (response?.status === 400 || response?.status === 401) {
      return { error: 'Проверьте адрес почты и пароль.' };
    }
    if (response?.status === 429) {
      return { error: 'Попробуйте войти через минуту.' };
    }
    return { error: 'Вход временно недоступен. Попробуйте снова.' };
  }

  const session: { token: string; expiresAt: string } = await response.json();
  await writeSession(session.token, session.expiresAt);
  redirect(form.get('next') === 'checkout' ? '/checkout' : '/account');
}

export async function verifyAccount(
  _state: AccountFormState,
  form: FormData,
): Promise<AccountFormState> {
  const response = await apiRequest('/auth/verify-email', jsonRequest({
    token: form.get('token'),
  })).catch(() => null);

  if (response?.ok) {
    return { success: 'Почта подтверждена. Теперь можно войти в аккаунт.' };
  }
  if (response?.status === 400 || response?.status === 409) {
    return { error: 'Ссылка устарела или уже использована. Для нового письма повторите регистрацию.' };
  }
  return { error: 'Подтвердить адрес сейчас не удалось. Попробуйте снова.' };
}

export async function logoutAccount() {
  const token = await readSession();
  if (token) {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
      headers: authorization(token),
    });
    if (!response.ok && response.status !== 401) {
      throw new Error('Could not revoke the session');
    }
  }
  await removeSession();
  redirect('/account');
}
