import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PDFViewer, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import supabase from '../../utils/supabase';
import InvoicePDFDocument from '../../components/pdf/InvoicePDFDocument'; // adjust path if needed

const InvoicePreviewModal = ({
  isOpen,
  onClose,
  invoiceDetails,
  companyData,
  customerData,
  items,
  onGenerateAndSave: propOnGenerateAndSave,
}) => {
 

  const handleGenerateAndSave = async (blob, url, invoiceIdFromProp) => {
    if (!blob) {
      alert('PDF is still generating, please wait a moment...');
      return;
    }

    // 1. Always trigger the browser download immediately from the blob
    try {
      const fileName = `Invoice_${invoiceDetails?.invoiceNumber || 'draft'}.pdf`;
      const downloadUrl = url || URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (!url) {
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
      }
    } catch (dlErr) {
      console.error('Error triggering local PDF download:', dlErr);
    }

    // 2. Best-effort upload to Supabase Storage if an invoice ID exists
    if (invoiceIdFromProp) {
      try {
        console.log('Attempting to upload PDF to Supabase Storage...');
        const filePath = `${invoiceIdFromProp}.pdf`;

        const { error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(filePath, blob, { contentType: 'application/pdf', upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('invoices').getPublicUrl(filePath);
          await supabase
            .from('invoices')
            .update({ pdf_url: publicUrl })
            .eq('id', invoiceIdFromProp);

          if (propOnGenerateAndSave) {
            propOnGenerateAndSave(publicUrl);
          }
        } else {
          console.warn('Supabase storage upload note:', uploadError.message);
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload skipped or failed:', storageErr.message);
      }
    }

    alert('✅ Invoice PDF downloaded successfully!');
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full h-90vh flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Invoice Preview</h2>

        <div className="flex-grow overflow-hidden flex">
          <PDFViewer className="flex-grow">
            <InvoicePDFDocument
              invoiceDetails={invoiceDetails}
              companyData={companyData}
              customerData={customerData}
              items={items}
            />
          </PDFViewer>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Close
          </button>

          <BlobProvider
            document={
              <InvoicePDFDocument
                invoiceDetails={invoiceDetails}
                companyData={companyData}
                customerData={customerData}
                items={items}
              />
            }
          >
            {({ blob, url, loading, error }) => (
              <>
                <button
                  onClick={() => {
                    handleGenerateAndSave(blob, url, invoiceDetails?.id);
                  }}
                  className="px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 shadow-sm transition-colors"
                  disabled={loading || !blob}
                >
                  {loading ? 'Generating PDF...' : 'Download PDF'}
                </button>

                {error && (
                  <p className="text-red-500 text-xs mt-2">
                    Failed to generate PDF: {error.message}
                  </p>
                )}
              </>
            )}
          </BlobProvider>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InvoicePreviewModal;
