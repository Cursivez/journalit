

import { useEffect, useState, useRef, useCallback } from 'react';
import JournalitPlugin from '../main';
import { eventBus } from '../services/events/EventBus';
import { clearPluginInstance, setPluginInstance } from '../utils/pluginContext';


let globalPlugin: JournalitPlugin | null = null;


let isPluginReady = false;


const pluginReadyListeners = new Set<() => void>();


const notifyPluginReady = () => {
  isPluginReady = true;
  pluginReadyListeners.forEach((listener) => listener());
  pluginReadyListeners.clear(); 
};


export const resetPluginHookState = (): void => {
  globalPlugin = null;
  clearPluginInstance();
  isPluginReady = false;
  pluginReadyListeners.clear();
};


export const setupPluginHook = (plugin: JournalitPlugin) => {
  
  globalPlugin = plugin;
  setPluginInstance(plugin);

  
  window.setTimeout(notifyPluginReady, 0);

  
  eventBus.publish('plugin:updated');
};

export const usePlugin = (): JournalitPlugin | null => {
  
  const [plugin, setPlugin] = useState<JournalitPlugin | null>(
    isPluginReady ? globalPlugin : null
  );

  
  const isMounted = useRef(true);

  
  const updatePlugin = useCallback(() => {
    if (!isMounted.current) {
      return;
    }

    setPlugin((currentPlugin) =>
      currentPlugin === globalPlugin ? currentPlugin : globalPlugin
    );
  }, []);
  const updatePluginRef = useRef(updatePlugin);

  useEffect(() => {
    updatePluginRef.current = updatePlugin;
  }, [updatePlugin]);

  useEffect(() => {
    const updateCurrentPlugin = () => {
      updatePluginRef.current();
    };

    
    isMounted.current = true;

    
    if (isPluginReady) {
      updateCurrentPlugin();
    } else {
      
      pluginReadyListeners.add(updateCurrentPlugin);
    }

    
    const unsubscribe = eventBus.subscribe(
      'plugin:updated',
      updateCurrentPlugin
    );

    
    return () => {
      
      isMounted.current = false;

      
      pluginReadyListeners.delete(updateCurrentPlugin);
      unsubscribe();
    };
  }, []);

  return plugin;
};
