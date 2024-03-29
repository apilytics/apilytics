import React, { useEffect } from 'react';

import { Alert } from 'components/shared/Alert';
import { useContext } from 'hooks/useContext';

export const UIAlerts: React.FC = () => {
  const { successMessage, setSuccessMessage, errorMessage, setErrorMessage } = useContext();

  useEffect(() => {
    return () => {
      setSuccessMessage('');
      setErrorMessage('');
    };
  }, [setErrorMessage, setSuccessMessage]);

  const renderSuccessAlert = successMessage && (
    <Alert
      text={successMessage}
      onDismiss={(): void => setSuccessMessage('')}
      className="alert-success mb-4"
    />
  );

  const renderErrorAlert = errorMessage && (
    <Alert
      text={errorMessage}
      onDismiss={(): void => setErrorMessage('')}
      className="alert-error mb-4"
    />
  );

  return (
    <>
      {renderSuccessAlert}
      {renderErrorAlert}
    </>
  );
};
