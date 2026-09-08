import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { supabase } from '../../lib/supabaseClient';
import { AlertMessage, Field, FieldGroup, FormFooter, FormPanel, FormSubtitle, FormTitle, Input, InputWrapper, Label, LogoArea, LogoIcon, LogoText, PageWrapper, PasswordToggle, SubmitButton } from '../Login/style';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [validLink, setValidLink] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setValidLink(Boolean(session));
      setCheckingLink(false);
    });
    return () => { active = false; };
  }, []);

  async function submit(event) {
    event.preventDefault(); setAlert({ type: '', message: '' });
    if (password.length < 8) { setAlert({ type: 'error', message: 'A nova senha deve ter pelo menos 8 caracteres.' }); return; }
    if (password !== confirmation) { setAlert({ type: 'error', message: 'As senhas não coincidem.' }); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setAlert({ type: 'error', message: error.message }); return; }
    setAlert({ type: 'success', message: 'Senha atualizada. Você já pode entrar com a nova senha.' });
    setTimeout(() => navigate('/'), 1200);
  }

  return <PageWrapper>
    <FormPanel style={{ margin: 'auto', minHeight: '100%' }}>
      <LogoArea><LogoIcon><HiOutlineWrenchScrewdriver /></LogoIcon><LogoText>AutoPro</LogoText></LogoArea>
      <FormTitle>Redefinir senha</FormTitle>
      <FormSubtitle>{checkingLink ? 'Validando o link de recuperação...' : validLink ? 'Escolha uma nova senha para sua conta.' : 'Este link de recuperação é inválido ou expirou.'}</FormSubtitle>
      {!checkingLink && validLink && <form onSubmit={submit}>
        <FieldGroup>
          <Field><Label htmlFor="new-password">Nova senha</Label><InputWrapper><FiLock className="input-icon" /><Input id="new-password" type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" minLength="8" required style={{ paddingRight: '40px' }} /><PasswordToggle type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <FiEyeOff /> : <FiEye />}</PasswordToggle></InputWrapper></Field>
          <Field><Label htmlFor="confirm-password">Confirmar nova senha</Label><InputWrapper><FiLock className="input-icon" /><Input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmation} onChange={event => setConfirmation(event.target.value)} autoComplete="new-password" minLength="8" required /></InputWrapper></Field>
        </FieldGroup>
        {alert.message && <AlertMessage className={alert.type}><FiAlertCircle />{alert.message}</AlertMessage>}
        <SubmitButton type="submit" disabled={loading}>{loading ? 'Atualizando senha...' : 'Salvar nova senha'}</SubmitButton>
      </form>}
      {!checkingLink && !validLink && <SubmitButton type="button" onClick={() => navigate('/login')}>Solicitar novo link</SubmitButton>}
      <FormFooter><Link to="/login">Voltar para o login</Link></FormFooter>
    </FormPanel>
  </PageWrapper>;
}
