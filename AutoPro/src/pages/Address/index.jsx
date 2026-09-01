import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageBg, FormCard, FormHeader, IconCircle, BrandName,
  FormTitle, FormSubtitle, Form, FieldGroup, Label,
  InputWrapper, Input, Row, CepRow, BuscarBtn, SubmitBtn,
} from "./style";

const Address = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    apelido: "", cep: "", logradouro: "", numero: "",
    complemento: "", bairro: "", cidade: "", uf: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // navigate to confirmation or next step
    navigate("/");
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
    <PageBg>
      <FormCard>
        {/* ── Header ── */}
        <FormHeader>
          <IconCircle>
            <span className="material-symbols-outlined">add_location_alt</span>
          </IconCircle>
          <BrandName>AutoPro</BrandName>
          <FormTitle>Adicionar Endereço</FormTitle>
          <FormSubtitle>Insira os detalhes do novo endereço para entrega.</FormSubtitle>
        </FormHeader>

        {/* ── Form ── */}
        <Form onSubmit={handleSubmit}>

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

          <SubmitBtn type="submit">
            <span className="material-symbols-outlined">check_circle</span>
            Salvar Endereço
          </SubmitBtn>
        </Form>
      </FormCard>
    </PageBg>
  );
};

export default Address;
