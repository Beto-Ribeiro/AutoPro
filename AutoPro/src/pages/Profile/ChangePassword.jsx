import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { SectionCard, SectionHeader, InputGroup, SecurityForm } from './style';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault(); setError(''); setMessage('');
    if (password.length < 6) { setError('A nova senha deve ter pelo menos 6 caracteres.'); return; }
    if (password !== confirmation) { setError('As senhas não coincidem.'); return; }
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword(''); setConfirmation(''); setMessage('Senha atualizada com sucesso.');
    } catch (err) {
      setError(err.message || 'Não foi possível atualizar a senha. Entre novamente e tente de novo.');
    } finally { setSaving(false); }
  }

  async function deleteAccount() {
    const answer = window.prompt('Esta ação é permanente. Digite EXCLUIR para confirmar a exclusão da sua conta.');
    if (answer !== 'EXCLUIR') return;
    setDeleting(true); setError(''); setMessage('');
    try {
      const { error: deleteError } = await supabase.rpc('delete_own_account');
      if (deleteError) throw deleteError;
      await supabase.auth.signOut();
      window.location.assign('/');
    } catch (err) {
      setError(err.message || 'Não foi possível excluir a conta. Tente novamente mais tarde.');
      setDeleting(false);
    }
  }

  return <SectionCard>
    <SectionHeader><h2>Senha e segurança</h2></SectionHeader>
    <p>Crie uma nova senha para acessar sua conta.</p>
    <SecurityForm onSubmit={submit}>
      <fieldset disabled={saving || deleting}>
        <InputGroup><label htmlFor="new-password">Nova senha</label><input id="new-password" type="password" value={password} onChange={event => setPassword(event.target.value)} minLength="6" autoComplete="new-password" required /></InputGroup>
        <InputGroup><label htmlFor="confirm-password">Confirmar nova senha</label><input id="confirm-password" type="password" value={confirmation} onChange={event => setConfirmation(event.target.value)} minLength="6" autoComplete="new-password" required /></InputGroup>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        <button type="submit">{saving ? 'Atualizando senha...' : 'Atualizar senha'}</button>
      </fieldset>
    </SecurityForm>
    <div className="danger-zone">
      <h3>Excluir conta</h3>
      <p>Esta ação remove permanentemente seus dados de acesso, anúncios e fotos. O histórico de pedidos é mantido sem identificação da conta.</p>
      <button type="button" className="delete-account" disabled={saving || deleting} onClick={deleteAccount}>{deleting ? 'Excluindo conta...' : 'Excluir minha conta'}</button>
    </div>
  </SectionCard>;
}
