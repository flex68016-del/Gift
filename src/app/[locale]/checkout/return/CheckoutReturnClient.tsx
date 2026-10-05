"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface CheckoutReturnClientProps {
  locale: string;
  transactionId?: string;
  status?: string;
}

export function CheckoutReturnClient({
  locale,
  transactionId,
  status,
}: CheckoutReturnClientProps) {
  const t = useTranslations("checkout");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Interroger le point d'état pour vérifier le statut réel
    async function checkStatus() {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payments/${transactionId}/status`);
        if (response.ok) {
          const data = await response.json();
          setPaymentStatus(data.status);
        }
      } catch (error) {
        console.error("Failed to check payment status:", error);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t("checkingStatus")}</p>
        </div>
      </div>
    );
  }

  // Afficher le message selon le statut
  const isSuccess = paymentStatus === "approved" || status === "approved";
  const isPending = paymentStatus === "pending" || status === "pending";
  const isFailed = paymentStatus === "declined" || paymentStatus === "canceled" || status === "declined" || status === "canceled";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {isSuccess && (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">{t("paymentSuccess")}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t("paymentSuccessMessage")}</p>
              <a
                href={`/${locale}`}
                className="inline-block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {t("backToHome")}
              </a>
            </>
          )}

          {isPending && (
            <>
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">{t("paymentPending")}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t("paymentPendingMessage")}</p>
              <a
                href={`/${locale}`}
                className="inline-block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {t("backToHome")}
              </a>
            </>
          )}

          {isFailed && (
            <>
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">{t("paymentFailed")}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t("paymentFailedMessage")}</p>
              <a
                href={`/${locale}`}
                className="inline-block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {t("backToHome")}
              </a>
            </>
          )}

          {!isSuccess && !isPending && !isFailed && (
            <>
              <h1 className="text-2xl font-bold mb-4">{t("paymentUnknown")}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t("paymentUnknownMessage")}</p>
              <a
                href={`/${locale}`}
                className="inline-block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                {t("backToHome")}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
