import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import path from 'path';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '2 solid #f0f0f0',
    paddingBottom: 15,
  },
  logo: {
    width: 100,
    height: 40,
    objectFit: 'contain',
  },
  invoiceTitle: {
    color: '#1a1a1a',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  invoiceSubtitle: {
    color: '#666666',
    fontSize: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  leftColumn: {
    width: '50%',
  },
  rightColumn: {
    width: '40%',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: '#666666',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    color: '#1a1a1a',
    fontSize: 10,
    marginBottom: 6,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: '#1a1a1a',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalsSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 10,
    color: '#495057',
    marginRight: 30,
    width: 80,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 10,
    color: '#1a1a1a',
    width: 80,
    textAlign: 'right',
  },
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
  },
});

export interface EnergyPackageReceiptProps {
  sender: { name: string; address: string; addressline2?: string };
  receiver: { username: string; email: string };
  packageName: string;
  totalAmount: number;
  transactionId: string;
  date: string;
}

const logoPath = path.resolve(__dirname, './grwbLogo.png');

const EnergyPackageReceipt: React.FC<{ receipt: EnergyPackageReceiptProps }> = ({ receipt }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Image style={styles.logo} src={logoPath} />
        </View>
        <View>
          <Text style={styles.invoiceTitle}>RECEIPT</Text>
          <Text style={styles.invoiceSubtitle}>{receipt.transactionId}</Text>
        </View>
      </View>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        {/* Left Column - From and To */}
        <View style={styles.leftColumn}>
          <View style={styles.section}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{receipt.sender.name}</Text>
            <Text style={styles.value}>{receipt.sender.address}</Text>
            {receipt?.sender?.addressline2 && <Text style={styles.value}>{receipt?.sender?.addressline2}</Text>}
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>{receipt.receiver.username}</Text>
            <Text style={styles.value}>{receipt.receiver.email}</Text>
          </View>
        </View>

        {/* Right Column - Details */}
        <View style={styles.rightColumn}>
          <View style={styles.section}>
            <Text style={styles.label}>Details</Text>
            <Text style={styles.value}>Date: {receipt.date}</Text>
            {/* <Text style={styles.value}>Transaction ID: {receipt.transactionId}</Text> */}
          </View>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Package Name</Text>
          <Text style={styles.tableHeaderCell}>Amount</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{receipt.packageName}</Text>
          <Text style={styles.tableCell}>${(receipt.totalAmount / 100).toFixed(2)}</Text>
        </View>
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={[styles.totalValue, { fontWeight: 'bold' }]}>${(receipt.totalAmount / 100).toFixed(2)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);

export default EnergyPackageReceipt;
