import DepositoTypeForm from "@/features/deposito-types/pages/form/deposito-type-form";

export default async function EditDepositoTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DepositoTypeForm depositoTypeId={id} />;
}

