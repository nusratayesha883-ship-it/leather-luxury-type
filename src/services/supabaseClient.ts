// Re-export all Supabase client utilities from primary src/lib/supabaseClient
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
} from '../lib/supabaseClient';
