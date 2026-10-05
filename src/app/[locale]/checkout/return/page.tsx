import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CheckoutReturnClient } from "./CheckoutReturnClient";

interface PageProps {
  params: {
    locale: string;
  };
  searchParams: {
    transaction_id?: string;
    status?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "checkout" });

  return {
    title: t("returnTitle"),
    description: t("returnDescription"),
  };
}

export default function CheckoutReturnPage({ params, searchParams }: PageProps) {
  return (
    <CheckoutReturnClient
      locale={params.locale}
      transactionId={searchParams.transaction_id}
      status={searchParams.status}
    />
  );
}
