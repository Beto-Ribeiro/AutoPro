import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { BsBuildings, BsGoogle } from 'react-icons/bs';
import { supabase } from '../../lib/supabaseClient';
import {
  PageWrapper,
  HeroPanel,
  HeroContent,
  HeroLogo,
  HeroLogoIcon,
  HeroTitle,
  HeroDescription,
  FormPanel,
  LogoArea,
  LogoIcon,
  LogoText,
  FormTitle,
  FormSubtitle,
  FieldGroup,
  Field,
  Label,
  InputWrapper,
  Input,
  PasswordToggle,
  PasswordRow,
  ForgotLink,
  SubmitButton,
  Divider,
  AltButtons,
  AltButton,
  FormFooter,
  AlertMessage,
} from './style';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [alert, setAlert]           = useState({ type: '', message: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setAlert({ type: 'error', message: error.message });
    } else {
      navigate('/');
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setLoading(false);
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setAlert({ type: 'error', message: 'Informe seu e-mail para redefinir a senha.' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setAlert({ type: 'error', message: error.message });
    } else {
      setAlert({ type: 'success', message: 'Link enviado! Verifique sua caixa de entrada.' });
    }
  };

  return (
    <PageWrapper>

      {/* ── Painel esquerdo (hero) ── */}
      <HeroPanel>
        <HeroContent>
          <HeroLogo>
            <HeroLogoIcon>
              <HiOutlineWrenchScrewdriver />
            </HeroLogoIcon>
            <span>AutoPro</span>
          </HeroLogo>

          <HeroTitle>
            Precisão<br />Industrial.
          </HeroTitle>

          <HeroDescription>
            Acesse o catálogo completo de peças automotivas de alta
            performance e gerencie suas cotações com eficiência.
          </HeroDescription>
        </HeroContent>
      </HeroPanel>

      {/* ── Painel direito (formulário) ── */}
      <FormPanel>

        <LogoArea>
          <LogoIcon>
            <HiOutlineWrenchScrewdriver />
          </LogoIcon>
          <LogoText>AutoPro</LogoText>
        </LogoArea>

        <FormTitle>Acesso ao Portal</FormTitle>
        <FormSubtitle>Insira suas credenciais para continuar.</FormSubtitle>

        <form onSubmit={handleLogin}>
          <FieldGroup>

            <Field>
              <Label htmlFor="email">E-mail corporativo</Label>
              <InputWrapper>
                <FiMail className="input-icon" />
                <Input
                  id="email"
                  type="email"
                  placeholder="engenheiro@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </InputWrapper>
            </Field>

            <Field>
              <PasswordRow>
                <Label htmlFor="password">Senha de acesso</Label>
                <ForgotLink type="button" onClick={handleForgot}>
                  Esqueceu a senha?
                </ForgotLink>
              </PasswordRow>
              <InputWrapper>
                <FiLock className="input-icon" />
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '40px' }}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              </InputWrapper>
            </Field>

          </FieldGroup>

          {alert.message && (
            <AlertMessage className={alert.type}>
              <FiAlertCircle />
              {alert.message}
            </AlertMessage>
          )}

          <SubmitButton type="submit" id="btn-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
            {!loading && <FiArrowRight />}
          </SubmitButton>
        </form>

        <Divider>ou acesse via</Divider>

        <AltButtons>
          <AltButton id="btn-sso" type="button" disabled={loading}>
            <BsBuildings />
            Single Sign-On (SSO)
          </AltButton>
          <AltButton id="btn-google" type="button" onClick={handleGoogle} disabled={loading}>
            <BsGoogle />
            Conta Pessoal (Google)
          </AltButton>
        </AltButtons>

        <FormFooter>
          Não possui cadastro?{' '}
          <a role="button" onClick={() => navigate('/register')}>
            Solicitar acesso
          </a>
        </FormFooter>

      </FormPanel>
    </PageWrapper>
  );
};

export default Login;
