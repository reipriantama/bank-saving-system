import CustomerForm from "@/features/customers/pages/form/customer-form";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerForm customerId={id} />;
}

