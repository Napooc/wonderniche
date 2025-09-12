import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityMetrics {
  failedLogins: number;
  suspiciousActivities: number;
  rateLimitHits: number;
  activeUsers: number;
  lastUpdated: Date;
}

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export function useSecurityMonitoring() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failedLogins: 0,
    suspiciousActivities: 0,
    rateLimitHits: 0,
    activeUsers: 0,
    lastUpdated: new Date()
  });

  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSecurityMetrics = async () => {
    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Fetch failed login attempts
      const { data: failedLogins } = await supabase
        .from('audit_logs')
        .select('id')
        .eq('action', 'login_failed')
        .gte('created_at', twentyFourHoursAgo.toISOString());

      // Fetch suspicious activities (multiple failed attempts from same IP)
      const { data: suspiciousLogs } = await supabase
        .from('audit_logs')
        .select('ip_address')
        .in('action', ['login_failed', 'signup_failed'])
        .gte('created_at', twentyFourHoursAgo.toISOString());

      // Count unique IPs with multiple failures
      const ipCounts = suspiciousLogs?.reduce((acc: Record<string, number>, log) => {
        const ip = typeof log.ip_address === 'string' ? log.ip_address : null;
        if (ip) {
          acc[ip] = (acc[ip] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const suspiciousActivities = Object.values(ipCounts).filter(count => count >= 3).length;

      // Fetch rate limit hits
      const { data: rateLimits } = await supabase
        .from('rate_limits')
        .select('id')
        .gte('created_at', twentyFourHoursAgo.toISOString());

      // Fetch unique active users
      const { data: activeUsersData } = await supabase
        .from('audit_logs')
        .select('user_id')
        .not('user_id', 'is', null)
        .gte('created_at', twentyFourHoursAgo.toISOString());

      const uniqueUsers = new Set(activeUsersData?.map(log => log.user_id) || []).size;

      setMetrics({
        failedLogins: failedLogins?.length || 0,
        suspiciousActivities,
        rateLimitHits: rateLimits?.length || 0,
        activeUsers: uniqueUsers,
        lastUpdated: new Date()
      });

      // Generate alerts based on thresholds
      generateSecurityAlerts(failedLogins?.length || 0, suspiciousActivities, rateLimits?.length || 0);

    } catch (error) {
      console.error('Failed to fetch security metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSecurityAlerts = (failedLogins: number, suspicious: number, rateLimitHits: number) => {
    const newAlerts: SecurityAlert[] = [];

    if (failedLogins > 50) {
      newAlerts.push({
        id: `failed_logins_${Date.now()}`,
        type: 'error',
        title: 'High Failed Login Rate',
        message: `${failedLogins} failed login attempts in the last 24 hours`,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    if (suspicious > 5) {
      newAlerts.push({
        id: `suspicious_activity_${Date.now()}`,
        type: 'warning',
        title: 'Suspicious Activity Detected',
        message: `${suspicious} IP addresses with multiple failed attempts detected`,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    if (rateLimitHits > 100) {
      newAlerts.push({
        id: `rate_limit_high_${Date.now()}`,
        type: 'warning',
        title: 'High Rate Limiting Activity',
        message: `${rateLimitHits} rate limit hits in the last 24 hours`,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Only add new alerts if they don't already exist
    const existingAlertTypes = alerts.map(alert => alert.title);
    const uniqueNewAlerts = newAlerts.filter(alert => 
      !existingAlertTypes.includes(alert.title)
    );

    if (uniqueNewAlerts.length > 0) {
      setAlerts(prev => [...prev, ...uniqueNewAlerts]);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const logSecurityEvent = async (
    action: string, 
    resourceType?: string, 
    resourceId?: string, 
    details?: any
  ) => {
    try {
      await supabase.rpc('log_audit_event', {
        p_action: action,
        p_resource_type: resourceType || null,
        p_resource_id: resourceId || null,
        p_new_values: details ? JSON.stringify(details) : null,
        p_ip_address: await getClientIP(),
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const checkForThreats = async () => {
    try {
      // Check for brute force attacks (multiple failed logins from same IP)
      const { data: recentFailures } = await supabase
        .from('audit_logs')
        .select('ip_address, created_at')
        .eq('action', 'login_failed')
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 minutes
        .order('created_at', { ascending: false });

      if (recentFailures && recentFailures.length > 0) {
        const ipCounts = recentFailures.reduce((acc: Record<string, number>, log) => {
          const ip = typeof log.ip_address === 'string' ? log.ip_address : null;
          if (ip) {
            acc[ip] = (acc[ip] || 0) + 1;
          }
          return acc;
        }, {});

        // Alert for IPs with more than 5 failed attempts in 15 minutes
        const suspiciousIPs = Object.entries(ipCounts)
          .filter(([_, count]) => count >= 5)
          .map(([ip, count]) => ({ ip, count }));

        for (const { ip, count } of suspiciousIPs) {
          await logSecurityEvent('potential_brute_force', 'security', ip, { 
            failed_attempts: count, 
            time_window: '15_minutes' 
          });
        }
      }
    } catch (error) {
      console.error('Threat detection failed:', error);
    }
  };

  useEffect(() => {
    fetchSecurityMetrics();
    
    // Set up periodic monitoring
    const metricsInterval = setInterval(fetchSecurityMetrics, 5 * 60 * 1000); // Every 5 minutes
    const threatInterval = setInterval(checkForThreats, 2 * 60 * 1000); // Every 2 minutes

    return () => {
      clearInterval(metricsInterval);
      clearInterval(threatInterval);
    };
  }, []);

  return {
    metrics,
    alerts,
    loading,
    acknowledgeAlert,
    dismissAlert,
    logSecurityEvent,
    refreshMetrics: fetchSecurityMetrics,
    checkForThreats
  };
}