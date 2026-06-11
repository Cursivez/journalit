

const DEVICE_FLOW_MODAL_STYLE_ID = 'journalit-device-flow-signin-modal-styles';


const deviceFlowSignInModalStyles = `

.device-activation-modal-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}


.device-activation-modal-container .device-activation-step {
  padding: 1.5rem;  
  min-height: auto;  
  align-items: flex-start;  
}


.device-activation-modal-container .activation-content {
  grid-template-columns: 1fr !important;  
  gap: 1.5rem !important;  
  max-width: 100% !important;  
  width: 100%;
}


.device-activation-modal-container .activation-right {
  display: none !important;
}


.device-activation-modal-container .activation-header {
  margin-bottom: 1rem;
}

.device-activation-modal-container .activation-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.device-activation-modal-container .activation-subtitle {
  font-size: 0.9rem;
}


.device-activation-modal-container .device-code-container {
  gap: 0.5rem;
}

.device-activation-modal-container .device-code-box {
  padding: 1rem;  
  gap: 0.75rem;  
}

.device-activation-modal-container .device-code {
  font-size: 1.5rem !important;  
  letter-spacing: 0.2em !important;  
}

.device-activation-modal-container .copy-button {
  width: 40px;
  height: 40px;
  padding: 0;
}


.device-activation-modal-container .activation-steps {
  gap: 0.5rem;  
}

.device-activation-modal-container .step-item {
  padding: 0.75rem;  
}

.device-activation-modal-container .step-number {
  width: 24px;  
  height: 24px;
  font-size: 0.8rem;
}

.device-activation-modal-container .step-text {
  font-size: 0.875rem;
}


.device-activation-modal-container .activation-primary-action {
  margin-top: 1rem;
}


.device-activation-modal-container .activation-waiting {
  margin-top: 1rem;
  padding: 1rem;
}

.device-activation-modal-container .waiting-text p {
  font-size: 0.9rem;
}

.device-activation-modal-container .status-hint {
  font-size: 0.8rem;
}


.device-activation-modal-container .activation-success,
.device-activation-modal-container .activation-error {
  text-align: center;
  padding: 1.5rem;
}

.device-activation-modal-container .activation-error h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.device-activation-modal-container .error-message {
  margin-bottom: 1.5rem;
}

.device-activation-modal-container .activation-error-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 0 0 0.75rem;
}

.device-activation-modal-container .activation-error-help {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.device-activation-modal-container .activation-error-help-content {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.device-activation-modal-container .activation-error-help-icon {
  color: var(--text-faint);
  margin-top: 2px;
}


.device-activation-modal-container .activation-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}


.device-activation-modal-container .activation-left {
  max-width: 100%;
  width: 100%;
}


.device-activation-modal-container .button-icon-left {
  margin-right: 8px;
}

.device-activation-modal-container .success-icon {
  color: var(--color-green);
}
`;

export function injectDeviceFlowSignInModalStyles(): void {
  return;
}
