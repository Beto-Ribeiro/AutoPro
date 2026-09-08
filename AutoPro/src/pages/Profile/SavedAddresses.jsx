import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { SectionCard, SectionHeader, GridContainer, EmptyState, AddressBox } from './style';

export default function SavedAddresses({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setError('');
      try {
        const { data, error } = await supabase.from('enderecos').select('*').eq('usuario_id', userId).order('padrao', { ascending: false }).order('apelido');
        if (error) throw error;
        if (active) setAddresses(data || []);
      } catch { if (active) setError('Não foi possível carregar seus endereços.'); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [userId, reload]);
  return <SectionCard><SectionHeader><h2>Endereços salvos</h2><Link className="add-btn" to="/profile/addresses/new">Adicionar endereço</Link></SectionHeader>
    {loading && <p role="status">Carregando endereços...</p>}
    {error && <p role="alert">{error} <button onClick={() => setReload(v => v + 1)}>Tentar novamente</button></p>}
    {!loading && !error && <GridContainer>{addresses.length ? addresses.map(address => <AddressBox key={address.id}>
      {address.padrao && <span className="badge">Padrão</span>}<h4>{address.apelido || 'Endereço de entrega'}</h4>
      <p>{address.logradouro}, {address.numero}{address.complemento && ` — ${address.complemento}`}<br />
      {address.bairro}, {address.cidade} — {address.estado}<br />CEP: {address.cep}</p>
    </AddressBox>) : <EmptyState>Você não tem nenhum endereço cadastrado.</EmptyState>}</GridContainer>}
  </SectionCard>;
}
