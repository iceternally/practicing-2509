'use client';

import { useState } from 'react';
import { PropertyData } from '@/services/marketDataService';
import { Download, FileText, Table, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// @ts-ignore
import { saveAs } from 'file-saver';

interface DataExporterProps {
  data: PropertyData[];
  filteredData: PropertyData[];
  dashboardRef?: React.RefObject<HTMLDivElement>;
}

const DataExporter = ({ data, filteredData, dashboardRef }: DataExporterProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);

  const exportToCSV = async (dataToExport: PropertyData[], filename: string) => {
    setIsExporting(true);
    setExportType('csv');

    try {
      // Create CSV headers
      const headers = [
        'ID',
        'Address',
        'Price',
        'Square Footage',
        'Bedrooms',
        'Bathrooms',
        'Year Built',
        'Lot Size',
        'Property Type',
        'Distance to City Center',
        'School Rating',
        'Crime Rate',
        'Neighborhood'
      ];

      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...dataToExport.map(property => [
          property.id,
          `"${property.address}"`,
          property.price,
          property.square_footage,
          property.bedrooms,
          property.bathrooms,
          property.year_built,
          property.lot_size,
          `"${property.property_type}"`,
          property.distance_to_city_center,
          property.school_rating,
          property.crime_rate,
          `"${property.neighborhood}"`
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV file. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportToPDF = async (dataToExport: PropertyData[], filename: string) => {
    setIsExporting(true);
    setExportType('pdf');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Property Market Analysis Report', margin, yPosition);
      yPosition += 15;

      // Add generation date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 10;

      // Add summary statistics
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary Statistics', margin, yPosition);
      yPosition += 10;

      const avgPrice = dataToExport.reduce((sum, p) => sum + p.price, 0) / dataToExport.length;
      const avgSqFt = dataToExport.reduce((sum, p) => sum + p.square_footage, 0) / dataToExport.length;
      const avgPricePerSqFt = dataToExport.reduce((sum, p) => sum + (p.price / p.square_footage), 0) / dataToExport.length;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total Properties: ${dataToExport.length}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Average Price: $${avgPrice.toLocaleString()}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Average Square Footage: ${avgSqFt.toFixed(0)} sq ft`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Average Price per Sq Ft: $${avgPricePerSqFt.toFixed(0)}`, margin, yPosition);
      yPosition += 15;

      // Add property data table
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Property Listings', margin, yPosition);
      yPosition += 10;

      // Table headers
      const headers = ['Address', 'Price', 'Sq Ft', 'Bed/Bath', 'Year', 'Type'];
      const colWidths = [60, 25, 20, 20, 15, 30];
      let xPosition = margin;

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += 8;

      // Table rows
      pdf.setFont('helvetica', 'normal');
      dataToExport.slice(0, 30).forEach((property) => { // Limit to first 30 properties
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        xPosition = margin;
        const rowData = [
          property.address.length > 25 ? property.address.substring(0, 25) + '...' : property.address,
          `$${(property.price / 1000).toFixed(0)}k`,
          property.square_footage.toString(),
          `${property.bedrooms}/${property.bathrooms}`,
          property.year_built.toString(),
          property.property_type.length > 12 ? property.property_type.substring(0, 12) + '...' : property.property_type
        ];

        rowData.forEach((data, index) => {
          pdf.text(data, xPosition, yPosition);
          xPosition += colWidths[index];
        });
        yPosition += 6;
      });

      // Add dashboard screenshot if available
      if (dashboardRef?.current) {
        try {
          const canvas = await html2canvas(dashboardRef.current, {
            scale: 0.5,
            useCORS: true,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.addPage();
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Dashboard Visualization', margin, margin);
          pdf.addImage(imgData, 'PNG', margin, margin + 10, imgWidth, imgHeight);
        } catch (error) {
          console.warn('Could not capture dashboard screenshot:', error);
        }
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF file. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleExport = (format: 'csv' | 'pdf', useFiltered: boolean = false) => {
    const dataToExport = useFiltered ? filteredData : data;
    const timestamp = new Date().toISOString().split('T')[0];
    const dataType = useFiltered ? 'filtered' : 'all';
    const filename = `property-market-analysis-${dataType}-${timestamp}.${format}`;

    if (format === 'csv') {
      exportToCSV(dataToExport, filename);
    } else {
      exportToPDF(dataToExport, filename);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Download size={20} />
        Export Data
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CSV Export */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Table size={20} className="text-green-600" />
            <h4 className="font-medium text-gray-900">CSV Export</h4>
          </div>
          <p className="text-sm text-gray-600">
            Export property data as a CSV file for use in spreadsheet applications.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleExport('csv', false)}
              disabled={isExporting}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isExporting && exportType === 'csv' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Export All Data ({data.length} properties)
            </button>
            {filteredData && filteredData.length !== data.length && (
              <button
                onClick={() => handleExport('csv', true)}
                disabled={isExporting}
                className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isExporting && exportType === 'csv' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                Export Filtered Data ({filteredData.length} properties)
              </button>
            )}
          </div>
        </div>

        {/* PDF Export */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-red-600" />
            <h4 className="font-medium text-gray-900">PDF Report</h4>
          </div>
          <p className="text-sm text-gray-600">
            Generate a comprehensive PDF report with statistics and visualizations.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleExport('pdf', false)}
              disabled={isExporting}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isExporting && exportType === 'pdf' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              Generate Full Report
            </button>
            {filteredData && filteredData.length !== data.length && (
              <button
                onClick={() => handleExport('pdf', true)}
                disabled={isExporting}
                className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isExporting && exportType === 'pdf' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <FileText size={16} />
                )}
                Generate Filtered Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Export Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Export Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• CSV files include all property details and can be opened in Excel or Google Sheets</li>
          <li>• PDF reports include summary statistics, property listings, and dashboard visualizations</li>
          <li>• Filtered exports only include properties matching your current filter criteria</li>
          <li>• Large datasets may take a few moments to process</li>
        </ul>
      </div>
    </div>
  );
};

export default DataExporter;