import { PhotoAsset } from './photo';

export interface Memory {
  id: string;
  ledgerId?: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  diaryIds: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export type BookPageLayoutType = 
  | 'L01_single_hero'        // 单张大图
  | 'L02_hero_with_title'    // 大图 + 标题
  | 'L03_two_photos'         // 两张照片
  | 'L04_three_photos'       // 三张照片
  | 'L05_four_photos'        // 四张照片
  | 'L06_photo_with_story'   // 照片 + 长文字
  | 'L07_date_journal'       // 日期手记
  | 'L08_chapter_opener'     // 章节首页
  | 'L09_quote_whitespace'   // 引语 / 留白
  | 'L10_photo_collage';     // 多图拼贴

export interface BookPageSlot {
  id: string;
  pageNumber: number;
  layout: BookPageLayoutType;
  chapterTitle?: string;
  diaryDate?: string;
  title?: string;
  bodyText?: string;
  quote?: string;
  photos: PhotoAsset[];
  caption?: string;
}

export interface BookChapter {
  id: string;
  title: string;
  subtitle?: string;
  pages: BookPageSlot[];
}

export type BookStatus = 'draft' | 'saved' | 'generating' | 'ready_to_order' | 'ordered' | 'in_production' | 'shipped';

export interface BookDraft {
  id: string;
  memoryId?: string;
  title: string;
  subtitle: string;
  authorName: string;
  coverImage: string;
  coverColor: string;
  spineText: string;
  paperType: 'matte_art_157g' | 'classic_warm_cream_140g' | 'fine_grain_offset_160g';
  bookStyle: 'editorial' | 'minimal' | 'story' | 'visual';
  chapters: BookChapter[];
  totalPageCount: number;
  status: BookStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
}
