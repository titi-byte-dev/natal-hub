'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { requestVerificationCode, submitVote } from '@/lib/api/votes';

interface VoteModalProps {
  submissionId: string;
  contestId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VoteModal({
  submissionId,
  contestId,
  isOpen,
  onClose,
}: VoteModalProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');

  const requestCodeMutation = useMutation({
    mutationFn: () => requestVerificationCode(contestId, email),
    onSuccess: () => setStep('code'),
  });

  const submitVoteMutation = useMutation({
    mutationFn: () =>
      submitVote(contestId, {
        submissionId,
        email,
        code,
        userAgent: navigator.userAgent,
      }),
    onSuccess: () => {
      alert('Voto confirmado com sucesso!');
      onClose();
      setEmail('');
      setCode('');
      setStep('email');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Votar</h2>

        {step === 'email' && (
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="seu@email.com"
            />
            <button
              onClick={() => requestCodeMutation.mutate()}
              disabled={requestCodeMutation.isPending || !email}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {requestCodeMutation.isPending ? 'A enviar...' : 'Enviar Código'}
            </button>
            {requestCodeMutation.isError && (
              <p className="text-red-500 text-sm mt-2">
                {requestCodeMutation.error?.message || 'Erro ao enviar código'}
              </p>
            )}
          </div>
        )}

        {step === 'code' && (
          <div>
            <p className="mb-4 text-sm text-gray-600">
              Enviámos um código para {email}
            </p>
            <label className="block mb-2 font-medium">Código de Verificação</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="00000"
              maxLength={5}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setStep('email')}
                className="flex-1 border py-2 rounded hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => submitVoteMutation.mutate()}
                disabled={submitVoteMutation.isPending || code.length !== 5}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {submitVoteMutation.isPending ? 'A votar...' : 'Confirmar Voto'}
              </button>
            </div>
            {submitVoteMutation.isError && (
              <p className="text-red-500 text-sm mt-2">
                {submitVoteMutation.error?.message || 'Erro ao votar'}
              </p>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

