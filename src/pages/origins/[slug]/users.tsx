import { DotsVerticalIcon, PlusIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { ChangeEvent, FormEvent } from 'react';

import { MainTemplate } from 'components/layout/MainTemplate';
import { BackButton } from 'components/shared/BackButton';
import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { OriginUserForm } from 'components/shared/OriginUserForm';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useAccount } from 'hooks/useAccount';
import { useOrigin } from 'hooks/useOrigin';
import { usePlausible } from 'hooks/usePlausible';
import { useUIState } from 'hooks/useUIState';
import { MODAL_NAMES, ORIGIN_ROLES, UNEXPECTED_ERROR } from 'utils/constants';
import { dynamicApiRoutes, dynamicRoutes } from 'utils/router';
import type { OriginInviteData, OriginUserData } from 'types';

const initialFormValues = {
  id: '',
  email: '',
  role: ORIGIN_ROLES.VIEWER,
};

const OriginUsers: NextPage = () => {
  const { slug, origin } = useOrigin();
  const { user: loggedInUser } = useAccount();
  const [originUsers, setOriginUsers] = useState<OriginUserData[]>([]);
  const [originInvites, setOriginInvites] = useState<OriginInviteData[]>([]);
  const [formValues, setFormValues] = useState<OriginUserData>(initialFormValues);
  const [selectedOriginUser, setSelectedOriginUser] = useState<OriginUserData | null>(null);
  const originUserId = selectedOriginUser?.id ?? '';
  const [selectedOriginInvite, setSelectedOriginInvite] = useState<OriginInviteData | null>(null);
  const originInviteId = selectedOriginInvite?.id ?? '';
  const plausible = usePlausible();

  const {
    loading,
    setLoading,
    setSuccessMessage,
    setErrorMessage,
    handleOpenModal,
    handleCloseModal: _handleCloseModal,
  } = useUIState();

  useEffect(() => {
    if (slug) {
      (async (): Promise<void> => {
        setLoading(true);

        try {
          const [originUsersRes, originInvitesRes] = await Promise.all([
            fetch(dynamicApiRoutes.originUsers({ slug })),
            fetch(dynamicApiRoutes.originInvites({ slug })),
          ]);

          if (originUsersRes.status === 200 && originInvitesRes.status === 200) {
            const [{ data: originUsersData }, { data: originInvitesData }] = await Promise.all([
              originUsersRes.json(),
              originInvitesRes.json(),
            ]);

            setOriginUsers(originUsersData);
            setOriginInvites(originInvitesData);
          }
        } catch {
          setErrorMessage(UNEXPECTED_ERROR);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [setErrorMessage, setLoading, slug]);

  const handleCloseModal = (): void => {
    setSelectedOriginUser(null);
    setSelectedOriginInvite(null);
    setFormValues(initialFormValues);
    _handleCloseModal();
  };

  const handleClickEditUser = (user: OriginUserData) => (): void => {
    setSelectedOriginUser(user);
    setFormValues(user);
    handleOpenModal(MODAL_NAMES.editOriginUser);
  };

  const handleClickDeleteUser = (user: OriginUserData) => (): void => {
    setSelectedOriginUser(user);
    handleOpenModal(MODAL_NAMES.deleteOriginUser);
  };

  const handleClickResendInvite = (invite: OriginInviteData) => (): void => {
    setSelectedOriginInvite(invite);
    handleOpenModal(MODAL_NAMES.resendOriginInvite);
  };

  const handleClickDeleteInvite = (invite: OriginInviteData) => (): void => {
    setSelectedOriginInvite(invite);
    handleOpenModal(MODAL_NAMES.deleteOriginInvite);
  };

  const handleSubmitInviteUser = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(dynamicApiRoutes.originInvites({ slug }), {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, data = [] } = await res.json();

      if (res.status === 201) {
        setErrorMessage('');
        setSuccessMessage(message);
        setOriginInvites(data);
        plausible('origin-invite-created');
      } else {
        setErrorMessage(message || UNEXPECTED_ERROR);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleSubmitEditUser = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(dynamicApiRoutes.originUser({ slug, originUserId }), {
        method: 'PATCH',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, data } = await res.json();

      if (res.status === 200) {
        setErrorMessage('');
        setSuccessMessage(message);
        setOriginUsers(originUsers.map((user) => (user.id === data.id ? data : user)));
        plausible('origin-user-edited');
      } else {
        setErrorMessage(message || UNEXPECTED_ERROR);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleConfirmDeleteOriginUser = async (): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(dynamicApiRoutes.originUser({ slug, originUserId }), {
        method: 'DELETE',
        body: JSON.stringify({ id: originUserId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 204) {
        setErrorMessage('');
        setSuccessMessage('User deleted successfully.');
        setOriginUsers(originUsers.filter((user) => user.id !== originUserId));
        plausible('origin-invite-cancelled');
      } else {
        const { message = UNEXPECTED_ERROR } = await res.json();
        setErrorMessage(message);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleConfirmDeleteInvite = async (): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    const { id, role } = selectedOriginInvite ?? {};

    const payload = {
      id,
      role,
      accept: false,
    };

    try {
      const res = await fetch(dynamicApiRoutes.originInvite({ slug, originInviteId }), {
        method: 'DELETE',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 204) {
        setErrorMessage('');
        setSuccessMessage('Invite deleted.');
        setOriginInvites(originInvites.filter((invite) => invite.id !== originInviteId));
        plausible('origin-invite-cancelled');
      } else {
        const { message = UNEXPECTED_ERROR } = await res.json();
        setErrorMessage(message);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleConfirmResendInvite = async (): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(dynamicApiRoutes.originInvite({ slug, originInviteId }), {
        method: 'PATCH',
        body: JSON.stringify({ email: selectedOriginInvite?.email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message } = await res.json();

      if (res.status === 200) {
        setErrorMessage('');
        setSuccessMessage(message);
        plausible('origin-invite-resent');
      } else {
        setErrorMessage(message || UNEXPECTED_ERROR);
      }
    } catch {
      setErrorMessage(UNEXPECTED_ERROR);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>): void =>
    setFormValues({ ...formValues, [target.name]: target.value });

  const originUserFormProps = {
    formValues,
    onInputChange: handleInputChange,
  };

  const renderOriginUsers = originUsers.map((user, index) => (
    <tr key={`origin-user-${index}`}>
      <td>
        {user.email} {user.email === loggedInUser?.email && '(you)'}
      </td>
      <td className="capitalize">{user.role}</td>

      {user.role === ORIGIN_ROLES.OWNER ? (
        <td className="table-cell" />
      ) : (
        <td className="flex justify-end">
          <div className="dropdown-end dropdown">
            <div tabIndex={0} className="btn btn-ghost" onClick={(e): void => e.preventDefault()}>
              <DotsVerticalIcon className="h-5 w-5" />
            </div>
            <ul
              tabIndex={0}
              className="card-bordered dropdown-content menu rounded-box bg-base-100 p-2 text-primary shadow"
            >
              <li onClick={handleClickEditUser(user)}>
                <a>Edit</a>
              </li>
              <li className="text-error hover:text-error" onClick={handleClickDeleteUser(user)}>
                <a className="unstyled">Delete</a>
              </li>
            </ul>
          </div>
        </td>
      )}
    </tr>
  ));

  const renderOriginInvites = originInvites.map((invite) => (
    <tr key={'email'}>
      <td>{invite.email}</td>
      <td>Invited</td>
      <td className="flex justify-end">
        <div className="dropdown-end dropdown">
          <div tabIndex={0} className="btn btn-ghost" onClick={(e): void => e.preventDefault()}>
            <DotsVerticalIcon className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="card-bordered dropdown-content menu rounded-box bg-base-100 p-2 text-primary shadow"
          >
            <li onClick={handleClickResendInvite(invite)}>
              <a>Resend invite</a>
            </li>
            <li className="text-error hover:text-error" onClick={handleClickDeleteInvite(invite)}>
              <a className="unstyled">Delete</a>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  ));

  const renderLoadingRow = (
    <div className="flex h-10 animate-pulse items-center rounded-lg border-2 border-base-content p-2">
      <div className="h-full w-full rounded-lg bg-base-200" />
    </div>
  );

  const renderUsersAndInvites = (
    <div className="card rounded-lg bg-base-100 p-4 shadow">
      <BackButton linkTo={dynamicRoutes.origin({ slug })} text="Dashboard" />
      <h5 className="text-white">Users for {origin?.name}</h5>
      <p className="mt-2 text-sm">Invite and manage users who can view or modify this origin.</p>
      <div className="mt-4">
        {loading ? (
          <div className="flex flex-col gap-2">
            {renderLoadingRow}
            {renderLoadingRow}
            {renderLoadingRow}
            {renderLoadingRow}
            {renderLoadingRow}
          </div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {renderOriginUsers}
              {renderOriginInvites}
            </tbody>
          </table>
        )}
        <Button
          className="btn-primary mt-4"
          endIcon={PlusIcon}
          onClick={(): void => handleOpenModal(MODAL_NAMES.inviteOriginUser)}
        >
          Invite
        </Button>
      </div>
    </div>
  );

  const renderInviteOriginUserModal = (
    <Modal name={MODAL_NAMES.inviteOriginUser}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">Invite new user to {origin?.name}</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <OriginUserForm
        {...originUserFormProps}
        onSubmit={handleSubmitInviteUser}
        emailInputProps={{ placeholder: 'my.coworker@bigmegacorp.co' }}
        loading={loading}
      />
    </Modal>
  );

  const renderEditOriginUserModal = (
    <Modal name={MODAL_NAMES.editOriginUser}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">Edit role for {selectedOriginUser?.email}</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <OriginUserForm
        {...originUserFormProps}
        onSubmit={handleSubmitEditUser}
        emailInputProps={{ value: selectedOriginUser?.email, readOnly: true, disabled: true }}
        loading={loading}
      />
    </Modal>
  );

  const renderDeleteOriginUserModal = (
    <Modal name={MODAL_NAMES.deleteOriginUser}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">Remove user from origin</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="p-4">
        <p>
          Are you sure you want to delete{' '}
          <span className="text-white">{selectedOriginUser?.email}</span> from{' '}
          <span className="text-white">{origin?.name}</span>?
          <br />
          After this action, the user will no longer have access to this origin.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        <Button className="btn-outline btn-error" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          className="btn-primary"
          onClick={handleConfirmDeleteOriginUser}
          autoFocus
          disabled={loading}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );

  const renderDeleteOriginInviteModal = (
    <Modal name={MODAL_NAMES.deleteOriginInvite}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">Delete invite</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="p-4">
        <p>
          Are you sure you want to delete invite for{' '}
          <span className="text-white">{selectedOriginInvite?.email}</span>?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        <Button className="btn-outline btn-error" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          className="btn-primary"
          onClick={handleConfirmDeleteInvite}
          autoFocus
          disabled={loading}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );

  const renderResendOriginInviteModal = (
    <Modal name={MODAL_NAMES.resendOriginInvite}>
      <div className="flex items-center justify-between p-2">
        <p className="px-2 font-bold">
          <p className="text-white">Resend invite</p>
        </p>
        <ModalCloseButton onClick={handleCloseModal} />
      </div>
      <div className="p-4">
        <p>
          Are you sure you want to resend invite for{' '}
          <span className="text-white">{selectedOriginInvite?.email}</span>?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2">
        <Button className="btn-outline btn-error" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          className="btn-primary"
          onClick={handleConfirmResendInvite}
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
    <MainTemplate headProps={{ title: origin?.name ? `Users for ${origin.name}` : 'Loading...' }}>
      {renderUsersAndInvites}
      {renderInviteOriginUserModal}
      {renderEditOriginUserModal}
      {renderDeleteOriginUserModal}
      {renderDeleteOriginInviteModal}
      {renderResendOriginInviteModal}
    </MainTemplate>
  );
};

export default withAuth(withOrigin(OriginUsers));
