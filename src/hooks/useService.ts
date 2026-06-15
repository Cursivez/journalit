

import { useState, useEffect } from 'react';
import { usePlugin } from './usePlugin';
import { ServiceName, GetServiceType } from '../types/ServiceRegistry';


type ServiceStatus = 'loading' | 'error' | 'ready';


interface ServiceHookResult<T> {
  service: T | null;
  status: ServiceStatus;
  error: Error | null;
}


export function useService<K extends ServiceName>(
  serviceName: K
): ServiceHookResult<GetServiceType<K>> {
  const plugin = usePlugin();
  const [status, setStatus] = useState<ServiceStatus>('loading');
  const [service, setService] = useState<GetServiceType<K> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: number | null = null;

    const loadService = async () => {
      if (!plugin) {
        
        timeoutId = window.setTimeout(() => void loadService(), 100);
        return;
      }

      try {
        
        if (plugin.serviceManager) {
          const serviceInstance =
            await plugin.serviceManager.getServiceByName(serviceName);

          if (mounted) {
            setService(serviceInstance);
            setStatus('ready');
            setError(null);
          }
          return;
        }

        throw new Error('Service manager not available');
      } catch (err) {
        console.error(`Error loading ${serviceName}:`, err);
        if (mounted) {
          setService(null);
          setStatus('error');
          setError(
            err instanceof Error
              ? err
              : new Error(`Failed to load ${serviceName}`)
          );
        }
      }
    };

    void loadService();

    return () => {
      mounted = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [plugin, serviceName]);

  return { service, status, error };
}


export function useAccountPageService() {
  return useService('accountPageService');
}
