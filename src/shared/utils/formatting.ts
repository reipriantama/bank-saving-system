import { format, parseISO, isValid } from "date-fns";
import { id as localeId } from "date-fns/locale";

// Date formatting
export const formatDate = (
  date: string | Date,
  formatString: string = "dd MMM yyyy"
): string => {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "Invalid Date";
    return format(dateObj, formatString, { locale: localeId });
  } catch {
    return "Invalid Date";
  }
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return "-";

  return formatDate(date, "dd MMM yyyy, HH:mm");
};

export const formatDateShort = (date: string | Date): string => {
  if (!date) return "-";

  return formatDate(date, "dd/MM/yyyy");
};

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with thousand separators (Indonesian format: 5.000.000)
export const formatRupiahInput = (value: string | number | undefined): string => {
  if (!value && value !== 0) return '';
  
  // Convert to string and remove all non-digit characters
  const numStr = String(value).replace(/[^\d]/g, '');
  
  if (!numStr) return '';
  
  // Format with thousand separators (dots for Indonesian format)
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted rupiah string to number (5.000.000 -> 5000000)
export const parseRupiahInput = (value: string): string => {
  // Remove all non-digit characters
  return value.replace(/[^\d]/g, '');
};
