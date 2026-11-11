import { newUuid } from './sync-map.js';
export async function registerDevice(client, store, owner, platform) {
  if (!client || !owner) return;
  let id = await store.get('north:account-device-id');
  if (!id) { id = newUuid(); await store.set('north:account-device-id', id); }
  const { error } = await client.from('account_devices').upsert({ user_id: owner, device_id: id, platform, last_seen: new Date().toISOString() }, { onConflict: 'user_id,device_id' });
  if (error) throw error;
}
export async function readDevices(client, owner) {
  if (!client || !owner) return [];
  const { data, error } = await client.from('account_devices').select('device_id,platform,last_seen').eq('user_id', owner).order('last_seen', { ascending: false });
  if (error) throw error;
  return data || [];
}
