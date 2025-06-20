import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    soundEffects: true,
    backgroundMusic: false,
    animations: true,
    notifications: true,
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('companionSettings', JSON.stringify(settings));
    onOpenChange(false);
  };

  const handleReset = () => {
    if (confirm('すべてのデータをリセットしますか？この操作は取り消せません。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="japanese-heading">設定</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Sound Settings */}
          <div>
            <h4 className="font-medium text-deep mb-3 japanese-text">音声設定</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects" className="japanese-text">効果音</Label>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={() => handleSettingChange('soundEffects')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="background-music" className="japanese-text">BGM</Label>
                <Switch
                  id="background-music"
                  checked={settings.backgroundMusic}
                  onCheckedChange={() => handleSettingChange('backgroundMusic')}
                />
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h4 className="font-medium text-deep mb-3 japanese-text">表示設定</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="japanese-text">アニメーション</Label>
                <Switch
                  id="animations"
                  checked={settings.animations}
                  onCheckedChange={() => handleSettingChange('animations')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="japanese-text">通知</Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={() => handleSettingChange('notifications')}
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h4 className="font-medium text-deep mb-3 japanese-text">データ管理</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start japanese-text"
                onClick={() => {
                  const data = localStorage.getItem('companionGame');
                  if (data) {
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'companion-save.json';
                    a.click();
                  }
                }}
              >
                すべてのデータをエクスポート
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive japanese-text"
                onClick={handleReset}
              >
                データをリセット
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button 
            onClick={handleSave}
            className="w-full bg-primary text-white hover:bg-primary/80 japanese-text"
          >
            設定を保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
