"use client";

import { useState } from "react";

interface ManageDashboardProps {
  locale: string;
  gift: {
    id: string;
    slug: string;
    title: string | null;
    recipient_name: string;
    status: string;
    first_opened_at: Date | null | string;
    open_count: number;
    created_at: Date | string;
    expires_at: Date | null | string;
  };
  giftUrl: string;
  translations: {
    title: string;
    description: string;
    status: string;
    firstOpened: string;
    openCount: string;
    createdAt: string;
    expiresAt: string;
    editButton: string;
    copyLink: string;
    downloadQR: string;
    deleteButton: string;
    deleteConfirm: string;
    cancel: string;
    backToHome: string;
  };
}

export function ManageDashboard({
  locale,
  gift,
  giftUrl,
  translations,
}: ManageDashboardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(giftUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/gifts/${gift.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.href = `/${locale}`;
      } else {
        alert("Failed to delete gift");
        setDeleting(false);
      }
    } catch (error) {
      console.error("Failed to delete gift:", error);
      setDeleting(false);
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <a
            href={`/${locale}`}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 inline-flex items-center gap-2"
          >
            ← {translations.backToHome}
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">{translations.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{translations.description}</p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{translations.status}</p>
                <p className="font-medium capitalize">{gift.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{translations.openCount}</p>
                <p className="font-medium">{gift.open_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{translations.firstOpened}</p>
                <p className="font-medium">{formatDate(gift.first_opened_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{translations.createdAt}</p>
                <p className="font-medium">{formatDate(gift.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{translations.expiresAt}</p>
                <p className="font-medium">{formatDate(gift.expires_at)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`/${locale}/create/${gift.id}`}
                  className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  {translations.editButton}
                </a>

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied ? "✓ Copied" : translations.copyLink}
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 px-6 py-3 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  {translations.deleteButton}
                </button>
              </div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{translations.deleteConfirm}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. The gift will be immediately inaccessible.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {translations.cancel}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : translations.deleteButton}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
