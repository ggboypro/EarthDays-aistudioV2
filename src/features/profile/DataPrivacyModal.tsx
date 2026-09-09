import React, { useState } from 'react';
import { diaryRepo } from '../../core/storage/diaryRepository';
import { PaperSheet } from '../../design-system/paper/PaperSheet';
import { PaperGrainOverlay } from '../../design-system/paper/PaperGrainOverlay';
import { motion } from 'motion/react';

interface DataPrivacyModalProps {
  onClose: () => void;
}

export const DataPrivacyModal: React.FC<DataPrivacyModalProps> = ({ onClose }) => {
  const [icloudEnabled, setIcloudEnabled] = useState(diaryRepo.isIcloudEnabled());
  const [lastSyncTime, setLastSyncTime] = useState('刚刚');
  const ledgers = diaryRepo.getLedgers();
  const entries = diaryRepo.getAllEntries();
  const memories = diaryRepo.getMemories();
  const books = diaryRepo.getBooks();

  const handleToggleIcloud = () => {
    const next = !icloudEnabled;
    setIcloudEnabled(next);
    diaryRepo.setIcloudEnabled(next);
    setLastSyncTime('刚刚');
  };

  const handleExportJson = () => {
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      ledgers,
      entries,
      memories,
      books,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `我在地球的日子_全量备份_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportMarkdown = () => {
    let md = `# 我在地球的日子 · 日记全集导出\n\n导出时间: ${new Date().toLocaleString()}\n\n---\n\n`;
    entries.forEach((e) => {
      md += `## ${e.diaryDate} (${e.dayOfWeek}) ${e.title ? `- ${e.title}` : ''}\n`;
      if (e.location) md += `*地点: ${e.location.name}*\n`;
      if (e.mood) md += `*心情: ${e.mood.label}*\n`;
      md += `\n${e.body}\n\n`;
      if (e.photos && e.photos.length > 0) {
        e.photos.forEach((ph, i) => {
          md += `![照片${i + 1}](${ph.url})\n`;
        });
        md += '\n';
      }
      md += '---\n\n';
    });

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `我在地球的日子_文本手记_${new Date().toISOString().split('T')[0]}.md`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (window.confirm('确定要重置所有账本和日记数据为默认示例吗？此操作不可逆。')) {
      diaryRepo.resetToDefault();
      alert('已成功重置为初始种子数据');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-[rgba(35,29,24,0.30)] backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-[#FAF8F2] rounded-[24px] border border-[#DED6C9] shadow-[0_16px_36px_-6px_rgba(35,28,20,0.16)] p-6 font-serif-sc text-[#302820] max-h-[90vh] overflow-y-auto"
      >
        <PaperGrainOverlay />
        <div className="relative z-10">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD1] mb-4">
          <div>
            <h3 className="text-[17px] font-medium text-[#302820]">数据与隐私管理</h3>
            <p className="text-[11.5px] text-[#766C60]">
              本地优先存储 · 私人数据边界 · 随时完整导出
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF7F1] border border-[#DED6C9] text-[#766C60] hover:text-[#302820] flex items-center justify-center text-[12px] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-[13px]">
          {/* iCloud Sync Switch */}
          <div className="p-3.5 bg-[#FAF7F1] rounded-[9px] border border-[#DED6C9] flex items-center justify-between">
            <div>
              <div className="font-medium text-[#302820] flex items-center gap-1.5">
                <span>☁️ iCloud 自动同步</span>
                {icloudEnabled && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EEE7DC] text-[#302820]">
                    已连接
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#766C60] mt-0.5">
                {icloudEnabled ? `已自动加密备份 · 最近同步: ${lastSyncTime}` : '当前仅保存在本机'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleIcloud}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                icloudEnabled ? 'bg-[#B45C42]' : 'bg-[#DED6C9]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#FFF9F2] transition-transform ${
                  icloudEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Privacy Statement */}
          <div className="p-3 bg-[#FAF7F1] rounded-[9px] border border-[#E5DDD1] text-[12px] text-[#766C60] leading-relaxed">
            <span className="font-medium text-[#302820] block mb-1">
              🔒 私人数据安全准则
            </span>
            您的所有日记文本、照片与账本均存放于本地安全沙盒中。我们绝不会将您的私人日记用于大模型公共训练。仅在您主动使用「✍️ 红笔润色」时，单条段落会匿名请求文风修饰。
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <span className="text-[12px] font-medium text-[#766C60] block">
              数据备份与导出
            </span>
            <button
              type="button"
              onClick={handleExportJson}
              className="w-full py-2.5 bg-[#FAF7F1] hover:bg-[#EEE7DC] border border-[#DED6C9] rounded-[9px] text-[#302820] font-medium cursor-pointer transition-colors text-left px-3.5 flex items-center justify-between"
            >
              <span>📥 导出完整结构化备份 (JSON)</span>
              <span className="text-[11px] text-[#9A9084]">含账本/记忆/画册</span>
            </button>

            <button
              type="button"
              onClick={handleExportMarkdown}
              className="w-full py-2.5 bg-[#FAF7F1] hover:bg-[#EEE7DC] border border-[#DED6C9] rounded-[9px] text-[#302820] font-medium cursor-pointer transition-colors text-left px-3.5 flex items-center justify-between"
            >
              <span>📄 导出纯文本日记汇编 (Markdown)</span>
              <span className="text-[11px] text-[#9A9084]">通用文档格式</span>
            </button>
          </div>

          {/* Reset System Data */}
          <div className="pt-2 border-t border-[#E5DDD1]">
            <button
              type="button"
              onClick={handleResetData}
              className="w-full py-2.5 bg-[#FAF7F1] hover:bg-[#EEE7DC] border border-[#DED6C9] rounded-[9px] text-[#B45C42] text-[12px] font-medium cursor-pointer transition-colors"
            >
              🔄 恢复默认初始演示数据
            </button>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
};
