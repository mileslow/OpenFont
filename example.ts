import Font from './src/index';

// Example 1: Load from URL (in browser/React)
async function analyzeFromUrl() {
  const font = new Font('https://example.com/path/to/font.ttf');
  
  const info = await font.info();
  console.log('Font Info:', info);
  // {
  //   familyName: "Roboto",
  //   styleName: "Bold Italic",
  //   weight: "Bold" or 700,
  //   isItalic: true,
  //   isBold: true,
  //   fullName: "Roboto Bold Italic",
  //   ...
  // }

  const weight = await font.getWeight();
  console.log('Weight:', weight); // 700 or "Bold"

  const isItalic = await font.isItalic();
  console.log('Is Italic:', isItalic); // true

  const isBold = await font.isBold();
  console.log('Is Bold:', isBold); // true
}

// Example 2: Load from ArrayBuffer (e.g., from file upload)
async function analyzeFromFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const font = new Font(arrayBuffer);
  
  const info = await font.info();
  console.log('Font Info:', info);
}

// Example 3: React component usage
/*
import React, { useState } from 'react';
import Font from 'openfont';

function FontAnalyzer() {
  const [fontInfo, setFontInfo] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const font = new Font(arrayBuffer);
      const info = await font.info();
      setFontInfo(info);
    }
  };

  const analyzeRemoteFont = async () => {
    const font = new Font('https://example.com/font.ttf');
    const info = await font.info();
    setFontInfo(info);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".ttf,.otf,.woff,.woff2" />
      <button onClick={analyzeRemoteFont}>Analyze Remote Font</button>
      
      {fontInfo && (
        <div>
          <h3>Font Information</h3>
          <p>Family: {fontInfo.familyName}</p>
          <p>Weight: {fontInfo.weight}</p>
          <p>Italic: {fontInfo.isItalic ? 'Yes' : 'No'}</p>
          <p>Bold: {fontInfo.isBold ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}
*/

export { analyzeFromUrl, analyzeFromFile };
