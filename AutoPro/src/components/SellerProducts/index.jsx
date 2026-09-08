import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { CATEGORIES, listProducts, money, productError, productPayload } from '../../lib/products';
import ProductImage from '../ProductImage';
import PhotoPicker from '../PhotoPicker';
import { productImages } from '../../lib/imageValidation';
import { uploadProductPhotos } from '../../lib/productImages';
import { SectionCard, SectionHeader } from '../../pages/Profile/style';
import { Form, Listings } from './style';

const emptyForm = { titulo: '', descricao: '', categoria: '', valor: '', estoque: '1', imagem: '', marca: '', compatibilidade: '', condicao: 'Novo', ativo: true };

export default function SellerProducts({ userId }) {
  const [username, setUsername] = useState('');
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [draftId, setDraftId] = useState(() => crypto.randomUUID());
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setError('');
      try {
        const { data, error } = await supabase.from('seller_profiles').select('id, username').eq('id', userId).maybeSingle();
        if (error) throw error;
        const items = await listProducts(userId);
        if (active) { setSeller(data); setUsername(data?.username || ''); setProducts(items); }
      } catch (err) { if (active) setError(productError(err)); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [userId, reload]);

  async function saveUsername(event) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      const value = username.trim().toLowerCase();
      if (!/^[a-z0-9_]{3,30}$/.test(value)) throw new Error('Use de 3 a 30 letras minúsculas, números ou sublinhado.');
      const { data, error } = await supabase.from('seller_profiles').upsert({ id: userId, username: value }, { onConflict: 'id' }).select('id, username').single();
      if (error) throw error;
      setSeller(data); setUsername(data.username); setMessage('Username salvo. Ele será exibido nos seus anúncios.');
    } catch (err) { setError(productError(err)); }
    finally { setSaving(false); }
  }

  async function saveProduct(event) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      if (!seller) throw new Error('Salve seu username antes de publicar.');
      const payload = productPayload(form, userId);
      if (!photos.length) throw new Error('Adicione pelo menos uma foto da peça.');
      const savedPhotos = await uploadProductPhotos(photos, userId);
      setPhotos(savedPhotos);
      payload.imagens = savedPhotos.map(photo => photo.url);
      payload.imagem = payload.imagens[0];
      const query = editingId
        ? supabase.from('products').update(payload).eq('id', editingId).eq('seller_id', userId)
        : supabase.from('products').upsert({ id: draftId, ...payload }, { onConflict: 'id' });
      const { data, error } = await query.select('id').single();
      if (error) throw error;
      if (!data) throw new Error('O anúncio não foi salvo. Tente novamente.');
      setMessage(editingId ? 'Anúncio atualizado.' : 'Produto cadastrado com sucesso.');
      setEditingId(null); setForm(emptyForm); setPhotos([]); setDraftId(crypto.randomUUID());
      setReload(value => value + 1);
    } catch (err) { setError(productError(err)); }
    finally { setSaving(false); }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Excluir o anúncio “${product.titulo}”? Esta ação não pode ser desfeita.`)) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const { error } = await supabase.from('products').delete().eq('id', product.id).eq('seller_id', userId);
      if (error) throw error;
      setProducts(current => current.filter(item => item.id !== product.id));
      if (editingId === product.id) {
        setEditingId(null); setForm(emptyForm); setPhotos([]); setDraftId(crypto.randomUUID());
      }
      setMessage('Anúncio excluído com sucesso.');
    } catch (err) { setError(productError(err)); }
    finally { setSaving(false); }
  }

  function change(event) {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  return <SectionCard id="meus-produtos">
    <SectionHeader><h2>Meus produtos</h2></SectionHeader>
    <p>Cadastre suas peças para que apareçam no catálogo da AutoPro.</p>
    {error && <div role="alert"><p>{error}</p><button type="button" onClick={() => setReload(value => value + 1)}>Tentar novamente</button></div>}
    {message && <p role="status">{message}</p>}
    {loading ? <p>Carregando seus anúncios...</p> : <>
      <Form onSubmit={saveUsername}>
        <fieldset disabled={saving}>
          <label htmlFor="seller-username">Username público do vendedor
            <input id="seller-username" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} required pattern="[a-z0-9_]{3,30}" minLength={3} maxLength={30} autoComplete="username" aria-describedby="username-help" />
          </label>
          <small id="username-help">De 3 a 30 letras, números ou sublinhado. Seu e-mail e documento não serão exibidos.</small>
          <div><button type="submit">Salvar username</button></div>
        </fieldset>
      </Form>
      <Form onSubmit={saveProduct} id="anuncio-form">
        <h3>{editingId ? 'Editar anúncio' : 'Cadastrar produto para vender'}</h3>
        {!seller && <p>Salve seu username acima para habilitar o cadastro.</p>}
        <fieldset disabled={saving || !seller}>
          <label>Título<input name="titulo" value={form.titulo} onChange={change} required minLength={3} maxLength={120} /></label>
          <label>Descrição<textarea name="descricao" value={form.descricao} onChange={change} required minLength={10} maxLength={5000} /></label>
          <div className="fields">
            <label>Categoria<select name="categoria" value={form.categoria} onChange={change} required><option value="">Selecione</option>{CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}</select></label>
            <label>Condição<select name="condicao" value={form.condicao} onChange={change}>{['Novo', 'Usado', 'Recondicionado'].map(item => <option key={item}>{item}</option>)}</select></label>
            <label>Preço (R$)<input name="valor" type="number" min="0.01" max="99999999.99" step="0.01" value={form.valor} onChange={change} required /></label>
            <label>Estoque<input name="estoque" type="number" min="0" max="2147483647" step="1" value={form.estoque} onChange={change} required /></label>
            <label>Marca (opcional)<input name="marca" value={form.marca} onChange={change} maxLength={100} /></label>
            <label>Compatibilidade (opcional)<input name="compatibilidade" value={form.compatibilidade} onChange={change} maxLength={500} /></label>
          </div>
          <PhotoPicker photos={photos} onChange={setPhotos} onError={setError} />
          <label className="checkbox"><input name="ativo" type="checkbox" checked={form.ativo} onChange={change} />Anúncio visível no catálogo</label>
          <div className="actions"><button type="submit">{saving ? 'Enviando fotos e salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar produto'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setPhotos([]); setDraftId(crypto.randomUUID()); }}>Cancelar edição</button>}</div>
        </fieldset>
      </Form>
      <h3>Seus anúncios ({products.length})</h3>
      {products.length === 0 && <p>Você ainda não cadastrou produtos para venda.</p>}
      <Listings>{products.map(product => <article key={product.id}>
        <div className="photo"><ProductImage src={product.imagem} alt={product.titulo} /></div>
        <div className="info"><Link to={`/products/${product.id}`}>{product.titulo}</Link><p>{money(product.valor)} · {product.estoque} em estoque</p><small>{product.ativo ? 'Publicado' : 'Oculto'}</small></div>
        <div className="listing-actions">
          <button type="button" disabled={saving} onClick={() => { setEditingId(product.id); setForm({ ...emptyForm, ...product, imagem: product.imagem || '' }); setPhotos(productImages(product).map(url => ({ id: url, url }))); setMessage(''); document.getElementById('anuncio-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>Editar</button>
          <button type="button" className="delete" disabled={saving} onClick={() => deleteProduct(product)}>Excluir</button>
        </div>
      </article>)}</Listings>
    </>}
  </SectionCard>;
}
