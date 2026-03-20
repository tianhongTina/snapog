'use client';

import { create } from 'zustand';
import type { OGParams, TemplateId } from '@/types';

interface EditorStore {
  params: OGParams;
  isGenerating: boolean;
  previewUrl: string;
  isDirty: boolean;

  setParam: <K extends keyof OGParams>(key: K, value: OGParams[K]) => void;
  setParams: (params: Partial<OGParams>) => void;
  resetParams: () => void;
  setIsGenerating: (generating: boolean) => void;
  setPreviewUrl: (url: string) => void;
  setIsDirty: (dirty: boolean) => void;
}

const DEFAULT_PARAMS: OGParams = {
  template: 'tech-dark' as TemplateId,
  title: 'Hello World',
  description: 'A beautiful Open Graph image generated with SnapOG',
  author: '',
  date: '',
  logoUrl: '',
  siteUrl: '',
  primaryColor: '#3b82f6',
  backgroundColor: '',
  textColor: '',
  backgroundImageUrl: '',
  backgroundImageMode: 'cover',
  backgroundLayer: 'image',
  badge: '',
  price: '',
  metric1Label: '',
  metric1Value: '',
  metric2Label: '',
  metric2Value: '',
  metric3Label: '',
  metric3Value: '',
  watermark: true,
};

export const useEditorStore = create<EditorStore>((set) => ({
  params: { ...DEFAULT_PARAMS },
  isGenerating: false,
  previewUrl: '',
  isDirty: false,

  setParam: (key, value) =>
    set((state) => ({
      params: { ...state.params, [key]: value },
      isDirty: true,
    })),

  setParams: (partialParams) =>
    set((state) => ({
      params: { ...state.params, ...partialParams },
      isDirty: true,
    })),

  resetParams: () =>
    set({
      params: { ...DEFAULT_PARAMS },
      isDirty: false,
    }),

  setIsGenerating: (generating) =>
    set({ isGenerating: generating }),

  setPreviewUrl: (url) =>
    set({ previewUrl: url }),

  setIsDirty: (dirty) =>
    set({ isDirty: dirty }),
}));
