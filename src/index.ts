import opentype from 'opentype.js';

export interface FontInfo {
  familyName: string;
  styleName: string;
  weight: number | string;
  isItalic: boolean;
  isBold: boolean;
  fullName: string;
  postScriptName: string;
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

export class Font {
  private font: opentype.Font | null = null;
  private loadPromise: Promise<void> | null = null;

  constructor(fontSource: string | ArrayBuffer) {
    if (typeof fontSource === 'string') {
      this.loadPromise = this.loadFromUrl(fontSource);
    } else {
      this.loadFromBuffer(fontSource);
    }
  }

  private async loadFromUrl(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      opentype.load(url, (err, font) => {
        if (err) {
          reject(new Error(`Failed to load font: ${err.message}`));
        } else if (font) {
          this.font = font;
          resolve();
        } else {
          reject(new Error('Failed to load font: Unknown error'));
        }
      });
    });
  }

  private loadFromBuffer(buffer: ArrayBuffer): void {
    this.font = opentype.parse(buffer);
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loadPromise) {
      await this.loadPromise;
    }
    if (!this.font) {
      throw new Error('Font not loaded');
    }
  }

  private getNameEntry(nameId: number): string {
    if (!this.font) return '';
    const names = this.font.names;
    const nameRecord = (names as unknown as Record<string, { en?: string }>)[nameId.toString()];
    return nameRecord?.en || '';
  }

  async info(): Promise<FontInfo> {
    await this.ensureLoaded();
    
    if (!this.font) {
      throw new Error('Font not loaded');
    }

    const weight = await this.getWeight();
    const isItalic = await this.isItalic();

    return {
      familyName: this.getNameEntry(1) || '',
      styleName: this.getNameEntry(2) || '',
      weight,
      isItalic,
      isBold: await this.isBold(),
      fullName: this.getNameEntry(4) || '',
      postScriptName: this.getNameEntry(6) || '',
      version: this.getNameEntry(5) || '',
      copyright: this.getNameEntry(0) || '',
      trademark: this.getNameEntry(7) || '',
      manufacturer: this.getNameEntry(8) || '',
      designer: this.getNameEntry(9) || '',
      description: this.getNameEntry(10) || '',
      unitsPerEm: this.font.unitsPerEm,
      ascender: this.font.ascender,
      descender: this.font.descender
    };
  }

  async getWeight(): Promise<number | string> {
    await this.ensureLoaded();
    
    if (!this.font) {
      throw new Error('Font not loaded');
    }

    const os2Table = this.font.tables.os2;
    if (os2Table && 'usWeightClass' in os2Table) {
      const weightValue = os2Table.usWeightClass as number;
      
      const weightNames: Record<number, string> = {
        100: 'Thin',
        200: 'Extra Light',
        300: 'Light',
        400: 'Normal',
        500: 'Medium',
        600: 'Semi Bold',
        700: 'Bold',
        800: 'Extra Bold',
        900: 'Black'
      };
      
      return weightNames[weightValue] || weightValue;
    }

    const styleName = this.getNameEntry(2).toLowerCase();
    if (styleName.includes('bold')) return 700;
    if (styleName.includes('light')) return 300;
    if (styleName.includes('black')) return 900;
    
    return 400;
  }

  async isItalic(): Promise<boolean> {
    await this.ensureLoaded();
    
    if (!this.font) {
      throw new Error('Font not loaded');
    }

    const post = this.font.tables.post;
    if (post && 'italicAngle' in post) {
      const angle = post.italicAngle as number;
      if (angle !== 0) return true;
    }

    const os2Table = this.font.tables.os2;
    if (os2Table && 'fsSelection' in os2Table) {
      const fsSelection = os2Table.fsSelection as number;
      if (fsSelection & 0x01) return true;
    }

    const styleName = this.getNameEntry(2).toLowerCase();
    return styleName.includes('italic') || styleName.includes('oblique');
  }

  async isBold(): Promise<boolean> {
    await this.ensureLoaded();
    
    const weight = await this.getWeight();
    const weightValue = typeof weight === 'number' ? weight : 400;
    
    return weightValue >= 700;
  }

  async getFamilyName(): Promise<string> {
    await this.ensureLoaded();
    return this.getNameEntry(1);
  }

  async getStyleName(): Promise<string> {
    await this.ensureLoaded();
    return this.getNameEntry(2);
  }

  async getFullName(): Promise<string> {
    await this.ensureLoaded();
    return this.getNameEntry(4);
  }

  async getPostScriptName(): Promise<string> {
    await this.ensureLoaded();
    return this.getNameEntry(6);
  }

  async getVersion(): Promise<string> {
    await this.ensureLoaded();
    return this.getNameEntry(5);
  }

  async getCopyright(): Promise<string> {
    await this.ensureLoaded();
    return this.getNameEntry(0);
  }

  async getDesigner(): Promise<string> {
    await this.ensureLoaded();
    return this.getNameEntry(9);
  }

  getRawFont(): opentype.Font | null {
    return this.font;
  }
}

export default Font;
