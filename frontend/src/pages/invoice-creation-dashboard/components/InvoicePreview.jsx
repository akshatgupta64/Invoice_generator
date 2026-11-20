import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// Styles for PDF export
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  section: {
    marginBottom: 10
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333'
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 5,
    color: '#555555'
  },
  text: {
    fontSize: 12,
    marginBottom: 2,
    color: '#333333'
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10
  }
});

// 📄 Main InvoicePreview component
const InvoicePreview = ({
  companyData = {},
  customerData = {},
  invoiceDetails = {},
  items = [],
  isForPDF = false
}) => {
  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + (item.amount || 0), 0);

  const calculateTax = (subtotal) => subtotal * 0.1;

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + calculateTax(subtotal);
  };

  const formatCurrency = (amount) => {
    const currency = invoiceDetails.currency || 'INR'; // Default to INR
    return new Intl.NumberFormat('en-IN', { // Use en-IN locale for Rupee symbol
      style: 'currency',
      currency
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentTermsText = (terms) => {
    const termsMap = {
      'due-on-receipt': 'Due on Receipt',
      'net-15': 'Net 15 Days',
      'net-30': 'Net 30 Days',
      'net-60': 'Net 60 Days',
      'net-90': 'Net 90 Days'
    };
    return termsMap[terms] || 'Net 30 Days';
  };

  if (isForPDF) {
    // ✅ PDF export version: every text wrapped inside <Text>
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {companyData.logo && (
              <Image src={companyData.logo} style={styles.image} />
            )}
            <Text style={styles.header}>Invoice</Text>
            <Text style={styles.subHeader}>
              Invoice #{invoiceDetails.invoiceNumber || 'N/A'}
            </Text>
            <Text style={styles.text}>Date: {formatDate(invoiceDetails.issueDate)}</Text>
            <Text style={styles.text}>Due Date: {formatDate(invoiceDetails.dueDate)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subHeader}>Bill To:</Text>
            <Text style={styles.text}>{customerData.name || '-'}</Text>
            <Text style={styles.text}>{customerData.email || '-'}</Text>
            <Text style={styles.text}>{customerData.phone || '-'}</Text>
            <Text style={styles.text}>{customerData.address || '-'}</Text>
            <Text style={styles.text}>
              {[customerData.city, customerData.state, customerData.zipCode].filter(Boolean).join(', ') || '-'}
            </Text>
            {customerData.company && (
              <Text style={styles.text}>{customerData.company}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.subHeader}>Items:</Text>
            {items.map((item, index) => (
              <View key={index} style={{ marginBottom: 5 }}>
                <Text style={styles.text}>Description: {item.description || '-'}</Text>
                <Text style={styles.text}>Quantity: {item.quantity ?? '-'}</Text>
                <Text style={styles.text}>Rate: {formatCurrency(item.rate)}</Text>
                <Text style={styles.text}>Amount: {formatCurrency(item.amount)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.subHeader}>Subtotal: {formatCurrency(calculateSubtotal())}</Text>
            <Text style={styles.subHeader}>Tax (10%): {formatCurrency(calculateTax(calculateSubtotal()))}</Text>
            <Text style={styles.subHeader}>Total: {formatCurrency(calculateTotal())}</Text>
          </View>

          {invoiceDetails.notes && (
            <View style={styles.section}>
              <Text style={styles.subHeader}>Notes:</Text>
              <Text style={styles.text}>{invoiceDetails.notes || '-'}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.subHeader}>Payment Terms:</Text>
            <Text style={styles.text}>{getPaymentTermsText(invoiceDetails.paymentTerms)}</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // 🌐 Web preview version
  return (
    <div className="bg-surface rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Eye" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Live Preview</h3>
        </div>
      </div>

      <div className="bg-white p-6">
        <div className="flex justify-between mb-6">
          <div className="flex items-center space-x-4">
            {companyData.logo && (
              <img src={companyData.logo} alt="" className="h-16 w-auto object-contain" />
            )}
            <div>
              <h1 className="text-2xl font-bold">INVOICE</h1>
              <p>{invoiceDetails.invoiceNumber || 'INV-000-0000-000'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Issue Date</div>
            <div className="font-medium">{formatDate(invoiceDetails.issueDate)}</div>
            <div className="text-xs text-gray-500 mt-2">Due Date</div>
            <div className="font-medium">{formatDate(invoiceDetails.dueDate)}</div>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <h2 className="font-bold mb-2">Our Information:</h2>
            <p>{companyData.name}</p>
            <p>{companyData.email}</p>
            <p>{companyData.phone}</p>
            <p>{companyData.address}</p>
            <p>{companyData.city}, {companyData.state} {companyData.zipCode}</p>
            {companyData.website && <p>{companyData.website}</p>}
          </div>
          <div className="text-right">
            <h2 className="font-bold mb-2">Bill To:</h2>
            <p>{customerData.name}</p>
            <p>{customerData.email}</p>
            <p>{customerData.phone}</p>
            {customerData.company && <p>{customerData.company}</p>}
            <p>{customerData.address}</p>
            <p>{customerData.city} {customerData.state} {customerData.zipCode}</p>
          </div>
        </div>

        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.rate)}</td>
                <td className="py-2 text-right">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-1/2">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tax (10%):</span>
              <span>{formatCurrency(calculateTax(calculateSubtotal()))}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>

        {invoiceDetails.notes && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">Notes:</h3>
            <p>{invoiceDetails.notes}</p>
          </div>
        )}
        <div>
          <h3 className="font-bold mb-2">Payment Terms:</h3>
          <p>{getPaymentTermsText(invoiceDetails.paymentTerms)}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
