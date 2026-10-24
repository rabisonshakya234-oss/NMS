'use client';
import Modal from './Modal';
import Button from './Button';
import type { ReactNode } from 'react';

interface ConfirmModalProps {
  show: boolean;
  title?: string;
  message: ReactNode;
  confirmText?: string;
  variant?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({ show, title = 'Are you sure?', message, confirmText = 'Confirm', variant = 'danger', loading, onConfirm, onClose }: ConfirmModalProps) {
  return (
    <Modal show={show} title={title} onClose={onClose} size="sm"
      footer={<>
        <Button variant="light" onClick={onClose}>Cancel</Button>
        <Button variant={variant} loading={loading} onClick={onConfirm}>{confirmText}</Button>
      </>}>
      <p className="mb-0">{message}</p>
    </Modal>
  );
}
