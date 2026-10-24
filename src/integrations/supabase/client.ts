// Supabase Integration Client Re-export
export {
  supabase,
  isSupabaseConfigured,
  insertOrderToSupabase,
  fetchAllOrders,
  updateRemoteOrderStatus,
  subscribeToOrdersRealtime,
  generateUniqueOrderId,
  getLocalOrders,
  saveLocalOrders,
  SUPABASE_SQL_SETUP,
} from '../../lib/supabaseClient';
