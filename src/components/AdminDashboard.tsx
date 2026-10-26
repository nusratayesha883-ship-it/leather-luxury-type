import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Database,
  Mail,
  CheckCircle2,
  Truck,
  Package,
  Phone,
  Eye,
  Check,
  X,
  Copy,
  Filter,
  ArrowLeft,
  LogOut,
  Shield,
  LayoutGrid,
  List,
  Calendar,
  MapPin,
  User,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  fetchAllOrders,
  updateRemoteOrderStatus,
  isSupabaseConfigured,
  subscribeToOrdersRealtime,
  SUPABASE_SQL_SETUP,
  signOutAdmin,
  getAdminSession,
  onAdminAuthStateChange,
} from '../services/supabaseClient';
import {
  exportOrdersToCSV,
  isGoogleSheetsWebhookConfigured,
  GOOGLE_APPS_SCRIPT_TEMPLATE,
} from '../services/googleSheetsService';
import {
  sendOrderDeliveredEmail,
  generateOrderConfirmationEmailHTML,
  generateOrderDeliveredEmailHTML,
} from '../services/emailService';
import { AdminLogin } from './AdminLogin';
import type { OrderRecord, OrderStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { navigateTo } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<string>('admin');

  // Orders & UI State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Detail Modal State
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<OrderRecord | null>(null);

  // Status & Consignment Update Modal State
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<OrderRecord | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('Processing');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [shippingCarrier, setShippingCarrier] = useState<string>('Sundarban / Steadfast Express');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Email Preview Modal State
  const [previewEmailOrder, setPreviewEmailOrder] = useState<OrderRecord | null>(null);
  const [emailPreviewType, setEmailPreviewType] = useState<'confirmation' | 'delivered'>('confirmation');

  // Integrations Guide Modal
  const [showIntegrationsModal, setShowIntegrationsModal] = useState<boolean>(false);
  const [activeIntegrationTab, setActiveIntegrationTab] = useState<'sheets' | 'supabase'>('sheets');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Check existing session on mount (Supabase Auth first, then local fallback)
  useEffect(() => {
    let mounted = true;

    const checkExistingAuth = async () => {
      // 1. Supabase Auth Session
      try {
        const session = await getAdminSession();
        if (session?.user?.email && mounted) {
          setIsAuthenticated(true);
          setAdminUser(session.user.email);
          return;
        }
      } catch (err) {
        console.warn('[Admin] Failed checking Supabase session:', err);
      }

      // 2. Local Fallback Session (if valid under 12h)
      try {
        const local = localStorage.getItem('luxe_admin_auth_session');
        const session = sessionStorage.getItem('luxe_admin_auth_session');
        const raw = local || session;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.authenticated && Date.now() - parsed.timestamp < 12 * 60 * 60 * 1000) {
            if (mounted) {
              setIsAuthenticated(true);
              setAdminUser(parsed.user || 'admin');
            }
          }
        }
      } catch {
        // ignore storage errors
      }
    };

    checkExistingAuth();

    // Listen to Supabase Auth state changes (sign in / sign out)
    const authSub = onAdminAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session?.user?.email) {
        setIsAuthenticated(true);
        setAdminUser(session.user.email);
      } else if (event === 'SIGNED_OUT') {
        const local = localStorage.getItem('luxe_admin_auth_session');
        const sess = sessionStorage.getItem('luxe_admin_auth_session');
        if (!local && !sess) {
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      mounted = false;
      authSub.unsubscribe();
    };
  }, []);

  // Load orders from Supabase & Local Database
  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.warn('[Admin] Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();

      // Subscribe to real-time order updates from Supabase
      const unsubscribe = subscribeToOrdersRealtime(() => {
        loadOrders();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isAuthenticated]);

  // Log out helper
  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.warn('[Admin] Supabase signOut error:', err);
    }
    localStorage.removeItem('luxe_admin_auth_session');
    sessionStorage.removeItem('luxe_admin_auth_session');
    setIsAuthenticated(false);
    setNotification({ type: 'info', message: 'You have been securely signed out of Supabase Auth.' });
  };

  // Copy helper with feedback
  const handleCopy = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    if (label) {
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    let result = orders.filter((o) => {
      // Status filter (maps 'In Progress' / 'Processing' and 'Completed' / 'Delivered')
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'Processing' || statusFilter === 'In Progress') {
          matchesStatus = o.status === 'Processing';
        } else if (statusFilter === 'Delivered' || statusFilter === 'Completed') {
          matchesStatus = o.status === 'Delivered';
        } else {
          matchesStatus = o.status === statusFilter;
        }
      }

      // Destination filter
      const matchesDest =
        destinationFilter === 'all' || o.delivery_destination === destinationFilter;

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        o.order_id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        (o.trx_id && o.trx_id.toLowerCase().includes(q)) ||
        o.leather_name.toLowerCase().includes(q) ||
        (o.delivery_address && o.delivery_address.toLowerCase().includes(q)) ||
        (o.city && o.city.toLowerCase().includes(q));

      return matchesStatus && matchesDest && matchesSearch;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'amount_high') {
        return (b.grand_total_bdt || 0) - (a.grand_total_bdt || 0);
      }
      if (sortBy === 'amount_low') {
        return (a.grand_total_bdt || 0) - (b.grand_total_bdt || 0);
      }
      return 0;
    });

    return result;
  }, [orders, statusFilter, destinationFilter, searchQuery, sortBy]);

  // Comprehensive Statistics calculation
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const processing = orders.filter((o) => o.status === 'Processing').length;
    const shipped = orders.filter((o) => o.status === 'Shipped').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    const cancelled = orders.filter((o) => o.status === 'Cancelled').length;

    const totalBDT = orders.reduce((acc, o) => acc + (o.grand_total_bdt || 0), 0);
    const totalUSD = orders.reduce((acc, o) => acc + (o.grand_total_usd || 0), 0);

    return { total, pending, processing, shipped, delivered, cancelled, totalBDT, totalUSD };
  }, [orders]);

  // Quick Status change directly from row/card
  const handleQuickStatusChange = async (order: OrderRecord, newStatus: OrderStatus) => {
    if (order.status === newStatus) return;

    // If changing to Shipped or Delivered, suggest opening the courier modal
    if (newStatus === 'Shipped' || newStatus === 'Delivered') {
      handleOpenStatusModal(order, newStatus);
      return;
    }

    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.order_id === order.order_id ? { ...o, status: newStatus } : o))
      );

      const res = await updateRemoteOrderStatus(order.order_id, newStatus);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Order ${order.order_id} status updated to ${newStatus} in Supabase!`,
        });
      } else {
        throw new Error(res.error || 'Failed to update');
      }
      setTimeout(() => setNotification(null), 4000);
      loadOrders();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Failed to update ${order.order_id}: ${err.message}`,
      });
      loadOrders();
    }
  };

  // Open dedicated Status & Consignment Modal
  const handleOpenStatusModal = (order: OrderRecord, newStatus: OrderStatus) => {
    setSelectedOrderForStatus(order);
    setTargetStatus(newStatus);
    setTrackingNumber(order.tracking_number || `EXP-${new Date().getFullYear()}-${order.order_id.replace('#', '')}`);
    setShippingCarrier(
      order.shipping_carrier ||
      (order.delivery_destination === 'domestic' ? 'Sundarban Courier / SteadFast' : 'DHL Express Worldwide')
    );
  };

  // Confirm Status update & trigger email
  const handleConfirmStatusUpdate = async () => {
    if (!selectedOrderForStatus) return;
    setIsUpdatingStatus(true);

    try {
      // 1. Update in Supabase & Local Database
      await updateRemoteOrderStatus(
        selectedOrderForStatus.order_id,
        targetStatus,
        targetStatus === 'Shipped' || targetStatus === 'Delivered' ? trackingNumber : undefined,
        targetStatus === 'Shipped' || targetStatus === 'Delivered' ? shippingCarrier : undefined
      );

      // 2. Automated Email Notification on Delivered / Shipped
      let emailDispatchedNote = '';
      if (targetStatus === 'Delivered' || targetStatus === 'Shipped') {
        const updatedRecord: OrderRecord = {
          ...selectedOrderForStatus,
          status: targetStatus,
          tracking_number: trackingNumber,
          shipping_carrier: shippingCarrier,
        };
        const emailResult = await sendOrderDeliveredEmail(updatedRecord);
        if (emailResult.success) {
          emailDispatchedNote = ` Automated dispatch email sent to ${selectedOrderForStatus.email}!`;
        }
      }

      setNotification({
        type: 'success',
        message: `Order ${selectedOrderForStatus.order_id} updated to ${targetStatus}.${emailDispatchedNote}`,
      });

      setTimeout(() => setNotification(null), 5000);
      setSelectedOrderForStatus(null);
      await loadOrders();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Failed to update status: ${err?.message || 'Unknown error'}`,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          label: 'Pending',
        };
      case 'Processing':
        return {
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
          label: 'In Progress',
        };
      case 'Shipped':
        return {
          bg: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
          dot: 'bg-purple-400',
          label: 'Shipped',
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
          label: 'Completed',
        };
      case 'Cancelled':
        return {
          bg: 'bg-red-500/15 text-red-300 border-red-500/40',
          dot: 'bg-red-400',
          label: 'Cancelled',
        };
      default:
        return {
          bg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
          dot: 'bg-neutral-400',
          label: status,
        };
    }
  };

  // If user is not authenticated, render the secure Login Guard
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onAuthenticated={(user) => {
          setIsAuthenticated(true);
          setAdminUser(user);
          setNotification({ type: 'success', message: `Welcome back, ${user}. Supabase Auth session active.` });
          setTimeout(() => setNotification(null), 4000);
        }}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#140D09] text-[#FDFBF7] py-6 sm:py-10 selection:bg-[#D4AF37] selection:text-[#170F0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/25">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/')}
              className="p-2.5 rounded-xl bg-[#241710] hover:bg-[#322016] text-[#D4AF37] border border-[#D4AF37]/35 transition-all cursor-pointer shadow-md shrink-0"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-[#FDFBF7]">
                  Luxe<span className="text-[#D4AF37]">Hide</span> Atelier — Master Order Management
                </h1>
              </div>
              <p className="text-xs text-[#A69282] mt-0.5">
                Live Supabase Orders Pipeline • Customer Verification & Tannery Production Control
              </p>
            </div>
          </div>

          {/* User Profile, System Badges & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Supabase Status Indicator */}
            <div
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                isSupabaseConfigured()
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
              }`}
              title={isSupabaseConfigured() ? 'Connected to live Supabase cloud database' : 'Using local resilience storage'}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured() ? 'Supabase: Live Cloud' : 'Supabase: Local Mode'}</span>
            </div>

            {/* Google Sheets Status Indicator */}
            <div
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                isGoogleSheetsWebhookConfigured()
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  : 'bg-neutral-900 border-[#D4AF37]/25 text-[#A69282]'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isGoogleSheetsWebhookConfigured() ? 'Sheets: Webhook Active' : 'Sheets: Ready'}</span>
            </div>

            {/* Setup / Instructions Modal Button */}
            <button
              onClick={() => setShowIntegrationsModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#2D1C13] hover:bg-[#3D2619] text-[#E5C365] text-xs font-bold border border-[#D4AF37]/40 shadow-sm cursor-pointer transition-all"
            >
              ⚙️ Cloud Setup Guide
            </button>

            {/* Admin Session Badge & Log Out */}
            <div className="flex items-center gap-1 pl-2 border-l border-[#D4AF37]/20">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241710] border border-[#D4AF37]/30 text-xs text-[#FDFBF7]">
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-semibold text-xs max-w-[220px] truncate" title={adminUser}>{adminUser}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full bg-red-950/50 hover:bg-red-900/70 text-red-300 text-xs font-bold border border-red-500/35 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Log out from Admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Action Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between shadow-xl ${
                notification.type === 'success'
                  ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-200'
                  : notification.type === 'info'
                  ? 'bg-blue-950/85 border-blue-500/50 text-blue-200'
                  : 'bg-red-950/85 border-red-500/50 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-[#D4C5B9] hover:text-[#FDFBF7] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-Time Metrics & Statistics (6 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Total Orders */}
          <div className="p-4 rounded-2xl bg-[#1E130D] border border-[#D4AF37]/25 space-y-1 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A69282] block">
              Total Orders
            </span>
            <div className="font-heading text-2xl font-bold text-[#FDFBF7]">{stats.total}</div>
            <span className="text-[10px] text-[#A69282] block">All Commissions</span>
          </div>

          {/* Pending */}
          <div className="p-4 rounded-2xl bg-[#1E130D] border border-amber-500/35 space-y-1 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
              Pending
            </span>
            <div className="font-heading text-2xl font-bold text-amber-300">{stats.pending}</div>
            <span className="text-[10px] text-amber-400/80 block">Awaiting Verification</span>
          </div>

          {/* In Progress */}
          <div className="p-4 rounded-2xl bg-[#1E130D] border border-blue-500/35 space-y-1 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              In Progress
            </span>
            <div className="font-heading text-2xl font-bold text-blue-300">{stats.processing}</div>
            <span className="text-[10px] text-blue-400/80 block">Tannery Splitting/Dye</span>
          </div>

          {/* Shipped */}
          <div className="p-4 rounded-2xl bg-[#1E130D] border border-purple-500/35 space-y-1 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
              Shipped
            </span>
            <div className="font-heading text-2xl font-bold text-purple-300">{stats.shipped}</div>
            <span className="text-[10px] text-purple-400/80 block">Courier In-Transit</span>
          </div>

          {/* Completed */}
          <div className="p-4 rounded-2xl bg-[#1E130D] border border-emerald-500/35 space-y-1 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Completed
            </span>
            <div className="font-heading text-2xl font-bold text-emerald-300">{stats.delivered}</div>
            <span className="text-[10px] text-emerald-400/80 block">Delivered Goods</span>
          </div>

          {/* Total Revenue */}
          <div className="p-4 rounded-2xl bg-[#241710] border border-[#D4AF37]/50 space-y-1 shadow-md col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
              Total Revenue
            </span>
            <div className="font-heading text-xl font-bold text-[#E5C365]">
              ৳{stats.totalBDT.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#A69282] block font-mono">
              ${stats.totalUSD.toFixed(2)} USD
            </span>
          </div>

        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#1C120D] border border-[#D4AF37]/30 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-[#D4AF37]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Customer, Email, Phone, Order ID (#LHA-1001), or TrxID..."
                className="w-full bg-[#140D08] text-xs sm:text-sm text-[#FDFBF7] pl-10 pr-9 py-2.5 rounded-2xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A69282] hover:text-[#FDFBF7] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle, Sort & Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              
              {/* Destination Filter Dropdown */}
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#241710] border border-[#D4AF37]/30 text-xs font-semibold text-[#FDFBF7] focus:outline-none cursor-pointer"
              >
                <option value="all">All Destinations</option>
                <option value="domestic">Inside Country (BD)</option>
                <option value="international">Outside Country (Global)</option>
              </select>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#241710] border border-[#D4AF37]/30 text-xs font-semibold text-[#FDFBF7] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Highest Value</option>
                <option value="amount_low">Lowest Value</option>
              </select>

              {/* Table / Cards Switcher */}
              <div className="flex items-center rounded-xl bg-[#140D08] border border-[#D4AF37]/30 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'table' ? 'bg-[#D4AF37] text-[#170F0B]' : 'text-[#A69282] hover:text-[#FDFBF7]'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'cards' ? 'bg-[#D4AF37] text-[#170F0B]' : 'text-[#A69282] hover:text-[#FDFBF7]'
                  }`}
                  title="Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Export to CSV Button */}
              <button
                onClick={() => exportOrdersToCSV(orders)}
                className="px-3.5 py-2 rounded-xl bg-[#2A1B12] hover:bg-[#382318] text-[#E5C365] hover:text-[#FDFBF7] text-xs font-bold border border-[#D4AF37]/35 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Download CSV for Excel & Google Sheets"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={loadOrders}
                disabled={loading}
                className="p-2 rounded-xl bg-[#2A1B12] hover:bg-[#382318] text-[#D4AF37] hover:text-[#FDFBF7] border border-[#D4AF37]/35 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                title="Refresh Orders from Supabase"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

          </div>

          {/* Filter Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D4AF37]/15">
            <span className="text-xs text-[#A69282] mr-1 flex items-center gap-1 font-semibold">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              Filter Status:
            </span>
            {[
              { id: 'all', label: `All (${stats.total})` },
              { id: 'Pending', label: `Pending (${stats.pending})` },
              { id: 'Processing', label: `In Progress (${stats.processing})` },
              { id: 'Shipped', label: `Shipped (${stats.shipped})` },
              { id: 'Delivered', label: `Completed (${stats.delivered})` },
              { id: 'Cancelled', label: `Cancelled (${stats.cancelled})` },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#170F0B] shadow-md'
                      : 'bg-[#18100C] text-[#D4C5B9] hover:bg-[#281810] hover:text-[#FDFBF7] border border-[#D4AF37]/20'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Orders Display (Table View OR Cards View) */}
        {viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="rounded-3xl bg-[#1C120D] border border-[#D4AF37]/30 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#241710] border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4 sm:px-6">Order ID & Date</th>
                    <th className="py-4 px-4">Customer Info</th>
                    <th className="py-4 px-4">Leather Hide & Specs</th>
                    <th className="py-4 px-4">Delivery Zone</th>
                    <th className="py-4 px-4">Payment & TrxID</th>
                    <th className="py-4 px-4">Grand Total</th>
                    <th className="py-4 px-4">Status & Update</th>
                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-[#D4AF37]/15">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center text-[#A69282]">
                        <div className="max-w-sm mx-auto space-y-2">
                          <Package className="w-8 h-8 text-[#D4AF37]/50 mx-auto" />
                          <p className="font-semibold text-sm text-[#FDFBF7]">No orders found matching the filter.</p>
                          <p className="text-xs">Adjust your search term or filter status, or place a test order on the Custom Order page.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const badge = getStatusBadge(ord.status);
                      return (
                        <tr
                          key={ord.order_id}
                          className="hover:bg-[#261811] transition-colors group"
                        >
                          {/* 1. Order ID & Date */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-sm text-[#E5C365]">
                                {ord.order_id}
                              </span>
                              <button
                                onClick={() => handleCopy(ord.order_id, ord.order_id)}
                                className="text-[#A69282] hover:text-[#D4AF37] transition-colors p-0.5 cursor-pointer"
                                title="Copy Order ID"
                              >
                                {copiedText === ord.order_id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <div className="text-[10px] text-[#A69282] mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#D4AF37]/60" />
                              <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                              <span className="text-[#7A6658]">({new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                            </div>
                          </td>

                          {/* 2. Customer Info */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#FDFBF7]">{ord.customer_name}</div>
                            <div className="text-[11px] text-[#D4C5B9] flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3 h-3 text-[#D4AF37]" />
                              <span>{ord.phone}</span>
                            </div>
                            {ord.email && (
                              <div className="text-[10px] text-[#A69282] truncate max-w-[150px] mt-0.5">
                                {ord.email}
                              </div>
                            )}
                          </td>

                          {/* 3. Leather Hide & Specs */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#FDFBF7]">{ord.leather_name}</div>
                            <div className="text-[11px] text-[#E5C365] font-semibold mt-0.5">
                              {ord.sqft} sq.ft • {ord.customization_specs.colorName}
                            </div>
                            {ord.customization_specs.logoDebossingText && (
                              <div className="text-[10px] text-[#A69282] italic truncate max-w-[150px]">
                                Logo: "{ord.customization_specs.logoDebossingText}"
                              </div>
                            )}
                          </td>

                          {/* 4. Delivery Zone */}
                          <td className="py-4 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.delivery_destination === 'domestic'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                : 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                            }`}>
                              {ord.delivery_destination === 'domestic' ? 'Inside BD (৳10/sqft)' : 'Outside BD ($1.50/sqft)'}
                            </span>
                            <div className="text-[10px] text-[#A69282] truncate max-w-[150px] mt-1" title={ord.delivery_address}>
                              {ord.delivery_address || 'Address on record'}
                            </div>
                          </td>

                          {/* 5. Payment & TrxID */}
                          <td className="py-4 px-4">
                            <div className="font-bold uppercase text-[#FDFBF7] flex items-center gap-1.5">
                              <span>{ord.payment_method}</span>
                              {(ord.payment_method === 'bkash' || ord.payment_method === 'nagad') && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#E5C365] font-mono">
                                  01353091099
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-[#E5C365] mt-0.5 flex items-center gap-1">
                              <span>Trx: {ord.trx_id || 'Pending'}</span>
                              {ord.trx_id && (
                                <button
                                  onClick={() => handleCopy(ord.trx_id, ord.trx_id)}
                                  className="text-[#A69282] hover:text-[#D4AF37] cursor-pointer"
                                  title="Copy TrxID"
                                >
                                  {copiedText === ord.trx_id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* 6. Grand Total */}
                          <td className="py-4 px-4">
                            <div className="font-heading font-extrabold text-sm text-[#E5C365]">
                              ৳{ord.grand_total_bdt.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-[#A69282] font-mono">
                              ${ord.grand_total_usd.toFixed(2)} USD
                            </div>
                          </td>

                          {/* 7. Status & Quick Dropdown */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                <span>{badge.label}</span>
                              </span>
                            </div>

                            {/* Quick Status Dropdown */}
                            <div className="mt-1.5 relative">
                              <select
                                value={ord.status}
                                onChange={(e) => handleQuickStatusChange(ord, e.target.value as OrderStatus)}
                                className="w-full text-[10px] font-semibold bg-[#140D08] text-[#D4C5B9] border border-[#D4AF37]/25 rounded-lg px-2 py-1 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">In Progress</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>

                          {/* 8. Action Buttons */}
                          <td className="py-4 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* WhatsApp Customer Direct */}
                              <a
                                href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '') || '8801905206450'}?text=${encodeURIComponent(
                                  `Hello ${ord.customer_name}, this is LuxeHide Atelier regarding your bespoke leather order ${ord.order_id} (${ord.leather_name}, ${ord.sqft} sq.ft). Current status: ${ord.status}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition-all shadow-sm cursor-pointer"
                                title="Message Customer on WhatsApp"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {/* View Full Order Details */}
                              <button
                                onClick={() => setSelectedOrderForDetails(ord)}
                                className="p-1.5 rounded-xl bg-[#2A1B12] hover:bg-[#382318] border border-[#D4AF37]/35 text-[#D4AF37] hover:text-[#FDFBF7] transition-all shadow-sm cursor-pointer"
                                title="View Complete Order Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Update Status & Consignment Modal */}
                              <button
                                onClick={() => handleOpenStatusModal(ord, ord.status)}
                                className="px-2.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C365] text-[#170F0B] font-bold text-[11px] transition-all cursor-pointer shadow-sm whitespace-nowrap"
                                title="Edit status, courier tracking & notify"
                              >
                                Manage
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-16 text-center text-[#A69282] rounded-3xl bg-[#1C120D] border border-[#D4AF37]/25">
                <Package className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-2" />
                <p className="font-semibold text-sm text-[#FDFBF7]">No orders found matching the filter.</p>
                <p className="text-xs mt-1">Try resetting the search or status filter.</p>
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                return (
                  <motion.div
                    key={ord.order_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-3xl bg-gradient-to-b from-[#221610] to-[#18100C] border border-[#D4AF37]/30 shadow-xl space-y-4 relative flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all"
                  >
                    {/* Top Row: ID, Date & Status */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#D4AF37]/15 pb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-base text-[#E5C365]">
                            {ord.order_id}
                          </span>
                          <button
                            onClick={() => handleCopy(ord.order_id, ord.order_id)}
                            className="text-[#A69282] hover:text-[#D4AF37] cursor-pointer"
                          >
                            {copiedText === ord.order_id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-[10px] text-[#A69282] mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#D4AF37]/60" />
                          <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Customer Summary */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#FDFBF7] text-sm">{ord.customer_name}</span>
                        <a
                          href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '') || '8801905206450'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                      <p className="text-[#A69282] text-[11px]">{ord.phone} • {ord.email || 'No email'}</p>
                      <p className="text-[#8D7768] text-[10px] truncate max-w-full">
                        <MapPin className="w-2.5 h-2.5 inline mr-1 text-[#D4AF37]" />
                        {ord.delivery_address}
                      </p>
                    </div>

                    {/* Leather Specs */}
                    <div className="p-3 rounded-2xl bg-[#140D08] border border-[#D4AF37]/20 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#FDFBF7]">{ord.leather_name}</span>
                        <span className="text-[#E5C365] font-bold">{ord.sqft} sq.ft</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#A69282]">
                        <span>Color: {ord.customization_specs.colorName}</span>
                        <span>Foil: {ord.customization_specs.foilOption || 'Blind'}</span>
                      </div>
                      {ord.customization_specs.logoDebossingText && (
                        <div className="text-[10px] text-[#A69282] italic pt-0.5 border-t border-[#D4AF37]/10">
                          Logo: "{ord.customization_specs.logoDebossingText}"
                        </div>
                      )}
                    </div>

                    {/* Pricing & Trx */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#A69282] block">Grand Total:</span>
                        <div className="font-heading font-extrabold text-lg text-[#E5C365]">
                          ৳{ord.grand_total_bdt.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#A69282] font-mono">
                          ${ord.grand_total_usd.toFixed(2)} USD
                        </div>
                      </div>

                      <div className="text-right text-[11px]">
                        <span className="font-bold uppercase text-[#FDFBF7] block">{ord.payment_method}</span>
                        <span className="text-[10px] font-mono text-[#A69282]">Trx: {ord.trx_id ? ord.trx_id.substring(0, 10) : 'Pending'}</span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-2 border-t border-[#D4AF37]/15 flex items-center justify-between gap-2">
                      {/* Status select */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleQuickStatusChange(ord, e.target.value as OrderStatus)}
                        className="text-xs font-semibold bg-[#140D08] text-[#D4C5B9] border border-[#D4AF37]/30 rounded-xl px-2.5 py-2 focus:outline-none cursor-pointer flex-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">In Progress</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrderForDetails(ord)}
                        className="px-3 py-2 rounded-xl bg-[#2A1B12] hover:bg-[#382318] border border-[#D4AF37]/35 text-[#D4AF37] hover:text-[#FDFBF7] text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </div>

                  </motion.div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* MODAL 1: COMPREHENSIVE ORDER DOSSIER / FULL DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrderForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForDetails(null)}
              className="fixed inset-0 bg-[#0A0604]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-3xl bg-[#221610] rounded-3xl p-5 sm:p-8 border-2 border-[#D4AF37]/50 shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#D4AF37]/25 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#E5C365]">
                      {selectedOrderForDetails.order_id}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedOrderForDetails.order_id, 'modal_id')}
                      className="text-[#A69282] hover:text-[#D4AF37] cursor-pointer p-1"
                      title="Copy Order ID"
                    >
                      {copiedText === 'modal_id' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#A69282] mt-0.5">
                    Commission registered on {new Date(selectedOrderForDetails.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(() => {
                    const badge = getStatusBadge(selectedOrderForDetails.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                    );
                  })()}
                  <button
                    onClick={() => setSelectedOrderForDetails(null)}
                    className="p-1.5 rounded-full text-[#D4C5B9] hover:text-[#FDFBF7] hover:bg-[#322016] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 3 Main Grids: Customer Info, Specifications, Financials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs">
                
                {/* 1. Customer Information Dossier */}
                <div className="p-4 rounded-2xl bg-[#1A110C] border border-[#D4AF37]/25 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#D4AF37] uppercase tracking-wider text-[11px] border-b border-[#D4AF37]/15 pb-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Customer Information</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Full Name:</span>
                      <span className="font-bold text-[#FDFBF7]">{selectedOrderForDetails.customer_name}</span>
                    </div>
                    {selectedOrderForDetails.company_name && (
                      <div className="flex justify-between">
                        <span className="text-[#A69282]">Company:</span>
                        <span className="font-semibold text-[#FDFBF7]">{selectedOrderForDetails.company_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-[#A69282]">Phone / WhatsApp:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#FDFBF7]">{selectedOrderForDetails.phone}</span>
                        <a
                          href={`https://wa.me/${selectedOrderForDetails.phone.replace(/[^0-9]/g, '') || '8801905206450'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300"
                          title="Open WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Email Address:</span>
                      <span className="font-semibold text-[#FDFBF7]">{selectedOrderForDetails.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Delivery Zone:</span>
                      <span className="font-bold text-[#E5C365]">
                        {selectedOrderForDetails.delivery_destination === 'domestic' ? 'Inside Country (Bangladesh)' : 'Outside Country (International)'}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-[#D4AF37]/10">
                      <span className="text-[#A69282] block mb-0.5">Shipping Address:</span>
                      <p className="text-[#FDFBF7] leading-relaxed bg-[#140D08] p-2 rounded-xl border border-[#D4AF37]/15">
                        {selectedOrderForDetails.delivery_address || 'No specific address provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Bespoke Leather Specifications */}
                <div className="p-4 rounded-2xl bg-[#1A110C] border border-[#D4AF37]/25 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#D4AF37] uppercase tracking-wider text-[11px] border-b border-[#D4AF37]/15 pb-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Product Specifications</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Leather Hide:</span>
                      <span className="font-bold text-[#FDFBF7]">{selectedOrderForDetails.leather_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Order Footage:</span>
                      <span className="font-bold text-[#E5C365]">{selectedOrderForDetails.sqft} sq.ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Color Shade:</span>
                      <span className="font-semibold text-[#FDFBF7]">
                        {selectedOrderForDetails.customization_specs.colorName}
                        {selectedOrderForDetails.customization_specs.customPantone && ` (${selectedOrderForDetails.customization_specs.customPantone})`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Debossing / Logo:</span>
                      <span className="font-semibold text-[#FDFBF7]">
                        {selectedOrderForDetails.customization_specs.logoDebossingText || 'None (Plain Hide)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Foil Stamping:</span>
                      <span className="font-semibold text-[#FDFBF7]">
                        {selectedOrderForDetails.customization_specs.foilOption === 'gold' ? '24k Gold Hot-Stamp' : selectedOrderForDetails.customization_specs.foilOption === 'silver' ? 'Silver Foil' : selectedOrderForDetails.customization_specs.foilOption === 'blind' ? 'Blind Impression' : 'Raw / None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A69282]">Thickness & Temper:</span>
                      <span className="font-semibold text-[#FDFBF7]">
                        {selectedOrderForDetails.customization_specs.thicknessOption || 'Standard 1.4 - 1.6 mm'}
                      </span>
                    </div>
                    {selectedOrderForDetails.customization_specs.specialNotes && (
                      <div className="pt-1.5 border-t border-[#D4AF37]/10">
                        <span className="text-[#A69282] block mb-0.5">Special Tannery Instructions:</span>
                        <p className="text-[#E5C365] italic bg-[#140D08] p-2 rounded-xl border border-[#D4AF37]/15">
                          "{selectedOrderForDetails.customization_specs.specialNotes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* 3. Cost Breakdown & Payment Details */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170E09] border border-[#D4AF37]/30 space-y-3">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                  <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-[11px]">
                    Transparent Financial Calculation & Payment Record
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-xs px-2 py-0.5 rounded bg-[#382318] text-[#E5C365] border border-[#D4AF37]/30">
                      Payment: {selectedOrderForDetails.payment_method}
                    </span>
                    {selectedOrderForDetails.trx_id && (
                      <span className="font-mono text-xs text-[#A69282]">
                        Trx: {selectedOrderForDetails.trx_id}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-[#140D08] border border-[#D4AF37]/15">
                    <span className="text-[#A69282] block text-[10px] uppercase font-bold">Base Hide Cost:</span>
                    <div className="font-bold text-sm text-[#FDFBF7] mt-0.5">
                      {selectedOrderForDetails.delivery_destination === 'domestic'
                        ? `৳${(selectedOrderForDetails.itemized_costs?.baseLeatherBDT || (selectedOrderForDetails.sqft * 540)).toLocaleString()}`
                        : `$${(selectedOrderForDetails.itemized_costs?.baseLeatherUSD || (selectedOrderForDetails.sqft * 4.5)).toFixed(2)}`}
                    </div>
                    <span className="text-[10px] text-[#A69282] block font-mono">
                      {selectedOrderForDetails.sqft} sq.ft × unit rate
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#140D08] border border-[#D4AF37]/15">
                    <span className="text-[#A69282] block text-[10px] uppercase font-bold">Delivery Cargo Fee:</span>
                    <div className="font-bold text-sm text-[#E5C365] mt-0.5">
                      {selectedOrderForDetails.delivery_destination === 'domestic'
                        ? `+৳${(selectedOrderForDetails.itemized_costs?.deliveryFeeBDT || (100 + selectedOrderForDetails.sqft * 10)).toLocaleString()}`
                        : `+$${(selectedOrderForDetails.itemized_costs?.deliveryFeeUSD || (20 + selectedOrderForDetails.sqft * 1.5)).toFixed(2)}`}
                    </div>
                    <span className="text-[10px] text-[#A69282] block font-mono">
                      {selectedOrderForDetails.delivery_destination === 'domestic' ? '৳10/sqft weight rate' : '$1.50/sqft air freight'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#281810] border border-[#D4AF37]/40 shadow-inner">
                    <span className="text-[#D4AF37] block text-[10px] uppercase font-extrabold">Grand Total:</span>
                    <div className="font-heading font-extrabold text-lg text-[#FDFBF7] mt-0.5">
                      ৳{selectedOrderForDetails.grand_total_bdt.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#A69282] block font-mono">
                      ${selectedOrderForDetails.grand_total_usd.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Consignment tracking details if already shipped */}
                {selectedOrderForDetails.tracking_number && (
                  <div className="mt-2 p-3 rounded-xl bg-[#1F140E] border border-purple-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-purple-400" />
                      <span>
                        Courier: <strong>{selectedOrderForDetails.shipping_carrier || 'Express Cargo'}</strong> • Tracking: <code className="font-mono text-[#E5C365]">{selectedOrderForDetails.tracking_number}</code>
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(selectedOrderForDetails.tracking_number || '', 'modal_track')}
                      className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      {copiedText === 'modal_track' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {/* Status Update Quick Bar inside Modal */}
              <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[#A69282] font-semibold">Change Status:</span>
                  {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={async () => {
                        await handleQuickStatusChange(selectedOrderForDetails, st);
                        setSelectedOrderForDetails((prev) => prev ? { ...prev, status: st } : null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedOrderForDetails.status === st
                          ? 'bg-[#D4AF37] text-[#170F0B] ring-2 ring-[#D4AF37]/50 shadow-md'
                          : 'bg-[#18100C] text-[#D4C5B9] hover:bg-[#2A1B12] hover:text-[#FDFBF7] border border-[#D4AF37]/20'
                      }`}
                    >
                      {st === 'Processing' ? 'In Progress' : st === 'Delivered' ? 'Completed' : st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPreviewEmailOrder(selectedOrderForDetails);
                      setEmailPreviewType('confirmation');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#2A1B12] hover:bg-[#382318] text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/35 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenStatusModal(selectedOrderForDetails, selectedOrderForDetails.status);
                    }}
                    className="px-4 py-2 rounded-xl btn-gold text-xs font-bold text-[#170F0B] flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Add Courier & Tracking</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: STATUS UPDATE & AUTOMATED EMAIL NOTIFICATION */}
      <AnimatePresence>
        {selectedOrderForStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForStatus(null)}
              className="fixed inset-0 bg-[#0A0604]/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg bg-[#221610] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl z-10 space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#D4AF37]/20">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#FDFBF7]">
                    Update Status for {selectedOrderForStatus.order_id}
                  </h3>
                  <p className="text-xs text-[#A69282] mt-0.5">
                    Customer: {selectedOrderForStatus.customer_name} ({selectedOrderForStatus.email})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderForStatus(null)}
                  className="text-[#D4C5B9] hover:text-[#FDFBF7] p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Select New Order Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTargetStatus(st)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        targetStatus === st
                          ? 'bg-[#382318] border-[#D4AF37] ring-1 ring-[#D4AF37] text-[#FDFBF7]'
                          : 'bg-[#18100C] border-[#D4AF37]/20 text-[#D4C5B9] hover:border-[#D4AF37]/40'
                      }`}
                    >
                      <span>{st === 'Processing' ? 'In Progress' : st === 'Delivered' ? 'Completed' : st}</span>
                      {targetStatus === st && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shipped & Delivered Tracking Inputs */}
              {(targetStatus === 'Shipped' || targetStatus === 'Delivered') && (
                <div className="p-4 rounded-2xl bg-[#1A110C] border border-[#D4AF37]/25 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#E5C365]">
                    <Truck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Consignment & Courier Tracking Details:</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#A69282] mb-1 font-semibold">
                      Tracking / Docket Number:
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. SDB-910293 or DHL-90219"
                      className="w-full bg-[#140D08] text-xs text-[#FDFBF7] px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#A69282] mb-1 font-semibold">
                      Courier / Freight Partner:
                    </label>
                    <input
                      type="text"
                      value={shippingCarrier}
                      onChange={(e) => setShippingCarrier(e.target.value)}
                      placeholder="e.g. Sundarban Courier, SteadFast, DHL Express, FedEx"
                      className="w-full bg-[#140D08] text-xs text-[#FDFBF7] px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Will automatically dispatch confirmation email to {selectedOrderForStatus.email}!</span>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForStatus(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#D4C5B9] hover:text-[#FDFBF7] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold text-[#170F0B] shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdatingStatus ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving & Syncing...</span>
                    </>
                  ) : (
                    <span>Save Changes to Supabase</span>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: LUXURY EMAIL RECEIPT PREVIEW MODAL */}
      <AnimatePresence>
        {previewEmailOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewEmailOrder(null)}
              className="fixed inset-0 bg-[#0A0604]/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-[#1C120D] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 shrink-0">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#FDFBF7]">
                      Email Receipt Preview: {previewEmailOrder.order_id}
                    </h3>
                    <p className="text-xs text-[#A69282]">
                      Recipient: {previewEmailOrder.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEmailPreviewType('confirmation')}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                      emailPreviewType === 'confirmation' ? 'bg-[#D4AF37] text-[#170F0B]' : 'bg-[#2A1B12] text-[#D4C5B9]'
                    }`}
                  >
                    Confirmation
                  </button>
                  <button
                    onClick={() => setEmailPreviewType('delivered')}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                      emailPreviewType === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-[#2A1B12] text-[#D4C5B9]'
                    }`}
                  >
                    Delivered / Shipped
                  </button>
                  <button
                    onClick={() => setPreviewEmailOrder(null)}
                    className="p-1 text-[#D4C5B9] hover:text-[#FDFBF7] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rendered HTML Preview */}
              <div className="flex-1 overflow-y-auto mt-4 p-4 rounded-2xl bg-[#120B08] border border-[#D4AF37]/20">
                <iframe
                  srcDoc={
                    emailPreviewType === 'confirmation'
                      ? generateOrderConfirmationEmailHTML(previewEmailOrder)
                      : generateOrderDeliveredEmailHTML(previewEmailOrder)
                  }
                  title="Receipt Preview"
                  className="w-full min-h-[500px] border-0 rounded-xl"
                />
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: CLOUD INTEGRATIONS SETUP GUIDE (SUPABASE & GOOGLE SHEETS) */}
      <AnimatePresence>
        {showIntegrationsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIntegrationsModal(false)}
              className="fixed inset-0 bg-[#0A0604]/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#221610] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-heading text-xl font-bold text-[#FDFBF7]">
                    Cloud Integration & Webhook Setup
                  </h3>
                </div>
                <button onClick={() => setShowIntegrationsModal(false)} className="text-[#D4C5B9] hover:text-[#FDFBF7] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-3">
                <button
                  onClick={() => setActiveIntegrationTab('sheets')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeIntegrationTab === 'sheets'
                      ? 'bg-[#D4AF37] text-[#170F0B]'
                      : 'bg-[#18100C] text-[#D4C5B9] hover:text-[#FDFBF7]'
                  }`}
                >
                  Google Sheets Webhook Script
                </button>
                <button
                  onClick={() => setActiveIntegrationTab('supabase')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeIntegrationTab === 'supabase'
                      ? 'bg-[#D4AF37] text-[#170F0B]'
                      : 'bg-[#18100C] text-[#D4C5B9] hover:text-[#FDFBF7]'
                  }`}
                >
                  Supabase SQL Orders Table
                </button>
              </div>

              {/* Tab 1: Google Sheets Setup */}
              {activeIntegrationTab === 'sheets' && (
                <div className="space-y-4 text-xs">
                  <p className="text-[#D4C5B9]">
                    Follow these 3 quick steps to append every web order live into a Google Sheet:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[#D4C5B9]">
                    <li>Create a new spreadsheet at <strong>sheets.google.com</strong>.</li>
                    <li>Open <strong>Extensions &gt; Apps Script</strong> and paste the code below.</li>
                    <li>Click <strong>Deploy &gt; New deployment &gt; Web app</strong> (Access: Anyone), copy the Webhook URL, and set it as <code>VITE_GOOGLE_SHEETS_WEBHOOK_URL</code> in your <code>.env</code> file.</li>
                  </ol>

                  <div className="relative">
                    <pre className="p-4 rounded-2xl bg-[#140D08] border border-[#D4AF37]/30 text-[11px] font-mono text-[#E5C365] overflow-x-auto max-h-60">
                      {GOOGLE_APPS_SCRIPT_TEMPLATE}
                    </pre>
                    <button
                      onClick={() => handleCopy(GOOGLE_APPS_SCRIPT_TEMPLATE)}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#2E1E14] hover:bg-[#3D281B] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Supabase Setup */}
              {activeIntegrationTab === 'supabase' && (
                <div className="space-y-4 text-xs">
                  <p className="text-[#D4C5B9]">
                    In your <strong>Supabase Dashboard &gt; SQL Editor</strong>, run this schema script to configure the <code>orders</code> table with full Row Level Security (RLS):
                  </p>

                  <div className="relative">
                    <pre className="p-4 rounded-2xl bg-[#140D08] border border-[#D4AF37]/30 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-60">
                      {SUPABASE_SQL_SETUP}
                    </pre>
                    <button
                      onClick={() => handleCopy(SUPABASE_SQL_SETUP)}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#2E1E14] hover:bg-[#3D281B] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy SQL'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#140D08] border border-[#D4AF37]/30 text-[#D4C5B9] space-y-1.5">
                    <span className="font-bold text-[#D4AF37] block">Admin Authentication Credentials:</span>
                    <p>
                      The <code>/admin</code> route authenticates directly with Supabase Auth. To add admin accounts, go to your <strong>Supabase Dashboard &gt; Authentication &gt; Users</strong>, click <strong>Add user &gt; Create user</strong>, and register your email and password.
                    </p>
                  </div>

                  <p className="text-[#A69282]">
                    Once run, set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your environment to transition seamlessly from local storage to cloud database.
                  </p>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
