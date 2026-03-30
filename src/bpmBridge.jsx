export function initBPMBridge({ onLoad, onSubmit, onError, initializationRef }) {
  window._loadData = async (data, info) => {
    onLoad && await onLoad(data, info);
  };

  window._saveData = (data, info) => {
    return onSubmit ? onSubmit(data, info) : {};
  };

  window._rollback = (error) => {
    onError && onError(error);
  };

  if (!window.workflowCockpit) {
    console.warn("workflowCockpit não está disponível ainda.");
    return;
  }

  if (initializationRef.current) {
    return;
  }

  /*
  if (typeof window.workflowCockpit !== 'function') {
    return;
  }
    */

  window.workflowCockpit = window.workflowCockpit({
      init: window._loadData,
      onSubmit: window._saveData,
      onError: window._rollback,
    });
}