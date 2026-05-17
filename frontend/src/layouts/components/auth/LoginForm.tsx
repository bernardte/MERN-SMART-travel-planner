import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userLoginSchema,
  type UserLoginSchemaType,
} from "@/lib/zod/userSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginApi } from "@/api/auth.api";
import useToast from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadingWave } from "@/components/ui/loading";
import { Eye, EyeClosed } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import useFollowStore from "@/stores/useFollowStore";

const LoginForm = () => {
  const form = useForm<UserLoginSchemaType>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { showToast } = useToast();
  const navigator = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setisVisible] = useState<boolean>(false);
  const onSubmit = async (values: UserLoginSchemaType) => {
    setIsLoading(true);

    try {
      const res = await loginApi(values);
      const result = res.data;
      const loginUser = result?.data;

      if (loginUser) {
        setUser(loginUser);

        if (loginUser) {
          setUser(loginUser);

          //  把 following array 转 map
          const map: Record<string, boolean> = {};

          loginUser.following?.forEach((id: string) => {
            map[id] = true;
          });

          useFollowStore.getState().setFollowingMap(map);
        }
      }


      if (loginUser?.token) {
        setAccessToken(loginUser.token);
      }
      showToast("success", result.message);
      navigator("/");
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error?.message || "Login failed";

      showToast("error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setisVisible((prev) => !prev);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col space-y-1 text-left">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage className="w-full text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col space-y-1 text-left">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder={isVisible ? "AAAaaa123" : "********"}
                    {...field}
                  />
                  <Button
                    type="button"
                    onClick={togglePasswordVisibility}
                    variant={"link"}
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {isVisible ? <EyeClosed size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="w-full text-xs text-red-500" />
            </FormItem>
          )}
        />

        {isLoading ? (
          <LoadingWave />
        ) : (
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Button>
        )}
      </form>
    </Form>
  );
};

export default LoginForm;
