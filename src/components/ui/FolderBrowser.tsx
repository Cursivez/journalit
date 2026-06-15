

import React, {
  useState,
  useEffect,
  useId,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { TFolder, App } from 'obsidian';
import { cssVars } from '../../styles/inlineStylePolicy';
import { t } from '../../lang/helpers';


const CLASS_NAMES = {
  FOLDER_BROWSER_CONTAINER: 'folder-browser-container',
  INPUT_CONTAINER: 'input-container',
  INPUT: 'folder-browser-input',
  DROPDOWN: 'folder-browser-dropdown',
  FOLDER_ITEM: 'folder-browser-item',
  FOLDER_ITEM_HIGHLIGHTED: 'highlighted',
  FOLDER_INDENT: 'folder-indent',
  FOLDER_TOGGLE: 'folder-toggle',
  FOLDER_ICON: 'folder-icon',
  FOLDER_NAME: 'folder-name',
  LABEL: 'folder-browser-label',
  REQUIRED: 'folder-browser-required',
  CLEAR_BUTTON: 'folder-browser-clear-button',
  ERROR: 'folder-browser-error',
  HELPER: 'folder-browser-helper',
};

interface FolderItem {
  folder: TFolder;
  path: string;
  depth: number;
  isExpanded: boolean;
  hasChildren: boolean;
}

interface FolderBrowserProps {
  
  selectedPath?: string;

  
  onChange: (path: string) => void;

  
  placeholder?: string;

  
  label?: string;

  
  error?: string;

  
  helperText?: string;

  
  required?: boolean;

  
  app: App;
}


function useFolderBrowserModel({
  selectedPath = '',
  onChange,
  app,
}: Pick<FolderBrowserProps, 'selectedPath' | 'onChange' | 'app'>) {
  
  const uniqueId = useId();
  const inputId = `folder-browser-${uniqueId}`;
  const listId = `folder-browser-list-${uniqueId}`;
  const helperId = `helper-${uniqueId}`;
  const errorId = `error-${uniqueId}`;

  
  const [inputValue, setInputValue] = useState(selectedPath);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  
  const browserRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  
  const isSelectingFolder = useRef(false);

  
  const getAllFolders = useCallback((): TFolder[] => {
    const folders: TFolder[] = [];

    const addFoldersRecursively = (folder: TFolder) => {
      
      if (
        !folder.name.startsWith('.') &&
        folder.name.toLowerCase() !== '!journalit'
      ) {
        folders.push(folder);

        
        folder.children.forEach((child) => {
          if (child instanceof TFolder) {
            addFoldersRecursively(child);
          }
        });
      }
    };

    
    const vault = app.vault;
    const rootFolder = vault.getRoot();

    
    rootFolder.children.forEach((child) => {
      if (child instanceof TFolder) {
        addFoldersRecursively(child);
      }
    });

    return folders;
  }, [app]);

  
  const buildFolderTree = useCallback((): FolderItem[] => {
    const allFolders = getAllFolders();
    const folderItems: FolderItem[] = [];

    const addFolderToTree = (folder: TFolder, depth: number = 0) => {
      const folderPath = folder.path;
      const hasChildren = folder.children.some(
        (child) =>
          child instanceof TFolder &&
          !child.name.startsWith('.') &&
          child.name.toLowerCase() !== '!journalit'
      );
      const isExpanded = expandedFolders.has(folderPath);

      folderItems.push({
        folder,
        path: folderPath,
        depth,
        isExpanded,
        hasChildren,
      });

      
      if (isExpanded && hasChildren) {
        for (const child of folder.children) {
          if (
            child instanceof TFolder &&
            !child.name.startsWith('.') &&
            child.name.toLowerCase() !== '!journalit'
          ) {
            addFolderToTree(child, depth + 1);
          }
        }
      }
    };

    
    const rootFolders = allFolders
      .filter((folder) => folder.parent === app.vault.getRoot())
      .sort((a, b) => a.name.localeCompare(b.name));

    rootFolders.forEach((folder) => addFolderToTree(folder));

    return folderItems;
  }, [getAllFolders, expandedFolders, app]);

  
  const folderTree = useMemo(() => buildFolderTree(), [buildFolderTree]);

  
  const filteredFolders = useMemo(() => {
    if (!inputValue.trim()) return folderTree;

    const searchTerm = inputValue.toLowerCase();
    return folderTree.filter(
      (item) =>
        item.path.toLowerCase().includes(searchTerm) ||
        item.folder.name.toLowerCase().includes(searchTerm)
    );
  }, [folderTree, inputValue]);

  
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsOpen(true);
      setHighlightedIndex(-1);
    },
    []
  );

  
  const handleSelect = useCallback(
    (folderPath: string) => {
      setInputValue(folderPath);
      onChange(folderPath);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  
  const handleToggleExpansion = useCallback(
    (folderPath: string, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      setExpandedFolders((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(folderPath)) {
          newSet.delete(folderPath);
        } else {
          newSet.add(folderPath);
        }
        return newSet;
      });
    },
    []
  );

  
  const handleClear = useCallback(() => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  
  useEffect(() => {
    const handleFolderSelection = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const folderItem = target.closest('[data-folder-item="true"]');

      if (folderItem && browserRef.current?.contains(target)) {
        
        const isToggle = target.closest('[data-folder-toggle="true"]');
        if (isToggle) return; 

        isSelectingFolder.current = true;

        const folderPath = folderItem.getAttribute('data-folder-path');
        if (folderPath) {
          handleSelect(folderPath);
        }

        window.setTimeout(() => {
          isSelectingFolder.current = false;
        }, 50);
      }
    };

    window.activeDocument.addEventListener(
      'mousedown',
      handleFolderSelection,
      true
    );

    return () => {
      window.activeDocument.removeEventListener(
        'mousedown',
        handleFolderSelection,
        true
      );
    };
  }, [handleSelect]);

  
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target;
      const isClickingInsideBrowser =
        target instanceof Node ? browserRef.current?.contains(target) : false;

      if (!isClickingInsideBrowser) {
        setIsOpen(false);
      }
    };

    window.activeDocument.addEventListener(
      'mousedown',
      handleOutsideClick,
      true
    );

    return () => {
      window.activeDocument.removeEventListener(
        'mousedown',
        handleOutsideClick,
        true
      );
    };
  }, [isOpen]);

  
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.activeDocument.addEventListener('keydown', handleEscapeKey, true);

    return () => {
      window.activeDocument.removeEventListener(
        'keydown',
        handleEscapeKey,
        true
      );
    };
  }, [isOpen]);

  
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const folderCount = filteredFolders.length;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) => (prev + 1) % folderCount);
          break;

        case 'ArrowUp':
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex((prev) => (prev - 1 + folderCount) % folderCount);
          break;

        case 'Enter':
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredFolders.length
          ) {
            handleSelect(filteredFolders[highlightedIndex].path);
          } else {
            
            const trimmedValue = inputValue.trim();
            if (trimmedValue !== selectedPath) {
              onChange(trimmedValue);
            }
            setIsOpen(false);
          }
          break;

        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [
      filteredFolders,
      highlightedIndex,
      handleSelect,
      inputValue,
      selectedPath,
      onChange,
    ]
  );

  
  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (isSelectingFolder.current) return;

      const relatedTarget = e.relatedTarget;
      const isFocusStillInside =
        relatedTarget instanceof Node
          ? browserRef.current?.contains(relatedTarget)
          : false;

      if (!isFocusStillInside) {
        window.setTimeout(() => {
          if (!isSelectingFolder.current) {
            setIsOpen(false);
            setHighlightedIndex(-1);

            
            const trimmedValue = inputValue.trim();
            if (trimmedValue !== selectedPath) {
              onChange(trimmedValue);
            }
          }
        }, 100);
      }
    },
    [inputValue, selectedPath, onChange]
  );

  const handleInputClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    []
  );

  
  const renderedFolders = useMemo(() => {
    return filteredFolders.map((item, index) => (
      <li
        key={item.path}
        id={`folder-${index}`}
        role="option"
        aria-selected={highlightedIndex === index}
        className={`${CLASS_NAMES.FOLDER_ITEM} ${highlightedIndex === index ? CLASS_NAMES.FOLDER_ITEM_HIGHLIGHTED : ''}`}
        onMouseEnter={() => setHighlightedIndex(index)}
        data-folder-item="true"
        data-folder-path={item.path}
      >
        
        <div
          className={CLASS_NAMES.FOLDER_INDENT}
          style={cssVars({ '--folder-depth': item.depth })}
        />

        
        {item.hasChildren && (
          <button
            type="button"
            className={CLASS_NAMES.FOLDER_TOGGLE}
            onClick={(e) => handleToggleExpansion(item.path, e)}
            data-folder-toggle="true"
          >
            {item.isExpanded ? '▼' : '▶'}
          </button>
        )}

        
        <span className={CLASS_NAMES.FOLDER_ICON}>📁</span>

        
        <span className={CLASS_NAMES.FOLDER_NAME}>
          {item.folder.name || t('ui.folder-browser.root')}
        </span>
      </li>
    ));
  }, [filteredFolders, highlightedIndex, handleToggleExpansion]);

  
  useEffect(() => {
    setInputValue(selectedPath);
  }, [selectedPath]);

  
  useEffect(() => {}, []);

  return {
    inputId,
    listId,
    helperId,
    errorId,
    inputValue,
    isOpen,
    highlightedIndex,
    filteredFolders,
    renderedFolders,
    browserRef,
    inputRef,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleInputClick,
    handleKeyDown,
    handleClear,
  };
}

export const FolderBrowser: React.FC<FolderBrowserProps> = ({
  selectedPath = '',
  onChange,
  placeholder = t('ui.folder-browser.placeholder'),
  label,
  error,
  helperText,
  required = false,
  app,
}) => {
  const {
    inputId,
    listId,
    helperId,
    errorId,
    inputValue,
    isOpen,
    highlightedIndex,
    filteredFolders,
    renderedFolders,
    browserRef,
    inputRef,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleInputClick,
    handleKeyDown,
    handleClear,
  } = useFolderBrowserModel({ selectedPath, onChange, app });

  return (
    <div
      ref={browserRef}
      className={CLASS_NAMES.FOLDER_BROWSER_CONTAINER}
      data-is-open={isOpen ? 'true' : 'false'}
    >
      {label && (
        <label htmlFor={inputId} className={CLASS_NAMES.LABEL}>
          {label}
          {required && <span className={CLASS_NAMES.REQUIRED}>*</span>}
        </label>
      )}

      <div
        className={CLASS_NAMES.INPUT_CONTAINER}
        data-has-clear={selectedPath ? 'true' : 'false'}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={
            highlightedIndex >= 0 ? `folder-${highlightedIndex}` : undefined
          }
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          role="combobox"
          className={CLASS_NAMES.INPUT}
        />

        
        {selectedPath && (
          <button
            type="button"
            className={`${CLASS_NAMES.CLEAR_BUTTON} clickable-icon`}
            onClick={handleClear}
            aria-label={t('ui.folder-browser.clear-aria')}
          >
            ×
          </button>
        )}

        
        {isOpen && filteredFolders.length > 0 && (
          <ul id={listId} role="listbox" className={CLASS_NAMES.DROPDOWN}>
            {renderedFolders}
          </ul>
        )}
      </div>

      
      {error && (
        <div id={errorId} role="alert" className={CLASS_NAMES.ERROR}>
          {error}
        </div>
      )}

      
      {!error && helperText && (
        <div id={helperId} className={CLASS_NAMES.HELPER}>
          {helperText}
        </div>
      )}
    </div>
  );
};


FolderBrowser.displayName = 'FolderBrowser';
