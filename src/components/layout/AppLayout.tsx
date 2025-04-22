
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft, FileCheck, Upload, Shield, Calendar, File } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import SettingsDrawer from '../settings/SettingsDrawer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { filingType, complianceScore } = useAppContext();
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: 'Document Wizard',
      icon: File,
      url: '/wizard',
    },
    {
      title: 'Generated Docs',
      icon: FileCheck,
      url: '/documents',
    },
    {
      title: 'Uploads',
      icon: Upload,
      url: '/uploads',
    },
    {
      title: 'Compliance',
      icon: Shield,
      url: '/compliance',
    },
    {
      title: 'Filing Prep',
      icon: Calendar,
      url: '/filing',
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {filingType && (
          <Sidebar>
            <SidebarHeader className="flex flex-col items-center justify-center p-4">
              <div className="flex w-full justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">IntelliFile</h1>
                <SettingsDrawer />
              </div>
              <Badge className="mt-2" variant={filingType === 'patent' ? 'default' : 'secondary'}>
                {filingType === 'patent' ? 'Patent' : 'Trademark'} Filing
              </Badge>
              <div className="w-full mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Filing Readiness</span>
                  <span>{complianceScore}%</span>
                </div>
                <Progress value={complianceScore} className="h-2 w-full" />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        )}
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            {filingType && (
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
            )}
            {!filingType ? (
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  {children}
                </div>
              </div>
            ) : (
              <>
                <SidebarTrigger className="mb-4 md:hidden" />
                {children}
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

