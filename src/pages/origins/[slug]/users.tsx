import { DotsVerticalIcon, PlusIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import type { NextPage } from 'next';
import type { ChangeEvent, FormEvent } from 'react';

import { OriginSettingsTemplate } from 'components/layout/OriginSettingsTemplate';
import { Button } from 'components/shared/Button';
import { ConfirmModal } from 'components/shared/ConfirmModal';
import { Modal } from 'components/shared/Modal';
import { ModalCloseButton } from 'components/shared/ModalCloseButton';
import { OriginUserForm } from 'components/shared/OriginUserForm';
import { withAuth } from 'hocs/withAuth';
import { withOrigin } from 'hocs/withOrigin';
import { useContext } from 'hooks/useContext';
import { useFetch } from 'hooks/useFetch';
import { useForm } from 'hooks/useForm';
import { usePlausible } from 'hooks/usePlausible';
import { MODAL_NAMES, ORIGIN_MENU_KEYS, ORIGIN_ROLES } from 'utils/constants';
import { dynamicApiRoutes } from 'utils/router';
import type { OriginInviteData, OriginUserData } from 'types';

const initialFormValues = {
  id: '',
  email: '',
  role: ORIGIN_ROLES.VIEWER,
};

const OriginUsers: NextPage = () => {
  const {
    slug,
    origin,
    user: loggedInUser,
    handleOpenModal,
    handleCloseModal: _handleCloseModal,
    setSuccessMessage,
  } = useContext();

  const plausible = usePlausible();
  const originUsersUrl = slug ? dynamicApiRoutes.originUsers({ slug }) : undefined;
  const originInvitesUrl = slug ? dynamicApiRoutes.originInvites({ slug }) : undefined;

  const {
    data: originUsers = [],
    setData: setOriginUsers,
    loading: originUsersLoading,
  } = useFetch<OriginUserData[]>({ url: originUsersUrl });

  const {
    data: originInvites = [],
    setData: setOriginInvites,
    loading: originInvitesLoading,
  } = useFetch<OriginInviteData[]>({ url: originInvitesUrl });

  const loading = originUsersLoading || originInvitesLoading;
  const { formValues, setFormValues, submitForm, submitting } = useForm(initialFormValues);
  const [selectedOriginUser, setSelectedOriginUser] = useState<OriginUserData | null>(null);
  const originUserId = selectedOriginUser?.id ?? '';
  const [selectedOriginInvite, setSelectedOriginInvite] = useState<OriginInviteData | null>(null);
  const originInviteId = selectedOriginInvite?.id ?? '';

  const handleCloseModal = (): void => {
    setSelectedOriginUser(null);
    setSelectedOriginInvite(null);
    setFormValues(initialFormValues);
    _handleCloseModal();
  };

  const handleClickEditUser = (user: OriginUserData) => (): void => {
    setSelectedOriginUser(user);
    setFormValues(user);
    handleOpenModal(MODAL_NAMES.EDIT_ORIGIN_USER);
  };

  const handleClickDeleteUser = (user: OriginUserData) => (): void => {
    setSelectedOriginUser(user);
    handleOpenModal(MODAL_NAMES.DELETE_ORIGIN_USER);
  };

  const handleClickResendInvite = (invite: OriginInviteData) => (): void => {
    setSelectedOriginInvite(invite);
    handleOpenModal(MODAL_NAMES.RESEND_ORIGIN_INVITE);
  };

  const handleClickDeleteInvite = (invite: OriginInviteData) => (): void => {
    setSelectedOriginInvite(invite);
    handleOpenModal(MODAL_NAMES.DELETE_ORIGIN_INVITE);
  };

  const handleSubmitInviteUser = (e: FormEvent): void => {
    e.preventDefault();

    submitForm<OriginInviteData[]>({
      url: dynamicApiRoutes.originInvites({ slug }),
      options: {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ data }) => {
        setOriginInvites(data);
        handleCloseModal();
        plausible('origin-invite-created');
      },
    });
  };

  const handleSubmitEditUser = (e: FormEvent): void => {
    e.preventDefault();

    submitForm<OriginUserData>({
      url: dynamicApiRoutes.originUser({ slug, originUserId }),
      options: {
        method: 'PATCH',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: ({ data }) => {
        setOriginUsers(originUsers.map((user) => (user.id === data.id ? data : user)));
        handleCloseModal();
        plausible('origin-user-edited');
      },
    });
  };

  const handleConfirmDeleteOriginUser = (): void => {
    submitForm({
      url: dynamicApiRoutes.originUser({ slug, originUserId }),
      options: {
        method: 'DELETE',
        body: JSON.stringify({ id: originUserId }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: () => {
        setSuccessMessage('User deleted successfully.');
        setOriginUsers(originUsers.filter((user) => user.id !== originUserId));
        handleCloseModal();
        plausible('origin-invite-cancelled');
      },
      errorCallback: () => handleCloseModal(),
    });
  };

  const handleConfirmDeleteInvite = (): void => {
    const { id, role } = selectedOriginInvite ?? {};

    const payload = {
      id,
      role,
      accept: false,
    };

    submitForm({
      url: dynamicApiRoutes.originInvite({ slug, originInviteId }),
      options: {
        method: 'DELETE',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: () => {
        setSuccessMessage('Invite deleted.');
        setOriginInvites(originInvites.filter((invite) => invite.id !== originInviteId));
        handleCloseModal();
        plausible('origin-invite-cancelled');
      },
      errorCallback: (): void => handleCloseModal(),
    });
  };

  const handleConfirmResendInvite = (): void => {
    submitForm({
      url: dynamicApiRoutes.originInvite({ slug, originInviteId }),
      options: {
        method: 'PATCH',
        body: JSON.stringify({ email: selectedOriginInvite?.email }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      successCallback: () => {
        handleCloseModal();
        plausible('origin-invite-resent');
      },
    });
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
                <a className="unstyled">Edit</a>
              </li>
              <li className="text-error" onClick={handleClickDeleteUser(user)}>
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
              <a className="unstyled">Resend invite</a>
            </li>
            <li className="text-error" onClick={handleClickDeleteInvite(invite)}>
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
    <>
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
          onClick={(): void => handleOpenModal(MODAL_NAMES.INVITE_ORIGIN_USER)}
          fullWidth
        >
          Invite new user
        </Button>
      </div>
    </>
  );

  const renderInviteOriginUserModal = (
    <Modal name={MODAL_NAMES.INVITE_ORIGIN_USER}>
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
    <Modal name={MODAL_NAMES.EDIT_ORIGIN_USER}>
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
    <ConfirmModal
      title="Remove user from origin"
      name={MODAL_NAMES.DELETE_ORIGIN_USER}
      onConfirm={handleConfirmDeleteOriginUser}
      submitting={submitting}
      dangerAction
    >
      <p>
        Are you sure you want to delete{' '}
        <span className="text-white">{selectedOriginUser?.email}</span> from{' '}
        <span className="text-white">{origin?.name}</span>?
        <br />
        After this action, the user will no longer have access to this origin.
      </p>
    </ConfirmModal>
  );

  const renderDeleteOriginInviteModal = (
    <ConfirmModal
      title="Delete invite"
      name={MODAL_NAMES.DELETE_ORIGIN_INVITE}
      onConfirm={handleConfirmDeleteInvite}
      submitting={submitting}
      dangerAction
    >
      <p>
        Are you sure you want to delete invite for{' '}
        <span className="text-white">{selectedOriginInvite?.email}</span>?
      </p>
    </ConfirmModal>
  );

  const renderResendOriginInviteModal = (
    <ConfirmModal
      title="Resend invite"
      name={MODAL_NAMES.RESEND_ORIGIN_INVITE}
      onConfirm={handleConfirmResendInvite}
      submitting={submitting}
    >
      <p>
        Are you sure you want to resend invite for{' '}
        <span className="text-white">{selectedOriginInvite?.email}</span>?
      </p>
    </ConfirmModal>
  );

  return (
    <OriginSettingsTemplate
      headProps={{ title: origin?.name ? `Users for ${origin.name}` : 'Loading...' }}
      activeItem={ORIGIN_MENU_KEYS.USERS}
    >
      {renderUsersAndInvites}
      {renderInviteOriginUserModal}
      {renderEditOriginUserModal}
      {renderDeleteOriginUserModal}
      {renderDeleteOriginInviteModal}
      {renderResendOriginInviteModal}
    </OriginSettingsTemplate>
  );
};

export default withAuth(withOrigin(OriginUsers));
