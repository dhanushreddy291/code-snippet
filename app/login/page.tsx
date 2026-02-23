import { AuthForm } from '@/components/auth-form';

export const metadata = {
  title: 'Sign In | SnippetHub',
  description: 'Sign in to your SnippetHub account',
};

export default function LoginPage() {
  return <AuthForm type="login" />;
}
