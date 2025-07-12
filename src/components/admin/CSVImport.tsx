
import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import api from '../../services/api';

interface ImportResult {
  successful: Array<{ row: number; name: string; id: string }>;
  failed: Array<{ row: number; data: any; error: string }>;
  total: number;
}

const CSVImport: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setError(null);
        setResults(null);
      } else {
        setError('Please select a valid CSV file');
        setSelectedFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      const response = await api.post('/csv/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data.results);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to import CSV file');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get('/csv/template', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'creator-template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download template');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Import Creators from CSV</h3>
        
        {/* Template Download */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">CSV Template</span>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Download the CSV template to see the required format. Include image URLs in the 'avatar' column for automatic upload.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* File Selection */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="mt-1"
            />
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>{selectedFile.name}</span>
              <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}

          <Button
            onClick={handleImport}
            disabled={!selectedFile || importing}
            className="w-full"
          >
            {importing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing & Uploading Images...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Display */}
        {results && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{results.total}</div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.successful.length}</div>
                <div className="text-sm text-green-600">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.failed.length}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {/* Successful Imports */}
            {results.successful.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Successfully Imported</span>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {results.successful.map((item, index) => (
                    <div key={index} className="text-sm text-green-700">
                      Row {item.row}: {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Failed Imports */}
            {results.failed.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Failed to Import</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {results.failed.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-red-700">Row {item.row}:</div>
                      <div className="text-red-600 ml-2">{item.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVImport;
