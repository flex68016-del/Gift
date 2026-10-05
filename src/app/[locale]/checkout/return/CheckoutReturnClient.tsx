"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import WhatsAppCTA from "@/components/WhatsAppCTA";

interface CheckoutReturnClientProps {
  locale: string;
  transactionId?: string;
  status?: string;
}

interface PaymentData {
  status: string;
  giftId?: string;
  giftSlug?: string;
  editToken?: string;
}

export function CheckoutReturnClient({
  locale,
  transactionId,
  status,
}: CheckoutReturnClientProps) {
  const t = useTranslations("checkout");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);

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
          setPaymentData(data);

          // Si succès, générer le QR code
          if (data.status === "approved" && data.giftSlug) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://moment.gift";
            const giftUrl = `${baseUrl}/${locale}/g/${data.giftSlug}`;
            const QRCode = (await import("qrcode")).default;
            const qrDataUrl = await QRCode.toDataURL(giftUrl, {
              width: 300,
              margin: 2,
            });
            setQrCode(qrDataUrl);
          }
        }
      } catch (error) {
        console.error("Failed to check payment status:", error);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [transactionId, locale]);

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

  const isSuccess = paymentData?.status === "approved" || status === "approved";
  const isPending = paymentData?.status === "pending" || status === "pending";
  const isFailed = paymentData?.status === "declined" || paymentData?.status === "canceled" || status === "declined" || status === "canceled";

  const giftUrl = paymentData?.giftSlug ? `/${locale}/g/${paymentData.giftSlug}` : null;
  const editUrl = paymentData?.editToken ? `/${locale}/manage/${paymentData.editToken}` : null;

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

              {/* Lien du cadeau */}
              {giftUrl && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("giftLink")}</p>
                  <a
                    href={giftUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {giftUrl}
                  </a>
                </div>
              )}

              {/* QR Code */}
              {qrCode && (
                <div className="mb-6">
                  <img src={qrCode} alt="QR Code" className="mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("scanToOpen")}</p>
                </div>
              )}

              {/* Bouton WhatsApp */}
              <div className="mb-6">
                <WhatsAppCTA
                  phoneNumber=""
                  defaultMessage={t("whatsappMessage")}
                  label={t("shareOnWhatsApp")}
                  position="inline"
                />
              </div>

              {/* Lien d'édition */}
              {editUrl && (
                <div className="mb-6">
                  <a
                    href={editUrl}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {t("editGift")}
                  </a>
                </div>
              )}

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
