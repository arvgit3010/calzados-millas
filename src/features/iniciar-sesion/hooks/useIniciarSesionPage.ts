import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { getApiErrorMessage, useAuth } from "@/core";
import { ROUTES } from "../../../core/config/routes";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),

});

export type LoginFormData = z.infer<typeof loginSchema>;

export function useIniciarSesionPage() {
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    const toastId = toast.loading("Validando credenciales...");
    try {
      const user = await login(data.email, data.password);

      if (user.role === "admin") {
        setShowAdminModal(true);
      } else {
        navigate(ROUTES.ecommerce);
      }
    } catch (error) {
      setApiError(getApiErrorMessage(error));
      toast.error("No se pudo iniciar sesión", { id: toastId });
      return;
    }

    toast.success("Sesión iniciada correctamente", { id: toastId });
  };

  const handleGoToEcommerce = () => {
    setShowAdminModal(false);
    navigate(ROUTES.ecommerce);
  };

  const handleGoToDashboard = () => {
    setShowAdminModal(false);
    navigate(ROUTES.gestionBotines);
  };

  return {
    register,
    errors,
    isSubmitting,
    apiError,
    showPassword,
    onTogglePassword: () => setShowPassword((prev) => !prev),
    onSubmit: handleSubmit(onSubmit),
    showAdminModal,
    handleGoToEcommerce,
    handleGoToDashboard,
  };
}
