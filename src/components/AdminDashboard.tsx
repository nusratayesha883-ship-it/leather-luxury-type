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
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  fetchAllOrders,
  updateRemoteOrderStatus,
  isSupabaseConfigured,
  subscribeToOrdersRealtime,
  SUPABASE_SQL_SETUP
} from '../services/supabaseClient';
import {
  exportOrdersToCSV,
  isGoogleSheetsWebhookConfigured,
  GOOGLE_APPS_SCRIPT_TEMPLATE
} from '../services/googleSheetsService';
import {
  sendOrderDeliveredEmail,
  generateOrderConfirmationEmailHTML,
  generateOrderDeliveredEmailHTML
} from '../services/emailService';
import type { OrderRecord, OrderStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { navigateTo } = useApp();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Status Update Modal State
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

  // Load orders on mount
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
    loadOrders();

    // Subscribe to real-time order updates from Supabase
    const unsubscribe = subscribeToOrdersRealtime(() => {
      loadOrders();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        o.order_id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        (o.trx_id && o.trx_id.toLowerCase().includes(q)) ||
        o.leather_name.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const processing = orders.filter((o) => o.status === 'Processing').length;
    const shipped = orders.filter((o) => o.status === 'Shipped').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    const totalBDT = orders.reduce((acc, o) => acc + (o.grand_total_bdt || 0), 0);
    const totalUSD = orders.reduce((acc, o) => acc + (o.grand_total_usd || 0), 0);

    return { total, pending, processing, shipped, delivered, totalBDT, totalUSD };
  }, [orders]);

  // Initiate status change
  const handleOpenStatusModal = (order: OrderRecord, newStatus: OrderStatus) => {
    setSelectedOrderForStatus(order);
    setTargetStatus(newStatus);
    setTrackingNumber(order.tracking_number || `EXP-${new Date().getFullYear()}-${order.order_id.replace('#', '')}`);
    setShippingCarrier(
      order.shipping_carrier ||
      (order.delivery_destination === 'domestic' ? 'Sundarban Courier / SteadFast' : 'DHL Express Worldwide')
    );
  };

  // Submit status update & trigger automated email if Delivered/Shipped
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

  // Copy code snippet helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Processing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Shipped':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#140D09] text-[#FDFBF7] py-8 sm:py-12 selection:bg-[#D4AF37] selection:text-[#170F0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/')}
              className="p-2.5 rounded-full bg-[#241710] hover:bg-[#322016] text-[#D4AF37] border border-[#D4AF37]/35 transition-all cursor-pointer shadow-md"
              title="Return to Atelier Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
                  LuxeHide Atelier — Master Order Management
                </h1>
              </div>
              <p className="text-xs text-[#A69282] mt-0.5">
                Real-time Supabase Database, Google Sheets Sync & Automated Customer Notifications
              </p>
            </div>
          </div>

          {/* Integration Status Badges & Setup Guide */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Supabase Status Indicator */}
            <div
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                isSupabaseConfigured()
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured() ? 'Supabase: Live Cloud' : 'Supabase: Local Mode'}</span>
            </div>

            {/* Google Sheets Status Indicator */}
            <div
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                isGoogleSheetsWebhookConfigured()
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isGoogleSheetsWebhookConfigured() ? 'Sheets: Webhook Active' : 'Sheets: Local Sync'}</span>
            </div>

            {/* Setup / Instructions Modal Button */}
            <button
              onClick={() => setShowIntegrationsModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#2D1C13] hover:bg-[#3D2619] text-[#E5C365] text-xs font-bold border border-[#D4AF37]/40 shadow-sm cursor-pointer transition-all"
            >
              ⚙️ Cloud Setup Guide
            </button>
          </div>
        </div>

        {/* Global Action Notification Toast */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-2xl border text-sm flex items-center justify-between shadow-xl ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/80 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-[#D4C5B9] hover:text-[#FDFBF7]">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* 5 Real-Time Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="p-4 rounded-2xl bg-[#1E130D] border border-[#D4AF37]/25 space-y-1 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A69282] block">
              Total Orders
            </span>
            <div className="font-heading text-2xl font-bold text-[#FDFBF7]">{stats.total}</div>
            <span className="text-[10px] text-[#A69282] block">All Commissions</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1E130D] border border-amber-500/30 space-y-1 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Pending Orders
            </span>
            <div className="font-heading text-2xl font-bold text-amber-300">{stats.pending}</div>
            <span className="text-[10px] text-amber-400/80 block">Awaiting Verification</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1E130D] border border-blue-500/30 space-y-1 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
              In Processing
            </span>
            <div className="font-heading text-2xl font-bold text-blue-300">{stats.processing}</div>
            <span className="text-[10px] text-blue-400/80 block">Tannery Splitting/Dye</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1E130D] border border-purple-500/30 space-y-1 shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block">
              Shipped Freight
            </span>
            <div className="font-heading text-2xl font-bold text-purple-300">{stats.shipped}</div>
            <span className="text-[10px] text-purple-400/80 block">En Route with Courier</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1E130D] border border-emerald-500/30 space-y-1 shadow-md col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
              Delivered Orders
            </span>
            <div className="font-heading text-2xl font-bold text-emerald-300">{stats.delivered}</div>
            <span className="text-[10px] text-emerald-400/80 block">Completed Batches</span>
          </div>

        </div>

        {/* Action Controls Bar: Search, Status Filter Tabs & Sheet/CSV Export */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#1F140E] border border-[#D4AF37]/30 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#D4AF37]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID (#LHA-1001), Customer, Phone, or TrxID..."
                className="w-full bg-[#140D08] text-xs text-[#FDFBF7] pl-10 pr-4 py-2.5 rounded-2xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A69282] hover:text-[#FDFBF7]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Action Buttons: Export to CSV & Refresh */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => exportOrdersToCSV(orders)}
                className="px-4 py-2.5 rounded-2xl bg-[#2A1B12] hover:bg-[#382318] text-[#E5C365] hover:text-[#FDFBF7] text-xs font-bold border border-[#D4AF37]/35 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                title="Download CSV for Excel & Google Sheets"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Export CSV / Sheet</span>
              </button>

              <button
                onClick={loadOrders}
                disabled={loading}
                className="p-2.5 rounded-2xl bg-[#2A1B12] hover:bg-[#382318] text-[#D4AF37] hover:text-[#FDFBF7] border border-[#D4AF37]/35 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                title="Refresh Orders"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

          </div>

          {/* Filter Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D4AF37]/15">
            <span className="text-xs text-[#A69282] mr-1 flex items-center gap-1 font-semibold">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              Filter:
            </span>
            {[
              { id: 'all', label: `All (${stats.total})` },
              { id: 'Pending', label: `Pending (${stats.pending})` },
              { id: 'Processing', label: `Processing (${stats.processing})` },
              { id: 'Shipped', label: `Shipped (${stats.shipped})` },
              { id: 'Delivered', label: `Delivered (${stats.delivered})` },
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

        {/* Orders Table Container */}
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
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#D4AF37]/15">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#A69282]">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Package className="w-8 h-8 text-[#D4AF37]/50 mx-auto" />
                        <p className="font-semibold text-sm text-[#FDFBF7]">No orders match the current filter.</p>
                        <p className="text-xs">Submit a test order on the /custom-order page to see it appear here live!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr
                      key={ord.order_id}
                      className="hover:bg-[#261811] transition-colors"
                    >
                      {/* 1. Order ID & Date */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-mono font-bold text-sm text-[#E5C365]">
                          {ord.order_id}
                        </div>
                        <div className="text-[10px] text-[#A69282] mt-0.5">
                          {new Date(ord.created_at).toLocaleDateString()} {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                          <div className="text-[10px] text-[#A69282] truncate max-w-[140px] mt-0.5">
                            {ord.email}
                          </div>
                        )}
                      </td>

                      {/* 3. Leather Hide & Specs */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#FDFBF7]">{ord.leather_name}</div>
                        <div className="text-[11px] text-[#E5C365] font-semibold">
                          {ord.sqft} sq.ft • {ord.customization_specs.colorName}
                        </div>
                        {ord.customization_specs.logoDebossingText && (
                          <div className="text-[10px] text-[#A69282] italic">
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
                          {ord.delivery_destination === 'domestic' ? 'Bangladesh (৳10/sqft)' : 'International ($1.50/sqft)'}
                        </span>
                        <div className="text-[10px] text-[#A69282] truncate max-w-[150px] mt-1" title={ord.delivery_address}>
                          {ord.delivery_address}
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
                        <div className="text-[10px] font-mono text-[#E5C365] mt-0.5">
                          Trx: {ord.trx_id || 'N/A'}
                        </div>
                      </td>

                      {/* 6. Grand Total */}
                      <td className="py-4 px-4">
                        <div className="font-heading font-extrabold text-sm text-[#E5C365]">
                          ৳{ord.grand_total_bdt.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#A69282]">
                          ${ord.grand_total_usd.toFixed(2)} USD
                        </div>
                      </td>

                      {/* 7. Status Badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(ord.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{ord.status}</span>
                        </span>
                      </td>

                      {/* 8. Action Buttons */}
                      <td className="py-4 px-4 sm:px-6 text-right space-x-1.5">
                        
                        {/* WhatsApp Customer Direct */}
                        <a
                          href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '') || '8801905206450'}?text=${encodeURIComponent(
                            `Hello ${ord.customer_name}, this is LuxeHide Atelier regarding your leather order ${ord.order_id} (${ord.leather_name}, ${ord.sqft} sq.ft).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 inline-block transition-all shadow-sm"
                          title="Message Customer on WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        {/* View Email Receipt Preview */}
                        <button
                          onClick={() => {
                            setPreviewEmailOrder(ord);
                            setEmailPreviewType('confirmation');
                          }}
                          className="p-1.5 rounded-xl bg-[#2A1B12] hover:bg-[#382318] border border-[#D4AF37]/35 text-[#D4AF37] inline-block transition-all shadow-sm cursor-pointer"
                          title="View Customer Confirmation Email"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Update Status Dropdown / Action */}
                        <button
                          onClick={() => handleOpenStatusModal(ord, ord.status === 'Pending' ? 'Processing' : ord.status === 'Processing' ? 'Shipped' : 'Delivered')}
                          className="px-2.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C365] text-[#170F0B] font-bold text-[11px] inline-block transition-all cursor-pointer shadow-sm"
                        >
                          Update Status
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </div>

      </div>

      {/* MODAL 1: STATUS UPDATE & AUTOMATED EMAIL CONFIRMATION */}
      <AnimatePresence>
        {selectedOrderForStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForStatus(null)}
              className="fixed inset-0 bg-[#0A0604]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
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
                  className="text-[#D4C5B9] hover:text-[#FDFBF7] p-1"
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
                  {(['Pending', 'Processing', 'Shipped', 'Delivered'] as OrderStatus[]).map((st) => (
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
                      <span>{st}</span>
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
                      className="w-full bg-[#140D08] text-xs text-[#FDFBF7] px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Will automatically send confirmation email to {selectedOrderForStatus.email}!</span>
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
                      <span>Saving & Notifying...</span>
                    </>
                  ) : (
                    <span>Confirm Status Update</span>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: LUXURY EMAIL RECEIPT PREVIEW MODAL */}
      <AnimatePresence>
        {previewEmailOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewEmailOrder(null)}
              className="fixed inset-0 bg-[#0A0604]/80 backdrop-blur-sm"
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
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      emailPreviewType === 'confirmation' ? 'bg-[#D4AF37] text-[#170F0B]' : 'bg-[#2A1B12] text-[#D4C5B9]'
                    }`}
                  >
                    Confirmation
                  </button>
                  <button
                    onClick={() => setEmailPreviewType('delivered')}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      emailPreviewType === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-[#2A1B12] text-[#D4C5B9]'
                    }`}
                  >
                    Delivered / Shipped
                  </button>
                  <button
                    onClick={() => setPreviewEmailOrder(null)}
                    className="p-1 text-[#D4C5B9] hover:text-[#FDFBF7]"
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

      {/* MODAL 3: CLOUD INTEGRATIONS SETUP GUIDE (SUPABASE & GOOGLE SHEETS) */}
      <AnimatePresence>
        {showIntegrationsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIntegrationsModal(false)}
              className="fixed inset-0 bg-[#0A0604]/80 backdrop-blur-sm"
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
                <button onClick={() => setShowIntegrationsModal(false)} className="text-[#D4C5B9] hover:text-[#FDFBF7]">
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
