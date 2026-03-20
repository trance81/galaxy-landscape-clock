// 설정 모달 컴포넌트
// 레이아웃 설정을 변경할 수 있는 모달 팝업입니다.

import React from 'react';
import { Settings, X } from 'lucide-react';
import { DeviceLayoutSettings } from '../types';
import { getDeviceType } from '../utils/device';
import { defaultLayoutSettings, saveLayoutSettings } from '../utils/layoutSettings';

// 버전 정보
const VERSION = '0.1';

/**
 * SettingsModal Props 타입 정의
 */
interface SettingsModalProps {
  /** 모달이 열려있는지 여부 */
  isOpen: boolean;
  /** 모달을 닫는 함수 */
  onClose: () => void;
  /** 현재 레이아웃 설정 */
  layoutSettings: DeviceLayoutSettings;
  /** 레이아웃 설정을 변경하는 함수 */
  onSettingsChange: (settings: DeviceLayoutSettings) => void;
}

/**
 * 설정 모달 컴포넌트
 * 사용자가 레이아웃 설정(시계 크기, 날씨 영역 크기 등)을 변경할 수 있는 모달입니다.
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  layoutSettings,
  onSettingsChange
}) => {
  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 현재 디바이스 타입 가져오기
  const currentDeviceType = getDeviceType();
  
  // 디바이스 타입별 한글 이름 매핑
  const deviceName = { 
    mobile: '모바일', 
    tablet: '태블릿', 
    desktop: '데스크탑' 
  }[currentDeviceType];
  
  // 현재 디바이스의 설정 가져오기
  const settings = layoutSettings[currentDeviceType];

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 md:p-4"
      onClick={(e) => {
        // 배경 클릭 시 모달 닫기
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 모달 내용: 배경 클릭과 구분하기 위해 stopPropagation 사용 */}
      {/* 모바일 대응: w-full로 전체 너비 사용, max-w-2xl은 데스크탑에서만 적용 */}
      <div 
        className="bg-[#0d0d0d] rounded-[2rem] border border-white/10 p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            레이아웃 설정
          </h2>
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 현재 디바이스 타입 설정 */}
        <div className="mb-6">
          {/* 현재 디바이스 타입 제목 */}
          <h3 className="text-sm font-semibold text-gray-300 mb-4">{deviceName} 설정</h3>

          {/* 시계 영역 크기 조절 */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">시계 영역 크기: {settings.clock}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.clock}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                const updated = {
                  ...layoutSettings,
                  [currentDeviceType]: { ...layoutSettings[currentDeviceType], clock: newValue }
                };
                saveLayoutSettings(updated); // 로컬 스토리지에 저장
                onSettingsChange(updated);   // 상태 업데이트
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* 시계 폰트 크기 조절 */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">시계 폰트 크기: {settings.clockFontSize}rem</label>
            <input
              type="range"
              min="3"
              max="20"
              step="0.5"
              value={settings.clockFontSize}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                const updated = {
                  ...layoutSettings,
                  [currentDeviceType]: { ...layoutSettings[currentDeviceType], clockFontSize: newValue }
                };
                saveLayoutSettings(updated);
                onSettingsChange(updated);
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* 날씨 영역 크기 조절 */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">날씨 영역 크기: {settings.weather}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.weather}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                const updated = {
                  ...layoutSettings,
                  [currentDeviceType]: { ...layoutSettings[currentDeviceType], weather: newValue }
                };
                saveLayoutSettings(updated);
                onSettingsChange(updated);
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* 달력 영역 너비 조절 */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">달력 영역 너비: {settings.calendar}%</label>
            <input
              type="range"
              min="20"
              max="60"
              value={settings.calendar}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                const updated = {
                  ...layoutSettings,
                  [currentDeviceType]: { ...layoutSettings[currentDeviceType], calendar: newValue }
                };
                saveLayoutSettings(updated);
                onSettingsChange(updated);
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* 기본값으로 복원 버튼 (현재 디바이스만) */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <button
            onClick={() => {
              const updated = {
                ...layoutSettings,
                [currentDeviceType]: defaultLayoutSettings[currentDeviceType]
              };
              saveLayoutSettings(updated);
              onSettingsChange(updated);
            }}
            className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
          >
            기본값으로 복원
          </button>
        </div>

        {/* 버전 표시: 설정 팝업 하단에 표시 */}
        <div className="mt-4 pt-3 border-t border-white/5 text-center">
          <span className="text-[10px] text-gray-500 font-medium" style={{ color: '#cfcfcf' }}>Version {VERSION}</span>
        </div>
      </div>
    </div>
  );
};
