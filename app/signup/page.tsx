import { AuthForm } from '@/components/auth-form';

export const metadata = {
  title: 'Sign Up | SnippetHub',
  description: 'Create a new SnippetHub account',
};

export default function SignupPage() {
  return <AuthForm type="signup" />;
}
