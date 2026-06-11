


const DROPDOWN_FIX_SCRIPT = `

  (function() {

    if (window.__dropdownClickHandlerAdded) return;
    

    window.__dropdownClickHandlerAdded = true;
    

    window.__isHandlingComboBoxRemove = false;
    

    document.addEventListener('mousedown', function(event) {

      if (window.__isHandlingComboBoxRemove) return;
      

      window.__isHandlingComboBoxRemove = true;
      
      try {

        const openDropdowns = document.querySelectorAll('[data-is-open="true"], [data-combobox-type][aria-expanded="true"]');
        
        if (openDropdowns.length > 0) {
          let shouldClose = true;
          

          for (const dropdown of openDropdowns) {
            if (dropdown.contains(event.target)) {
              shouldClose = false;
              break;
            }
          }
          

          if (shouldClose) {
            openDropdowns.forEach(dropdown => {
              const input = dropdown.querySelector('input[role="combobox"]');
              if (input) {

                input.blur();
                

                dropdown.setAttribute('data-is-open', 'false');
                if (input.hasAttribute('aria-expanded')) {
                  input.setAttribute('aria-expanded', 'false');
                }
              }
            });
          }
        }
      } catch (err) {
        console.error('Error in dropdown click handler:', err);
      } finally {

        window.__isHandlingComboBoxRemove = false;
      }
    }, true);
  })();
`;


export function injectDropdownFixScript(): void {
  if (document.head.querySelector('#dropdown-fix-script')) return;
  const scriptEl = document.createElement('script');
  scriptEl.id = 'dropdown-fix-script';
  scriptEl.textContent = DROPDOWN_FIX_SCRIPT;
  document.head.appendChild(scriptEl);
}


export function removeDropdownFixScript(): void {
  const existingScript = document.head.querySelector('#dropdown-fix-script');
  if (existingScript) existingScript.remove();
}
