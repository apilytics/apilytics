import { TrashIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { OriginSettingsTemplate } from 'components/layout/OriginSettingsTemplate';
import { WeeklyReport } from 'components/layout/WeeklyReport';
import { Button } from 'components/shared/Button';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Form } from 'components/shared/Form';
import { IconButton } from 'components/shared/IconButton';
import { Input } from 'components/shared/Input';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { Toggle } from 'components/shared/Toggle';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import { useForm } from 'hooks/useForm';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES, ORIGIN_MENU_KEYS, REQUEST_TIME_FORMAT, WEEK_DAYS } from 'utils/constants';
import { dynamicApiRoutes } from 'utils/router';
import type { OriginData, OriginMetrics } from 'types';

const OriginEmailReports: NextPage = () => {
  const plausible = usePlausible();
  const { origin, setOrigin, handleOpenModal, handleCloseModal: _handleCloseModal } = useContext();
  const { submitForm: submitOriginSettingsForm, loading: originSettingsFormLoading } = useForm({});

  const { submitForm: submitSendWeeklyEmailReports, loading: sendWeeklyEmailReportsLoading } =
    useForm({});

  const {
    name,
    slug = '',
    weeklyEmailReportsEnabled: initialWeeklyEmailReportsEnabled = false,
  } = origin ?? {};

  const from = dayjs().subtract(WEEK_DAYS, 'day').format(REQUEST_TIME_FORMAT);
  const to = dayjs().format(REQUEST_TIME_FORMAT);

  const metricsUrl = slug
    ? dynamicApiRoutes.originMetrics({
        slug,
        from,
        to,
      })
    : undefined;

  const {
    data: metrics,
    loading: metricsLoading,
    notFound,
  } = useFetch<OriginMetrics>({ url: metricsUrl });

  const recipientsUrl = slug ? dynamicApiRoutes.originEmailReportRecipients({ slug }) : undefined;

  const {
    data: recipients = [],
    setData: setRecipients,
    loading: recipientsLoading,
  } = useFetch<string[]>({
    url: recipientsUrl,
  });

  const [weeklyEmailReportsEnabled, setWeeklyEmailReportsEnabled] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

  useEffect(() => {
    setWeeklyEmailReportsEnabled(initialWeeklyEmailReportsEnabled);
  }, [initialWeeklyEmailReportsEnabled, setWeeklyEmailReportsEnabled]);

  const {
    formValues: { recipient },
    onInputChange,
    submitForm,
    loading: recipientsFormLoading,
  } = useForm({ recipient: '' });

  const loading =
    originSettingsFormLoading ||
    recipientsLoading ||
    recipientsFormLoading ||
    sendWeeklyEmailReportsLoading ||
    metricsLoading;

  const sendReportsButtonDisabled = !recipients.length || loading;

  const handleCloseModal = (): void => {
    setSelectedRecipient(null);
    _handleCloseModal();
  };

  const handleWeeklyEmailReportsToggle = (): void => {
    submitOriginSettingsForm<OriginData>({
      url: dynamicApiRoutes.origin({ slug }),
      options: {
        method: 'PATCH',
        body: JSON.stringify({ name, weeklyEmailReportsEnabled: !weeklyEmailReportsEnabled }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ data }) => {
        setOrigin(data);
        setWeeklyEmailReportsEnabled(!weeklyEmailReportsEnabled);
        plausible('weekly-email-reports-toggled');
      },
    });
  };

  const handleSubmitRecipients = ({
    payload,
    successCallback,
  }: {
    payload: string[];
    successCallback: () => void;
  }): void => {
    submitForm<string[]>({
      url: dynamicApiRoutes.originEmailReportRecipients({ slug }),
      options: {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ data }): void => {
        setRecipients(data);
        successCallback();
      },
    });
  };

  const handleSubmitAddRecipient = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    handleSubmitRecipients({
      payload: [...recipients, recipient],
      successCallback: () => plausible('weekly-email-report-recipient-added'),
    });
  };

  const handleClickDeleteRecipient = (email: string) => (): void => {
    handleOpenModal(MODAL_NAMES.DELETE_RECIPIENT);
    setSelectedRecipient(email);
  };

  const handleConfirmDeleteRecipient = (): void => {
    handleCloseModal();

    handleSubmitRecipients({
      payload: recipients.filter((r) => r !== selectedRecipient),
      successCallback: () => plausible('weekly-email-report-recipient-deleted'),
    });
  };

  const handleConfirmSendWeeklyEmailReports = (): void => {
    handleCloseModal();

    submitSendWeeklyEmailReports({
      url: dynamicApiRoutes.originEmailReports({ slug }),
      options: {
        method: 'POST',
      },
      successCallback: () => plausible('weekly-email-reports-sent'),
    });
  };

  if (notFound) {
    return <NotFoundTemplate />;
  }

  return (
    <OriginSettingsTemplate
      headProps={{ title: origin?.name ? `Email reports for ${origin.name}` : 'Loading...' }}
      activeItem={ORIGIN_MENU_KEYS.EMAIL_REPORTS}
    >
      <Form
        title={`Email reports for ${origin?.name}`}
        subTitle="Send weekly email reports to your colleagues etc."
        onSubmit={handleSubmitAddRecipient}
        loading={loading}
        submitButtonText="Add recipient"
      >
        <Toggle
          label="Enable weekly email reports"
          checked={weeklyEmailReportsEnabled}
          onChange={handleWeeklyEmailReportsToggle}
        />
        <p className="mt-4 text-white">Recipients</p>
        {recipients.length ? (
          recipients.map((email) => (
            <div className="flex items-center gap-2" key={email}>
              <Input value={email} readOnly disabled formControlProps={{ className: 'grow' }} />
              <IconButton
                icon={TrashIcon}
                type="button"
                onClick={handleClickDeleteRecipient(email)}
              />
            </div>
          ))
        ) : (
          <p className="text-sm">No recipients. Add your first recipient below.</p>
        )}
        <Input
          name="recipient"
          label="Email"
          type="email"
          placeholder="my.scaryboss@nextbigunicorn.io"
          onChange={onInputChange}
          value={recipient}
          required
          formControlProps={{ className: 'mt-4' }}
        />
      </Form>
      <Button
        onClick={(): void => handleOpenModal(MODAL_NAMES.SEE_WEEKLY_EMAIL_REPORT)}
        className={clsx('btn-primary mt-4', !loading && 'btn-outline')} // `btn-outline` won't with `disabled` attribute.
        fullWidth
        loading={loading}
        disabled={loading}
      >
        Preview report
      </Button>
      <Button
        onClick={(): void => handleOpenModal(MODAL_NAMES.SEND_WEEKLY_EMAIL_REPORTS)}
        className={clsx('btn-primary mt-4', !sendReportsButtonDisabled && 'btn-outline')} // `btn-outline` won't with `disabled` attribute.
        fullWidth
        disabled={sendReportsButtonDisabled}
        loading={sendWeeklyEmailReportsLoading}
      >
        Send reports now
      </Button>
      <ConfirmModal
        title="Delete recipient"
        name={MODAL_NAMES.DELETE_RECIPIENT}
        onConfirm={handleConfirmDeleteRecipient}
        onClose={(): void => setSelectedRecipient(null)}
        loading={loading}
        dangerAction
      >
        <p>
          Are you sure you want to delete the recipient{' '}
          <span className="text-white">{selectedRecipient}</span>?
        </p>
      </ConfirmModal>
      <Modal name={MODAL_NAMES.SEE_WEEKLY_EMAIL_REPORT}>
        <div className="flex justify-end p-2">
          <ModalCloseButton onClick={handleCloseModal} />
        </div>
        <div className="overflow-y-auto">
          {origin && metrics && (
            <WeeklyReport origin={origin} metrics={metrics} from={from} to={to} isPreview />
          )}
        </div>
      </Modal>
      <ConfirmModal
        title="Send weekly email reports"
        name={MODAL_NAMES.SEND_WEEKLY_EMAIL_REPORTS}
        onConfirm={handleConfirmSendWeeklyEmailReports}
        loading={loading}
      >
        <p>Are you sure you want to send the weekly email reports to the following recipients?</p>
        <ul className="list-none">
          {recipients.map((email) => (
            <li className="text-white" key={email}>
              {email}
            </li>
          ))}
        </ul>
      </ConfirmModal>
    </OriginSettingsTemplate>
  );
};

export default withAuth(withOrigin(OriginEmailReports));
