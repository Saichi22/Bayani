// filepath: src/navigation/types.ts

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Assessment: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  PersonalityTest: undefined;
  DemographicProfile: undefined;
  Camera: undefined;
  HeroResult: { imageUrl?: string };
};