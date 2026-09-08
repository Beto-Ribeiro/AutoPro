import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import {
  PageBg, FormCard, FormHeader, IconCircle, BrandName,
  FormTitle, FormSubtitle, Form, FieldGroup, Label,
  InputWrapper, Input, Row, CepRow, BuscarBtn, SubmitBtn,
} from "./style";

const Address = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { addressId } = useParams();
  const isEditing = Boolean(addressId);
  const [form, setForm] = useState({
    apelido: "", cep: "", logradouro: "", numero: "",
    complemento: "", bairro: "", cidade: "", uf: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(isEditing);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      const { data, error } = await supabase
        .from('enderecos')
        .select('*')
        .eq('id', addressId)
        .eq('usuario_id', session.user.id)
        .maybeSingle();
      if (!active) return;
      if (error || !data) {
        setAlert({ type: 'error', message: 'Endereço não encontrado.' });
      } else {
        setForm({
          apelido: data.apelido || '', cep: data.cep || '', logradouro: data.logradouro || '',
          numero: data.numero || '', complemento: data.complemento || '', bairro: data.bairro || '',
          cidade: data.cidade || '', uf: data.estado || '',
        });
      }
      setLoadingAddress(false);
    })();
    return () => { active = false; };
  }, [addressId, isEditing, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    setLoading(true);

    // Obtém sessão atual
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      setAlert({ type: "error", message: "Você precisa estar logado para salvar um endereço." });
      return;
    }

    const payload = {
        usuario_id:   session.user.id,
        apelido:      form.apelido,
        cep:          form.cep.replace(/\D/g, ""),
        logradouro:   form.logradouro,
        numero:       form.numero,
        complemento:  form.complemento || null,
        bairro:       form.bairro,
        cidade:       form.cidade,
        estado:       form.uf.toUpperCase(),
      };
    if (!isEditing) payload.padrao = false;
    const request = isEditing
      ? supabase.from("enderecos").update(payload).eq('id', addressId).eq('usuario_id', session.user.id)
      : supabase.from("enderecos").insert(payload);
    const { error } = await request;

    setLoading(false);

    if (error) {
      console.error("Erro ao salvar endereço:", error);
      setAlert({ type: "error", message: "Erro ao salvar endereço. Tente novamente." });
    } else {
      setAlert({ type: "success", message: isEditing ? "Endereço atualizado com sucesso!" : "Endereço salvo com sucesso!" });
      navigate('/profile/addresses');
    }
  };

  const buscarCep = async () => {
    const cepClean = form.cep.replace(/\D/g, "");
    if (cepClean.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          uf: data.uf || "",
        }));
      }
    } catch {
      // silent fail
    }
  };


  return (
    <PageBg $embedded={embedded}>
      <FormCard as={embedded ? 'section' : 'main'} style={embedded ? { maxWidth: 'none' } : undefined}>
        {/* ── Header ── */}
        <FormHeader>
          <IconCircle>
            <span className="material-symbols-outlined">add_location_alt</span>
          </IconCircle>
          {!embedded && <BrandName>AutoPro</BrandName>}
          <FormTitle as={embedded ? 'h2' : 'h1'}>{isEditing ? 'Editar Endereço' : 'Adicionar Endereço'}</FormTitle>
          <FormSubtitle>{isEditing ? 'Atualize os detalhes do seu endereço de entrega.' : 'Insira os detalhes do novo endereço para entrega.'}</FormSubtitle>
        </FormHeader>

        {/* ── Alert ── */}
        {alert.message && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '8px',
              background: alert.type === 'success' ? '#d1fae5' : '#fee2e2',
              color: alert.type === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${alert.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            }}
          >
            {alert.message}
          </div>
        )}

        {/* ── Form ── */}
        {loadingAddress ? <p style={{ textAlign: 'center', color: 'var(--secondary)' }}>Carregando endereço...</p> : <Form onSubmit={handleSubmit}>

          {/* Apelido */}
          <FieldGroup>
            <Label htmlFor="apelido">Apelido</Label>
            <InputWrapper>
              <span className="material-symbols-outlined leading-icon">bookmark</span>
              <Input
                $hasIcon
                id="apelido"
                name="apelido"
                placeholder="Ex: Casa, Trabalho"
                value={form.apelido}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FieldGroup>

          {/* CEP + Logradouro */}
          <Row>
            <FieldGroup>
              <Label htmlFor="cep">CEP</Label>
              <CepRow>
                <InputWrapper style={{ flex: 1 }}>
                  <span className="material-symbols-outlined leading-icon">location_on</span>
                  <Input
                    $hasIcon
                    id="cep"
                    name="cep"
                    placeholder="00000-000"
                    value={form.cep}
                    onChange={handleChange}
                    maxLength={9}
                    required
                  />
                </InputWrapper>
                <BuscarBtn type="button" onClick={buscarCep}>Buscar</BuscarBtn>
              </CepRow>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="logradouro">Logradouro</Label>
              <InputWrapper>
                <Input
                  id="logradouro"
                  name="logradouro"
                  placeholder="Rua, Avenida, etc."
                  value={form.logradouro}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FieldGroup>
          </Row>

          {/* Número + Complemento */}
          <Row>
            <FieldGroup>
              <Label htmlFor="numero">Número</Label>
              <InputWrapper>
                <Input
                  id="numero"
                  name="numero"
                  placeholder="Nº"
                  value={form.numero}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="complemento">Complemento</Label>
              <InputWrapper>
                <Input
                  id="complemento"
                  name="complemento"
                  placeholder="Apto, Sala, Bloco..."
                  value={form.complemento}
                  onChange={handleChange}
                />
              </InputWrapper>
            </FieldGroup>
          </Row>

          {/* Bairro */}
          <FieldGroup>
            <Label htmlFor="bairro">Bairro</Label>
            <InputWrapper>
              <Input
                id="bairro"
                name="bairro"
                placeholder="Bairro"
                value={form.bairro}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FieldGroup>

          {/* Cidade + UF */}
          <Row $cols="1fr 100px">
            <FieldGroup>
              <Label htmlFor="cidade">Cidade</Label>
              <InputWrapper>
                <Input
                  id="cidade"
                  name="cidade"
                  placeholder="Cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="uf">UF</Label>
              <InputWrapper>
                <Input
                  id="uf"
                  name="uf"
                  placeholder="SP"
                  value={form.uf}
                  onChange={handleChange}
                  maxLength={2}
                  required
                />
              </InputWrapper>
            </FieldGroup>
          </Row>

          <SubmitBtn type="submit" disabled={loading}>
            <span className="material-symbols-outlined">check_circle</span>
            {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Salvar Endereço'}
          </SubmitBtn>
        </Form>
        }
      </FormCard>
    </PageBg>
  );
};

export default Address;
