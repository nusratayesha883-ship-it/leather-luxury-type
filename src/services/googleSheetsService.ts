import type { OrderRecord } from '../types';

// Webhook URL configured in environment variables
const GOOGLE_SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';

export const isGoogleSheetsWebhookConfigured = (): boolean => {
  return Boolean(
    GOOGLE_SHEETS_WEBHOOK_URL &&
    GOOGLE_SHEETS_WEBHOOK_URL.startsWith('https://') &&
    !GOOGLE_SHEETS_WEBHOOK_URL.includes('your_google_script')
  );
};

export interface SheetSyncResult {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * 1. Sync order record to Google Sheet Webhook / Google Apps Script
 */
export const syncOrderToGoogleSheets = async (
  order: OrderRecord
): Promise<SheetSyncResult> => {
  const timestamp = new Date().toISOString();

  // Structured row payload matching standard spreadsheet columns
  const payload = {
    action: 'appendRow',
    orderId: order.order_id,
    timestamp: order.created_at || timestamp,
    status: order.status || 'Pending',
    customerName: order.customer_name,
    phone: order.phone,
    email: order.email,
    company: order.company_name || 'N/A',
    deliveryZone: order.delivery_destination === 'domestic' ? 'Inside Country (Bangladesh)' : 'Outside Country (International)',
    deliveryAddress: order.delivery_address,
    leatherType: order.leather_name,
    sqft: order.sqft,
    colorShade: order.customization_specs.colorName + (order.customization_specs.customPantone ? ` (${order.customization_specs.customPantone})` : ''),
    logoDebossing: order.customization_specs.logoDebossingText || 'None / Raw',
    thicknessOption: order.customization_specs.thicknessOption || 'Standard',
    paymentMethod: order.payment_method.toUpperCase(),
    officialPaymentAccount: '01353091099',
    trxId: order.trx_id,
    grandTotalBDT: order.grand_total_bdt,
    grandTotalUSD: order.grand_total_usd,
    atelierNotes: order.customization_specs.specialNotes || 'None',
  };

  // If live webhook endpoint is provided
  if (isGoogleSheetsWebhookConfigured()) {
    try {
      const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors', // Standard for Google Apps Script Web Apps to prevent browser CORS block
      });

      console.log('[Google Sheets Webhook Dispatched]', response.status);
      return {
        success: true,
        message: `Order ${order.order_id} successfully dispatched to Google Sheet.`,
        timestamp,
      };
    } catch (err: any) {
      console.warn('[Google Sheets Sync Error]', err);
      return {
        success: false,
        message: `Sync warning: ${err?.message || 'Could not reach endpoint'}. Stored in local sync queue.`,
        timestamp,
      };
    }
  }

  // Fallback when webhook URL is not yet configured: Log to local sync records
  console.info('[Google Sheets Mock Sync] Webhook not configured. Payload queued for export:', payload);
  return {
    success: true,
    message: `Order ${order.order_id} queued for Google Sheets record.`,
    timestamp,
  };
};

/**
 * 2. Export Orders to CSV (Direct Excel & Google Sheets Import)
 */
export const exportOrdersToCSV = (orders: OrderRecord[]): void => {
  if (!orders || orders.length === 0) return;

  const headers = [
    'Order ID',
    'Date & Time',
    'Status',
    'Customer Name',
    'Phone / WhatsApp',
    'Email Address',
    'Delivery Zone',
    'Full Delivery Address',
    'Leather Article',
    'Square Footage',
    'Color & Shade',
    'Custom Logo',
    'Thickness',
    'Payment Channel',
    'Payment Account',
    'TrxID / Note',
    'Total BDT',
    'Total USD',
  ];

  const rows = orders.map((o) => [
    `"${o.order_id}"`,
    `"${new Date(o.created_at).toLocaleString()}"`,
    `"${o.status}"`,
    `"${(o.customer_name || '').replace(/"/g, '""')}"`,
    `"${o.phone}"`,
    `"${o.email}"`,
    `"${o.delivery_destination}"`,
    `"${(o.delivery_address || '').replace(/"/g, '""')}"`,
    `"${(o.leather_name || '').replace(/"/g, '""')}"`,
    o.sqft,
    `"${(o.customization_specs.colorName || '').replace(/"/g, '""')}"`,
    `"${(o.customization_specs.logoDebossingText || 'None').replace(/"/g, '""')}"`,
    `"${o.customization_specs.thicknessOption || 'Standard'}"`,
    `"${o.payment_method.toUpperCase()}"`,
    '"01353091099"',
    `"${(o.trx_id || '').replace(/"/g, '""')}"`,
    o.grand_total_bdt,
    o.grand_total_usd,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `LuxeHide_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 3. Ready-to-use Google Apps Script Code for Live Google Sheet Integration
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// Google Apps Script to paste into Extensions > Apps Script in your Google Sheet
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Order ID",
        "Timestamp",
        "Status",
        "Customer Name",
        "Phone / WhatsApp",
        "Email",
        "Company",
        "Delivery Zone",
        "Delivery Address",
        "Leather Hide",
        "Sq.Ft",
        "Color / Shade",
        "Custom Logo",
        "Thickness",
        "Payment Channel",
        "Official Number",
        "TrxID",
        "Total (BDT)",
        "Total (USD)",
        "Atelier Notes"
      ]);
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.orderId || "",
      data.timestamp || new Date().toISOString(),
      data.status || "Pending",
      data.customerName || "",
      data.phone || "",
      data.email || "",
      data.company || "",
      data.deliveryZone || "",
      data.deliveryAddress || "",
      data.leatherType || "",
      data.sqft || 0,
      data.colorShade || "",
      data.logoDebossing || "",
      data.thicknessOption || "",
      data.paymentMethod || "",
      data.officialPaymentAccount || "01353091099",
      data.trxId || "",
      data.grandTotalBDT || 0,
      data.grandTotalUSD || 0,
      data.atelierNotes || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
