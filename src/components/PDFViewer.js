import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ onFileUpload, pdfFile, darkness, coffeeIntensity }) => {
  const [numPages, setNumPages] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Progressive coffee filter
  const sepia = (coffeeIntensity / 100) * 0.8; // up to 0.8
  const hue = -20 * (coffeeIntensity / 100); // up to -20deg
  const bright = 1 - (coffeeIntensity / 100) * 0.08; // down to 0.92
  const coffeeFilter = `sepia(${sepia}) hue-rotate(${hue}deg) brightness(${bright})`;
  const darkModeFilter = `invert(${darkness / 100}) hue-rotate(180deg)`;
  // Combine both filters
  const combinedFilter = `${darkModeFilter} ${coffeeFilter}`;

  const darkModeStyles = `
    .react-pdf__Page {
      filter: ${combinedFilter};
      transition: filter 0.2s;
    }
    .react-pdf__Page canvas {
      filter: ${combinedFilter};
      transition: filter 0.2s;
    }
  `;

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', p: 0, m: 0 }}>
      <style>{darkModeStyles}</style>
      {!pdfFile ? (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #666',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            width: '100%',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography color="text.secondary">Drop the PDF file here...</Typography>
          ) : (
            <Typography color="text.secondary">
              Drag and drop a PDF file here, or click to select a file
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ width: '100vw', height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, p: 0, m: 0 }}>
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Typography color="text.secondary">Loading PDF...</Typography>}
            error={<Typography color="error">Error loading PDF!</Typography>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                scale={1.2}
                loading={<Typography color="text.secondary">Loading page...</Typography>}
              />
            ))}
          </Document>
        </Box>
      )}
    </Box>
  );
};

export default PDFViewer; 