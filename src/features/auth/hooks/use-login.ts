import { useForm } from "react-hook-form";
import {
  defaultLoginValues,
  loginSchema,
  LoginSchemaType,
} from "../schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSonner } from "@/shared/hooks/use-sonner";
import { useLoginMutation } from "../api/auth";
import { useRouter } from "next/navigation";
import PATHS from "@/shared/routes";

const useLogin = () => {
  const { sonner } = useSonner();
  const { replace } = useRouter();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
  });

  const { mutate: onLogin, isPending } = useLoginMutation();

  const onSubmit = (data: LoginSchemaType) => {
    onLogin(data, {
      onSuccess: async () => {
        const access =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        // Set cookie via server to ensure middleware sees it on next request
        if (typeof window !== "undefined" && access) {
          try {
            await fetch("/api/session/set", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: access,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              }),
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn("Failed to set session cookie:", e);
          }
        }

        sonner.success("Berhasil masuk!");

        // Both ADMIN and USER redirect to dashboard
        const redirectPath = PATHS.PROTECTED.DASHBOARD;

        // Force full reload so cookie is included in request that hits middleware
        setTimeout(() => {
          if (typeof window !== "undefined") {
            replace(redirectPath);
          }
        }, 100);
      },
      onError: (error) => {
        sonner.error(error.message || "Gagal masuk. Silakan coba lagi nanti.");
      },
    });
  };

  return {
    onSubmit,
    form,
    loading: isPending,
  };
};

export default useLogin;
