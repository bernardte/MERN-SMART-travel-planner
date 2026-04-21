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
import {
  userResetPasswordSchema,
  type UserResetPasswordSchemaType,
} from "@/lib/zod/userSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPasswordForm = () => {
  const form = useForm<UserResetPasswordSchemaType>({
    resolver: zodResolver(userResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: UserResetPasswordSchemaType) => {
    console.log("Signup:", values);
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

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
