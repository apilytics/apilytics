import { PlusIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { OriginMenu } from 'components/shared/OriginMenu';
import { withAuth } from 'hocs/withAuth';
import { useAccount } from 'hooks/useAccount';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { MODAL_NAMES, UNEXPECTED_ERROR } from 'utils/constants';
import { formatCount } from 'utils/metrics';
import { dynamicApiRoutes, dynamicRoutes, staticApiRoutes, staticRoutes } from 'utils/router';
import type { OriginInviteData } from 'types';

const Origins: NextPage = () => {
  const { origins, setOrigins, originInvites, setOriginInvites } = useAccount();
  const [selectedOriginInvite, setSelectedOriginInvite] = useState<OriginInviteData | null>(null);
  const plausible = usePlausible();

  const {
    loading,
    setLoading,
    setSuccessMessage,
    setErrorMessage,
    handleOpenModal,
    handleCloseModal: _handleCloseModal,
  } = useUIState();

  const fetchOrigins = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const res = await fetch(staticApiRoutes.origins);

      if (res.status === 200) {
        const { data } = await res.json();
        setOrigins(data);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
    }
  }, [setErrorMessage, setLoading, setOrigins]);

  useEffect(() => {
    fetchOrigins();
  }, [fetchOrigins]);

  const handleCloseModal = (): void => {
    setSelectedOriginInvite(null);
    _handleCloseModal();
  };

  const handleConfirmInvite = (accept: boolean) => async (): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    const { id = '', role, originSlug = '' } = selectedOriginInvite ?? {};

    const payload = {
      id,
      role,
      accept,
    };

    try {
      const res = await fetch(
        dynamicApiRoutes.originInvite({ slug: originSlug, originInviteId: id }),
        {
          method: 'DELETE',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.status === 204) {
        setErrorMessage('');
        setSuccessMessage(`Invite ${accept ? 'accepted' : 'rejected'} successfully.`);
        setOriginInvites([...originInvites].filter((invite) => invite.id !== id));
        fetchOrigins();
        plausible('origin-invite-accepted');
      } else {
        const { message = UNEXPECTED_ERROR } = await res.json();
        setErrorMessage(message);
        setLoading(false);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
      setLoading(false);
    } finally {
      handleCloseModal();
    }
  };

  const renderSkeletonRow = (
    <div className="flex h-20 animate-pulse items-center gap-4 rounded-lg border-2 border-base-content p-4">
      <div className="h-8 grow rounded-lg bg-base-100" />
      <div className="h-8 w-4 rounded-lg bg-base-100" />
    </div>
  );

  const renderOriginsAndInvites = (): JSX.Element[] | JSX.Element => {
    const renderInvites = originInvites.map((originInvite, index) => (
      <div className="card rounded-lg bg-base-100 p-4" key={`invite-${index}`}>
        <h6>
          Invitation:{' '}
          <span className="text-white">
            {originInvite.originName} ({originInvite.role})
          </span>
        </h6>
        <p>Accept the invite to get access to the origin.</p>
        <div className="mt-4 flex gap-2">
          <Button
            className="btn-success"
            onClick={(): void => {
              setSelectedOriginInvite(originInvite);
              handleOpenModal(MODAL_NAMES.acceptOriginInvite);
            }}
          >
            Accept
          </Button>
          <Button
            className="btn-outline btn-error"
            onClick={(): void => {
              setSelectedOriginInvite(originInvite);
              handleOpenModal(MODAL_NAMES.rejectOriginInvite);
            }}
          >
            Decline
          </Button>
        </div>
      </div>
    ));

    const renderOrigins = origins.map(
      ({
        name,
        slug,
        totalMetrics,
        lastDayMetrics,
        userRole,
        dynamicRouteCount,
        excludedRouteCount,
      }) => (
        <Link href={dynamicRoutes.origin({ slug })} key={name}>
          <a className="unstyled">
            <div className="card rounded-lg bg-base-100 px-4 py-2 hover:bg-gray-700" key={name}>
              <div className="flex items-center justify-between">
                <div>
                  <h6>{name}</h6>
                  <div className="flex gap-4 text-sm">
                    <p>
                      <span className="text-white">{formatCount(lastDayMetrics)}</span> requests in
                      last 24h
                    </p>
                    <p>
                      <span className="text-white">{formatCount(totalMetrics)}</span> total requests
                    </p>
                  </div>
                </div>
                <OriginMenu
                  slug={slug}
                  userRole={userRole}
                  dynamicRouteCount={dynamicRouteCount}
                  excludedRouteCount={excludedRouteCount}
                />
              </div>
            </div>
          </a>
        </Link>
      ),
    );

    if (loading) {
      return (
        <>
          {renderSkeletonRow}
          {renderSkeletonRow}
          {renderSkeletonRow}
          {renderSkeletonRow}
          {renderSkeletonRow}
        </>
      );
    }

    if (origins.length) {
      return (
        <>
          {renderInvites}
          {renderOrigins}
        </>
      );
    }

    if (originInvites.length) {
      return renderInvites;
    }

    return <p>No origins available. Add your first origin to start analyzing your APIs.</p>;
  };

  const renderContent = (
    <div className="divide-y divide-base-content">
      <div className="flex flex-col pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h5 className="text-white">Origins</h5>
        <Button
          linkTo={staticRoutes.newOrigin}
          endIcon={PlusIcon}
          className="btn-outline btn-primary"
        >
          Add origin
        </Button>
      </div>
      <div className="flex flex-col gap-2 py-4">{renderOriginsAndInvites()}</div>
    </div>
  );

  const renderAcceptInviteModal = (
    <Modal name={MODAL_NAMES.acceptOriginInvite}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">Accept invite</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="p-4">
        <p>
          Are you sure you want to accept invite for{' '}
          <span className="text-white">{selectedOriginInvite?.originName}</span>?
        </p>
        <p>
          After accepting, you will become a collaborator with{' '}
          <span className="text-white">{selectedOriginInvite?.role}</span> rights.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        <Button className="btn-outline btn-error" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          className="btn-primary"
          onClick={handleConfirmInvite(true)}
          autoFocus
          disabled={loading}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );

  const renderDeclineInviteModal = (
    <Modal name={MODAL_NAMES.rejectOriginInvite}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">Reject invite</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="p-4">
        <p>
          Are you sure you want to reject invite for{' '}
          <span className="text-white">{selectedOriginInvite?.originName}</span>?
        </p>
        <p>After rejecting, the invite will be lost and you need a new invite.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        <Button className="btn-outline btn-error" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          className="btn-primary"
          onClick={handleConfirmInvite(false)}
          autoFocus
          disabled={loading}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );

  return (
    <MainTemplate headProps={{ title: 'Origins' }}>
      {renderContent}
      {renderAcceptInviteModal}
      {renderDeclineInviteModal}
    </MainTemplate>
  );
};

export default withAuth(Origins);
