import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    marginLeft:-40,
    width: 200,
    height: 80,
    objectFit: 'contain',
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  invoiceNumber: {
    marginTop: 4,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  leftBlock: {
    width: '55%',
  },
  rightBlock: {
    width: '40%',
    textAlign: 'right',
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 2,
  },
  datesBlock: {
    textAlign: 'right',
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bfbfbf',
    paddingBottom: 4,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 4,
  },
  colDescription: { width: '40%' },
  colQty: { width: '15%', textAlign: 'right' },
  colRate: { width: '20%', textAlign: 'right' },
  colAmount: { width: '25%', textAlign: 'right' },
  totalBlock: {
    marginTop: 10,
    alignSelf: 'flex-end',
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderColor: '#333',
    marginTop: 5,
    paddingTop: 3,
  },
  notesBlock: {
    marginTop: 15,
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  paymentTerms: {
    marginTop: 3,
  },
});

const InvoicePDFDocument = ({ invoiceDetails, companyData, customerData, items }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item?.quantity || 0) * Number(item?.rate || 0)),
    0
  );
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          {companyData?.logo && <Image src={companyData.logo} style={styles.logo} />}
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoiceDetails?.invoiceNumber}</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.datesBlock}>
          <Text>Issue Date: {invoiceDetails?.issueDate}</Text>
          <Text>Due Date: {invoiceDetails?.dueDate}</Text>
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <View style={styles.leftBlock}>
            <Text style={styles.subHeader}>Our Informatio:</Text>
            <Text style={styles.text}>{companyData?.name}</Text>
            <Text style={styles.text}>{companyData?.email}</Text>
            <Text style={styles.text}>{companyData?.phone}</Text>
            <Text style={styles.text}>
              {companyData?.address}
              {companyData?.city ? `, ${companyData.city}` : ''}
              {companyData?.state ? `, ${companyData.state}` : ''}
            </Text>
            {companyData?.website && <Text style={styles.text}>{companyData.website}</Text>}
          </View>
          <View style={styles.rightBlock}>
            <Text style={styles.subHeader}>Bill To:</Text>
            <Text style={styles.text}>{customerData?.name}</Text>
            {customerData?.email && <Text style={styles.text}>{customerData.email}</Text>}
            {customerData?.phone && <Text style={styles.text}>{customerData.phone}</Text>}
            {customerData?.company && <Text style={styles.text}>{customerData.company}</Text>}
            <Text style={styles.text}>
              {customerData?.address}
              {customerData?.city ? `, ${customerData.city}` : ''}
              {customerData?.state ? `, ${customerData.state}` : ''}
            </Text>
          </View>
        </View>

        {/* Items header */}
        <View style={styles.itemHeader}>
          <Text style={styles.colDescription}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colAmount}>Amount</Text>
        </View>

        {/* Items list */}
        {items.map((item, idx) => {
          const qty = Number(item?.quantity || 0);
          const rate = Number(item?.rate || 0);
          const amount = qty * rate;
          return (
            <View style={styles.itemRow} key={idx}>
              <Text style={styles.colDescription}>{item?.description}</Text>
              <Text style={styles.colQty}>{`${qty}`}</Text>
              <Text style={styles.colRate}>{`Rs.${rate.toFixed(2)}`}</Text>
              <Text style={styles.colAmount}>{`Rs.${amount.toFixed(2)}`}</Text>
            </View>
          );
        })}

        {/* Totals */}
        <View style={styles.totalBlock}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>{`Rs.${subtotal.toFixed(2)}`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax (10%):</Text>
            <Text>{`Rs.${tax.toFixed(2)}`}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotal}>Total:</Text>
            <Text style={styles.grandTotal}>{`Rs.${total.toFixed(2)}`}</Text>
          </View>
        </View>

        {/* Notes & payment terms */}
        <View style={styles.notesBlock}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.text}>{invoiceDetails?.notes || '-'}</Text>
          <Text style={styles.notesTitle}>Payment Terms:</Text>
          <Text style={styles.paymentTerms}>{invoiceDetails?.paymentTerms || 'Due on receipt'}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDFDocument;
