import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userSignUpSchema,
  type UserSignUpSchemaType,
} from "@/lib/zod/userSchema";
import { registerAccountApi } from "@/api/auth.api";
import useToast from "@/hooks/useToast";
import type { mode } from "./AuthForm";
import { useState } from "react";
import { LoadingWave } from "@/components/ui/loading";
import { Eye, EyeClosed } from "lucide-react";
import { useWatch } from "react-hook-form";

const SignupForm = ({
  setMode,
}: {
  setMode: React.Dispatch<React.SetStateAction<mode>>;
}) => {
  const form = useForm<UserSignUpSchemaType>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
    },
  });
  const password = useWatch({
    control: form.control,
    name: "password",
  })
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setisVisible] = useState<boolean>(false);
  
  const getPasswordStrength = (password: string = "") => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;

    return score;
  };

  const onSubmit = async (values: UserSignUpSchemaType) => {
    setIsLoading(true);
    try {
      const validateData = userSignUpSchema.safeParse(values);

      if (!validateData) showToast("error", "All field is required!");
      const res = await registerAccountApi(values);
      const result = res.data;
      showToast("success", result.message);
      setTimeout(() => {
        setMode("login");
      }, 2000);
    } catch (error: any) {
      showToast("error", `${error.res.data.error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setisVisible((prev) => !prev);
  };

  const strength = getPasswordStrength(password);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col space-y-1">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="john123" {...field} />
              </FormControl>
              <FormMessage className="w-full text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col space-y-1 text-left">
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage className="w-full text-xs text-red-500" />
            </FormItem>
          )}
        />

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
              <div className="mt-2 space-y-1">
                <div className="h-2 w-full rounded bg-gray-200">
                  <div
                    className={`h-2 rounded transition-all ${
                      strength === 0
                        ? "w-0"
                        : strength === 1
                          ? "w-1/4 bg-red-500"
                          : strength === 2
                            ? "w-2/4 bg-orange-500"
                            : strength === 3
                              ? "w-3/4 bg-yellow-500"
                              : "w-full bg-green-500"
                    }`}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  {strength === 0 && "Enter password"}
                  {strength === 1 && "Weak password"}
                  {strength === 2 && "Medium password"}
                  {strength === 3 && "Good password"}
                  {strength === 4 && "Strong password"}
                </p>
              </div>
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
            Sign Up
          </Button>
        )}
      </form>
    </Form>
  );
};

export default SignupForm;
