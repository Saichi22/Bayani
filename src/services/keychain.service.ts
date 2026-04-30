import * as Keychain from 'react-native-keychain';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const SERVICE_NAME = 'bayani_auth_tokens';

export async function saveTokens(tokens: Tokens): Promise<void> {
  await Keychain.setGenericPassword(
    'tokens',
    JSON.stringify(tokens),
    { service: SERVICE_NAME },
  );
}

export async function loadTokens(): Promise<Tokens | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
    if (credentials) {
      return JSON.parse(credentials.password) as Tokens;
    }
    return null;
  } catch (error) {
    console.error('Failed to load tokens', error);
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE_NAME });
}
