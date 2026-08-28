import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { supabase } from '../../lib/supabaseClient';
import {
  PageWrapper,
  Card,
  BrandHeader,
  BrandIcon,
  BrandName,
  PageTitle,
  PageSubtitle,
  Form,
  Field,
  Label,
  InputWrapper,
  Input,
  PasswordToggle,
  TermsRow,
  SubmitButton,
  FooterDivider,
  AlertMessage,
} from './style';

/* ── helpers ── */
const formatCpfCnpj = (val) => {
  const digits = val.replace(/\D/g, '');
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

const formatPhone = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

/* ── Component ── */
const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    documento: '',
    email: '',
    telefone: '',
    senha: '',
  });
  const [termos, setTermos]       = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [alert, setAlert]         = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'documento'
        ? formatCpfCnpj(value)
        : name === 'telefone'
        ? formatPhone(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    if (!termos) {
      setAlert({ type: 'error', message: 'Você deve aceitar os Termos de Serviço.' });
      return;
    }
    if (form.senha.length < 8) {
      setAlert({ type: 'error', message: 'A senha deve ter pelo menos 8 caracteres.' });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {
        data: {
          nome:      form.nome,
          documento: form.documento,
          telefone:  form.telefone,
        },
      },
    });

    setLoading(false);

    if (error) {
      setAlert({ type: 'error', message: error.message });
    } else {
      setAlert({
        type: 'success',
        message: 'Conta criada! Verifique seu e-mail para confirmar o cadastro.',
      });
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <PageWrapper>
      <Card>

        {/* ── Brand header ── */}
        <BrandHeader>
          <BrandIcon>
            <HiOutlineWrenchScrewdriver />
          </BrandIcon>
          <BrandName>AutoPro</BrandName>
          <PageTitle>Cadastro de Cliente</PageTitle>
          <PageSubtitle>Crie sua conta para acessar o catálogo industrial.</PageSubtitle>
        </BrandHeader>

        {/* ── Alert ── */}
        {alert.message && (
          <AlertMessage className={alert.type} style={{ marginBottom: '14px' }}>
            <FiAlertCircle />
            {alert.message}
          </AlertMessage>
        )}

        {/* ── Form ── */}
        <Form onSubmit={handleSubmit}>

          {/* Nome completo */}
          <Field>
            <Label htmlFor="nome">Nome completo</Label>
            <InputWrapper>
              <FiUser className="field-icon" />
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Ex: João da Silva"
                value={form.nome}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </InputWrapper>
          </Field>

          {/* CPF/CNPJ */}
          <Field>
            <Label htmlFor="documento">CPF / CNPJ</Label>
            <InputWrapper>
              <FiCreditCard className="field-icon" />
              <Input
                id="documento"
                name="documento"
                type="text"
                placeholder="000.000.000-00"
                value={form.documento}
                onChange={handleChange}
                required
                inputMode="numeric"
                maxLength={18}
              />
            </InputWrapper>
          </Field>

          {/* E-mail */}
          <Field>
            <Label htmlFor="email">E-mail</Label>
            <InputWrapper>
              <FiMail className="field-icon" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contato@empresa.com.br"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </InputWrapper>
          </Field>

          {/* Telefone */}
          <Field>
            <Label htmlFor="telefone">Telefone</Label>
            <InputWrapper>
              <FiPhone className="field-icon" />
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={form.telefone}
                onChange={handleChange}
                required
                maxLength={15}
              />
            </InputWrapper>
          </Field>

          {/* Senha */}
          <Field>
            <Label htmlFor="senha">Senha</Label>
            <InputWrapper>
              <FiLock className="field-icon" />
              <Input
                id="senha"
                name="senha"
                type={showPass ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={form.senha}
                onChange={handleChange}
                required
                autoComplete="new-password"
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

          {/* Termos */}
          <TermsRow>
            <input
              id="termos"
              type="checkbox"
              checked={termos}
              onChange={(e) => setTermos(e.target.checked)}
            />
            <label htmlFor="termos">
              Concordo com os{' '}
              <a href="#">Termos de Serviço</a> e{' '}
              <a href="#">Política de Privacidade</a>.
            </label>
          </TermsRow>

          {/* Submit */}
          <SubmitButton type="submit" id="btn-criar-conta" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
            {!loading && <FiArrowRight />}
          </SubmitButton>

        </Form>

        {/* ── Footer ── */}
        <FooterDivider>
          Já tem uma conta?{' '}
          <a role="button" onClick={() => navigate('/login')}>
            Fazer login
          </a>
        </FooterDivider>

      </Card>
    </PageWrapper>
  );
};

export default Register;
