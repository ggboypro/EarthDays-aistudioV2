export interface ThemePalette {
  id: string;
  name: string;
  primary: string;       // 主色 (e.g. #4A6B6C Ocean slate, #654E3C Warm wood)
  secondary: string;     // 辅助色 (e.g. #7E9798, #9A806E)
  paper: string;         // 纸张色 (e.g. #FDFBF7 Warm white, #F7F3EB Cream)
  paperBorder: string;   // 纸张微边框 (e.g. #EFE8DC)
  ink: string;           // 墨水主色 (e.g. #2C2520 Dark charcoal ink)
  inkMuted: string;      // 墨水淡色/次级字色 (e.g. #6F665C)
  accent: string;        // 强调色 (e.g. #A65B44 Rust/Wax, #C27D38 Ochre)
  shadowColor: string;   // 阴影着色 (e.g. rgba(35, 28, 20, 0.12))
  canvasBg: string;      // 外层环境桌布背景色 (e.g. #EAE3D7)
}
