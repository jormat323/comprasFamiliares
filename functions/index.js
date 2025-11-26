const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mercadopago = require('mercadopago');

admin.initializeApp();
const db = admin.firestore();

// configure mercadopago via env var MP_ACCESS_TOKEN
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN || '');

exports.consolidateList = functions.https.onCall(async (data, context)=>{
  const { groupId, listId } = data;
  if(!groupId || !listId) throw new functions.https.HttpsError('invalid-argument','Missing groupId/listId');
  const itemsSnap = await db.collection(`groups/${groupId}/shoppingLists/${listId}/items`).get();
  const map = new Map();
  itemsSnap.forEach(doc=>{
    const it = doc.data();
    const key = (it.name || '').trim().toLowerCase();
    const prev = map.get(key) || { name: it.name, qty: 0, requestedBy: [] };
    prev.qty += Number(it.qty || 0);
    prev.requestedBy.push(it.requestedBy || null);
    map.set(key, prev);
  });
  const consolidated = Array.from(map.values());
  const orderRef = await db.collection(`groups/${groupId}/orders`).add({ consolidated, createdAt: admin.firestore.FieldValue.serverTimestamp(), status: 'pending' });
  return { orderId: orderRef.id, consolidated };
});

exports.createMercadoPagoPreference = functions.https.onCall(async (data, context)=>{
  // data: { orderId, items: [{title, unit_price, quantity}] }
  const { orderId, items } = data;
  if(!orderId || !items) throw new functions.https.HttpsError('invalid-argument','Missing orderId/items');
  // simple mapping to MP preference
  const mpItems = items.map(i=>({ title: i.title, unit_price: Number(i.unit_price) || 0, quantity: Number(i.quantity) || 1 }));
  const preference = { items: mpItems, back_urls: { success: '', pending: '', failure: '' } };
  const mpResp = await mercadopago.preferences.create(preference);
  // store preference id
  await db.collection('orders').doc(orderId).update({ mp_preference_id: mpResp.body.id });
  return { preferenceId: mpResp.body.id, initPoint: mpResp.body.init_point };
});
