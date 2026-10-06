# Association files

These make `https://sl.techcortix.com/invite/...` and `/auth/...` open the app
instead of the browser, and they are what makes those links safe to email: a
custom URL scheme can be claimed by any installed app, a verified App Link
cannot.

Two placeholders must be filled in before this works.

## `assetlinks.json` (Android)

`sha256_cert_fingerprints` must be the **Play App Signing** certificate, not the
upload key. Play Console → your app → Setup → App integrity → App signing key
certificate → SHA-256 fingerprint. Add the upload key's fingerprint as a second
entry if you also sideload debug builds.

Verify after deploying:

```bash
curl -s https://sl.techcortix.com/.well-known/assetlinks.json | jq .
adb shell pm verify-app-links --re-verify com.techcortix.cortix_sl
```

## `apple-app-site-association` (iOS)

`appIDs` is `<TeamID>.<bundle id>`. The Team ID is in the Apple Developer
account under Membership.

Note the iOS bundle id is **`com.techcortix.cortixSl`** — camel case, no
underscore. It is *not* the same string as the Android package
(`com.techcortix.cortix_sl`). Using the Android one here silently fails to
verify.

Served with no extension and no signature, which is correct for iOS 9+. It must
come back as `application/json` — `next.config.ts` sets that header, because
Next would otherwise serve this extensionless file as `application/octet-stream`
and iOS would ignore it.

Verify after deploying:

```bash
curl -sI https://sl.techcortix.com/.well-known/apple-app-site-association | grep -i content-type
```
