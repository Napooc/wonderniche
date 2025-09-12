import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Users, 
  Activity,
  Search,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user_id: string | null;
}

interface SecuritySetting {
  id: string;
  setting_name: string;
  setting_value: any;
  updated_at: string;
}

interface RateLimit {
  id: string;
  identifier: string;
  action: string;
  count: number;
  window_start: string;
  created_at: string;
}

export default function SecurityDashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch audit logs
      const { data: auditData, error: auditError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (auditError) throw auditError;

      // Fetch security settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('security_settings')
        .select('*')
        .order('setting_name');

      if (settingsError) throw settingsError;

      // Fetch recent rate limits
      const { data: rateLimitData, error: rateLimitError } = await supabase
        .from('rate_limits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (rateLimitError) throw rateLimitError;

      setAuditLogs((auditData || []).map(log => ({
        ...log,
        ip_address: typeof log.ip_address === 'string' ? log.ip_address : null,
        user_agent: typeof log.user_agent === 'string' ? log.user_agent : null
      })));
      setSecuritySettings(settingsData || []);
      setRateLimits(rateLimitData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load security data: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSecuritySetting = async (settingName: string, newValue: any) => {
    try {
      const { error } = await supabase
        .from('security_settings')
        .update({ 
          setting_value: JSON.stringify(newValue),
          updated_at: new Date().toISOString()
        })
        .eq('setting_name', settingName);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${settingName} updated successfully`
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update setting: " + error.message,
        variant: "destructive"
      });
    }
  };

  const cleanupRateLimits = async () => {
    try {
      await supabase.rpc('cleanup_rate_limits');
      
      toast({
        title: "Success",
        description: "Rate limits cleaned up successfully"
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cleanup rate limits: " + error.message,
        variant: "destructive"
      });
    }
  };

  const filteredAuditLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip_address?.includes(searchTerm)
  );

  const getActionBadgeColor = (action: string) => {
    if (action.includes('failed') || action.includes('error') || action.includes('deleted')) {
      return 'destructive';
    }
    if (action.includes('created') || action.includes('login')) {
      return 'default';
    }
    if (action.includes('updated')) {
      return 'secondary';
    }
    return 'outline';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audit Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {auditLogs.filter(log => 
                log.action.includes('login_failed') && 
                new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate Limits</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rateLimits.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users (24h)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(auditLogs
                .filter(log => new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000))
                .map(log => log.user_id)
                .filter(Boolean)
              ).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit-logs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="security-settings">Security Settings</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search logs by action, resource, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card className="glass-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? `No logs found matching "${searchTerm}"` : 'No audit logs found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAuditLogs.slice(0, 50).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.resource_type && (
                          <div>
                            <div className="font-medium">{log.resource_type}</div>
                            {log.resource_id && (
                              <div className="text-muted-foreground text-xs">
                                {log.resource_id.substring(0, 8)}...
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{log.ip_address || 'Unknown'}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {log.new_values && typeof log.new_values === 'object' && (
                          <div className="text-muted-foreground">
                            {Object.keys(log.new_values).join(', ')}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="security-settings" className="space-y-4">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Security Configuration</h3>
            <div className="space-y-4">
              {securitySettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{setting.setting_name.replace(/_/g, ' ').toUpperCase()}</h4>
                    <p className="text-sm text-muted-foreground">
                      Current value: {JSON.parse(setting.setting_value)}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newValue = prompt(`Enter new value for ${setting.setting_name}:`, JSON.parse(setting.setting_value));
                      if (newValue !== null) {
                        updateSecuritySetting(setting.setting_name, newValue);
                      }
                    }}
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rate-limits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Rate Limits</h3>
            <Button onClick={cleanupRateLimits} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Cleanup Old Limits
            </Button>
          </div>

          <Card className="glass-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Window Start</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateLimits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No active rate limits
                    </TableCell>
                  </TableRow>
                ) : (
                  rateLimits.map((limit) => (
                    <TableRow key={limit.id}>
                      <TableCell className="font-mono text-sm">{limit.identifier}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{limit.action}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{limit.count}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(limit.window_start), 'MMM dd, HH:mm')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(limit.created_at), 'MMM dd, HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}