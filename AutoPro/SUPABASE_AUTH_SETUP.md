# Recuperação de senha

O fluxo usa `resetPasswordForEmail()` e leva o usuário para `/reset-password`,
onde a senha é atualizada com `updateUser()` após a validação do link pelo Supabase.

Antes de publicar, no painel do Supabase abra **Authentication → URL Configuration** e:

1. Defina **Site URL** como o endereço público do AutoPro.
2. Em **Redirect URLs**, adicione `https://SEU-DOMINIO/reset-password`.
3. Para desenvolvimento local, adicione `http://localhost:5173/reset-password`.

Em **Authentication → Email Templates**, mantenha o template **Reset Password** ativo.
O link padrão deve usar `{{ .ConfirmationURL }}` para respeitar o endereço de redirecionamento.

O provedor de e-mail padrão do Supabase serve para testes e tem limites. Para produção,
configure SMTP próprio em **Authentication → SMTP Settings**.
