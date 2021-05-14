import { assets as OnboardingAssets } from './Onboarding';
import { assets as WelcomeAssets } from './Welcome';
export { default as Login } from './Login';
export { default as Register } from './Register';
export { default as Onboarding } from './Onboarding';
export { default as OtpConfirmation } from './OtpConfirmation';
export { default as CreateProfile } from './CreateProfile';
export { default as Welcome } from './Welcome';
export const assets = [...OnboardingAssets, ...WelcomeAssets];
