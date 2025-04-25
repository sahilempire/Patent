
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft, FileCheck, Upload, Shield, Calendar, File, ChevronRight } from 'lucide-react';
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
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Document Wizard',
      icon: File,
      url: '/wizard',
      description: 'Create your filing application',
    },
    {
      title: 'Generated Docs',
      icon: FileCheck,
      url: '/documents',
      description: 'Review and download documents',
    },
    {
      title: 'Uploads',
      icon: Upload,
      url: '/uploads',
      description: 'Upload supporting materials',
    },
    {
      title: 'Compliance',
      icon: Shield,
      url: '/compliance',
      description: 'Check filing compliance',
    },
    {
      title: 'Filing Prep',
      icon: Calendar,
      url: '/filing',
      description: 'Prepare for final submission',
    },
  ];

  // Find the current step index
  const currentIndex = navigationItems.findIndex(item => item.url === location.pathname);
  const nextItem = currentIndex < navigationItems.length - 1 ? navigationItems[currentIndex + 1] : null;

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
                <SidebarGroupLabel>Filing Process</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item, index) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link 
                            to={item.url} 
                            className={`flex items-center gap-2 ${location.pathname === item.url ? 'text-primary font-medium' : ''}`}
                          >
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex flex-col">
                              <span>{item.title}</span>
                              <span className="text-xs text-muted-foreground">{item.description}</span>
                            </div>
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
            {filingType && currentIndex !== -1 && (
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <div className="flex items-center mb-6">
                  {navigationItems.map((item, index) => (
                    <React.Fragment key={item.title}>
                      <Link to={item.url} className={`text-sm ${location.pathname === item.url ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {item.title}
                      </Link>
                      {index < navigationItems.length - 1 && (
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
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
                
                {nextItem && currentIndex !== navigationItems.length - 1 && (
                  <div className="mt-8 flex justify-end">
                    <Button onClick={() => navigate(nextItem.url)}>
                      Continue to {nextItem.title} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
