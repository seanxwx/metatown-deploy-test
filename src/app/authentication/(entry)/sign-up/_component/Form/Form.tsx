'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '@/components/Button'
import TextField from '@/components/TextField'
import signUp from '@/db/signUp'
import useSession from '@/hooks/useSession'
import navigate from '@/utils/navigate'
import Conditions from './_components/Conditions'

const schema = z
  .object({
    email: z
      .string()
      .nonempty('Please enter your email address')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .nonempty('Please enter a password')
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().nonempty('Please confirm your password'),
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Passwords do not match. Please try again',
  }) satisfies z.ZodType<{
  email: string
  password: string
}>

type ServerError = Awaited<ReturnType<typeof signUp>>['error']
type Schema = z.infer<typeof schema>

export const getServerErrorMessage = (
  error: ServerError
): string | undefined => {
  if (!error) {
    return
  }

  if (error.code === 'email_exists') {
    return 'This email is already registered. Please use a different email or log in instead.'
  }

  if (error.code === 'user_already_exists') {
    return 'A user with this email address already exists in our system. Please use a different email or log in instead.'
  }

  return 'Something wrong, please try again later.'
}

const Form: FC = () => {
  const { mutate } = useSession(true)

  const [serverError, setServerError] = useState<ServerError>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email, password }: Schema): Promise<void> => {
    const { error } = await signUp({ email, password })

    if (error) {
      setServerError(error)

      return
    }
    await mutate()
    navigate('/spaces')
  }

  return (
    <form
      className="relative space-y-8"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      <TextField
        label="Email"
        type="email"
        errorMessage={errors.email?.message}
        {...register('email')}
      />

      <TextField
        label="Password"
        type="password"
        errorMessage={errors.password?.message}
        {...register('password')}
      />

      <TextField
        label="Confirm password"
        type="password"
        errorMessage={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div className="py-2">
        <Conditions />
      </div>
      {serverError && (
        <p className="absolute -top-[4.5rem] text-xs text-rose-500">
          {getServerErrorMessage(serverError)}
        </p>
      )}

      <Button className="w-full" type="submit" isLoading={isSubmitting}>
        Join Meta Town
      </Button>
    </form>
  )
}

export default Form
