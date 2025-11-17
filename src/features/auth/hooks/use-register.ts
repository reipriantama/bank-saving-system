import { useForm } from "react-hook-form";
import {
  registerSchema,
  RegisterSchemaType,
  defaultRegisterValues,
} from "../schemas/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../api/auth";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useRouter } from "next/navigation";
import PATHS from "@/shared/routes";

const useRegister = () => {
  const { sonner } = useSonner();

  const { replace } = useRouter();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
  });

  const { mutate: onRegister, isPending } = useRegisterMutation();

  const onSubmit = (data: RegisterSchemaType) => {
    onRegister(data, {
      onSuccess: () => {
        sonner.success("Registrasi berhasil! Silakan login untuk melanjutkan.");

        // Redirect to login page immediately
        setTimeout(() => {
          if (typeof window !== "undefined") {
            replace(PATHS.PUBLIC.LOGIN);
          }
        }, 100);
      },
      onError: (error) => {
        sonner.error(
          error.message || "Registrasi gagal. Silakan coba lagi nanti."
        );
      },
    });
  };

  return {
    onSubmit,
    form,
    loading: isPending,
  };
};

export default useRegister;
