import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@frontend/components/ui/tabs';
import { Button } from '@frontend/components/ui/button';
import { useAdmin } from '@frontend/hooks/useAdmin';
import AdminStateTab from './admin/AdminStateTab';
import AdminClipsTab from './admin/AdminClipsTab';
import AdminRewardsTab from './admin/AdminRewardsTab';
import AdminFeedTab from './admin/AdminFeedTab';
import AdminPredictionsTab from './admin/AdminPredictionsTab';

export default function AdminDashboardPage() {
  const { isAuthenticated, checkingAuth, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, checkingAuth, navigate]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="hud-label">Панель управления</p>
          <h1 className="section-title text-2xl">Admin Dashboard</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await logout();
            navigate('/admin');
          }}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Выйти
        </Button>
      </div>

      <Tabs defaultValue="state">
        <TabsList className="flex-wrap">
          <TabsTrigger value="state">Состояние</TabsTrigger>
          <TabsTrigger value="clips">Клипы</TabsTrigger>
          <TabsTrigger value="rewards">Награды</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="state"><AdminStateTab /></TabsContent>
        <TabsContent value="clips"><AdminClipsTab /></TabsContent>
        <TabsContent value="rewards"><AdminRewardsTab /></TabsContent>
        <TabsContent value="feed"><AdminFeedTab /></TabsContent>
        <TabsContent value="predictions"><AdminPredictionsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
