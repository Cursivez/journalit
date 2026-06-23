

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
  const [state, setState] = useState<ServiceHookResult<GetServiceType<K>>>(
    () => ({
      service: null,
      status: 'loading',
      error: null,
    })
  );

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
            setState({
              service: serviceInstance,
              status: 'ready',
              error: null,
            });
          }
          return;
        }

        throw new Error('Service manager not available');
      } catch (err) {
        console.error(`Error loading ${serviceName}:`, err);
        if (mounted) {
          setState({
            service: null,
            status: 'error',
            error:
              err instanceof Error
                ? err
                : new Error(`Failed to load ${serviceName}`),
          });
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

  return state;
}


export function useAccountPageService() {
  return useService('accountPageService');
}
