# OpenFont

A lightweight, TypeScript-based library for extracting detailed information from font files in the browser and Node.js.

[![npm version](https://img.shields.io/npm/v/openfont.svg)](https://www.npmjs.com/package/openfont)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔍 Extract comprehensive font metadata (weight, style, family name, etc.)
- 🌐 Load fonts from URLs or ArrayBuffer
- ⚡ Async/await API for seamless integration
- 📦 Works in both browser and Node.js environments
- 💪 Full TypeScript support with type definitions
- 🎨 Perfect for font management tools, design systems, and typography applications

## Installation

```bash
npm install openfont
```

## Quick Start

### Load from URL

```typescript
import Font from 'openfont';

const font = new Font('https://example.com/path/to/font.ttf');
const info = await font.info();

console.log(info);
// {
//   familyName: "Roboto",
//   styleName: "Bold Italic",
//   weight: "Bold",
//   isItalic: true,
//   isBold: true,
//   fullName: "Roboto Bold Italic",
//   postScriptName: "Roboto-BoldItalic",
//   version: "Version 2.137",
//   ...
// }
```

### Load from File Upload

```typescript
import Font from 'openfont';

async function handleFileUpload(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const font = new Font(arrayBuffer);
  
  const weight = await font.getWeight();
  const isItalic = await font.isItalic();
  
  console.log(`Weight: ${weight}, Italic: ${isItalic}`);
}
```

## API Reference

### Constructor

#### `new Font(fontSource: string | ArrayBuffer)`

Creates a new Font instance.

- **fontSource**: Either a URL string pointing to a font file, or an ArrayBuffer containing font data

```typescript
// From URL
const font1 = new Font('https://fonts.example.com/myfont.ttf');

// From ArrayBuffer
const buffer = await fetch('/font.ttf').then(r => r.arrayBuffer());
const font2 = new Font(buffer);
```

### Methods

#### `info(): Promise<FontInfo>`

Returns comprehensive information about the font.

```typescript
const info = await font.info();
```

**Returns:**
```typescript
{
  familyName: string;        // e.g., "Roboto"
  styleName: string;         // e.g., "Bold Italic"
  weight: number | string;   // e.g., 700 or "Bold"
  isItalic: boolean;
  isBold: boolean;
  fullName: string;          // e.g., "Roboto Bold Italic"
  postScriptName: string;    // e.g., "Roboto-BoldItalic"
  version: string;
  copyright: string;
  trademark: string;
  manufacturer: string;
  designer: string;
  description: string;
  unitsPerEm: number;
  ascender: number;
  descender: number;
}
```

#### `getWeight(): Promise<number | string>`

Returns the font weight. Returns a number (100-900) or a string name (e.g., "Bold", "Light").

```typescript
const weight = await font.getWeight(); // 700 or "Bold"
```

#### `isItalic(): Promise<boolean>`

Checks if the font is italic or oblique.

```typescript
const italic = await font.isItalic(); // true or false
```

#### `isBold(): Promise<boolean>`

Checks if the font is bold (weight >= 700).

```typescript
const bold = await font.isBold(); // true or false
```

#### `getFamilyName(): Promise<string>`

Returns the font family name.

```typescript
const family = await font.getFamilyName(); // "Roboto"
```

#### `getStyleName(): Promise<string>`

Returns the font style name.

```typescript
const style = await font.getStyleName(); // "Bold Italic"
```

#### `getFullName(): Promise<string>`

Returns the full font name.

```typescript
const fullName = await font.getFullName(); // "Roboto Bold Italic"
```

#### `getPostScriptName(): Promise<string>`

Returns the PostScript name.

```typescript
const psName = await font.getPostScriptName(); // "Roboto-BoldItalic"
```

#### `getVersion(): Promise<string>`

Returns the font version string.

```typescript
const version = await font.getVersion(); // "Version 2.137"
```

#### `getCopyright(): Promise<string>`

Returns the copyright notice.

```typescript
const copyright = await font.getCopyright();
```

#### `getDesigner(): Promise<string>`

Returns the font designer's name.

```typescript
const designer = await font.getDesigner();
```

#### `getRawFont(): opentype.Font | null`

Returns the underlying opentype.js Font object for advanced use cases.

```typescript
const opentypeFont = font.getRawFont();
```

## React Example

```typescript
import React, { useState } from 'react';
import Font from 'openfont';

function FontAnalyzer() {
  const [fontInfo, setFontInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const font = new Font(arrayBuffer);
      const info = await font.info();
      setFontInfo(info);
    } catch (error) {
      console.error('Failed to analyze font:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWebFont = async () => {
    setLoading(true);
    try {
      const font = new Font('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2');
      const info = await font.info();
      setFontInfo(info);
    } catch (error) {
      console.error('Failed to analyze font:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Font Analyzer</h1>
      
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".ttf,.otf,.woff,.woff2"
        disabled={loading}
      />
      
      <button onClick={analyzeWebFont} disabled={loading}>
        Analyze Web Font
      </button>

      {loading && <p>Loading...</p>}

      {fontInfo && (
        <div>
          <h2>Font Information</h2>
          <table>
            <tbody>
              <tr>
                <td><strong>Family:</strong></td>
                <td>{fontInfo.familyName}</td>
              </tr>
              <tr>
                <td><strong>Style:</strong></td>
                <td>{fontInfo.styleName}</td>
              </tr>
              <tr>
                <td><strong>Weight:</strong></td>
                <td>{fontInfo.weight}</td>
              </tr>
              <tr>
                <td><strong>Italic:</strong></td>
                <td>{fontInfo.isItalic ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td><strong>Bold:</strong></td>
                <td>{fontInfo.isBold ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td><strong>Designer:</strong></td>
                <td>{fontInfo.designer}</td>
              </tr>
              <tr>
                <td><strong>Version:</strong></td>
                <td>{fontInfo.version}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FontAnalyzer;
```

## Node.js Example

```typescript
import Font from 'openfont';
import fs from 'fs/promises';

async function analyzeFontFile(filePath: string) {
  const buffer = await fs.readFile(filePath);
  const font = new Font(buffer.buffer);
  
  const info = await font.info();
  console.log('Font Family:', info.familyName);
  console.log('Weight:', info.weight);
  console.log('Is Italic:', info.isItalic);
  console.log('Designer:', info.designer);
}

analyzeFontFile('./fonts/MyFont.ttf');
```

## Supported Font Formats

- TrueType (.ttf)
- OpenType (.otf)
- WOFF (.woff)
- WOFF2 (.woff2)

## Browser Compatibility

OpenFont works in all modern browsers that support ES2020 and the Fetch API:

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

## TypeScript Support

OpenFont is written in TypeScript and includes full type definitions out of the box. No need for `@types` packages.

```typescript
import Font, { FontInfo } from 'openfont';

const font = new Font('path/to/font.ttf');
const info: FontInfo = await font.info();
```

## Error Handling

All async methods can throw errors. Wrap them in try-catch blocks:

```typescript
try {
  const font = new Font('https://example.com/font.ttf');
  const info = await font.info();
} catch (error) {
  console.error('Failed to load or parse font:', error);
}
```

## Use Cases

- **Design Systems**: Automatically catalog and validate fonts in your design system
- **Font Managers**: Build font browsing and management applications
- **Typography Tools**: Create tools for font analysis and comparison
- **Web Font Optimization**: Analyze web fonts to optimize loading strategies
- **Font Validation**: Verify font files meet specific requirements
- **Documentation**: Auto-generate font specimen sheets

## How It Works

OpenFont is built on top of [opentype.js](https://github.com/opentypejs/opentype.js), a powerful font parser. It provides a simplified, promise-based API for common font analysis tasks.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Miles Low](https://github.com/mileslow)

## Links

- [GitHub Repository](https://github.com/mileslow/OpenFont)
- [npm Package](https://www.npmjs.com/package/openfont)
- [Report Issues](https://github.com/mileslow/OpenFont/issues)

## Acknowledgments

Built with [opentype.js](https://github.com/opentypejs/opentype.js) - a powerful JavaScript parser and writer for TrueType and OpenType fonts.
