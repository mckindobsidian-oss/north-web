const queues = new WeakMap();
const object = value => value && typeof value === 'object' && !Array.isArray(value);

/** Apply only this device's changed leaves to the latest account preferences. */
export function mergePreferenceChanges(local = {}, remote = {}, baseline) {
  if (baseline !== undefined && JSON.stringify(local) === JSON.stringify(baseline)) return remote;
  if (!object(local)) return local;
  const result = {...(object(remote) ? remote : {})};
  for (const key of Object.keys(local)) result[key] = mergePreferenceChanges(local[key], remote?.[key], baseline?.[key]);
  return result;
}

/** Serialize local read/modify/write so simultaneous controls cannot erase each other. */
export function savePreferences(store, username, patch) {
  let owners = queues.get(store);
  if (!owners) { owners = new Map(); queues.set(store,owners); }
  const task = (owners.get(username) || Promise.resolve()).catch(()=>{}).then(async () => {
    const key = `u:${username}`;
    const profile = await store.get(key);
    if (!profile) throw Error('Account preferences are unavailable. Sign in and retry.');
    const pm = typeof patch === 'function' ? patch(profile.pm || {}) : mergePreferenceChanges(patch,profile.pm || {});
    await store.set(key,{...profile,pm});
    return pm;
  });
  owners.set(username,task);
  return task;
}
