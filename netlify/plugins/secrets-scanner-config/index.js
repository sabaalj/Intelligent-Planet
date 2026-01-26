/**
 * Netlify Build Plugin: Secrets Scanner Configuration
 *
 * This plugin automatically configures the secrets scanner to allow
 * the Firebase API key by setting SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES
 * to match the NEXT_PUBLIC_FIREBASE_API_KEY environment variable.
 *
 * Firebase Web API keys are designed to be public and exposed in client-side
 * code. Security is enforced through Firebase Security Rules, not by keeping
 * the API key secret.
 */
module.exports = {
  onPreBuild: ({ netlifyConfig }) => {
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (firebaseApiKey) {
      // Set the secrets scanner to omit the Firebase API key
      // This prevents false positives for intentionally public Firebase keys
      netlifyConfig.build.environment.SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES = firebaseApiKey;
      console.log('Configured secrets scanner to allow Firebase API key');
    } else {
      console.warn('NEXT_PUBLIC_FIREBASE_API_KEY not found, skipping secrets scanner configuration');
    }
  }
};
