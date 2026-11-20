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
    if (!blob || !invoiceIdFromProp) {
      console.warn('Missing blob or invoiceId, skipping upload.');
      return;
    }

    try {
      console.log('Uploading PDF to Supabase Storage.');
      const filePath = `${invoiceIdFromProp}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(filePath, blob, { contentType: 'application/pdf', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('invoices').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('invoices')
        .update({ pdf_url: publicUrl })
        .eq('id', invoiceIdFromProp);

      if (updateError) throw updateError;

      // Trigger download after successful upload and database update
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice_${invoiceDetails?.invoiceNumber || 'draft'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      alert('✅ PDF generated and saved successfully!');
      if (propOnGenerateAndSave) {
        propOnGenerateAndSave(publicUrl);
      }
      // Call generateInvoiceNumber to ensure the next invoice number is correct
      // This assumes generateInvoiceNumber is passed down or accessible here
      // For now, we'll assume it's handled by the parent component after this modal closes
      // or we need to pass it as a prop.
    } catch (error) {
      console.error('Error generating or saving PDF:', error.message);
      alert('❌ Failed to generate or save PDF: ' + error.message);
    }
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
                    console.log('Generating & saving PDF, invoiceDetails.id:', invoiceDetails?.id);
                    if (invoiceDetails?.id) handleGenerateAndSave(blob, url, invoiceDetails.id);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={loading || !blob}
                >
                  {loading ? 'Generating...' : 'Generate & Save PDF'}
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
