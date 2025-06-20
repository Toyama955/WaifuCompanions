import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Upload, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import type { GameState } from "@shared/schema";

interface SaveLoadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'save' | 'load';
}

export default function SaveLoadModal({ open, onOpenChange, mode }: SaveLoadModalProps) {
  const [newSaveName, setNewSaveName] = useState("");
  const queryClient = useQueryClient();

  const { data: gameStates } = useQuery<GameState[]>({
    queryKey: ['/api/game-states?userId=default-user'],
    enabled: open
  });

  const createGameStateMutation = useMutation({
    mutationFn: async (data: { name: string; data: any }) => {
      return apiRequest('POST', '/api/game-states', {
        userId: 'default-user',
        name: data.name,
        data: data.data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game-states'] });
      setNewSaveName("");
    }
  });

  const deleteGameStateMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/game-states/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game-states'] });
    }
  });

  const handleSave = () => {
    if (!newSaveName.trim()) return;

    // Collect current game state
    const gameData = {
      characters: {}, // Would collect current character states
      conversations: {}, // Would collect current conversations
      settings: JSON.parse(localStorage.getItem('companionSettings') || '{}'),
      timestamp: new Date().toISOString()
    };

    createGameStateMutation.mutate({
      name: newSaveName,
      data: gameData
    });
  };

  const handleLoad = (gameState: GameState) => {
    // Load game state
    console.log('Loading game state:', gameState);
    // Would implement actual loading logic here
    onOpenChange(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('このセーブデータを削除しますか？')) {
      deleteGameStateMutation.mutate(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="japanese-heading">
            {mode === 'save' ? 'ゲームを保存' : 'ゲームを読込'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Save slots */}
          {gameStates?.map((gameState) => (
            <Card key={gameState.id} className="border border-gray-200 hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-deep japanese-text">{gameState.name}</h4>
                    <p className="text-sm text-gray-600 japanese-text">
                      {new Date(gameState.createdAt!).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mode === 'load' ? (
                      <Button
                        size="sm"
                        onClick={() => handleLoad(gameState)}
                        className="bg-primary text-white hover:bg-primary/80"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        読込
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(gameState.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* New save slot */}
          {mode === 'save' && (
            <Card className="border border-dashed border-gray-300 hover:border-primary transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newSaveName}
                      onChange={(e) => setNewSaveName(e.target.value)}
                      placeholder="セーブ名を入力..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary japanese-text"
                    />
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={!newSaveName.trim() || createGameStateMutation.isPending}
                    className="bg-primary text-white hover:bg-primary/80"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {gameStates?.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <Save className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="japanese-text">セーブデータがありません</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
          <Button
            variant="outline"
            className="flex-1 japanese-text"
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          {mode === 'save' && (
            <Button className="flex-1 bg-secondary text-white hover:bg-secondary/80 japanese-text">
              オートセーブ設定
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
